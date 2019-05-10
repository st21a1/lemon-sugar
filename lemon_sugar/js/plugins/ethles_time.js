/*:
 * 
 *
 * @plugindesc time event support.
 * @author ethles <percivalstr@163.com>
 *
 * @help This plugin does not provide plugin commands.
 *
 * 
 */

//JavaScript的时间基础单位是毫秒
const ONE_HOUR = 1000 * 60 * 60;
const ONE_MINUTE = 1000 * 60;
const ONE_SECOND = 1000;
/**
 * EVENT_TYPE enum - 时间事件的枚举定义
 */
class EVENT_TYPE {
    constructor() {
        this.ONE_SHOT = 0;
        this.HOUR_LOOP = 1;
        this.DAY_LOOP = 2;
        this.MINUTE_LOOP = 3;
    }
}
EVENT_TYPE = new EVENT_TYPE();


/**
 * LS_Time class
 * time counter - 基础计时功能类
 * @constructor
 * @param {number} date 天数
 * @param {number} hour 小时
 * @param {number} minute 分钟 
 */
class LS_Time {
    constructor(date, hour, minute) {
        let _date = date || 0;
        let _hour = hour || 0;
        let _minute = minute || 0;

        this.time = _minute + (60 * hour) + (1440 * date)
    }
    /**
     * Get time of game. - 返回当前游戏时间，用作比较大小。
     * @return {number} time
     */
    getTime() {
        return this.time;
    }

    /**
     * Get date of game. - 返回当前的天数
     * @return {number} date
     */
    getDay() {
        return parseInt(this.time / 1440);
    }

    /**
     * Get hour of day. - 返回当前的小时数
     * @return {number} hour
     */
    getHour() {
        return parseInt((this.time % 1440) / 60);
    }

    /**
     * Get minute of hour. - 返回当前的分钟数
     * @return {number} minute
     */
    getMinute() {
        return this.time % 60;
    }

    /**
     * change the inner time. - 改变时间，传入正值时间前进，负值时间倒退。
     * @param {number} minutes 
     */
    skipMinutes(minutes) {
        this.time += minutes;
    }

    /**
     * change the inner time - 改变时间，传入正值时间前进，负值时间倒退。
     * @param {number} hours 
     */
    skipHours(hours) {
        this.time += 60 * hours;
    }

    /**
     * change the inner time - 改变时间，传入正值时间前进，负值时间倒退。
     * @param {number} days 
     */
    skipDays(days) {
        this.time += 1440 * days;
    }

};




/**
 * TimeEvent class
 * DO NOT GET INSTANCE BY new !!! USE TimeEventGenerator !!! - 请用 generator 生成该类的实例
 * @constructor
 * @param {string} name event name, must unique. - 事件名，必须唯一
 * @param {LS_Time} time event activiate time - 发生的时间
 * @param {boolean} isLoop event is loop event - 是否是重复事件 
 * @param {number} loop_minute trigger per loopTime minutes - 重复事件的周期
 */
class TimeEvent {
    constructor(name, time, isLoop, loopTime) {
        this.name = name || "";
        this.time = time || new LS_Time();
        this.isLoop = isLoop || false;
        this.loopTime = loopTime || -1;
    }

    /**
     * @return {boolean} 是否是重复事件
     */
    isLoopEvent() {
        return this.isLoop;
    }

    /**
     * 为重复时间事件更新内部的计时器到下一次触发时间
     */
    nextLoop() {
        if (isLoopEvent) {
            this.time.skipMinutes(this.loopTime)
        }
    }

}

/**
 * 时间事件的工厂函数
 * @param {EVENT_TYPE} type 
 * @param {string} name 
 * @param {LS_Time} activeTime 
 * @param {number} loopTime 
 */
function TimeEventGenerator(type, name, activeTime, loopTime) {
    switch (type) {
        case EVENT_TYPE.ONE_SHOT:
            return TimeEvent(name, activeTime, false, -1)
        case EVENT_TYPE.MINUTE_LOOP:
            return TimeEvent(name, activeTime, true, loopTime)
        case EVENT_TYPE.HOUR_LOOP:
            return TimeEvent(name, activeTime, true, 60 * loopTime)
        case EVENT_TYPE.DAY_LOOP:
            return TimeEvent(name, activeTime, true, 1440 * loopTime)
        default:
            return TimeEvent(name, activeTime, false, -1)
    }
}

/**
 * TimeManager class
 * @constructor
 * @param {object} subscribers 拥有 mail方法的对象
 */
class TimeManager {
    constructor() {
        this.gameTime = new LS_Time();
        this.events = [];
        this.happend = [];
        this.listeners = [];
    }

    /**
     * 添加事件
     * 会检查事件名是否重复
     * @param {TimeEvent} event 
     */
    addEvent(event) {
        if (!this.events.some((name) => name === event.name)) {
            this.events.push(event)
        }
    }

    /**
     * 删除事件
     * 遍历事件列表，删除指定名称的事件
     * @param {string} name 
     */
    deleteEvent(findName) {
        this.events = this.events.filter((name) => name !== findName)
    }

    addListener(subscriber) {
        this.listeners.push(subscriber);
    }

    /**
     * 更新世界状态
     * 包括更新游戏时间，发送当前发生的事件，然后对该事件进行删除或更新
     */
    tiktok() {
        this.gameTime.skipMinutes(1);
        this.events = this.events.map(
            (e) => {
                if (e.time.getTime() === this.gameTime.getTime()) {
                    this.happend.push(e.name);
                    if (e.isLoopEvent()) {
                        return e.nextLoop();
                    }
                }
            }, this
        );
        this.listeners.forEach((e) => e.mail(this.happend));
        this.happend = [];
    }
}

/**
 * EventCollector class
 * 收集器会不断接收发送过来的事件名称，直到调用take取走指定名称的所有结果。
 */
class EventCollector {
    constructor() {
        this.box = []
    }

    mail(eventNames) {
        this.box.concat(eventNames)
    }

    exist(findName) {
        return this.box.some((name) => name === findName);
    }

    count(findName) {
        return this.box.reduce((sum, name) => sum + (name === findName), 0)
    }

    take(findName) {
        let oldLenth = this.box.lenth;
        this.box = this.box.filter((name) => name === findName);
        return oldLenth !== this.box.lenth
    }
}

ec = new EventCollector();
tm = new TimeManager();
tm.addListener(ec);
setInterval(tm.tiktok(), ONE_MINUTE);


function isTriggerd(name) {
    return ec.take(name)
}

function addMinuteLoopEvent(name, day, hour, minute, freq) {
    ec.addEvent(TimeEventGenerator(EVENT_TYPE.MINUTE_LOOP, name, new LS_Time(day, hour, minute), freq))
}

function addHourLoopEvent(name, day, hour, minute, freq) {
    ec.addEvent(TimeEventGenerator(EVENT_TYPE.HOUR_LOOP, name, new LS_Time(day, hour, minute), freq))
}

function addDayLoopEvent(name, day, hour, minute, freq) {
    ec.addEvent(TimeEventGenerator(EVENT_TYPE.DAY_LOOP, name, new LS_Time(day, hour, minute), freq))
}

function addEvent(name, day, hour, minute) {
    ec.addEvent(TimeEventGenerator(EVENT_TYPE.ONE_SHOT, new LS_Time(day, hour, minute)))
}