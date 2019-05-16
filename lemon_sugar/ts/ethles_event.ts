import { ITime, SimpleTime } from "./ethles_time";

enum EventStatus {
  Pending,
  Started,
  Done,
  Error
}

interface IEvent {
  activeFunc: Promise<number>;
  status: EventStatus;
}

export interface ITimeEvent extends IEvent {
  activeTime: ITime;
}

export class SimpleTimeEvent implements ITimeEvent {
  activeFunc: Promise<number>;
  activeTime: SimpleTime;
  status: EventStatus;
  constructor(parameters) {}
}

export class LoopTimeEvent implements ITimeEvent {
  activeFunc: Promise<number>;
  activeTime: SimpleTime;
  status: EventStatus;
  loopDuration: SimpleTime;
  constructor(parameters) {}
}
