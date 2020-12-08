var isRunning = false; // used in simStep and toggleSimStep
var surface; // Set in the redrawWindow function. It is the D3 selection of the svg drawing surface
var simTimer; // Set in the initialization function
var parameters = {
  animationDelay: 500,
  probInfected: 0.05,
  InfectionRate: 0.05,
  DistTransmission: 2,
  arrivalFactor: 1,
  mallLimit: 50,
};

function toggleArray(array, value) {
  var index = array.indexOf(value);
  if (index === -1) {
    array.push(value);
  } else {
    array.splice(index, 1);
  }
}

function changeOption(element, type, num) {
  element.classList.toggle("text-success");
  type === "food"
    ? toggleArray(bannedRest, num)
    : toggleArray(bannedShops, num);
}

function hasReached(customer, location) {
  return (
    Math.abs(customer.location.x - location[0]) +
      Math.abs(customer.location.y - location[1]) ===
    0
  );
}

function randn_bm(min, max, skew) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {
    num = randn_bm(min, max, skew);
  } // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}

function changeParams(element) {
  // change value of dropdown visual
  var group = element.classList[1];
  var value = element.innerHTML;
  document.querySelector("." + group).innerHTML = value;
  var newval;
  switch (group) {
    case "animationDelay":
      switch (value) {
        case "Slow": newval = 600; break;
        case "Medium": newval = 500; break;
        case "Fast": newval = 450; break;
      } break;
    case "arrivalFactor":
      switch (value) {
        case "Low": newval = 0.5; break;
        case "Medium": newval = 1; break;
        case "High": newval = 1.5; break;
      } break;
    case "probInfected":
      switch (value) {
        case "Low": newval = 0.05; break;
        case "High": newval = 0.1; break;
      } break;
    case "mallLimit":
      newval = parseInt(value);
  }
  parameters[group] = newval;
  console.table(parameters);
}

$(".dropdown-toggle").dropdown();

function changeTarget(customer, array) {
  customer.target.x = array[0];
  customer.target.y = array[1];
}

//The drawing surface will be divided into logical cells
var maxCols = 70;
var middleCol = maxCols / 2;
var cellWidth; //cellWidth is calculated in the redrawWindow function
var cellHeight; //cellHeight is calculated in the redrawWindow function

const urlPatientA =
  "https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg";
const urlcustomers = [
  "images/customer_green.png",
  "images/customer_red.png",
  "images/customer_teal.png",
  "images/customer_yellow.png",
];

const urlEntrance =
  "https://www.flaticon.com/svg/static/icons/svg/899/899433.svg";

const urlInfected = "images/infected.png";
const urlNotInfected = "images/customer_green.png";

var customeridx = 0;

function padDigits(number) {
  return Array(Math.max(2 - String(number).length + 1, 0)).join(0) + number;
}
function parseDate(date) {
  return padDigits(date.getHours()) + ":" + padDigits(date.getMinutes());
}

var datetime = new Date(2020, 11, 1, 7, 0, 0, 0);
/**
 * Get a random floating point number between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random floating point number
 */
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// dynamic arrays
var customers = [];

var currentTime = 0;
var statistics = {
  timeofday: parseDate(datetime),
  customers: 0,
  infected: 0,
  avgInfected: 0,
  r0: 0,
  profits: 0,
  ratio: 0,
  infectionLocation: {
    food0: 0,
    food1: 0,
    shop0: 0,
    shop1: 0,
    shop2: 0,
    shop3: 0,
    outside: 0,
    mall: 0,
  },
};

var cumratioinfected = 0;
var totinfected = 0;
var totnewinfected = 0;
var totalcustomers = 0;

// Probability that one patron arrives
var probArrival = {
  1: 0 * parameters.arrivalFactor,
  2: 0 * parameters.arrivalFactor,
  3: 0 * parameters.arrivalFactor,
  4: 0 * parameters.arrivalFactor,
  5: 0 * parameters.arrivalFactor,
  6: 0.02 * parameters.arrivalFactor,
  7: 0.05 * parameters.arrivalFactor,
  8: 0.1 * parameters.arrivalFactor,
  9: 0.15 * parameters.arrivalFactor,
  10: 0.1 * parameters.arrivalFactor,
  11: 0.2 * parameters.arrivalFactor,
  12: 0.35 * parameters.arrivalFactor,
  13: 0.35 * parameters.arrivalFactor,
  14: 0.2 * parameters.arrivalFactor,
  15: 0.1 * parameters.arrivalFactor,
  16: 0.05 * parameters.arrivalFactor,
  17: 0.1 * parameters.arrivalFactor,
  18: 0.15 * parameters.arrivalFactor,
  19: 0.3 * parameters.arrivalFactor,
  20: 0.1 * parameters.arrivalFactor,
  21: 0.05 * parameters.arrivalFactor,
  22: 0.01 * parameters.arrivalFactor,
  23: 0.01 * parameters.arrivalFactor,
};

// This next function is executed when the script is loaded. It contains the page initialization code.
(function () {
  // Your page initialization code goes here
  // All elements of the DOM will be available here
  window.addEventListener("resize", redrawWindow); //Redraw whenever the window is resized
  simTimer = window.setInterval(simStep, parameters.animationDelay); // call the function simStep every animationDelay milliseconds
  redrawWindow();
})();

function toggleSimStep() {
  isRunning = !isRunning;
  var btn = document.querySelector("#startsim");
  if (isRunning) {
    btn.innerHTML = "Pause simulation";
  } else {
    btn.innerHTML = "Start simulation";
  }
}

function updateStats() {
  document.querySelector("#statstime").innerHTML = statistics.timeofday;
  document.querySelector("#statscustomer").innerHTML = statistics.customers;
  document.querySelector("#statsinfected").innerHTML = statistics.infected;
  document.querySelector("#statsprofit").innerHTML =
    "$" + statistics.profits.toFixed(2);
  document.querySelector("#statsratio").innerHTML = statistics.ratio.toFixed(2);

  document.querySelector("#rest-count").innerHTML = customers.filter(function (
    d
  ) {
    return ["food0", "food1"].includes(d.place);
  }).length;
  document.querySelector("#retail-count").innerHTML = customers.filter(
    function (d) {
      return ["shop0", "shop1", "shop2", "shop3"].includes(d.place);
    }
  ).length;
  document.querySelector("#mall-count").innerHTML = customers.filter(function (
    d
  ) {
    return ["mall"].includes(d.place);
  }).length;
  document.querySelector("#outside-count").innerHTML = customers.filter(
    function (d) {
      return ["outside mall"].includes(d.place);
    }
  ).length;
}

function initialiseData() {
  customeridx = 0;
  isRunning = false; // used by simStep
  window.clearInterval(simTimer);
  currentTime = 0;
  datetime = new Date(2020, 11, 1, 7, 0, 0, 0);
  customers = [];
  cumratioinfected = 0;
  profits = 0;
  statistics = {
    avgInfected: 0,
    customers: 0,
    infected: 0,
    infectionLocation: {
      food0: 0,
      food1: 0,
      shop0: 0,
      shop1: 0,
      shop2: 0,
      shop3: 0,
      outside: 0,
      mall: 0,
    },
    profits: 0,
    r0: 0,
    ratio: 0,
    timeofday: parseDate(datetime),
    totalcustomers: 0,
    totinfected: 0,
    totnewinfected: 0,
  };
  statistics.timeofday = parseDate(datetime);

  avgInfected = 0;
  queues = [[], [], []];
  document.querySelector("#startsim").innerHTML = "Start simulation";
  updateStats();
}

function redrawWindow() {
  simTimer = window.setInterval(simStep, parameters.animationDelay); // call the function simStep every animationDelay milliseconds
  initialiseData();
  //resize the drawing surface; remove all its contents;
  var drawsurface = document.getElementById("surface");
  var surfaceWidth = 1000;
  var surfaceHeight = surfaceWidth / 2;
  drawsurface.style.width = surfaceWidth + "px";
  drawsurface.style.height = surfaceHeight + "px";
  drawsurface.innerHTML = ""; //This empties the contents of the drawing surface, like jQuery erase().
  // Compute the cellWidth and cellHeight, given the size of the drawing surface
  numCols = maxCols;
  cellWidth = surfaceWidth / numCols;
  numRows = Math.ceil(surfaceHeight / cellWidth);
  cellHeight = surfaceHeight / numRows;
  // In other functions we will access the drawing surface using the d3 library.
  //Here we set the global variable, surface, equal to the d3 selection of the drawing surface
  surface = d3.select("#surface");
  surface.selectAll("*").remove(); // we added this because setting the inner html to blank may not remove all svg elements
  surface.style("font-size", "100%");
  // rebuild contents of the drawing surface
  updateSurface();
  updateStats();
}

function updateSurface() {
  var allcustomers = surface.selectAll(".customer").data(customers);
  allcustomers.exit().remove();

  var newcustomers = allcustomers.enter().append("g").attr("class", "customer");

  newcustomers
    .append("svg:image")
    .attr("x", function (d) {
      return cellWidth * d.location.x;
    })
    .attr("y", function (d) {
      return cellHeight * d.location.y;
    })
    .attr("width", Math.min(cellWidth, cellHeight))
    .attr("height", Math.min(cellWidth, cellHeight))
    .attr("xlink:href", function (d) {
      if (d.type == "I") return urlInfected;
      else return urlcustomers[d.id % 4];
    });

  //  newcustomers
  //   .append("text")
  //   .attr("x", function (d) {
  //     return cellWidth * d.location.x;
  //   })
  //   .attr("y", function (d) {
  //     return (cellHeight * (d.location.y)) ;
  //   })
  //   .attr("width", Math.min(cellWidth, cellHeight))
  //   .attr("height", Math.min(cellWidth, cellHeight))
  //   .text(function (d) {
  //     return d.id
  //   });

  // var images = allcustomers.selectAll("text");
  var images = allcustomers.selectAll("image");
  images
    .transition()
    .attr("x", function (d) {
      return cellWidth * d.location.x;
    })
    .attr("y", function (d) {
      return cellHeight * d.location.y;
    })
    .attr("xlink:href", function (d) {
      if (d.type == "I" || d.type == "NI") {
        return urlInfected;
      } else {
        return urlcustomers[d.id % 4];
      }
    })
    .duration(parameters.animationDelay)
    .ease("linear");

  var layout = surface.selectAll(".layout").data(["./images/3entrance.png"]);
  var newlayout = layout.enter().append("g").attr("class", "layout");
  newlayout
    .append("svg:image")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("xlink:href", "./images/layout.png");

  //   newlayout
  //     .append("rect")
  //     .attr("x", cellWidth * 33.5)
  //     .attr("y", cellHeight * nodes.queueStartingPoint[0][1])
  //     .attr("width", cellWidth)
  //     .attr("height", cellHeight);
}

function addDynamicAgents() {
  if (Math.random() < probArrival[datetime.getHours()]) {
    statistics.customers++;
    var newcustomer = {
      id: customeridx,
      location: { x: 0, y: 0 },
      place: "outside mall",
      target: { x: 0, y: 0 },
      state: "QUEUEING",
      type: "N",
      scantime: getRandomFloat(1, 5),
    };
    if (Math.random() < parameters.probInfected) {
      newcustomer.type = "I";
    } else {
      newcustomer.type = "N";
    }

    // Find the right queue to go to
    var shortestQueueIndex = queues.indexOf(
      queues.reduce(
        function (p, c) {
          return p.length > c.length ? c : p;
        },
        { length: Infinity }
      )
    );
    newcustomer.entranceChoice = shortestQueueIndex;
    queues[shortestQueueIndex].push(newcustomer);
    newcustomer.target.x = nodes.mallEntrance[newcustomer.entranceChoice][0];
    newcustomer.target.y = nodes.mallEntrance[newcustomer.entranceChoice][1];
    newcustomer.location.x = nodes.spawnLocation[newcustomer.entranceChoice][0];
    newcustomer.location.y = nodes.spawnLocation[newcustomer.entranceChoice][1];

    customers.push(newcustomer);
    customeridx++;
  }
}

function updateCustomer(customerIndex) {
  customerIndex = Number(customerIndex);
  var customer = customers[customerIndex];
  var x = customer.location.x;
  var y = customer.location.y;
  var state = customer.state;


  var hasArrived =
    Math.abs(customer.target.x - x) + Math.abs(customer.target.y - y) == 0;
  //identify the citizens infected
  if (customer.type == "N") {
    var infectedcitizens = customers.filter(function (d) {
      return (
        (d.type == "I") &
        (d.place != "outside mall") &
        (d.place == customer.place)
      );
    });

    // determine if any citizen infected is nearby
    i = 0;
    if (infectedcitizens.length > 0 && customer.type == "N") {
      while (customer.type == "N" && i < infectedcitizens.length) {
        var infected = infectedcitizens[i];
        var infectedx = infected.location.x;
        var infectedy = infected.location.y;
        var distance = Math.sqrt(
          (infectedx - x) * (infectedx - x) + (infectedy - y) * (infectedy - y)
        );
        if (distance < parameters.DistTransmission) {
          if (Math.random() < parameters.InfectionRate) {
            customer.type = "NI";
            statistics.infectionLocation[customer.place]++;
            customer.infectedLocation = customer.place;
            // console.log(statistics.infectionLocation)
          }
        }
        i++;
      }
    }
  }

  // Behavior of patient depends on his or her state
  switch (state) {
    case "QUEUEING":
      progressQueue(customer, hasArrived);
      break;
    case "EATING":
      Eating(customer, hasArrived);
      break;
    case "SHOPPING":
      Shopping(customer, hasArrived);
      break;
    case "LEAVING":
      if (hasArrived) {
        changeTarget(customer, nodes.spawnLocation[customer.exit]);
        customer.state = "LEFT";
        customer.place = "outside mall";
      }
      break;
    case "LEFT":
      if (hasArrived) {
        statistics.customers--;
        customer.state = "GONE";
      }
    default:
      break;
  }
  // set the destination row and column
  var targetx = customer.target.x;
  var targety = customer.target.y;
  // compute the distance to the target destination
  var deltax = targetx - x;
  var deltay = targety - y;
  // set the speed
  var cellsPerStep = 1;
  // compute the cell to move to
  var newx = x + Math.min(Math.abs(deltax), cellsPerStep) * Math.sign(deltax);
  var newy = y + Math.min(Math.abs(deltay), cellsPerStep) * Math.sign(deltay);
  // update the location of the patient
  customer.location.x = newx;
  customer.location.y = newy;
}

/**
 * Remove customers who have left from the customer database and the svg object
 *
 */
function removeDynamicAgents() {
  var allcustomers = surface.selectAll(".customer").data(customers);
  var leftcustomers = allcustomers.filter(function (d, i) {
    return d.state == "GONE";
  });
  leftcustomers.remove();
  //customers = customers.filter(function (d) {
  //  return d.state != "GONE";
  //});
}

function updateDynamicAgents(redraw = true) {
  // loop over all the agents and update their states
  for (var customerIndex in customers) {
    if (customers[customerIndex].state != "GONE") {
      updateCustomer(customerIndex);
    }
  }
  if (redraw) {
    updateSurface();
  }
}

function simStep(fastfwd = false) {
  if (isRunning) {
    datetime.setSeconds(datetime.getSeconds() + 10);
    addDynamicAgents();
    updateDynamicAgents((redraw = !fastfwd));
    if (!fastfwd) {
      removeDynamicAgents();
    }

    // update stats
    currentTime++;
    statistics.totnewinfected = customers.filter(function (d) {
      return d.type == "NI";
    }).length;
    statistics.totinfected = customers.filter(function (d) {
      return d.type == "NI" || d.type == "I";
    }).length;
    statistics.timeofday = parseDate(datetime);
    statistics.totalcustomers = customers.length;
    cumratioinfected += statistics.infected / (statistics.customers + 0.001);
    statistics.avgInfected = (cumratioinfected / currentTime) * 100;
    statistics.r0 = statistics.totnewinfected / statistics.totinfected;
    statistics.ratio = statistics.profits / statistics.r0;
    if (!fastfwd) {
      updateChart();
      updateStats();
    }
    // console.log(statistics)
    // console.log(simulationCount + " " + datetime);

    if (datetime.getDay() === 3) {
      // if (datetime.getHours() === 10) {
      isRunning = false;
      // console.log("Simulation has ended");
    }
  }
}

function generateData() {
  var simCount = parseInt(prompt("How many simulations do you want to run?"));
  var simulationResults = [
    Object.keys(statistics)
      .concat(Object.keys(statistics.infectionLocation))
      .concat(Object.keys(parameters)),
  ];
  var i = 0;
  parameters.mallLimit = 150;
  while (i < simCount) {
    initialiseData();
    console.log("Simulation: " + i);
    isRunning = true;
    while (isRunning) {
      simStep((fastfwd = true));
    }

    simulationResults.push(
      Object.values(statistics).concat(
        Object.values(statistics.infectionLocation).concat(
          Object.values(parameters)
        )
      )
    );
    i++;
  }
  let csvContent = "";

  simulationResults.forEach(function (rowArray) {
    let simulationResults = rowArray.join(",");
    csvContent += simulationResults + "\r\n";
  });

  (function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  })("data.csv", csvContent);
}
