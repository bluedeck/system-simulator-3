"use strict";

class Sys_record {

    constructor() {

        this.uid = uid();
        this.system = null;
        this.id = null;
        this.t0 = null;
        this.t1 = null;
        this.t2 = null;
        this.tw = null;
        this.tq = null;
        this.ts = null;
    }

    complete() {

        not_null(this.t0, "E 3200 Sys_record.prototype.complete");
        not_null(this.t1, "E 3201 Sys_record.prototype.complete");
        not_null(this.t2, "E 3202 Sys_record.prototype.complete");

        this.tw = this.t1 - this.t0;
        this.tq = this.t2 - this.t0;
        this.ts = this.t2 - this.t1;
    }
}

class Request {

    constructor(birth=null) {

        not_null(birth, "E 1558 Request");

        this.id = Symbol("Request with birth time " + birth);
        this.uid = uid();
        this.birth = birth;
        this.birth_system = null;
        this.current_system = new Sys_record();
        this.systems_chain = [];
        this.done = false;
        this.dropped = false;
        this.dropped_at = null;
        this.dropped_by_sys_id = null;
        this.dropped_by_sys_name = null;
        this.directives = {};
        this.name = null;
    }

    t0(system = null, time = null) {  // time of entry to a queue

        not_null(system, "E 1117 Request.prototype.t0");
        not_null(time, "E 1116 Request.prototype.t0");

        this.birth_system = system;
        this.current_system.id = system.id;
        this.current_system.system = system;
        this.current_system.t0 = time;
    }

    drop(system = null, time = null) {

        not_null(system, "E 1113 Request.prototype.drop");
        not_null(time, "E 1114 Request.prototype.drop");

        this.systems_chain.push(this.current_system);
        this.current_system = new Sys_record();
        this.dropped = true;
        this.dropped_at = time;
        this.dropped_by_sys_id = system.id;
        this.dropped_by_sys_name = system.name;
    }

    t1(system = null, time = null) {  // time of process being started

        not_null(system, "E 1111 Request.prototype.t1");
        not_null(time, "E 1112 Request.prototype.t1");

        if(this.current_system.t0 === undefined) {
            throw new Error("E 1118 Request.prototype.t1 this request is dropped out of the system but then processed.");
        }
        else if(this.current_system.id !== system.id) {
            throw new Error("E 1119 Request.prototype.t1 this request is queued into one system but processed by another.");
        }
        else {
            this.current_system.t1 = time;
        }
    }

    t2(system = null, time = null) {  // time of leaving the system

        not_null(system, "E 1220 Request.prototype.t2");
        not_null(time, "E 1221 Request.prototype.t2");

        if(this.current_system.t1 === undefined) {
            throw new Error("E 1222 Request.prototype.t2 this request has not been serviced but then declared departed.");
        }
        else if(this.current_system.id !== system.id) {
            throw new Error("E 1223 Request.prototype.t2 this request is processed by one system but departed by another.");
        }
        else {
            this.current_system.t2 = time;
            this.current_system.complete();
            this.systems_chain.push(this.current_system);
            this.current_system = new Sys_record();
        }
    }

    finished() {

        this.done = true;
    }

    sum_tq() {

        let sum = 0;
        this.systems_chain.forEach(system_record => {
            sum += system_record.tq;
        });
        return sum;
    }

    sum_tw() {

        let sum = 0;
        this.systems_chain.forEach(system_record => {
            sum += system_record.tw;
        });
        return sum;
    }

    sum_ts() {

        let sum = 0;
        this.systems_chain.forEach(system_record => {
            sum += system_record.ts;
        });
        return sum;
    }

    set_directives(directives=null) {

        not_null(directives, "E 2025 Request.prototype.set_directives");
        assert(directives instanceof Object, "E 2026 Request.prototype.set_directives");

        this.directives = directives;
    }

    add_directive(system=null, directive_key=null, directive_value=null) {

        const System = require("./system");

        not_null(system, "E 2000 Request.prototype.add_directive");
        not_null(directive_key, "E 2001 Request.prototype.add_directive");
        not_null(directive_value, "E 2003 Request.prototype.add_directive");
        assert(system instanceof System, "E 2002 Request.prototype.add_directive");

        if(!(system.id in this.directives))
            this.directives[system.id] = {};

        this.directives[system.id][directive_key] = directive_value;
    }

    set_name(name=null) {

        this.name = name;
    }

}

module.exports = Request;