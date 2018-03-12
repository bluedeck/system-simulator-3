"use strict";

const System = require("./system");
const Simulator = require("./simulator");
const Synthetic_event_loop = require("./synthetic_event_loop");
const analyzer = require("./analyzer").analyzer;
const distribution_analyzer = require("./analyzer").distribution_analyzer;
const Collection = require("./prereq").Collection;
const dict = require("./prereq").dict;
const Dict = require("./prereq").Dict;
const Random = require("./prereq").Random;

const runs = 50;
let avg_tqs = [];

for(let i=0; i<runs; i++) {

    const simulation_time = 1000;

    const event_loop = new Synthetic_event_loop(Infinity, simulation_time);

    // System constructor(name=null, ts=null, max_queue_length=null, core_count=1);

    const cpu     = new System("CPU / ts = 20 / infinite queue / 2 cores",               20/1000, Infinity, 2, event_loop);
    const disk    = new System("Disk I/O device / ts = 100 / infinite queue / 1 core",  100/1000, Infinity, 1, event_loop);
    const network = new System("Network I/O device / ts = 25 / infinite queue / 1 core", 25/1000, Infinity, 1, event_loop);

    // System add_dispatch_target(system, probability);
    // probability need not add up to 1. the method will adjust weight.

    cpu.add_dispatch_target(disk, 0.1);
    cpu.add_dispatch_target(network, 0.4);
    cpu.add_dispatch_target(null, 0.5);  // null -> interpreted as finished and leaves the system.

    disk.add_dispatch_target(cpu, 0.5);
    disk.add_dispatch_target(network, 0.5);

    network.add_dispatch_target(cpu, 0.9);
    network.add_dispatch_target(cpu, 0.1);

    const arrival_topology_question_1 = [
        {handler: cpu, rate: 40, name: 1, directives: new Dict()}
    ];
    const arrival_topology_question_2 = [
        {handler: cpu, rate: 2 , name: 2, directives: new Dict(cpu.id, {ts: 248/1000})},
        {handler: cpu, rate: 38, name: 3, directives: new Dict(cpu.id, {ts: 8  /1000})}
    ];
    const arrival_topology_question_3 = [
        {handler: cpu, rate: 1 , name: 4, directives: new Dict(cpu.id, {ts: 248/1000, priority: 0})},
        {handler: cpu, rate: 3 , name: 5, directives: new Dict(cpu.id, {ts: 8  /1000, priority: 1})},
        {handler: network, rate: 5 , name: 5, directives: new Dict(cpu.id, {priority: 1})},
    ];
    const arrival_topology_sandbox = [
        {handler: cpu, rate: 82, name: 4, directives: new Dict(cpu.id, {ts: 0  /1000, priority: 0})},
    ];

    const simulator = new Simulator(simulation_time, event_loop, ...arrival_topology_question_3);

    event_loop.execute();

    log();
    log(`run ${(i+1)} of ${runs}:`);

    const analyzer_result_type1 = analyzer(...(simulator.requests.filter(req => req.name === 4)));
    const analyzer_result_type2 = analyzer(...(simulator.requests.filter(req => req.name === 5)));

    const avg_tq = analyzer_result_type2.avg_tq;

    avg_tqs.push(avg_tq);

    log(cpu.read_directives(simulator.requests[0], "ts"));
}




//verbose
log();
log(`at the end of ${runs} runs, stat reports (tq-focused) as follows: `);
log(distribution_analyzer(...avg_tqs));





















if("// sandbox", 1) {


    const Request = require("./request");

    const simulation_time = 100;

    const event_loop = new Synthetic_event_loop(Infinity, simulation_time);

    // System constructor(name=null, ts=null, max_queue_length=null, core_count=1);

    const cpu     = new System("CPU / ts = 20 / infinite queue / 2 cores",               20/1000, Infinity, 2, event_loop);
    const disk    = new System("Disk I/O device / ts = 100 / infinite queue / 1 core",  100/1000, Infinity, 1, event_loop);
    const network = new System("Network I/O device / ts = 25 / infinite queue / 1 core", 25/1000, Infinity, 1, event_loop);

    // System add_dispatch_target(system, probability);
    // probability need not add up to 1. the method will adjust weight.

    cpu.add_dispatch_target(disk, 0.1);
    cpu.add_dispatch_target(network, 0.4);
    cpu.add_dispatch_target(null, 0.5);  // null -> interpreted as finished and leaves the system.

    disk.add_dispatch_target(cpu, 0.5);
    disk.add_dispatch_target(network, 0.5);

    network.add_dispatch_target(cpu, 1);

    const req = new Request(4);
    req.add_directive(cpu, "ts", 300);
    req.add_directive(cpu, "priority", 3);
    req.set_directives(new Dict(cpu.id, {ts: 3300, priority: 35}));

}
