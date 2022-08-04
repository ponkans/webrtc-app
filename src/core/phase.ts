/**
 * 阶段标识器
 */
type TProcess = 'start' | 'createOffer' | 'reciveAnswer';

class Phase {
  list: TProcess[];
  index: number;
  current: TProcess | 'disconnected';

  constructor() {
    this.list = ['start', 'createOffer', 'reciveAnswer'];
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
