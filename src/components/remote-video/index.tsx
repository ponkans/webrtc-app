import {
  useEffect,
  useRef,
  FC,
  VideoHTMLAttributes,
  MutableRefObject,
} from 'react';
import { defaultVideoAtt } from '@/constants/video';
import { CONNECTION_EVENTS } from '@/constants/events';
import Connection from '@/core/connection';
import { ILocalVideoRef } from '@/components/local-video';
import './index.css';

interface IRemoteVideoProps {
  localVideoRef: MutableRefObject<ILocalVideoRef>;
  videoAtt?: VideoHTMLAttributes<Record<string, any>>;
  connectionRef?: MutableRefObject<Connection>;
  peerConnection: RTCPeerConnection;
  socket: WebSocket;
}

const RemoteVideo: FC<IRemoteVideoProps> = ({
  localVideoRef,
  videoAtt,
  connectionRef,
  peerConnection,
  socket,
}) => {
  const mergeVideoAtt = { ...defaultVideoAtt, ...videoAtt };
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const connection = new Connection({
      peerConnection,
      socket,
      localVideoRef,
    });

    if (connectionRef) {
      connectionRef.current = connection;
    }

    connection.on(CONNECTION_EVENTS.TRACK, (track) => {
      if (remoteRef.current) remoteRef.current.srcObject = track;
    });

    return () => {
      connection.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (remoteRef.current) {
      remoteRef.current.onloadeddata = () => {
        remoteRef.current?.play();
      };
    }
  }, []);

  return <video ref={remoteRef} {...mergeVideoAtt} />;
};
export default RemoteVideo;
