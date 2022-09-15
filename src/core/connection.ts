/**
 * webrtc 连接
 * 连接过程发生的事件，通过 EventEmitter 抛出
 */
import { MutableRefObject } from 'react';
import { EventEmitter } from 'events';
import { CONNECTION_EVENTS } from '@/constants/events';
import { ILocalVideoRef } from '@/components/local-video';

interface IConnectionProps {
  localVideoRef: MutableRefObject<ILocalVideoRef>;
  peerConnection: RTCPeerConnection;
  socket: WebSocket;
}

interface Connection extends IConnectionProps {}

class Connection extends EventEmitter {
  constructor({ localVideoRef, peerConnection, socket }: IConnectionProps) {
    super();
    this.localVideoRef = localVideoRef;
    this.peerConnection = peerConnection;
    this.socket = socket;
    this.addEventListener();
  }

  private addEventListener() {
    this.on(CONNECTION_EVENTS.MESSAGE, async (e) => {
      const { type, sdp, iceCandidate } = JSON.parse(e.data);
      switch (type) {
        case 'offer':
          await this.reviceOffer(new RTCSessionDescription({ type, sdp }));
          break;
        case 'answer':
          this.peerConnection.setRemoteDescription(
            new RTCSessionDescription({ type, sdp })
          );
          break;
        case 'ice':
          this.peerConnection.addIceCandidate(iceCandidate);
          break;
      }
    });

    /**
     * 收到对方音视频流数据
     */
    this.peerConnection.ontrack = (e) => {
      if (e && e.streams) {
        this.emit(CONNECTION_EVENTS.TRACK, e.streams[0]);
      }
    };

    /**
     * 搜集并发送候选人
     */
    this.peerConnection.onicecandidate = (e) => {
      try {
        if (e.candidate) {
          this.socket.send(
            JSON.stringify({
              type: 'ice',
              iceCandidate: e.candidate,
            })
          );
        }
      } catch (error) {
        this.emit(CONNECTION_EVENTS.ERROR, error);
      }
    };
  }

  /**
   * 创建/发送 offer
   */
  public async connect() {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socket.send(JSON.stringify(offer));
    } catch (error) {
      this.emit(CONNECTION_EVENTS.ERROR, error);
    }
  }

  /**
   * 收到 offer -> 添加本地音视频流 -> 创建/发送 answer
   */
  private async reviceOffer(description: RTCSessionDescriptionInit) {
    await this.localVideoRef.current.startLocal();
    try {
      this.peerConnection.setRemoteDescription(description);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.send(JSON.stringify(answer));
    } catch (error) {
      this.emit(CONNECTION_EVENTS.ERROR, error);
    }
  }
}

export default Connection;
