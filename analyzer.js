"use strict";

function analyzer(...finished_or_unfinished_requests) {

    let sum_tq = 0;
    let sum_tw = 0;
    let sum_ts = 0;
    let count = finished_or_unfinished_requests.length;
    let count_done = 0;
    let count_drop = 0;

    finished_or_unfinished_requests.forEach(request => {

        if(request.dropped)
            return count_drop++;

        if(!request.done)
            return;
        else
            count_done += 1;

        sum_tq += request.sum_tq();
        sum_tw += request.sum_tw();
        sum_ts += request.sum_ts();
    });

    const avg_tq = sum_tq / count_done;
    const avg_tw = sum_tw / count_done;
    const avg_ts = sum_ts / count_done;
    const slowdown = avg_tw / avg_ts;

    log("processed requests (n):", count_done);
    log("dropped requests:", count_drop);
    log("dropped percentage:", Math.round(count_drop / (count_done + count_drop) * 100) + "%");
    log("average turnaround (tq):", avg_tq);
    log("average waiting (tw):", avg_tw);
    log("average serve (ts):", avg_ts);
    log("slowdown:", slowdown);

    return {avg_tq, avg_tw, avg_ts, slowdown, n: count_done, drop: count_drop};
}

function distribution_analyzer(...trials) {

    let sample_size = trials.length;

    let mnt_list_1_mnt_times_n = 0;
    let mnt_list_2_mnt_times_n = 0;
    let mnt_list_3_mnt_times_n = 0;
    let mnt_list_4_mnt_times_n = 0;
    let mnt_list_5_mnt_times_n = 0;
    let mnt_list_6_mnt_times_n = 0;
    let mnt_list_7_mnt_times_n = 0;
    let mnt_list_8_mnt_times_n = 0;
    let mnt_list_9_mnt_times_n = 0;
    let mnt_list_X_mnt_times_n = 0;

    trials.forEach(Xi => {

        mnt_list_1_mnt_times_n += Xi ** 1;
        mnt_list_2_mnt_times_n += Xi ** 2;
        mnt_list_3_mnt_times_n += Xi ** 3;
        mnt_list_4_mnt_times_n += Xi ** 4;
        mnt_list_5_mnt_times_n += Xi ** 5;
        mnt_list_6_mnt_times_n += Xi ** 6;
        mnt_list_7_mnt_times_n += Xi ** 7;
        mnt_list_8_mnt_times_n += Xi ** 8;
        mnt_list_9_mnt_times_n += Xi ** 9;
        mnt_list_X_mnt_times_n += Xi ** 10;

    });

    const mnt_list_1_mnt = mnt_list_1_mnt_times_n / sample_size;
    const mnt_list_2_mnt = mnt_list_2_mnt_times_n / sample_size;
    const mnt_list_3_mnt = mnt_list_3_mnt_times_n / sample_size;
    const mnt_list_4_mnt = mnt_list_4_mnt_times_n / sample_size;
    const mnt_list_5_mnt = mnt_list_5_mnt_times_n / sample_size;
    const mnt_list_6_mnt = mnt_list_6_mnt_times_n / sample_size;
    const mnt_list_7_mnt = mnt_list_7_mnt_times_n / sample_size;
    const mnt_list_8_mnt = mnt_list_8_mnt_times_n / sample_size;
    const mnt_list_9_mnt = mnt_list_9_mnt_times_n / sample_size;
    const mnt_list_X_mnt = mnt_list_X_mnt_times_n / sample_size;

    const variance = mnt_list_2_mnt - mnt_list_1_mnt ** 2;
    const std_dev = Math.sqrt(variance);

    let expected_deviation_times_n = 0;

    trials.forEach(Xi => {

        expected_deviation_times_n += Math.abs(Xi - mnt_list_1_mnt);

    });

    const exp_dev = expected_deviation_times_n / sample_size;

    return {
        mnt_list_1_mnt,
        mnt_list_2_mnt,
        mnt_list_3_mnt,
        mnt_list_4_mnt,
        mnt_list_5_mnt,
        mnt_list_6_mnt,
        mnt_list_7_mnt,
        mnt_list_8_mnt,
        mnt_list_9_mnt,
        mnt_list_X_mnt,
        variance,
        std_dev,
        exp_dev
    };
}

module.exports.analyzer = analyzer;
module.exports.distribution_analyzer = distribution_analyzer;

if("// extra arrival topologies", false) {

    const N_B_ = "// do not run these because this env lacks Collection class and system objects. paste to main to run.";

    const arrival_topology_question_2_tester_1 = [
        {handler: cpu, rate: 0 , name: Symbol("cpu bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict},
        {handler: cpu, rate: 40, name: Symbol("i/o bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict}
    ];
    const arrival_topology_question_2_tester_2 = [
        {handler: cpu, rate: 2 , name: Symbol("cpu bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict},
        {handler: cpu, rate: 38, name: Symbol("i/o bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict}
    ];
    const arrival_topology_question_2_tester_3 = [
        {handler: cpu, rate: 10, name: Symbol("cpu bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict},
        {handler: cpu, rate: 30, name: Symbol("i/o bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict}
    ];
    const arrival_topology_question_2_tester_4 = [
        {handler: cpu, rate: 20, name: Symbol("cpu bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict},
        {handler: cpu, rate: 20, name: Symbol("i/o bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict}
    ];
    const arrival_topology_question_2_tester_5 = [
        {handler: cpu, rate: 30, name: Symbol("cpu bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict},
        {handler: cpu, rate: 10, name: Symbol("i/o bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict}
    ];
    const arrival_topology_question_2_tester_6 = [
        {handler: cpu, rate: 40, name: Symbol("cpu bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict},
        {handler: cpu, rate: 0 , name: Symbol("i/o bound request"), directives: new Collection(cpu.id, {ts: 20/1000}).dict}
    ];
}

if("// observant", false) {

    const observant = `

Request {
  uid: 996025,
  birth: 21.01634214614318,
  birth_system: 
   System {
     id: Symbol(System symbol for CPU / ts = 20 / infinite queue / 2 cores),
     uid: 991847,
     name: 'CPU / ts = 20 / infinite queue / 2 cores',
     queue: 
      Queue_with_priority {
        finite: false,
        length: 12,
        max_length: Infinity,
        queue: [Object] },
     max_queue_length: Infinity,
     ts: 0.02,
     current: { '1012001': [Object], '1012572': [Object] },
     busy: 2,
     core_count: 2,
     dispatch_targets_collection: [ [Object], [Object], null ],
     dispatch_targets_probability_collection: [ 0.1, 0.4, 0.5 ],
     event_loop: 
      Synthetic_event_loop {
        time: 100.00179252250065,
        sorted: [Object],
        count: 16724,
        max_tasks: Infinity,
        max_time: 100,
        done: [Array],
        violation: [],
        busy: false } },
  current_system: 
   Sys_record {
     uid: 997105,
     system: null,
     id: null,
     t0: null,
     t1: null,
     t2: null },
  systems_chain: 
   [ Sys_record {
       uid: 996026,
       system: [Object],
       id: Symbol(System symbol for CPU / ts = 20 / infinite queue / 2 cores),
       t0: 21.01634214614318,
       t1: 21.041560806108514,
       t2: 21.071563203374886 },
     Sys_record {
       uid: 996032,
       system: [Object],
       id: Symbol(System symbol for Network I/O device / ts = 25 / infinite queue / 1 core),
       t0: 21.071563203374886,
       t1: 21.27289075339448,
       t2: 21.293828836451773 },
     Sys_record {
       uid: 996098,
       system: [Object],
       id: Symbol(System symbol for CPU / ts = 20 / infinite queue / 2 cores),
       t0: 21.293828836451773,
       t1: 21.29434232857013,
       t2: 21.302350371225568 },
     Sys_record {
       uid: 996109,
       system: [Object],
       id: Symbol(System symbol for Network I/O device / ts = 25 / infinite queue / 1 core),
       t0: 21.302350371225568,
       t1: 21.689169153522972,
       t2: 21.69759295703598 },
     Sys_record {
       uid: 996162,
       system: [Object],
       id: Symbol(System symbol for CPU / ts = 20 / infinite queue / 2 cores),
       t0: 21.69759295703598,
       t1: 21.934167557784914,
       t2: 21.936598348872405 },
     Sys_record {
       uid: 996215,
       system: [Object],
       id: Symbol(System symbol for Network I/O device / ts = 25 / infinite queue / 1 core),
       t0: 21.936598348872405,
       t1: 22.106693977451123,
       t2: 22.10921778860027 },
     Sys_record {
       uid: 996258,
       system: [Object],
       id: Symbol(System symbol for CPU / ts = 20 / infinite queue / 2 cores),
       t0: 22.10921778860027,
       t1: 22.79541803581882,
       t2: 22.796495623881587 },
     Sys_record {
       uid: 996367,
       system: [Object],
       id: Symbol(System symbol for Network I/O device / ts = 25 / infinite queue / 1 core),
       t0: 22.796495623881587,
       t1: 22.98436255961967,
       t2: 23.00084318986858 },
     Sys_record {
       uid: 996404,
       system: [Object],
       id: Symbol(System symbol for CPU / ts = 20 / infinite queue / 2 cores),
       t0: 23.00084318986858,
       t1: 23.991930856525215,
       t2: 23.992886126958446 },
     Sys_record {
       uid: 996565,
       system: [Object],
       id: Symbol(System symbol for Network I/O device / ts = 25 / infinite queue / 1 core),
       t0: 23.992886126958446,
       t1: 24.020698160322368,
       t2: 24.033129467640283 },
     Sys_record {
       uid: 996576,
       system: [Object],
       id: Symbol(System symbol for CPU / ts = 20 / infinite queue / 2 cores),
       t0: 24.033129467640283,
       t1: 24.908744143089425,
       t2: 24.909333087535316 },
     Sys_record {
       uid: 996738,
       system: [Object],
       id: Symbol(System symbol for Disk I/O device / ts = 100 / infinite queue / 1 core),
       t0: 24.909333087535316,
       t1: 25.154905490594324,
       t2: 25.16350417604399 },
     Sys_record {
       uid: 996796,
       system: [Object],
       id: Symbol(System symbol for Network I/O device / ts = 25 / infinite queue / 1 core),
       t0: 25.16350417604399,
       t1: 25.383125281014703,
       t2: 25.383364523058503 },
     Sys_record {
       uid: 996863,
       system: [Object],
       id: Symbol(System symbol for CPU / ts = 20 / infinite queue / 2 cores),
       t0: 25.383364523058503,
       t1: 25.530451060451735,
       t2: 25.531533428271945 },
     Sys_record {
       uid: 996918,
       system: [Object],
       id: Symbol(System symbol for Network I/O device / ts = 25 / infinite queue / 1 core),
       t0: 25.531533428271945,
       t1: 26.30714232028779,
       t2: 26.312220534929253 },
     Sys_record {
       uid: 997038,
       system: [Object],
       id: Symbol(System symbol for CPU / ts = 20 / infinite queue / 2 cores),
       t0: 26.312220534929253,
       t1: 26.559329059032017,
       t2: 26.562860391436182 } ],
  done: true,
  dropped: false,
  dropped_at: null,
  dropped_by_sys_id: null,
  dropped_by_sys_name: null,
  directives: 
   { [Symbol(System symbol for CPU / ts = 20 / infinite queue / 2 cores)]: { ts: 0.008 } },
  name: null }

    `;
}