function nearestExit(selectedCustomer) {
  var exit1 =
    Math.abs(selectedCustomer.location.x - nodes.mallEntrance[0][0]) +
    Math.abs(selectedCustomer.location.y - nodes.mallEntrance[0][1]);
  var exit2 =
    Math.abs(selectedCustomer.location.x - nodes.mallEntrance[1][0]) +
    Math.abs(selectedCustomer.location.y - nodes.mallEntrance[1][1]);
  var exit3 =
    Math.abs(selectedCustomer.location.x - nodes.mallEntrance[2][0]) +
    Math.abs(selectedCustomer.location.y - nodes.mallEntrance[2][1]);
  var exits = [exit1, exit2, exit3];
  return exits.indexOf(Math.min(...exits));
}
//normal distrution
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

function Shopping(selectedCustomer, hasArrived) {
  switch (selectedCustomer.substate) {
    case "FINDINGSHOP":
      if (hasReached(selectedCustomer, nodes.points.middle)) {
        var shopChoice = Math.floor(Math.random() * 4);
        selectedCustomer.shopChoice = shopChoice;
        selectedCustomer.substate = "GOINGTOSHOP";
        changeTarget(
          selectedCustomer,
          nodes.shopEntrance["shop" + selectedCustomer.shopChoice]
        );
      }
      break;
    case "GOINGTOSHOP":
      if (Math.random() < 0.01) {
        selectedCustomer.substate = "LEAVINGSHOP";
        changeTarget(
          selectedCustomer,
          nodes.shopEntrance["shop" + selectedCustomer.shopChoice]
        );
      } else if (hasArrived) {
        // Choose random place in a shop to shop
        var cornerChoice = Math.floor(Math.random() * 4);
        changeTarget(
          selectedCustomer,
          nodes["shop" + selectedCustomer.shopChoice][cornerChoice]
        );
      }
      break;
    case "LEAVINGSHOP":
      if (Math.random() < 0.3) {
        var exit = nearestExit(selectedCustomer);
        selectedCustomer.exit = exit;
        selectedCustomer.state = "LEAVING";
        statistics[7].count = statistics[7].count + Math.round(randn_bm(0,50,1))
        changeTarget(selectedCustomer, nodes.mallEntrance[exit]);
      } else {
        selectedCustomer.substate = "FINDINGSHOP";
        changeTarget(selectedCustomer, nodes.points.middle);
      }
      break;
  }
}
