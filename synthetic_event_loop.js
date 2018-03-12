"use strict";

const Sorted = require("./sorted");

class Synthetic_event_loop {

    /*
        Synthetic event loop simulates a event loop (https://en.wikipedia.org/wiki/event_loop) and execute it under its
        own time frame. I think this is the most elegant approach to simulate a system.
    */

    constructor(max_tasks=Infinity, max_time=Infinity) {

        assert(typeof max_tasks === "number", "E 2030 Synthetic_event_loop");
        assert(typeof max_time === "number", "E 2031 Synthetic_event_loop");

        this.time = 0;
        this.sorted = new Sorted();
        this.count = 0;
        this.max_tasks = max_tasks;
        this.max_time = max_time;
        this.done = [];
        this.violation = [];
        this.busy = false;
    }

    set_timeout(fn, timeout) {

        assert(typeof fn === "function", "E 3020 Synthetic_event_loop.prototype.set_timeout");
        assert(typeof timeout === "number", "E3021 Synthetic_event_loop.prototype.set_timeout");

        this.sorted.add(fn, this.time + timeout);
    }

    set_interval(fn, interval) {

        assert(typeof fn === "function", "E 3022 Synthetic_event_loop.prototype.set_interval");
        assert(typeof interval === "number", "E3023 Synthetic_event_loop.prototype.set_interval");

        const wrapper = time => {
            fn(time);
            this.set_timeout(wrapper, interval);
        };

        this.sorted.add(wrapper, this.time + interval);
    }

    set_variable_interval(fn, interval_fn) {

        assert(typeof fn === "function", "E 3024 Synthetic_event_loop.prototype.set_variable_interval");
        assert(typeof interval_fn === "function", "E3025 Synthetic_event_loop.prototype.set_variable_interval");

        const wrapper = time => {
            fn(time);
            this.set_timeout(wrapper, interval_fn(time));
        };

        this.sorted.add(wrapper, this.time + interval_fn(this.time));
    }

    execute() {

        /*
            run the event loop in order. events inserted into event loop while other events are being executed will be
            executed by the synthetic event loop. a negative timeout will be seen as a violation to the time continuity
            and reported accordingly.

            negative timeouts will also be thrown as you try to set timeout
        */

        if(this.busy)
            return;

        this.busy = true;

        for(let x; (x=this.sorted.least()) && this.count<this.max_tasks && this.time<this.max_time; "placeholder") {

            const task = x.element;
            const time = x.index;
            if(time < this.time) {
                this.violation.push({offender: x, time: this.time, indicated_time: time});
                continue;
            }
            this.done.push(x);
            this.time = time;
            task(time);
            this.count ++;
        }

        this.busy = false;
    }
}

module.exports = Synthetic_event_loop;