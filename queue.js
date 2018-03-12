"use strict";

class Quick_shift_array {

    constructor() {

        this.array = {};
        this.start = 0;
        this.end = 0;
        this.length = 0;
    }

    push(v) {

        this.array[this.end] = v;
        this.length ++;
        this.end ++;
        return this;
    }

    pop() {

        if(this.length > 0) {

            this.length --;
            this.end --;
            const ret = this.array[this.end];
            delete this.array[this.end];
            return ret;
        }
        else {

            return undefined;
        }
    }

    shift() {

        if(this.length > 0) {

            const ret = this.array[this.start];
            delete this.array[this.start];
            this.start ++;
            this.length --;
            return ret;
        }
    }

    unshift(v) {

        this.start --;
        this.length ++;
        this.array[this.start] = v;
        return this;
    }


}

class Queue_with_priority {

    constructor(max_queue_length=Infinity) {

        not_null(max_queue_length, "E 2010 Queue_with_priority");
        assert(typeof max_queue_length === "number", "E 2011 Queue_with_priority");

        this.finite = max_queue_length !== Infinity;
        this.length = 0;
        this.max_length = max_queue_length;
        //this.queue = new Quick_shift_array();
        this.queue = {};
        this.priorities = [];
    }

    enqueue(item=null, priority=0) {

        not_null(item, "E 1339 Queue_with_priority.prototype.enqueue");
        assert(typeof priority === "number", "E 3000 Queue_with_priority.prototype.enqueue");

        if(!(priority in this.queue)) {
            this.queue[priority] = new Quick_shift_array();
            this.priorities.push(priority);
            this.priorities.sort((a,b) => b-a);
        }

        if(this.length < this.max_length) {

            this.queue[priority].push(item);
            this.length ++;
            return true;
        }
        else {

            return false;
        }

    }

    dequeue() {

        if(this.length > 0) {

            for(let i=0; i<this.priorities.length; i++) {

                if(this.queue[this.priorities[i]].length > 0) {
                    this.length --;
                    return this.queue[this.priorities[i]].shift();
                }
            }
        }

        return null;

    }

    non_empty() {

        return this.length !== 0;
    }

    empty() {

        return this.length === 0;
    }

}

module.exports = Queue_with_priority;