function toggleArray(array, value) {
  var index = array.indexOf(value);
  if (index === -1) {
    array.push(value);
  } else {
    array.splice(index, 1);
  }
}

function changeTarget(customer, array) {
  customer.target.x = array[0];
  customer.target.y = array[1];
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function padDigits(number) {
  return Array(Math.max(2 - String(number).length + 1, 0)).join(0) + number;
}

function parseDate(date) {
  return padDigits(date.getHours()) + ":" + padDigits(date.getMinutes());
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
        case "Slow":
          newval = 600;
          break;
        case "Medium":
          newval = 500;
          break;
        case "Fast":
          newval = 450;
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
          newval = 0.05;
          break;
      }
      break;
    case "mallLimit":
      newval = parseInt(value);
  }
  parameters[group] = newval;
}
