/*:
 * 
 *
 * @plugindesc game_time
 * @author ethles
 *
 * @help This plugin does not provide plugin commands.
 *
 * 
 */


const ONE_HOUR = 1000 * 60 * 60;
const ONE_MINUTE = 1000 * 60;
const ONE_SECOND = 1000;
/**
 * LS_Time class
 * 
 * @constructor
 * @param {number} date
 * @param {numebr} hour
 */
class LS_Time {
    constructor(date, hour, minute) {
        let _date = date || 0;
        let _hour = hour || 0;
        let _minute = minute || 0;

        this.time = _minute + (60 * hour) + (1440 * date)
    }
    /**
     * Get time of game.
     * @return {number} time
     */
    getTime() {
        return this.time;
    }

    /**
     * Get date of game.
     * @return {number} date
     */
    getDay() {
        return parseInt(this.time / 1440);
    }

    /**
     * Get hour of day.
     * @return {number} hour
     */
    getHour() {
        return ((this.time % 1440) / 60);
    }

    /**
     * Get minute of hour.
     * @return {number} minute
     */
    getMinute() {
        return this.time % 60
    }

    skipMinutes(minutes) {
        this.time += minutes;
    }

    skipHours(hours) {
        this.time += 60 * hours;
    }
    skipDays(days) {
        this.time += 1440 * days;
    }


};

/**
 * EVENT_TYPE enum
 */
class EVENT_TYPE {
    constructor() {
        this.ONE_SHOT = 0;
        this.HOUR_LOOP = 1;
        this.DATE_LOOP = 2;
        this.MINUTE_LOOP = 3;
    }
}
EVENT_TYPE = new EVENT_TYPE();


/**
 * Time_Event class
 * DO NOT GET INSTANCE BY new !!! USE Time_Event_Generator !!!
 * @constructor
 * @param {string} name event name, must unique.
 * @param {LS_Time} time event activiate time
 * @param {boolean} isLoop event is loop event
 * @param {number} loop_minute trigger per loop_time minutes
 */
class Time_Event {
    constructor(name, time, isLoop, loop_time) {
        this.name = name || "";
        this.time = time || new LS_Time();
        this.isLoop = isLoop || false;
        this.loop_time = this.loop_time || -1;
    }

}

function Time_Event_Generator(type, name, active_time, loop_time) {
    switch (type) {
        case EVENT_TYPE.ONE_SHOT:
            return Time_Event(name, active_time, false, -1)
        case EVENT_TYPE.MINUTE_LOOP:
            return Time_Event(name, active_time, true, loop_time)
        case EVENT_TYPE.HOUR_LOOP:
            return Time_Event(name, active_time, true, 60 * loop_time)
        case EVENT_TYPE.DATE_LOOP:
            return Time_Event(name, active_time, true, 1440 * loop_time)
        default:
            return Time_Event(name, active_time, false, -1)
    }
}

/**
 * Time_Manager class
 * @constructor
 */
class Time_Manager {
    constructor(subscriber) {
        this.game_time = new LS_Time();
        this.events = [];
        this.listener = subscriber;
        this.ring = []
    }
    /**
     * 
     * @param {Time_Event} event 
     */
    add_event(event) {
        if (this.events.map((e) => e.name).indexOf(event.name) === -1) {
            this.events.push(event)
        }
    }

    kill_event(name) {
        this.events = this.events.map((e) => {
            if (e.name !== name) {
                return e
            }
        })
    }

    tiktok() {
        this.game_time.skipMinutes(1);
        this.events = this.events.map(
            (e) => {
                if (e.time.getTime() === this.game_time.getTime()) {
                    this.ring.push(e.name);
                    if (e.isLoop === true) {
                        return e.time.skipMinutes(e.loop_minute);
                    } else {
                        return;
                    }
                }
            }
        );
        this.listener.mail(this.ring);
        this.ring = [];
    }



}

class Dock {
    constructor() {
        this.done = []
    }

    mail(names) {
        names.forEach(name => {
            this.done.push(name);
        });
    }

    take(name) {
        let find = [];
        this.done = this.done.map(
            (e) => {
                if (e !== name) {
                    return e;
                } else {
                    find.push(e)
                    return;
                }
            }
        )
        return find;
    }
}

dock = new Dock();
gt = new Time_Manager(dock.mail);
setInterval(gt.tiktok(), ONE_MINUTE)


function isTriggerd(name) {
    return take(name).size && true
}

function addLoopEvent() {}

function addEvent() {}