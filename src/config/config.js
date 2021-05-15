const chalk = require('chalk');
const moment = require('moment');
const settings = require('./settings.js');

// The object that we export later
const config = {


    // This is used for console logging!
    log: {

        error: function(data) {
            console.log(`${time()} [${chalk.red.bold("Error")}] ${data}`)
        },
        info: function(data) {
            console.log(`${time()} [${chalk.cyanBright.bold("Info")}] ${data}`)
        },
        debug: function(data) {
            if (config.debug) console.log(`${time()} [${chalk.cyanBright.bold("Debug")}] ${data}`)
        },
        warning: function(data) {
            console.log(`${time()} [${chalk.orange.bold("Warning")}] ${data}`)
        },

    }


}



// Now lets export it! (so we can use it in other files, think of it as declaring this object as a public object)
module.exports = config;



// A function to return the time
const time = function () {

    let t = moment().utcOffset(settings.offset * 60)
    return `[${chalk.hex("b9bbbe")(t.format("DD/MM/YY"))}][${chalk.hex("b9bbbe")(t.format("HH:mm:ss"))}]`
}