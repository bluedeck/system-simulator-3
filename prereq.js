"use strict";

let unique_counter = 0;
global.log = (...x) => console.log(...x);
global.uid = () => unique_counter++;
global.assert = assert;
global.not_null = not_null;
global.defined = defined;

class AssertionError extends Error {constructor() {super();}}
class NotNullConstraintError extends AssertionError {constructor() {super();}}
class DefinedConstraintError extends AssertionError {constructor() {super();}}

function assert(v, message="Assertion error") {

    if(!v)
        throw new AssertionError(message);

    return v;
}

function not_null(v, message="Not null constraint error") {

    if(v === null)
        throw new NotNullConstraintError(message);

    return v;
}

function defined(v, message="Defined constraint error") {

    if(v === undefined)
        throw new DefinedConstraintError(message);

    return v;
}



class Random {

    static uniform(a, b) {  // returns a rv X ~ U(a,b)

        return Math.random() * (b-a) + a;
    }

    static __exp(lambda) {  // returns a rv X ~ exp(lambda)

        return (-1) / lambda * Math.log(Random.uniform(0.0, 1.0));
    }

    static exponential(rate) {

        return (- Math.log(1.0 - Math.random()) / rate);
    }
}

function arb (...arr) {

    let sum = 0;
    arr.map(n => (sum += n, n));
    let ran = Math.random() * sum;
    for(let i=0; i<arr.length; i++) {
        ran -= arr[i];

        if(ran <= 0)
            return i;
    }
}

function exp (rate) {

    return (- Math.log(1.0 - Math.random()) / rate);
}

class Collection {

    constructor(k, v) {

        this.dict = {};
        this.add(k, v);
    }

    add(k, v) {

        this.dict[k] = v;
        return this;
    }

    exist(k) {

        return k in this.dict;
    }

    peek(k) {

        return this.dict[k];
    }

    delete(k) {

        return delete this.dict[k];
    }
}

function dict(...kv_list) {

    const map = {};

    for(let i=0; i<kv_list.length; i+=2) {

        map[kv_list[i]] = kv_list[i+1];
    }

    return map;
}

class Dict {

    constructor(k, v) {

        this.add(k, v);
    }

    add(k, v) {

        assert(k !== "add", "E 3221 Dict.prototype.add");

        this[k] = v;
        return this;
    }
}

module.exports.assert = assert;
module.exports.not_null = not_null;
module.exports.uniform = Random.uniform;
module.exports.exp = Random.exponential;
module.exports.Random = Random;
module.exports.arb = arb;
module.exports.Collection = Collection;
module.exports.dict = dict;
module.exports.Dict = Dict;