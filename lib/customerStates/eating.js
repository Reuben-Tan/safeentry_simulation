const OCCUPIED = 11;
const VACANT = 10;
var foodCapacity = [Array(9).fill(VACANT), Array(8).fill(VACANT)];
var foodQueue = [[], []];

//normal distribution
function randn_bm(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {num = randn_bm(min, max, skew)}; // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}

function Eating(selectedCustomer, hasArrived) {
  // not at food area
  // Select food choice for customer
  var foodChoice = selectedCustomer.foodChoice;

  switch (selectedCustomer.substate) {
    case "NOTATFOODAREA":
      changeTarget(selectedCustomer, nodes.points.middle);
      if (hasArrived) {
        selectedCustomer.substate = "LOOKINGFORFOOD";
        changeTarget(selectedCustomer, nodes.points.foodMiddle);
      }
      break;
    case "LOOKINGFORFOOD":
      if (!("foodChoice" in selectedCustomer) & hasArrived) {
        selectedCustomer.foodChoice = Math.random() > 0.5 ? 0 : 1;
        selectedCustomer.eatingTime = Math.random() * 10;
        selectedCustomer.substate = "QUEUEINGFORFOOD";
        changeTarget(
          selectedCustomer,
          nodes.shopEntrance["food" + selectedCustomer.foodChoice]
        );
      }
      break;
    case "QUEUEINGFORFOOD":
      if (
        hasReached(selectedCustomer, nodes.shopEntrance["food" + foodChoice])
      ) {
        // find a seat to sit and eat
        var seatnum = foodCapacity[foodChoice].indexOf(VACANT);
        selectedCustomer.seatnum = seatnum;
        if (seatnum >= 0) {
          changeTarget(selectedCustomer, nodes["food" + foodChoice][seatnum]);
          foodCapacity[foodChoice][seatnum] = OCCUPIED;
          selectedCustomer.substate = "EATING";
        }
      }
      break;
    case "EATING":
      if (hasArrived) {
        if (Math.random() < 0.05) {
          // Finish eating
          foodCapacity[foodChoice][selectedCustomer.seatnum] = VACANT;
          selectedCustomer.substate = "LEAVING";
          statistics[7].count = statistics[7].count + Math.round(randn_bm(0,50,1))
          changeTarget(
            selectedCustomer,
            nodes.shopEntrance["food" + foodChoice]
          );
        }
      }
      break;
    case "LEAVING":
      if (hasArrived) {
        selectedCustomer.state = "SHOPPING";
        selectedCustomer.substate = "FINDINGSHOP";
        changeTarget(selectedCustomer, nodes.points.middle);
      }
      break;
  }
}
