import { MutableRefObject, FC } from 'react';
import Connection from '@/core/connection';
import { ILocalVideoRef } from '@/components/local-video';
import { videoStatus } from '@/App';
import './index.css';

interface IStatusItem {
  text: string;
  action: () => void;
}

interface IActionVideo {
  status: videoStatus;
  setStatus: React.Dispatch<React.SetStateAction<videoStatus>>;
  localVideoRef: MutableRefObject<ILocalVideoRef>;
  connectionRef: MutableRefObject<Connection>;
  socket: WebSocket;
}

const ActionVideo: FC<IActionVideo> = ({
  status,
  setStatus,
  localVideoRef,
  connectionRef,
  socket,
}) => {
  const startCall = async () => {
    await localVideoRef.current.startLocal();
    await connectionRef.current.connect();
    setStatus(videoStatus.calling);
  };

  const closeCall = () => {
    socket.send(
      JSON.stringify({
        type: 'closeAll',
      })
    );
  };

  const statusMap: Record<number, IStatusItem> = {
    0: {
      text: '开始视频通话',
      action: startCall,
    },
    1: {
      text: '结束视频通话',
      action: closeCall,
    },
    2: {
      text: '视频已结束',
      action: () => {},
    },
  };

  return (
    <div className='action'>
      <button className='btn' onClick={statusMap[status].action}>
        {statusMap[status].text}
      </button>
    </div>
  );
};

export default ActionVideo;
