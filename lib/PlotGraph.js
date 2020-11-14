//Graph 1 - Number of Infections Vs Time

// Function to retrieve Number of Infections
function getData1() {
  return statistics[2].count;
}
//Function to retrieve Number of Customers in Store
function getData2() {
  return statistics[1].count;
}
//Function to retrieve Average % Customers Infected
function getData3() {
  return statistics[3].count;
}

//Function to retrieve RO Values
function getData4() {
  return statistics[4].count;
}

let myChart = document.getElementById("myChart").getContext("2d");
let myChart2 = document.getElementById("myChart2").getContext("2d");
let myChart3 = document.getElementById("myChart3").getContext("2d");
var chart = new Chart(myChart, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: [""],
    datasets: [
      {
        label: "Number of Infected people",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
      {
        label: "Number of Customers in Store",
        backgroundColor: "rgb(0, 99, 0)",
        borderColor: "rgb(0, 99, 0)",
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

    scales: {
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
        backgroundColor: "rgb(100, 99, 132)",
        borderColor: "rgb(100, 99, 132)",
        data: [],
      },
    ],
  },
  // Configuration options go here
  options: {
    title: {
      display: true,
      text: "Average $ Customers Infected vs Time",
    },

    scales: {
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
        backgroundColor: "rgb(75, 99, 132)",
        borderColor: "rgb(75, 99, 132)",
        data: [],
      },
    ],
  },
  // Configuration options go here
  options: {
    title: {
      display: true,
      text: "RO Value vs Time",
    },

    scales: {
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
}
