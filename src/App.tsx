import { useRef } from 'react';
import './App.css';
import LocalVideo, { ILocalVideoRef } from '@/components/local-video';
import RemoteVideo from '@/components/remote-video';

const peerConnection = new RTCPeerConnection({ bundlePolicy: 'max-bundle' });

const App = () => {
  const localVideoRef = useRef<ILocalVideoRef>({} as ILocalVideoRef);

  return (
    <div>
      <button onClick={() => localVideoRef.current.startLocal()}>
        点击获取本地流
      </button>
      <LocalVideo
        localVideoRef={localVideoRef}
        peerConnection={peerConnection}
      />
      <RemoteVideo />
    </div>
  );
};

export default App;
