const status = require('./status');
const methods = require('./helperFunctions')

class Middleware{
    constructor(){
    }

    async populateIfLess(req, res, next){
        if (status.dataCount < 4){
            try {
                const data = await methods.fetchMeaning();
                Object.entries(data).map(entry => {
                    status.updateData([entry[0], entry[1]])
                })
                methods.log('Data populated on')
                setTimeout(() => {
                    console.log(status.dataCount);
                }, 1500);
                next()
            } catch (error) {
                methods.log(error);
                res.send({ERROR: "Something went wrong, please check log file."}).end()
            }
        } else {
            next()
        }
    }
}

module.exports = Middleware;