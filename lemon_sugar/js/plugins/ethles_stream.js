/*
 * @Description: In User Settings Edit
 * @Author: st21a1
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-11 00:19:02
 * @desc 直播数据插件
 * 
 * @help
 * 插件指令：
 * 开始配信  #开始进行直播配信，此时开始计算直播时间
 * 结束配信  #结束本次直播配信，此时开始更新vtuber本人的数据
 * 去医院    #结束当天所有活动，此时健康值变为100，时间进入下一天
 * 直播规则：
 * 每天可以在自宅电脑处进行直播
 * 通过游戏行动获得更多直播选项
 * 直播收益为
 * sc=固定收益+人气值*直播技能参数（X-Y之间浮动）
 * 收获人气=直播技能参数（X-Y之间浮动）
 * 扣除（直播技能参数）健康值
 * 经过（固定值）时间
 * 直播实例
 * 在道具店购买《DMC》后 直播槻泣，获得2000（固定）+2000（人气值）（2.0-4.0）=6000-10000不等的sc和500-750不等的人气值。

 * 健康值
 * 健康值总量为100
 * 健康值和时间将作为限制玩家行动的规则
 * 健康值归零时，时间强制调整至次日12：00，强制传送到【医院】，扣除（固定金额）金钱，回复50健康值。
 * 健康值可以使用金币在【医院】处恢复（该项是否消耗时间视剧本丰富程度决定）
 * @LastEditTime: 2019-05-25 17:50:45
 */


/**
 * @description: Vtuber个人信息
 * @param {Youtube_Stream} stream Vtuber直播信息
 * @param {number} health Vtuber健康值
 * @param {number} money Vtuber金钱
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
 * @description: 直播信息
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
/**
 * @description: 
 * @param {boolean} isLive 是否正在配信
 * @param {LS_Time} stream_time 开始配信时间
 * @param {LS_Time} stream_time 结束配新时间
 * @return: 
 */
class Stream_Time {
    constructor() {
        this.start_time = 0;
        this.end_time = 0;
        this.isLive = false
    }
    getStream_Time() {
        return this.end_time - this.start_time
    }

}

/**
 * @description: 
 * @param {number} sc_money 本次配信sc收入
 * @param {LS_Time} stream_time 配信时长
 * @param {LS_Time} stable_income 配信基础收入
 * @param broadcast_tatus 直播状态
 * @return: 
 */

class Live_income {
    constructor() {
        this.sc_money = new income();
        this.stream_time = 0;
        this.stable_income = 500;
        this.broadcast_status = getbroadcast_status(0, 1);
    }
}
/**
 * @description: 获取本次直播收入
 * @param {number} stable_income 固定收益
 * @param {number} subscribe_num 人气值(订阅数)
 * @param {type} broadcast_status 直播状态
 * @return: 
 */
function getsc(stable_income, broadcast_status) {
    var income = stable_income + subscribe_num * broadcast_status
    return income

}
/**
 * @description: 获取直播技能参数（直播状态）
 * @param {number} minNum 技能参数最小值
 * @param {number} maxNum 技能参数最大值
 * @return:  num 目标随机值
 */
function getbroadcast_status(minNum, maxNum) {
    var Range = maxNum - minNum;
    var Rand = Math.random();
    var num = minNum + Math.round(Rand * Range); //四舍五入
    return num;
}


/**
 * ==================================
 * --------------API-----------------
 * ==================================
 */

/**
 * @description: 当前游戏时间开始直播
 * @param {type} 
 * @return: 
 */
function 开始配信() {
    Stream_Time.start_time = 游戏时间()
    Stream_Time.isLive = true

}

/**
 * @description: 当前直播时间结束直播
 * @param {type} 
 * @return: 
 */
function 结束配信() {
    Stream_Time.end_time = 游戏时间()
    Stream_Time.isLive = false
    update_Live();
}

/**
 * @description: 当前直播时间结束直播
 * @param {string} args 技能名称
 * @return: 更新角色信息
 */
function 使用技能(args) {
    switch (args) {
        case "脱粪":
            takatsuki.health -= 15
            if (takatsuki.stream.sc_status) {
                takatsuki.money += 2000
            }
            takatsuki.stream.subscribe_num +=200
            break;
        case "脱毛":
            takatsuki.health -= 5
            if (takatsuki.stream.sc_status) {
                takatsuki.money += 500
            }
            takatsuki.stream.subscribe_num +=50
            break;
        default:
            break;
    }
}

/**
 * @description: 健康值归零，去医院花费500元治疗所有健康值
 * @param {type} 
 * @return: 
 */
function 去医院(){
    takatsuki.health =100
    takatsuki.money -= 500
    nextDays(getDay())
    //TODU: 人物传送到医院门口
}

/**
 * @description: 健康值归零，去医院治疗
 * @param {type} 
 * @return: 
 */
function 去睡觉(){
    takatsuki.health += 30
    nextDays(getDay())
    //TODU: 人物传送到地图阿律床边
}

/**
 * @description: 更新配信数据
 * @param {type} 
 * @return: 
 */
function update_Live() {
    takatsuki.stream.stream_time = Stream_Time.getStream_Time()
    takatsuki.stream.total_stream_time += takatsuki.stream.stream_time
    takatsuki.stream.subscribe_num += 1000 * (getbroadcast_status(0, 1))
    update_Vtuber()
}

/**
 * @description: 更新vtuber数据
 * @param {type} 
 * @return: 
 */
function update_Vtuber() {
    takatsuki.health = 100 * (1 - getbroadcast_status(0, 1))
    if (takatsuki.stream.sc_status) {
        takatsuki.money += getsc(500, takatsuki.stream.subscribe_num)
    }
    if(takatsuki.health<=0){
        去医院()
    }
}

/**
 * @description: 设置插件指令
 * @param {type} 
 * @return: 
 */
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    switch (command) {
        case "开始配信":
            开始配信();
            break;
        case "结束配信":
            结束配信();
            break;
        case "去医院":
            去医院();
            break;
        default:
            break;
    }
}