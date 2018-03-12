"use strict";

const Queue = require("./queue");
const Random = require("./prereq").Random;
const arb = require("./prereq").arb;
const Request = require("./request");

class System {

    constructor(name=null, ts=null, max_queue_length=Infinity, core_count=1, event_loop=null) {

        not_null(name, "E 1001 System");
        not_null(ts, "E 1002 System");
        not_null(core_count, "E 1003 System");
        not_null(event_loop, "E 1004 System");

        this.id = Symbol("System symbol for " + name);
        this.uid = uid();
        this.name = name;
        this.queue = new Queue(max_queue_length);
        this.max_queue_length = max_queue_length;
        this.ts = ts;
        this.current = {};
        this.busy = 0;
        this.core_count = core_count;
        this.dispatch_targets_collection = [];
        this.dispatch_targets_probability_collection = [];
        this.event_loop = event_loop;
    }

    arrive(request=null, time=null) {

        not_null(request, "E 1011 System.prototype.arrive");
        not_null(time, "E 1012 System.prototype.arrive");
        assert(request instanceof Request, "E 1013 System.prototype.arrive");

        request.t0(this, time);

        const priority = this.read_directives(request, "priority") || 0;

        if(!this.queue.enqueue(request, priority)) {
            request.drop(this, time);
            return false;
        }
        else {
            return this.process_attempt(time);
        }

    }

    process_attempt(time=null) {

        not_null(time, "E 1021 System.prototype.arrive");

        if(this.busy < this.core_count) {

            const next_request = this.queue.dequeue();

            if(next_request) {

                next_request.t1(this, time);

                let ts = this.get_process_time();

                if(this.read_directives(next_request, "ts") !== null) {

                    const ts_directive = this.read_directives(next_request, "ts");
                    ts = Random.exponential(1/ts_directive);
                }

                const departure_time = time + ts;
                next_request.t2(this, departure_time);
                this.current[next_request.uid] = next_request;
                this.busy++;

                this.event_loop.set_timeout(time => this.depart(next_request, time), ts);
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    depart(request=null, departure_time=null) {

        not_null(request, "E 1030 System.prototype.depart");
        not_null(departure_time, "E 1031 System.prototype.depart");
        assert(request instanceof Request, "E 1032 System.prototype.depart");
        assert(request.uid in this.current, "E 1033 System.prototype.depart - " + request.uid + " not in " + Object.keys(this.current));

        const next_system = this.get_random_dispatch_target();
        delete this.current[request.uid];
        this.busy--;
        this.process_attempt(departure_time);

        if(next_system === null)
            request.finished();
        else
            next_system.arrive(request, departure_time);

    }

    add_dispatch_target(system, probability) {

        assert(system instanceof System || system === null, "E 3100 System.prototype.add_dispatch_target");
        assert(typeof probability === "number", "E 3101 System.prototype.add_dispatch_target");

        this.dispatch_targets_collection.push(system);
        this.dispatch_targets_probability_collection.push(probability);
    }

    get_random_dispatch_target() {

        const index = arb(...this.dispatch_targets_probability_collection);
        return this.dispatch_targets_collection[index];
    }

    get_process_time() {

        return Random.exponential(1/this.ts);
    }

    toString() {

        return this.name;
    }

    read_directives(request=null, directive_name=null) {

        not_null(request, "E 3010 System.prototype.read_directives");
        assert(request instanceof Request, "E 3011 System.prototype.read_directives");
        not_null(directive_name, "E 3012 System.prototype.read_directives");

        if(this.id in request.directives && directive_name in request.directives[this.id]) {
            return request.directives[this.id][directive_name];
        }
        else {
            return null;
        }
    }

}

module.exports = System;