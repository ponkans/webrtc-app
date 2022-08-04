import { useEffect, useRef } from 'react';
import './App.css';
import LocalVideo, { ILocalVideoRef } from '@/components/local-video';
import RemoteVideo from '@/components/remote-video';
import Connection from '@/core/connection';

const peerConnection = new RTCPeerConnection({ bundlePolicy: 'max-bundle' });
const socket = new WebSocket('ws://localhost:5000');

const App = () => {
  const localVideoRef = useRef<ILocalVideoRef>({} as ILocalVideoRef);
  const connectionRef = useRef<Connection>({} as Connection);

  useEffect(() => {
    socket.onmessage = async (e) => {
      const { type, sdp } = JSON.parse(e.data);
      switch (type) {
        case 'offer':
          await connectionRef.current.reviceOffer(
            new RTCSessionDescription({ type, sdp })
          );
          break;
        case 'answer':
          break;
        case 'answer_ice':
          break;
        case 'offer_ice':
          break;
      }
    };
  }, []);

  const startVideoCall = async () => {
    await localVideoRef.current.startLocal();
    await connectionRef.current.connect();
  };

  return (
    <div>
      <button onClick={startVideoCall}>开始视频通话</button>
      <LocalVideo
        localVideoRef={localVideoRef}
        peerConnection={peerConnection}
      />
      <RemoteVideo
        connectionRef={connectionRef}
        peerConnection={peerConnection}
        socket={socket}
      />
    </div>
  );
};

export default App;
