class Vtuber {
    constructor(money) {
        this.stream = new Youtube_Stream();
        this.health = 100;
        this.money = money || 0;
    }
}

class Youtube_Stream {
    constructor() {
        this.sc_status = false;
        this.stream_time = 0;
        this.total_stream_time = 0;
        this.subscribe_num = 0;
    }

}

var takatsuki = new Vtuber();

//export function