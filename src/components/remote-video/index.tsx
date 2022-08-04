import { useEffect, useRef, FC } from 'react';
import type { VideoHTMLAttributes, MutableRefObject } from 'react';
import { defaultRemoteVideoAtt } from '@/constants/video';
import { CONNECTION_EVENTS } from '@/constants/events';
import Connection from '@/core/connection';
import './index.css';

interface IRemoteVideoProps {
  videoAtt?: VideoHTMLAttributes<Record<string, any>>;
  connectionRef?: MutableRefObject<Connection>;
  peerConnection: RTCPeerConnection;
  socket: WebSocket;
}

const RemoteVideo: FC<IRemoteVideoProps> = ({
  videoAtt,
  connectionRef,
  peerConnection,
  socket,
}) => {
  const mergeVideoAtt = { ...defaultRemoteVideoAtt, ...videoAtt };
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const connection = new Connection({ peerConnection, socket });
    if (connectionRef) connectionRef.current = connection;

    connection.on(CONNECTION_EVENTS.TRACK, (track) => {
      if (remoteRef.current) remoteRef.current.srcObject = track;
    });

    return () => {
      connection.removeAllListeners();
    };
  }, []);

  return (
    <div>
      <video ref={remoteRef} {...mergeVideoAtt} />
    </div>
  );
};
export default RemoteVideo;
