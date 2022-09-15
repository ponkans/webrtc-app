/**
 * p2p 连接各阶段事件
 */
export const CONNECTION_EVENTS = {
  /** 获取stream track */
  TRACK: 0,

  /** 交换 offer、ice */
  MESSAGE: 1,

  /** 未知错误 */
  ERROR: 100,
};
