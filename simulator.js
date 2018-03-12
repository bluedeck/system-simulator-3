"use strict";

const Random = require("./prereq").Random;
const Request = require("./request");

class Simulator {

    constructor(total_time, event_loop, ...topologies) {

        this.requests = [];

        for(let i=0; i<topologies.length; i++) {

            const handler = topologies[i].handler;
            const rate = topologies[i].rate;
            const directives = topologies[i].directives;
            const name = topologies[i].name;

            event_loop.set_variable_interval(time => {

                const request = new Request(time);
                request.set_directives(directives);
                request.set_name(name);
                this.requests.push(request);
                handler.arrive(request, time);

            }, () => Random.exponential(rate));

        }
    }
}

module.exports = Simulator;