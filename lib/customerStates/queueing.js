/**
 * New customers choose which is the shortest queue and joins it, moves queue up whenever there's space in front and enters mall once done
 *
 * @param {object} the customer we're looking at
 * @return  NIL
 */
function progressQueue(selectedCustomer, hasArrived) {
    var queuePos;
    queuePos = Math.max(
      queues[0].indexOf(selectedCustomer),
      queues[1].indexOf(selectedCustomer),
      queues[2].indexOf(selectedCustomer)
    );
    // No selected queue yet, find a queue to go to
    if (queuePos === -1) {
        var shortestQueueIndex = queues.indexOf(queues.reduce(function(p,c) {return p.length>c.length?c:p;},{length:Infinity}));
        selectedCustomer.entranceChoice = shortestQueueIndex
        queues[shortestQueueIndex].push(selectedCustomer)
        selectedCustomer.target.row = nodes.mallEntrance[selectedCustomer.entranceChoice][0]
        selectedCustomer.target.col = nodes.mallEntrance[selectedCustomer.entranceChoice][1]
    } else {
        if (queuePos === 0 && hasArrived) {
            // reach the end of the queue
            if (selectedCustomer.scantime < 0) {
                selectedCustomer.state = 'SHOPPING';
                if (Math.random() > 0.5) {
                    selectedCustomer.state = 'EATING';
                }
                queues[selectedCustomer.entranceChoice].shift();
              } else {
                selectedCustomer.scantime--;
              }
        } else if (queuePos >= 1) {
            selectedCustomer.target.row = nodes.mallEntrance[0][0] + queuePos
            selectedCustomer.target.col = nodes.mallEntrance[0][1]
        }
    }
    
  }