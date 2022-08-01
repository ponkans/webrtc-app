/**
 * 阶段标识器
 */
type TProcess = 'start' | 'connecting' | 'connected' | 'playing';

class Phase {
  list: TProcess[];
  index: number;
  current: TProcess | 'disconnected';

  constructor() {
    this.list = ['start', 'connecting', 'connected', 'playing'];
    this.index = 0;
    this.current = this.list[this.index];
  }

  next() {
    this.index++;
    this.current = this.list[++this.index];
  }

  failed() {
    this.current = 'disconnected';
  }

  reset() {
    this.index = 0;
    this.current = this.list[this.index];
  }
}

export default Phase;
