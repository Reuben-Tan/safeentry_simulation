/**
 * New customers choose which is the shortest queue and joins it, moves queue up whenever there's space in front and enters mall once done
 *
 * @param {object} the customer we're looking at
 * @return  NIL
 */
function progressQueue(selectedCustomer, hasArrived) {
    var queuePos;
    var arrivedAtEntrance = Math.abs(selectedCustomer.location.x - nodes.queueStartingPoint[selectedCustomer.entranceChoice][0]) +
    Math.abs(selectedCustomer.location.y - nodes.queueStartingPoint[selectedCustomer.entranceChoice][1]) === 0
    queuePos = Math.max(
      queues[0].indexOf(selectedCustomer),
      queues[1].indexOf(selectedCustomer),
      queues[2].indexOf(selectedCustomer)
    );
    
    // No selected queue yet, find a queue to go to
    if (queuePos === -1) {
        alert('error1')
    } else {
        if (queuePos === 0 && arrivedAtEntrance) {
            // reach the end of the queue
            if (selectedCustomer.scantime < 0) {
                selectedCustomer.state = 'SHOPPING';
                if (Math.random() > 0.5) {
                    selectedCustomer.state = 'EATING';
                }
                queues[selectedCustomer.entranceChoice].shift();
                selectedCustomer.target.x = nodes.food1[0][0]
                selectedCustomer.target.y = nodes.food1[0][1]
              } else {
                selectedCustomer.scantime--;
              }
        } else {
            switch(selectedCustomer.entranceChoice) {
                case 0:
                    selectedCustomer.target.x = nodes.queueStartingPoint[selectedCustomer.entranceChoice][0]
                    selectedCustomer.target.y = nodes.queueStartingPoint[selectedCustomer.entranceChoice][1] + queuePos
                    break;
                case 1:
                    selectedCustomer.target.x = nodes.queueStartingPoint[selectedCustomer.entranceChoice][0] 
                    selectedCustomer.target.y = nodes.queueStartingPoint[selectedCustomer.entranceChoice][1] + queuePos
                    break;
                case 2:
                    selectedCustomer.target.x = nodes.queueStartingPoint[selectedCustomer.entranceChoice][0] + queuePos
                    selectedCustomer.target.y = nodes.queueStartingPoint[selectedCustomer.entranceChoice][1] 
                    break;

            }
        }
    }
    selectedCustomer.position = queuePos
    
  }