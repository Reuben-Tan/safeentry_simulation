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
        selectedCustomer.place = "shop" + selectedCustomer.shopChoice
      }
      break;
    case "LEAVINGSHOP":
      selectedCustomer.place = 'mall'
      if (Math.random() < 0.3) {
        var exit = nearestExit(selectedCustomer);
        selectedCustomer.exit = exit;
        selectedCustomer.state = "LEAVING";
        if (Math.random() < 0.1) {
          statistics.profits += randn_bm(0,50,1)
        }
        changeTarget(selectedCustomer, nodes.mallEntrance[exit]);
      } else {
        selectedCustomer.substate = "FINDINGSHOP";
        changeTarget(selectedCustomer, nodes.points.middle);
      }
      break;
  }
}
