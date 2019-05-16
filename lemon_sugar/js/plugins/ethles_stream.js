
/*
 * @Description: In User Settings Edit
 * @Author: st21a1
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-11 00:19:02
 * @LastEditTime: 2019-05-17 02:05:04
 */

 /**
 * @description: 
 * @param {type} 
 * @return: 
 */
class Vtuber {
    constructor(money) {
        this.stream = new Youtube_Stream();
        this.health = 100;
        this.money = money || 0;
    }
}
/**
 * @description: 
 * @param {boolean} sc_status 是否开启sc
 * @param {LS_Time} stream_time 配信时长
 * @param {LS_Time} total_stream_time 总配信时长
 * @param {number} subscribe_num 订阅数
 * @return: 
 */
class Youtube_Stream {
    constructor() {
        this.sc_status = false;
        this.stream_time = 0;
        this.total_stream_time = 0;
        this.subscribe_num = 0;
    }

}

var takatsuki = new Vtuber();

class Stream_Time {
    constructor(){
        this.start_time=0;
        this.end_time=0;
        this.isLive
    }

}


/**
 * @description: 
 * @param sc_money 本次配信sc收入
 * @param stream_time 配信时长
 * @param stable_income 配信基础收入
 * @param broadcast_tatus 直播状态
 * @return: 
 */

class Live_income{
    constructor() {
        this.sc_money = new income();
        this.stream_time = 0;
        this.stable_income = 500;
        this.broadcast_status = 0;
    }
}

function getincome(stable_income,broadcast_status){
    var income =stable_income+subscribe_num*broadcast_status
    return income

}


//检验接口对象,同时把方法名放进数组中
var Interface = function(name,methods) {
    //判断接口的参数个数(第一个为接口对象,第二个为参数数组)
    if(arguments.length != 2) {
        throw new Error('创建的接口对象参数必须为两个,第二个为方法数组')
    }
    //接口对象引用名
    this.name = name;
    //自己的属性
    this.methods = [];//定义一个内置的空数组对象 等待接受methods里的元素（方法名称）
    //判断数组是否中的元素是否为string的字符串
    for (var i = 0 ; i < methods.length; i++) {
        //判断方法数组里面是否为string(字符串)的属性
        if(typeof methods[i] != 'string') {
            throw new Error('方法名必须是string类型的!')
        }
        //把他放在接口对象中的methods中(把接口方法名放在Interface对象的数组中)
        this.methods.push(methods[i]);
    }
}

