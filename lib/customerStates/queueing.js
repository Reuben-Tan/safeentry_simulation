/**
 * New customers choose which is the shortest queue and joins it, moves queue up whenever there's space in front and enters mall once done
 *
 * @param {object} the customer we're looking at
 * @return  NIL
 */
function progressQueue(selectedCustomer, hasArrived) {
  var queuePos;
  var arrivedAtEntrance = hasReached(selectedCustomer, nodes.queueStartingPoint[selectedCustomer.entranceChoice]);
  queuePos = queues[selectedCustomer.entranceChoice].indexOf(selectedCustomer);

  if (queuePos === 0 && arrivedAtEntrance) {
    // reach the end of the queue
    if (selectedCustomer.scantime < 0) {
      // selectedCustomer.state = (Math.random() > 0.5) ? "SHOPPING" : "EATING"
      selectedCustomer.state = "EATING"
      if (selectedCustomer.location.x > 25.5) {
        selectedCustomer.substate = 'NOTATFOODAREA'
        changeTarget(selectedCustomer, nodes.points.middle)
    } else {
        selectedCustomer.substate = 'LOOKINGFORFOOD'
        changeTarget(selectedCustomer, nodes.points.foodMiddle)
    }
      queues[selectedCustomer.entranceChoice].shift();
    } else {
      selectedCustomer.scantime--;
    }
  } else {
    switch (selectedCustomer.entranceChoice) {
      case 0:
        selectedCustomer.target.x =
          nodes.queueStartingPoint[selectedCustomer.entranceChoice][0];
        selectedCustomer.target.y =
          nodes.queueStartingPoint[selectedCustomer.entranceChoice][1] +
          queuePos;
        break;
      case 1:
        selectedCustomer.target.x =
          nodes.queueStartingPoint[selectedCustomer.entranceChoice][0];
        selectedCustomer.target.y =
          nodes.queueStartingPoint[selectedCustomer.entranceChoice][1] +
          queuePos;
        break;
      case 2:
        selectedCustomer.target.x =
          nodes.queueStartingPoint[selectedCustomer.entranceChoice][0] +
          queuePos;
        selectedCustomer.target.y =
          nodes.queueStartingPoint[selectedCustomer.entranceChoice][1];
        break;
    }
  }
}
