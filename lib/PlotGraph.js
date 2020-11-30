//Graph 1 - Number of Infections Vs Time

// Function to retrieve Number of Infections
function getData1() {
  return statistics.infected;
}
//Function to retrieve Number of Customers in Store
function getData2() {
  return statistics.customers;
}
//Function to retrieve Average % Customers Infected
function getData3() {
  return statistics.avgInfected;
}

//Function to retrieve RO Values
function getData4() {
  return statistics.r0;
}

//Function to get the profit/infectionns ratio
function getData5() {
  return statistics.ratio;
}

let myChart = document.getElementById("myChart").getContext("2d");
let myChart2 = document.getElementById("myChart2").getContext("2d");
let myChart3 = document.getElementById("myChart3").getContext("2d");
let myChart4 = document.getElementById("myChart4").getContext("2d");
var chart = new Chart(myChart, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: [""],
    datasets: [
      {
        label: "Number of Infected people",
        backgroundColor: "rgb(238, 109, 134,0.75)",
        borderColor: "rgb(238, 109, 134,0.85)",
        data: [],
      },
      {
        label: "Number of Customers in Store",
        backgroundColor: "rgb(248, 207, 108,0.75)",
        borderColor: "rgb(248,207, 108,0.85)",
        data: [],
      },
    ],
  },
  // Configuration options go here
  options: {
    title: {
      display: true,
      text: "Number of Customers Infected vs Time",
    },
    elements: {
      point: {
        radius: 0,
      },
    },

    scales: {
      xAxes: [
        {
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  },
});

var chart2 = new Chart(myChart2, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: [""],
    datasets: [
      {
        label: "Average % Customers Infected",
        backgroundColor: "rgb(161, 193, 139,0.75)",
        borderColor: "rgb(161, 193, 139,0.85)",
        data: [],
      },
    ],
  },
  // Configuration options go here
  options: {
    elements: {
      point: {
        radius: 0,
      },
    },
    title: {
      display: true,
      text: "Proportion of Infected vs Time",
    },

    scales: {
      xAxes: [
        {
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  },
});

var chart3 = new Chart(myChart3, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: [""],
    datasets: [
      {
        label: "RO Value",
        backgroundColor: "rgb(89, 160, 216,0.75)",
        borderColor: "rgb(89, 160, 216,0.85)",
        data: [],
      },
    ],
  },
  // Configuration options go here
  options: {
    elements: {
      point: {
        radius: 0,
      },
    },
    title: {
      display: true,
      text: "RO Value vs Time",
    },

    scales: {
      xAxes: [
        {
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  },
});

var chart4 = new Chart(myChart4, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: [""],
    datasets: [
      {
        label: "Profits/Infection Ratio",
        backgroundColor: "rgb(109, 191, 191,0.75)",
        borderColor: "rgb(109, 191, 191,0.85)",
        data: [],
      },
    ],
  },
  // Configuration options go here
  options: {
    elements: {
      point: {
        radius: 0,
      },
    },
    title: {
      display: true,
      text: "Profits/Infection Ratio vs Time",
    },

    scales: {
      xAxes: [
        {
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  },
});

function updateChart() {
  //Update Graph 1
  chart.data.datasets[0].data.push(getData1());
  chart.data.datasets[1].data.push(getData2());
  chart.data.labels.push(""); // Push out empty labels of time
  chart.update();

  //Update Graph 2
  chart2.data.datasets[0].data.push(getData3());
  chart2.data.labels.push(""); // Push out empty labels of time
  chart2.update();

  //Update Graph 3
  chart3.data.datasets[0].data.push(getData4());
  chart3.data.labels.push(""); // Push out empty labels of time
  chart3.update();

   //Update Graph 4
   chart4.data.datasets[0].data.push(getData5());
   chart4.data.labels.push(""); // Push out empty labels of time
   chart4.update();


}
