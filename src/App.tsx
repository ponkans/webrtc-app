import { useRef, useEffect, useState } from 'react';
import LocalVideo, { ILocalVideoRef } from '@/components/local-video';
import RemoteVideo from '@/components/remote-video';
import ActionVideo from '@/components/action-video';
import Connection from '@/core/connection';
import { CONNECTION_EVENTS } from '@/constants/events';
import './App.css';

const peerConnection = new RTCPeerConnection({
  bundlePolicy: 'max-bundle',
});
const socket = new WebSocket('ws://localhost:5000');

export enum videoStatus {
  /**
   * 初始化状态
   */
  init = 0,

  /**
   * 视频中
   */
  calling = 1,

  /**
   * 结束通话
   * peerConnection close
   * localStream close
   */
  close = 2,
}

const App = () => {
  const localVideoRef = useRef<ILocalVideoRef>({} as ILocalVideoRef);
  const connectionRef = useRef<Connection>({} as Connection);
  const [status, setStatus] = useState<videoStatus>(videoStatus.init);

  useEffect(() => {
    localVideoRef.current.startLocal();
  }, []);

  /**
   * 监听 socket 服务信息
   */
  useEffect(() => {
    socket.onmessage = (e) => {
      connectionRef.current.emit(CONNECTION_EVENTS.MESSAGE, e);
      const { type } = JSON.parse(e.data);
      switch (type) {
        case 'offer':
        case 'answer':
          setStatus(videoStatus.calling);
          break;
        case 'closeAll':
          setStatus(videoStatus.close);
          localVideoRef.current.closeCall();
          break;
      }
    };
  }, []);

  return (
    <div className='app'>
      <div className='remote'>
        <div className='local'>
          <LocalVideo
            localVideoRef={localVideoRef}
            peerConnection={peerConnection}
            videoAtt={{ width: 80, height: 80 }}
          />
        </div>
        <RemoteVideo
          localVideoRef={localVideoRef}
          connectionRef={connectionRef}
          peerConnection={peerConnection}
          socket={socket}
          videoAtt={{ width: 500, height: 500 }}
        />
      </div>
      <ActionVideo
        status={status}
        setStatus={setStatus}
        localVideoRef={localVideoRef}
        connectionRef={connectionRef}
        socket={socket}
      />
    </div>
  );
};

export default App;
