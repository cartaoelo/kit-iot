var pn532 = require('pn532');
var i2c = require('i2c');

var wire = new i2c(pn532.I2C_ADDRESS, { device: '/dev/i2c-1' });
var rfid = new pn532.PN532(wire, { pollInterval: 200 });

rfid.on('ready', function () {
    console.log('READY');
    rfid.getFirmwareVersion().then(function (data) {
        console.log('Firmware: ', data);
        console.log('Listen for card read event ...');
        rfid.on('tag', function (tag) {
            console.log(Date.now(), 'UID:', tag.uid);
        });
    });
});