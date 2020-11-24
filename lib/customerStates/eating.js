const OCCUPIED = 11;
const VACANT = 10
var foodCapacity = [Array(9).fill(VACANT),Array(8).fill(VACANT)]
var foodQueue = [[],[]]

function Eating(selectedCustomer, hasArrived) {
    // not at food area
    // Select food choice for customer
    // Substate: 'finding food', queueing/moving towards food entrnace, eating, leaving
    var foodChoice = selectedCustomer.foodChoice
    console.log(selectedCustomer.substate)



    switch (selectedCustomer.substate) {
        case 'NOTATFOODAREA':
            changeTarget(selectedCustomer, nodes.points.middle)
            if (hasArrived) {
                selectedCustomer.substate = 'LOOKINGFORFOOD'
                changeTarget(selectedCustomer, nodes.points.foodMiddle)
            }
            break;
        case 'LOOKINGFORFOOD':
            if (!('foodChoice' in selectedCustomer) & hasArrived) {
                selectedCustomer.foodChoice = Math.random() > 0.5 ? 0 : 1
                selectedCustomer.eatingTime = Math.random() * 10
                selectedCustomer.substate = 'QUEUEINGFORFOOD'
                changeTarget(selectedCustomer, nodes.shopEntrance['food'+selectedCustomer.foodChoice])
            }
            break;
        case 'QUEUEINGFORFOOD':
            if (hasReached(selectedCustomer, nodes.shopEntrance['food'+foodChoice])) {
                // find a seat to sit and eat
                var seatnum = foodCapacity[foodChoice].indexOf(VACANT)
                selectedCustomer.seatnum = seatnum
                if (seatnum >= 0) {
                    changeTarget(selectedCustomer, nodes['food'+foodChoice][seatnum])
                    foodCapacity[foodChoice][seatnum] = OCCUPIED
                    selectedCustomer.substate = 'EATING'
                }
            }
            break;
        case 'EATING':
            if (hasArrived) {
                if (Math.random() < 0.05) {
                    // Finish eating
                    foodCapacity[foodChoice][selectedCustomer.seatnum] = VACANT
                    selectedCustomer.substate = 'LEAVING'
                    changeTarget(selectedCustomer, nodes.shopEntrance['food'+foodChoice])
                }
            }
            break;
        case 'LEAVING':
            if (hasArrived) {
                selectedCustomer.state = 'SHOPPING'
                changeTarget(selectedCustomer, nodes.points.middle)
            }
            break;
    }


    
    

    


    // if customer is in the shopping section, move towards middle
    







    
}