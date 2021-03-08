module.exports.ERROR={
  //无错误
  NONE: "success",
  //参数格式错误
  IDENTIFY_CHECK_FAILED: "Identify Check Failed",
  //参数格式错误
  PARAM_FORMAT : "param format error",
  //连接超时
  CONNECT_TIMEOUT: "connect timeout",
  //通讯超时
  OPERATE_TIMEOUT: "operate timeout",
  //通讯中
  OPERATING : "operating",
  //蓝牙未连接
  NOT_CONNECTED : "device not connected",
  //返回数据格式错误
  DATA_FORMAT : "receive format error",
  //未检测到蓝牙信号
  NO_SIGNAL : "no signal",
  //参数错误
  PARAM : "error param",
  //手机未打开蓝牙
  BLEDISABLE : "ble not available",
  //上升遇阻
  LOCK_FAILED:"lock failed",
  //下降遇阻
  UNLOCK_FAILED:"unlock failed"
};

module.exports.CMD={
    UNLOCK:0x01,
    LOCK:0x02,
    CHECK_PWD:0x11,
    SET_PWD:0x12
};

module.exports.UPDOWN={
  LOCK:0x00,
  UNLOCK:0x01,
  UNLOCKFAILED:0x02,
  LOCKFAILED:0x03,
  UNKNOWN:0x88
}

module.exports.HEAD={
    SEND:0x55,
    SUCCESS:0x5a,
    FAILED:0x5b
}