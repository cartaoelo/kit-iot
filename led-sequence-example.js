const Gpio = require('onoff').Gpio;

const led = {
    1: new Gpio(13, 'out'),//red
    2: new Gpio(19, 'out'),//blue
    3: new Gpio(26, 'out')//yellow
};
let idLed = 1;
let value = 0;

function actLed(color, value) {
    led[color].write(parseInt(value), function (err, value) {
        if (err) {
            console.log("LED ERROR -", err);
        }
    });
}

setInterval(function () {
    value = value === 0 ? 1 : 0;
    actLed(idLed, value);
    idLed = idLed < 3 ? idLed + 1 : 1;
}, 500);