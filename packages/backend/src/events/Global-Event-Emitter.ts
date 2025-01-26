import { EventEmitter } from "node:events";

export class GlobalEventEmitter extends EventEmitter {
  public data: any[] = []
  constructor() {
    super();
    this.data = [];
  }

  startTask() {
    this.emit('taskStarted');
  }
  endTask() {
    this.emit('taskCompleted');
  }
  getData() {
    return this.data;
  }
}
