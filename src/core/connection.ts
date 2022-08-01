/**
 * webrtc 连接
 * 连接过程发生的事件，通过 EventEmitter 抛出
 */
import { EventEmitter } from 'events';
import Phase from './phase';

interface IConnectionProps {}

interface Connection extends IConnectionProps {
  phase: Phase;
}

class Connection extends EventEmitter {
  constructor() {
    super();
    this.phase = new Phase();
  }

  //    A、B 都连接信令服务器（ws）；
  //    A 创建本地视频，并获取会话描述对象（offer sdp）信息；
  //    A 将 offer sdp 通过 ws 发送给 B；
  //    B 收到信令后，B 创建本地视频，并获取会话描述对象（answer sdp）信息；
  //    B 将 answer sdp 通过 ws 发送给 A；
  //    A 和 B 开始打洞，收集并通过 ws 交换 ice 信息；
  //    完成打洞后，A 和 B 开始为安全的媒体通信协商秘钥；
  //    至此， A 和 B 可以进行音视频通话。
}

export default Connection;
