import { SimpleTime } from "./ethles_time";
import { ITimeEvent } from "./ethles_event";

class Game {
  gameTime: SimpleTime;
  events: [ITimeEvent];
  subscriber: any;
}
