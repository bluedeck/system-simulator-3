"use strict";

const sorted = Symbol();

class Sorted {

    constructor() {

        this.arr = [];
        this[sorted] = true;
        this.length = 0;
    }

    add(element, index) {

        this.arr.push({element, index});
        this[sorted] = false;
        this.length = this.arr.length;
    }

    __sort__() {

        if(this[sorted])
            return;

        this.arr.sort((a,b) => b.index - a.index);
        this[sorted] = true;
    }

    least(peek=false) {

        this.__sort__();

        if(peek) {
            return this.arr[this.arr.length-1];
        }
        else {
            this.length = this.arr.length;
            return this.arr.pop();
        }
    }

    most(peek=false) {

        this.__sort__();

        if(peek) {
            return this.arr[0];
        }
        else {
            this.length = this.arr.length;
            return this.arr.shift();
        }

    }

}

module.exports = Sorted;