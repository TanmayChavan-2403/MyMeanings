var dataCount = 0;
let data = []

function updateStatus(num, opp){
    if (opp == "add"){
        module.exports.dataCount += num
    } else if (opp == "sub") {
        module.exports.dataCount -= num
    } else {
        module.exports.dataCount = num;
    }
}

function updateData(arr){
    updateStatus(data.push(arr), 'update');
}

module.exports.data = data;
module.exports.updateStatus = updateStatus;
module.exports.updateData = updateData;
module.exports.dataCount = dataCount;