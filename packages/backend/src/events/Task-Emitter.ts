import { GlobalEventEmitter } from './Global-Event-Emitter.js';

export class TaskEmitter extends GlobalEventEmitter {
  private totalSize: number;
  private uploadedSize: number;

  constructor(totalSize: number) {
    super();
    this.totalSize = totalSize;
    this.uploadedSize = 0;
  }

  updateProgress(chunkSize: number) {
    this.uploadedSize += chunkSize;

    const progress = Math.round((this.uploadedSize / this.totalSize) * 100);
    this.emit('progress', progress);

    if (this.uploadedSize >= this.totalSize) {
      this.emit('complete');
    }
  }

}