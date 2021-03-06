var queues = [[], [], []];

function progressQueue(selectedCustomer, hasArrived) {
  var queuePos;
  var arrivedAtEntrance = hasReached(
    selectedCustomer,
    nodes.queueStartingPoint[selectedCustomer.entranceChoice]
  );
  // QueuePos finds the position in the queue that the customer is in
  queuePos = queues[selectedCustomer.entranceChoice].indexOf(selectedCustomer);
  // If customer isn't in the queue, assign him to the shortest queue
  if (queuePos === -1) {
    queues[selectedCustomer.entranceChoice].push(selectedCustomer)
    queuePos = queues[selectedCustomer.entranceChoice].indexOf(selectedCustomer);
  }

  if (queuePos === 0 && arrivedAtEntrance) {   // reach the end of the queue
    // Check if mall volume is larger than mall limit
    var mallVolume = customers.filter(function (d) {
      return ["mall","food0","food1","shop0","shop1","shop2","shop3"].includes(d.place);}).length;
    if ((selectedCustomer.scantime < 0) & (mallVolume < parameters.mallLimit)) {
      if (Math.random() > 0.8) {
        selectedCustomer.state = "SHOPPING";
        selectedCustomer.substate = "FINDINGSHOP";
        changeTarget(selectedCustomer, nodes.points.middle);
      } else {
        selectedCustomer.state = "EATING";
        if (selectedCustomer.location.x > 25.5) {
          selectedCustomer.substate = "NOTATFOODAREA";
          changeTarget(selectedCustomer, nodes.points.middle);
        } else {
          selectedCustomer.substate = "LOOKINGFORFOOD";
          changeTarget(selectedCustomer, nodes.points.foodMiddle);
        }
      }
      queues[selectedCustomer.entranceChoice].shift();
      selectedCustomer.place = "mall";
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
    // Leave from impatience
    if (Math.random() < 0.005 * queuePos) {
      selectedCustomer.state = "LEAVING";
      queues[selectedCustomer.entranceChoice].splice(queues[selectedCustomer.entranceChoice].indexOf(selectedCustomer)); // remove from queue array
      selectedCustomer.exit = selectedCustomer.entranceChoice;
    }
  }
}
