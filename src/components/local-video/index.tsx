import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  MutableRefObject,
  VideoHTMLAttributes,
} from 'react';
import { defaultVideoAtt } from '@/constants/video';
import './index.css';

export interface ILocalVideoRef {
  startLocal: () => void;
  closeCall: () => void;
}

interface ILocalVideo {
  videoAtt?: VideoHTMLAttributes<Record<string, any>>;
  localVideoRef: MutableRefObject<ILocalVideoRef>;
  peerConnection: RTCPeerConnection;
}

let localStream: MediaStream;

const LocalVideo = forwardRef<ILocalVideoRef, ILocalVideo>(
  ({ videoAtt, localVideoRef, peerConnection }) => {
    const mergeVideoAtt = { ...defaultVideoAtt, ...videoAtt };
    const localRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(localVideoRef, () => ({
      startLocal,
      closeCall,
    }));

    useEffect(() => {
      if (localRef.current) {
        localRef.current.onloadeddata = () => {
          localRef.current?.play();
        };
      }
    }, []);

    const startLocal = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            aspectRatio: 1,
          },
          audio: true,
        });
        if (localRef.current) {
          localRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.error('摄像头/麦克风权限获取失败！');
        return;
      }
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    };

    const closeCall = () => {
      peerConnection.close();
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    };

    return (
      <div>
        <video {...mergeVideoAtt} muted ref={localRef}></video>
      </div>
    );
  }
);

export default LocalVideo;
