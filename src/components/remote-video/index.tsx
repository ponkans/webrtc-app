import { useEffect, useRef } from 'react';
import type { VideoHTMLAttributes, FC, MutableRefObject } from 'react';
import { defaultRemoteVideoAtt } from '@/constants/video';
import { CONNECTION_EVENTS } from '@/constants/events';
import Connection from '@/core/connection';
import './index.css';

interface IRemoteVideoProps {
  videoAtt?: VideoHTMLAttributes<Record<string, any>>;
  connectionRef?: MutableRefObject<Connection>;
}

const RemoteVideo: FC<IRemoteVideoProps> = ({ videoAtt, connectionRef }) => {
  const mergeVideoAtt = { ...defaultRemoteVideoAtt, ...videoAtt };
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const connection = new Connection();
    if (connectionRef) {
      connectionRef.current = connection;
    }

    connection.on(CONNECTION_EVENTS.TRACK, (track) => {
      if (remoteRef.current) {
        remoteRef.current.srcObject = track;
      }
    });
  }, []);

  return (
    <div>
      <video ref={remoteRef} {...mergeVideoAtt} />
    </div>
  );
};

export default RemoteVideo;
