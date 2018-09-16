const Gpio = require('onoff').Gpio;

const sw1 = new Gpio(6, 'in', 'falling', {debounceTimeout: 200});
const sw2 = new Gpio(5, 'in', 'both');
const led = {
    red: new Gpio(13, 'out'),
    blue: new Gpio(19, 'out'),
    yellow: new Gpio(26, 'out')
};

let state_sw1 = 0;

sw1.watch(function (err, value) {
    if (err) {        
        console.log("Switch 1 ERROR", err);
    } else {
        state_sw1 = state_sw1 === 0 ? 1 : 0;
        led["red"].writeSync(state_sw1);
        led["blue"].writeSync(state_sw1);
        led["yellow"].writeSync(state_sw1);
    }
});

sw2.watch(function (err, value) {
    if (err) {        
        console.log("Switch 2 ERROR", err);
    } else {
        led["red"].writeSync(value);
        led["blue"].writeSync(value);
        led["yellow"].writeSync(value);
    }
});