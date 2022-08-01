import {
  useRef,
  useImperativeHandle,
  forwardRef,
  MutableRefObject,
  useEffect,
} from 'react';
import './index.css';

export interface ILocalVideoRef {
  startLocal: () => any;
}

interface ILocalVideo {
  localVideoRef: MutableRefObject<ILocalVideoRef>;
  peerConnection: RTCPeerConnection;
}

const LocalVideo = forwardRef<ILocalVideoRef, ILocalVideo>(
  ({ localVideoRef, peerConnection }) => {
    const localRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(localVideoRef, () => ({
      startLocal,
    }));

    useEffect(() => {
      if (localRef.current) {
        localRef.current.onloadeddata = () => {
          localRef.current?.play();
        };
      }
    }, []);

    const startLocal = async () => {
      let localStream: MediaStream;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localRef.current) {
          localRef.current.srcObject = localStream;
        }
      } catch {
        console.error('摄像头/麦克风权限获取失败！');
        return;
      }
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    };

    return (
      <div>
        <video muted ref={localRef}></video>
      </div>
    );
  }
);

export default LocalVideo;
