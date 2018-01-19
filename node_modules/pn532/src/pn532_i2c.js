'use strict';
var EventEmitter = require('events').EventEmitter;
var logger = require('winston').loggers.get('i2c');
var Gpio = require('onoff').Gpio,
    interrupt = new Gpio(25, 'in', 'falling');

class PN532_I2C extends EventEmitter {
    constructor(wire) {
        super();
        this.wire = wire;
    }

    init() {
        var self = this;
        logger.debug('Initializing I2C...');

        interrupt.watch(function (err, value) {
            self.wire.read(255, (err, res) => {
                if (res[0] & 0x01) {
                    res.splice(0, 1);
                    self.emit('data', Buffer(res));
                }
            });
        });

        return new Promise((resolve, reject) => {
            this.wire.on('data', (data) => {
                this.emit('data', data);
            });

            this.wire.on('error', (error) => {
                this.emit('error', error);
            });

            resolve();
        });
    }

    write(buffer) {
        this.wire.write(buffer, (data, err) => { });
    }
}

module.exports = PN532_I2C;
