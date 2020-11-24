const OCCUPIED = 11;
const VACANT = 10
var foodCapacity = [Array(8).fill(VACANT),Array(9).fill(VACANT)]
var foodQueue = [[],[]]
var test = [Array(5).fill(VACANT), Array(10).fill(VACANT)]
console.log(foodCapacity)

function Eating(selectedCustomer, hasArrived) {
    // not at food area
    // Select food choice for customer
    // Substate: 'finding food', queueing/moving towards food entrnace, eating, leaving
    console.log(foodCapacity)
    if (selectedCustomer.location.x > 33.5) {
        changeTarget(selectedCustomer, nodes.points.middle)
    } else {
        if (!('foodChoice' in selectedCustomer)) {
            selectedCustomer.foodChoice = Math.random() > 0.5 ? 0 : 1
            selectedCustomer.eatingTime = Math.random() * 10
            selectedCustomer.substate = 'QUEUEINGFORFOOD'
            changeTarget(selectedCustomer, nodes.shopEntrance['food'+selectedCustomer.foodChoice])
        }
        var foodChoice = selectedCustomer.foodChoice
        switch (selectedCustomer.substate) {
            case 'QUEUEINGFORFOOD':
                if (hasArrived) {
                    // find a seat to sit and eat
                    var seatnum = foodCapacity[foodChoice].indexOf(VACANT)
                    selectedCustomer.seatnum = seatnum
                    if (seatnum >= 0) {
                        changeTarget(selectedCustomer, nodes['food'+foodChoice][seatnum])
                        foodCapacity[foodChoice][seatnum] = OCCUPIED
                        test[0][0] = 100
                        selectedCustomer.substate = 'EATING'
                    }
                }
                break;
            case 'EATING':
                if (hasArrived) {
                    if (Math.random() < 0.1) {
                        // Finish eating
                        foodCapacity[foodChoice][selectedCustomer.seatnum] = VACANT
                        test[0][0] = 200
                        changeTarget(selectedCustomer, nodes.shopEntrance['food' + foodChoice])
                        selectedCustomer.substate = 'LEAVING'
                        changeTarget(selectedCustomer, nodes.shopEntrance['food'+foodChoice])
                    }
                }
                break;
            case 'LEAVING':
                if (hasArrived) {
                    selectedCustomer.state = 'SHOPPING'
                }
                break;
        }
        
    }
    

    


    // if customer is in the shopping section, move towards middle
    







    
}