var WINDOWBORDERSIZE = 10;
var HUGE = 999999; //Sometimes useful when testing for big or small numbers
var isRunning = false; // used in simStep and toggleSimStep
var surface; // Set in the redrawWindow function. It is the D3 selection of the svg drawing surface
var simTimer; // Set in the initialization function
var parameters = {
  animationDelay: 150,
  probInfected: 0.01,
  InfectionRate: 0.05,
  DistTransmission: 2,
  arrivalFactor: 2,
  NumEntrance: 2,
};


function hasReached(customer, location) {
  return (
    Math.abs(customer.location.x - location[0]) +
      Math.abs(customer.location.y - location[1]) ===
    0
  );
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
        case "Slow":
          newval = 200;
          break;
        case "Medium":
          newval = 150;
          break;
        case "Fast":
          newval = 100;
          break;
      }
      break;
    case "arrivalFactor":
      switch (value) {
        case "Low":
          newval = 1;
          break;
        case "Medium":
          newval = 2;
          break;
        case "High":
          newval = 3;
          break;
      }
      break;
    case "probInfected":
      switch (value) {
        case "Low":
          newval = 0.01;
          break;
        case "High":
          newval = 0.15;
          break;
      }
      break;
    case "NumEntrance":
      newval = value;
  }
  parameters[group] = newval;
  console.log(parameters);
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

var exitRow = 7.5;
var exitCol = 30;
var entrance1Row = 7.5;
var entrance1Col = 9;
var entrance2Row = 13;
var entrance2Col = 15;
var customeridx = 0;

// States of mall patrons
const QUEUEING = 1;
const SHOPPING = 2;
const EXITING = 3;
const EXITED = 4;
const LEFT = 5;

// Key areas
const EXIT = 1;
const ENTRANCE = 2;
const shops = {
  1: [4, 12],
  2: [4, 20],
  3: [4, 27],
  4: [11, 12],
  5: [11, 20],
  6: [11, 27],
};

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
var queues = [[], [], []];

var currentTime = 0;
var statistics = [
  {
    name: "Time of day ",
    location: { x: 15, y: 1 },
    datetime: parseDate(datetime),
  },
  {
    name: "No. Customers in Store: ",
    location: { x: 16, y: 1 },
    count: 0,
  },
  {
    name: "No. Customers Infected: ",
    location: { row: 17, col: 1 },
    count: 0,
  },
  {
    name: "Avg % Customers Infected: ",
    location: { x: 18, y: 1 },
    count: 0,
  },
  { name: "R0: ", location: { x: 19, y: 1 }, count: 0 },
];

var cumratioinfected = 0;
var totinfected = 0;
var totnewinfected = 0;

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
  document.querySelector("#statstime").innerHTML = statistics[0].datetime;
  document.querySelector("#statscustomer").innerHTML = statistics[1].count;
  document.querySelector("#statsinfected").innerHTML = statistics[2].count;
}

function redrawWindow() {
  isRunning = false; // used by simStep
  window.clearInterval(simTimer); // clear the Timer
  parameters.animationDelay = 200;
  simTimer = window.setInterval(simStep, parameters.animationDelay); // call the function simStep every animationDelay milliseconds

  // Re-initialize simulation variables
  currentTime = 0;
  datetime = new Date(2020, 11, 1, 7, 0, 0, 0);
  statistics[0].datetime = parseDate(datetime);
  customers = [];
  statistics[1].count = 0;
  statistics[2].count = 0;
  statistics[3].count = 0;
  statistics[4].count = 0;
  cumratioinfected = 0;
  totinfected = 0;
  totnewinfected = 0;
  queues = [[], [], []];
  document.querySelector("#startsim").innerHTML = "Start simulation";

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
      return cellHeight * (d.location.y);
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
  //     return (cellHeight * (d.location.y + 1)) ;
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
      return cellHeight * (d.location.y);
    })
    .attr("xlink:href", function (d) {
      if (d.type == "I") {
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

  // NUNO FOREVER
  //   newlayout
  //     .append("rect")
  //     .attr("x", cellWidth * 33.5)
  //     .attr("y", cellHeight * nodes.queueStartingPoint[0][1])
  //     .attr("width", cellWidth)
  //     .attr("height", cellHeight);
}

function addDynamicAgents() {
  // if (Math.random() < probArrival[datetime.getHours()]) {
  if (Math.random() < 0.5) {
    // if (customers.length === 0) {
    statistics[1].count++;
    var newcustomer = {
      id: customeridx,
      location: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      state: "QUEUEING",
      type: "N",
      timeAdmitted: 0,
      shoppingTime: getRandomFloat(10, 50),
      scantime: getRandomFloat(1,5),
      // temp: getRandomFloat(35.3, 38.8),
    };
    if (Math.random() < parameters.probInfected) {
      (newcustomer.type = "I"), statistics[2].count++, totinfected++;
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
  var shoptime = customer.shoppingTime;

  var hasArrived =
    Math.abs(customer.target.x - x) + Math.abs(customer.target.y - y) == 0;
  //identify the citizens infected
  var infectedcitizens = customers.filter(function (d) {
    return d.type == "I";
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
          (customer.type = "I"), statistics[2].count++, totnewinfected++;
        }
      }
      i = i + 1;
    }
  }

  // Behavior of patient depends on his or her state
  switch (state) {
    case "QUEUEING":
      progressQueue(customer, hasArrived);
      break;
    case "EATING":
      Eating(customer, hasArrived);

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
  customers = customers.filter(function (d) {
    return d.state != "GONE";
  });
}

function updateDynamicAgents() {
  // loop over all the agents and update their states
  for (var customerIndex in customers) {
    updateCustomer(customerIndex);
  }
  updateSurface();
}

function simStep() {
  //This function is called by a timer; if running, it executes one simulation step
  //The timing interval is set in the page initialization function near the top of this file
  if (isRunning) {
    //the isRunning variable is toggled by toggleSimStep
    // Increment current time (for computing statistics)
    currentTime++;
    datetime.setMinutes(datetime.getMinutes() + 1);

    // console.log(datetime)
    // Sometimes new agents will be created in the following function
    addDynamicAgents();
    // In the next function we update each agent
    updateDynamicAgents();
    // Sometimes agents will be removed in the following function
    removeDynamicAgents();

    //Update statistics
    // console.log(customers.filter(function (d) {
    //   return d.entranceChoice === 0;
    // }));

    statistics[0].datetime = parseDate(datetime);

    cumratioinfected =
      cumratioinfected + statistics[2].count / (statistics[1].count + 0.001);
    statistics[3].count = (cumratioinfected / currentTime) * 100;
    statistics[4].count = totnewinfected / totinfected;
    updateChart();
    updateStats();
  }
}
