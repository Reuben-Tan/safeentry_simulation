var WINDOWBORDERSIZE = 10;
var HUGE = 999999; //Sometimes useful when testing for big or small numbers
var animationDelay = 150; //controls simulation and transition speed
var isRunning = false; // used in simStep and toggleSimStep
var surface; // Set in the redrawWindow function. It is the D3 selection of the svg drawing surface
var simTimer; // Set in the initialization function

//The drawing surface will be divided into logical cells
var maxCols = 40;
var middleCol = maxCols / 2;
var cellWidth; //cellWidth is calculated in the redrawWindow function
var cellHeight; //cellHeight is calculated in the redrawWindow function

//You are free to change images to suit your purpose. These images came from icons-land.com.
// The copyright rules for icons-land.com require a backlink on any page where they appear.
// See the credits element on the html page for an example of how to comply with this rule.
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

const urlInfected = "images/Zombie.png"
const urlNotInfected = "images/customer_green.png"

var exitRow = 7.5;
var exitCol = 32;
var entrance1Row = 7.5;
var entrance1Col = 7;
var entrance2Row = 14;
var entrance2Col = 15;
var customeridx = 1;

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
// datetime object
var datetime = new Date(2020, 11, 1, 7, 0, 0, 0);

function padDigits(number) {
  return Array(Math.max(2 - String(number).length + 1, 0)).join(0) + number;
}
function parseDate(date) {
  return padDigits(date.getHours()) + ":" + padDigits(date.getMinutes());
}

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
var queue1 = [];
var queue2 = [];

// caregivers is a static list, populated with a receptionist and a doctor
var keyAreas = [
  { type: EXIT, label: "Exit", location: { row: exitRow, col: exitCol } },
  {
    type: ENTRANCE,
    label: "Entrance 1",
    location: { row: entrance1Row, col: entrance1Col },
  }, 
  {
    type: ENTRANCE,
    label: "Entrance 2",
    location: { row: entrance2Row, col: entrance2Col },
  }
];

// We have different types of citizes (infected=I and notinfected=N) according to a probability, probInfected.
var probInfected = 0.1;

// These variables define what is the probability of getting infected when a notinfected citizen is near to a infected citizen, 
// It also specifies the minimum distance for an infection opportunity to take place
var InfectionRate=0.2;
var DistTransmission=2;

// We can section our screen into different areas. In this model, the waiting area and the staging area are separate.
var areas = [
  {
    label: "Waiting Area",
    startRow: 3,
    numRows: 10,
    startCol: 10,
    numCols: 20,
    color: "blue",
  },
  {
    label: "Shop",
    startRow: 3,
    numRows: 3,
    startCol: 10,
    numCols: 4,
    color: "black",
  },
  {
    label: "Shop",
    startRow: 10.15,
    numRows: 3,
    startCol: 10,
    numCols: 4,
    color: "black",
  },
  {
    label: "Shop",
    startRow: 3,
    numRows: 3,
    startCol: 26,
    numCols: 4,
    color: "black",
  },
  {
    label: "Shop",
    startRow: 10.15,
    numRows: 3,
    startCol: 26,
    numCols: 4,
    color: "black",
  },
  {
    label: "Shop",
    startRow: 3,
    numRows: 3,
    startCol: 18,
    numCols: 4,
    color: "black",
  },
  {
    label: "Shop",
    startRow: 10.15,
    numRows: 3,
    startCol: 18,
    numCols: 4,
    color: "black",
  },
];
var waitingRoom = areas[0]; // the waiting room is the first element of the areas array

var currentTime = 0;
var statistics = [
  {
    name: "Time of day ",
    location: { row: 12 , col: 1 },
  },
  {
    name: "No. Customers in Store: ",
    location:{row:13, col :1},
    count:0
  },
  {
    name:"No. Customers Infected: ",
    location :{row:14, col :1},
    count:0
  },
  {
    name:"Avg % Customers Infected: ",
    location:{row:15, col :1},
    count:0
  },
  {name:"R0: ",
  location:{row:16, col :1},
  count:0
  }
];

var cumratioinfected=0;
var totinfected=0;
var totnewinfected=0

// Probability that one patron arrives
const arrivalFactor = 2;
var probArrival = {
  1: 0 * arrivalFactor,
  2: 0 * arrivalFactor,
  3: 0 * arrivalFactor,
  4: 0 * arrivalFactor,
  5: 0 * arrivalFactor,
  6: 0.02 * arrivalFactor,
  7: 0.05 * arrivalFactor,
  8: 0.1 * arrivalFactor,
  9: 0.15 * arrivalFactor,
  10: 0.1 * arrivalFactor,
  11: 0.2 * arrivalFactor,
  12: 0.35 * arrivalFactor,
  13: 0.35 * arrivalFactor,
  14: 0.2 * arrivalFactor,
  15: 0.1 * arrivalFactor,
  16: 0.05 * arrivalFactor,
  17: 0.1 * arrivalFactor,
  18: 0.15 * arrivalFactor,
  19: 0.3 * arrivalFactor,
  20: 0.1 * arrivalFactor,
  21: 0.05 * arrivalFactor,
  22: 0.01 * arrivalFactor,
  23: 0.01 * arrivalFactor,
};

// This next function is executed when the script is loaded. It contains the page initialization code.
(function () {
  // Your page initialization code goes here
  // All elements of the DOM will be available here
  window.addEventListener("resize", redrawWindow); //Redraw whenever the window is resized
  simTimer = window.setInterval(simStep, animationDelay); // call the function simStep every animationDelay milliseconds
  redrawWindow();
})();

// We need a function to start and pause the the simulation.
function toggleSimStep() {
  //this function is called by a click event on the html page.
  // Search BasicAgentModel.html to find where it is called.
  isRunning = !isRunning;
  console.log("isRunning: " + isRunning);
}

function redrawWindow() {
  isRunning = false; // used by simStep
  window.clearInterval(simTimer); // clear the Timer
  animationDelay = 600 - document.getElementById("slider1").value;
  simTimer = window.setInterval(simStep, animationDelay); // call the function simStep every animationDelay milliseconds

  // Re-initialize simulation variables
  currentTime = 0;
  datetime = new Date(2020, 11, 1, 7, 0, 0, 0);
  customers = [];
  statistics[1].count=0;
  statistics[2].count=0;
  statistics[3].count=0;
  statistics[4].count=0;
  cumratioinfected=0;
  totinfected=0;
  totnewinfected=0

  //resize the drawing surface; remove all its contents;
  var drawsurface = document.getElementById("surface");
  var creditselement = document.getElementById("credits");
  var w = window.innerWidth;
  var h = window.innerHeight;
  var surfaceWidth = w - 3 * WINDOWBORDERSIZE;
  var surfaceHeight = h - creditselement.offsetHeight - 3 * WINDOWBORDERSIZE;

  drawsurface.style.width = surfaceWidth + "px";
  drawsurface.style.height = surfaceHeight + "px";
  drawsurface.style.left = WINDOWBORDERSIZE / 2 + "px";
  drawsurface.style.top = WINDOWBORDERSIZE / 2 + "px";
  drawsurface.style.border = "thick solid #0000FF"; //The border is mainly for debugging; okay to remove it
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
}

// The window is resizable, so we need to translate row and column coordinates into screen coordinates x and y
function getLocationCell(location) {
  var row = location.row;
  var col = location.col;
  var x = (col - 1) * cellWidth; //cellWidth is set in the redrawWindow function
  var y = (row - 1) * cellHeight; //cellHeight is set in the redrawWindow function
  return { x: x, y: y };
}

function updateSurface() {
  var allcustomers = surface.selectAll(".customer").data(customers);
  allcustomers.exit().remove();

  var newcustomers = allcustomers.enter().append("g").attr("class", "customer");

  newcustomers
    .append("svg:image")
    .attr("x", function (d) {
      var cell = getLocationCell(d.location);
      return cell.x + "px";
    })
    .attr("y", function (d) {
      var cell = getLocationCell(d.location);
      return cell.y + "px";
    })
    .attr("width", Math.min(cellWidth, cellHeight) + "px")
    .attr("height", Math.min(cellWidth, cellHeight) + "px")
    .attr(
      "xlink:href",
      function(d){if (d.type=="I") return urlInfected; else return urlNotInfected;}
    );

  var images = allcustomers.selectAll("image");
  // Next we define a transition for each of these image elements.
  // Note that we only need to update the attributes of the image element which change
  images
    .transition()
    .attr("x", function (d) {
      var cell = getLocationCell(d.location);
      return cell.x + "px";
    })
    .attr("y", function (d) {
      var cell = getLocationCell(d.location);
      return cell.y + "px";
	})
	.attr("xlink:href",function(d){if (d.type=="I") return urlInfected; else return urlNotInfected;})
    .duration(animationDelay)
    .ease("linear"); // This specifies the speed and type of transition we want.

  var allkeyareas = surface.selectAll(".keyarea").data(keyAreas);
  var newcaregivers = allkeyareas.enter().append("g").attr("class", "keyarea");
  newcaregivers
    .append("svg:image")
    .attr("x", function (d) {
      var cell = getLocationCell(d.location);
      return cell.x + "px";
    })
    .attr("y", function (d) {
      var cell = getLocationCell(d.location);
      return cell.y + "px";
    })
    .attr("width", Math.min(cellWidth, cellHeight) + "px")
    .attr("height", Math.min(cellWidth, cellHeight) + "px")
    .attr("xlink:href", urlEntrance);

  // It would be nice to label the caregivers, so we add a text element to each new caregiver group
  newcaregivers
    .append("text")
    .attr("x", function (d) {
      var cell = getLocationCell(d.location);
      return cell.x + cellWidth + "px";
    })
    .attr("y", function (d) {
      var cell = getLocationCell(d.location);
      return cell.y + cellHeight / 2 + "px";
    })
    .attr("dy", ".35em")
    .text(function (d) {
      return d.label;
    });

  // The simulation should serve some purpose
  // so we will compute and display the average length of stay of each patient type.
  // We created the array "statistics" for this purpose.
  // Here we will create a group for each element of the statistics array (two elements)
  var allstatistics = surface.selectAll(".statistics").data(statistics);
  var newstatistics = allstatistics
    .enter()
    .append("g")
    .attr("class", "statistics");
  // For each new statistic group created we append a text label
  newstatistics.append("text")
	.attr("x", function(d) { var cell= getLocationCell(d.location); return (cell.x+cellWidth)+"px"; })
  .attr("y", function(d) { var cell= getLocationCell(d.location); return (cell.y+cellHeight/2)+"px"; })
  .attr("dy", ".35em")
  .text("");

  //newstatistics
  //.append("text")
  // .attr("x", function (d) {
  //   var cell = getLocationCell(d.location);
  //   return cell.x + cellWidth + "px";
  // })
  //.attr("x", "1%")
  //.attr("y", "3%")
  //.attr("dy", ".35em")
  //.text("");


  // The data in the statistics array are always being updated.
  // So, here we update the text in the labels with the updated information.
  //allstatistics.selectAll("text").text("Current time: " + parseDate(datetime)); //The toFixed() function sets the number of decimal places to display
  allstatistics.selectAll("text").text(function(d) {
	  var nocitizens = d.count; // cumulativeValue and count for each statistic are always changing
		return d.name+nocitizens });
    
  // Finally, we would like to draw boxes around the different areas of our system. We can use d3 to do that too.
  var allareas = surface.selectAll(".areas").data(areas);
  var newareas = allareas.enter().append("g").attr("class", "areas");
  // For each new area, append a rectangle to the group
  newareas
    .append("rect")
    .attr("x", function (d) {
      return (d.startCol - 1) * cellWidth;
    })
    .attr("y", function (d) {
      return (d.startRow - 1) * cellHeight;
    })
    .attr("width", function (d) {
      return d.numCols * cellWidth;
    })
    .attr("height", function (d) {
      return d.numRows * cellWidth;
    })
    .style("fill", function (d) {
      return d.color;
    })
    .style("stroke", "black")
    .style("stroke-width", 1);
}

function addDynamicAgents() {
  if (Math.random() < probArrival[datetime.getHours()]) {
    statistics[1].count++
    var newcustomer = {
	  id: customeridx,
      location: { row: 10, col: 1 },
	  state: QUEUEING,
	  type: "I",
      timeAdmitted: 0,
      shoppingTime: getRandomFloat(10,50),
      scantime: getRandomFloat(3,7),
      temp : getRandomFloat(35.3, 38.8)
    };
	if (Math.random()<probInfected) {
		newcustomer.type = "I", statistics[2].count++, totinfected++}
	   else{newcustomer.type = "N"};

      
    // newcustomer.sick = newcustomer.temp > getRandomFloat(37.4,38)
    if (queue1.length > queue2.length) {
      newcustomer.target = {row: entrance2Row, col: entrance2Col}
      newcustomer.entranceChoice = 2
      queue2.push(newcustomer)
    } else {
      newcustomer.target = {row: entrance1Row, col: entrance1Col}
      newcustomer.entranceChoice = 1
      queue1.push(newcustomer)
    }
    customers.push(newcustomer);
    customeridx++;
  }
}

function updateCustomer(customerIndex) {
  customerIndex = Number(customerIndex);
  var customer = customers[customerIndex];
  var row = customer.location.row;
  var col = customer.location.col;
  var state = customer.state;
  var shoptime = customer.shoppingTime;

  var hasArrived =
    Math.abs(customer.target.row - row) + Math.abs(customer.target.col - col) ==
	0;
  //identify the citizens infected 
  var infectedcitizens=customers.filter(function(d){return d.type=="I";});

  //determine if any citizen infected is nearby
  i=0
  if (infectedcitizens.length>0 && customer.type=="N") {
	  while (customer.type=="N" && i< infectedcitizens.length){
		 var infected=infectedcitizens[i];
		 var infectedrow=infected.location.row
		 var infectedcol=infected.location.col
		 var distance=Math.sqrt((infectedrow-row)*(infectedrow-row)+(infectedcol-col)*(infectedcol-col))
		 if (distance<DistTransmission){
			  if (Math.random()<InfectionRate) {customer.type="I",statistics[2].count++, totnewinfected++}    
		  }
		 i=i+1 
	  }
  }

  function progressQueue(selectedCustomer) {
    var queuePos;
    const entranceNumber = selectedCustomer.entranceChoice;
    queuePos = Math.max(queue1.indexOf(selectedCustomer),queue2.indexOf(selectedCustomer))
    if (entranceNumber === 1) {
      if (queuePos >= 1) {
        selectedCustomer.target.row = entrance1Row + queuePos;
        selectedCustomer.target.col = entrance1Col - 1;
      } else {
        selectedCustomer.target.row = entrance1Row;
        selectedCustomer.target.col = entrance1Col - 1;
      }
      if (queuePos === 0) {
        if (selectedCustomer.scantime < 0) {
          selectedCustomer.state = SHOPPING;
          queue1.shift();
        } else {
          selectedCustomer.scantime--;
        }
    }
  } else {
    if (queuePos >= 1) {
      selectedCustomer.target.row = entrance2Row + queuePos;
      selectedCustomer.target.col = entrance2Col - 1;
    } else {
      selectedCustomer.target.row = entrance2Row;
      selectedCustomer.target.col = entrance2Col - 1;
    }
    if (queuePos === 0) {
      if (customer.scantime < 0) {
        selectedCustomer.state = SHOPPING;
        queue2.shift();
      } else {
        selectedCustomer.scantime--;
      }
  }
  }
}


  // Behavior of patient depends on his or her state
  switch (state) {
    case QUEUEING:
      progressQueue(customer);
      break;
    case SHOPPING:
      if (shoptime > 0) {
        customer.shoppingTime--;
        if (hasArrived) {
          // Randomly choose a shop to enter
          chosenShop = Math.ceil(Math.random() * 6);
          customer.target.row = shops[chosenShop][0];
          customer.target.col = shops[chosenShop][1];
        }
      } else {
        customer.state = EXITING;
      }
      break;
    case EXITING:
      // Complete treatment randomly according to the probability of departure
      customer.state = EXITED;
      customer.target.row = exitRow;
      customer.target.col = exitCol;
      break;
    case EXITED:
      if (hasArrived) {
        customer.target.row = 1;
        customer.target.col = maxCols;
        customer.state = LEFT;
      }
      break;
    case LEFT:
      if (hasArrived) {
        statistics[1].count--
        customer.state = "GONE";
        if (customer.type=="I") {statistics[2].count--};
      }
      break;
    default:
      break;
  }
  // set the destination row and column
  var targetRow = customer.target.row;
  var targetCol = customer.target.col;
  // compute the distance to the target destination
  var rowsToGo = targetRow - row;
  var colsToGo = targetCol - col;
  // set the speed
  var cellsPerStep = 1;
  // compute the cell to move to
  var newRow =
    row + Math.min(Math.abs(rowsToGo), cellsPerStep) * Math.sign(rowsToGo);
  var newCol =
    col + Math.min(Math.abs(colsToGo), cellsPerStep) * Math.sign(colsToGo);
  // update the location of the patient
  customer.location.row = newRow;
  customer.location.col = newCol;
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
    // Sometimes new agents will be created in the following function
    addDynamicAgents();
    // In the next function we update each agent
    updateDynamicAgents();
    // Sometimes agents will be removed in the following function
    removeDynamicAgents();

    //Update statistics
		cumratioinfected=cumratioinfected+(statistics[2].count/(statistics[1].count+0.001));
    statistics[3].count=cumratioinfected/currentTime*100;
    statistics[4].count=totnewinfected/totinfected;
  }
}
