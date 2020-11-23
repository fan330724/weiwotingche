/**
 * SDK初始化函数
 */
module.exports.init = init;
/**
 * 搜索蓝牙设备
 * @param cb 搜索到设备的回调函数
 */
module.exports.startScan = startScan;
/**
 * 停止搜索设备
 */
module.exports.stopScan = stopScan;
/**
 * 连接蓝牙
 * @param cb 连接成功或失败的回调函数
 */
module.exports.connect = connect;
/**
 * 断开蓝牙连接
 */
module.exports.disconnect = disconnect;
/**
 * 设置需要连接的蓝牙设备
 * @param device 蓝牙设备对象
 * @param key 离线码
 */
module.exports.setDevice = setDevice;
/**
 * 升起地锁
 * @param callback 回调函数
 */
module.exports.lock = lock;
/**
 * 降下地锁
 * @param callback 回调函数
 */
module.exports.unlock = unlock;


const PACKET_STATUS_START = 0x22;
const PACKET_STATUS_COMPLETE = 0x33;

//服务UUID
const SERVICE_UUID = "A08F7710-C37C-11E3-99CC-0228AC012A70";
//读UUID
const TX_UUID = "B34AE89E-C37C-11E3-940E-0228AC012A70";
//写UUID
const RX_UUID = "BB8A27E0-C37C-11E3-B953-0228AC012A70";
//INDICATE UUID
const INDICATE_UUID = "BB8A27E2-C37C-11E3-B954-0228AC012A70";
//WRITE UUID
const WRITE_UUID = "BB8A27E3-C37C-11E3-B954-0228AC012A70";



//服务UUID
const SERVICE_UUID_V2 = "00005500-D102-11E1-9B23-00025B00A5A6";
//写UUID
const RX_UUID_V2 = "00005501-D102-11E1-9B23-00025B00A5A6";
//读UUID
const TX_UUID_V2 = "00005502-D102-11E1-9B23-00025B00A5A6";




var bleConst = require("bleConst.js");
var crcHelper = require("crc.js");
var bleTool = require("bleTool.js");

//当前连接的device
var curDevice = null;
//离线码
var curKey = null;
//是否已连接蓝牙设备
var isConnected = false;
//是否正在搜索信号
var isScanning = false;
//接收消息超时时间
var timeout = 8000;
//定时器
var _timer = null;
//当前的回调函数
var _curCB = null;
//接收数据缓冲队列
var _buffer = null;
//等待的消息数
var _waitCount = 0;
//消息计数
var _msgIndex = 1;
//地锁版本号
var _version = 0;
//地锁状态
var _lockState = null;

//初始化
function init() {
  curDevice = null;
  isConnected = false;
  isScanning = false;
  //监听蓝牙开关状态改变
  wx.onBluetoothAdapterStateChange(function (res) {
    console.log(`adapterState changed, now is`, res);
  });
  wx.onBLEConnectionStateChanged(function (res) {
    console.log(`connect state changed, now is`, res);
    if (!res.connected) {
      isConnected = false;
    }
  });


};

//蓝牙开关是否可用
function getBLEAvailable(cb) {
  wx.getBluetoothAdapterState({
    complete: function (res) {
      if (res.adapterState) {
        cb(res.adapterState.available, res.errMsg);
      }
      else {
        cb(false, "获取状态失败");
      }
    }
  });
}

//开始扫描设备
function startScan(cb) {
  wx.onBluetoothDeviceFound(function (devices) {
    //Android 和 iOS此处有差异化
    if (!(devices instanceof Array)) {
      devices = devices.devices;
    }

    for (var i = 0; i < devices.length; i++) {
      var device = devices[i];
      if (device.name.length == 7) {
        console.log("发现信号：", device);
        cb(device);
      }
    }
  });

  wx.startBluetoothDevicesDiscovery({
    services: [],//[SERVICE_UUID_V2, SERVICE_UUID],
    allowDuplicatesKey: true,
    success: function (res) {
      isScanning = true;
    }
  });
}

//停止扫描设备
function stopScan() {
  wx.stopBluetoothDevicesDiscovery();
  console.log('停止了')
}

function setDevice(device, key) {
  disconnect();
  curDevice = device;
  curKey = key;
}

//连接设备
function connect(cb) {
  if (!curDevice) {
    cb(false, bleConst.ERROR.NO_SIGNAL);
    return;
  }
  if (isConnected) {
    cb(true, bleConst.ERROR.NONE);
    return;
  }

  var deviceId = curDevice.deviceId;
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function (res) {
      //获取设备的Service
      wx.getBLEDeviceServices({
        deviceId: deviceId,
        complete: function (res) {
          if (res.services) {
            for (var i = 0; i < res.services.length; i++) {
              var serviceId = res.services[i].uuid;
              if (serviceId.toUpperCase().indexOf(SERVICE_UUID) > -1) {
                _version = 1;
              }
              else if (serviceId.toUpperCase().indexOf(SERVICE_UUID_V2) > -1) {
                _version = 2;
              }
              else {
                continue;
              }
              //找到需要的Service后，查询Characteristic
              wx.getBLEDeviceCharacteristics({
                deviceId: deviceId,
                serviceId: _getServiceUUID(),
                complete: function (res) {
                  //启用 notify 功能
                  wx.notifyBLECharacteristicValueChanged({
                    state: true,
                    deviceId: deviceId,
                    serviceId: _getServiceUUID(),
                    characteristicId: _getTXUUID(),
                    success: function (res) {
                      if (_version == 2) {
                        _onConnSuc(cb);
                        return;
                      }
                      wx.notifyBLECharacteristicValueChanged({
                        state: true,
                        deviceId: deviceId,
                        serviceId: _getServiceUUID(), characteristicId: INDICATE_UUID,
                        success: function (res) {
                          _onConnSuc(cb);
                        },
                        fail: function (res) {
                          console.log(res.errMsg);
                          disconnect();
                        }
                      });
                    },
                    fail: function (res) {
                      console.log(res.errMsg);
                      disconnect();
                    }
                  })
                },
              });
            }
          }
          else {
            cb(false, "getBLEDeviceServices fail---" + res.errMsg);
            disconnect();
          }
        },
      })
    },
    fail: function (res) {
      cb(false, res.errMsg);
    }
  })
}

//断开连接
function disconnect() {
  isConnected = false;
  _version = 0;
  if (curDevice) {
    wx.closeBLEConnection({
      deviceId: curDevice.deviceId
    });
  }
}

/**
 * 校验离线码
 */
function checkKey(key, callback) {
  if (key.length != 8) {
    callback(false, bleConst.ERROR.PARAM);
    return;
  }

  var data = bleTool.utf8Encode(key);
  var msg = { head: bleConst.HEAD.SEND, cmd: bleConst.CMD.CHECK_PWD, data: data };
  _sendMsg(msg, function (isSuc, error, resMsg) {
    if (!callback) {
      return;
    }
    if (isSuc) {
      if (resMsg.head == bleConst.HEAD.SUCCESS && resMsg.cmdCode == msg.cmdCode) {
        _lockState = { state: resMsg.data[0], power: resMsg.data[1] };
        callback(true, bleConst.ERROR.NONE, _lockState);
      }
      else {
        callback(false, bleConst.ERROR.IDENTIFY_CHECK_FAILED);
        disconnect();
      }
    }
    else {
      callback(false, error);
      disconnect();
    }
  }, 1);
}

/**
 * 上升
 */
function lock(callback) {
  var msg = { head: bleConst.HEAD.SEND, cmd: bleConst.CMD.LOCK };
  _sendMsg(msg, function (isSuc, error, resMsg) {
    if (!callback) {
      return;
    }
    if (isSuc) {
      if (resMsg.head == bleConst.HEAD.SUCCESS && resMsg.cmdCode == msg.cmdCode) {
        if (_waitCount == 0) {
          _lockState.state = bleConst.UPDOWN.LOCK;
          callback(true, bleConst.ERROR.NONE, _lockState);
        }
      }
      else {
        if (_waitCount) {
          _endTask();
        }
        callback(false, bleConst.ERROR.LOCK_FAILED, _lockState);
      }
    }
    else {
      callback(false, error);
    }
  }, 2);
}

/**
 * 下降
 */
function unlock(callback) {
  var msg = { head: bleConst.HEAD.SEND, cmd: bleConst.CMD.UNLOCK };
  _sendMsg(msg, function (isSuc, error, resMsg) {
    if (!callback) {
      return;
    }
    if (isSuc) {
      if (resMsg.head == bleConst.HEAD.SUCCESS && resMsg.cmdCode == msg.cmdCode) {
        if (_waitCount == 0) {
          _lockState.state = bleConst.UPDOWN.UNLOCK;
          callback(true, bleConst.ERROR.NONE, _lockState);
        }
      }
      else {
        if (_waitCount) {
          _endTask();
        }
        callback(false, bleConst.ERROR.UNLOCK_FAILED, _lockState);
      }
    }
    else {
      callback(false, error);
    }
  }, 2);
}

function _sendMsg(msg, cb, count) {
  connect(function (isSuc, error) {
    if (isSuc) {
      if (_startTask(cb)) {
        _waitCount = count;
        var buffer = _encodeMsg(msg);
        _uartSend(buffer);
      }
    }
    else {
      cb(false, error);
    }
  });
}

function _uartSend(buffer) {
  var leftBf = null;
  var pktLen = buffer.byteLength;
  if (pktLen > 20) {
    leftBf = buffer.slice(20, pktLen);
    buffer = buffer.slice(0, 20);
  }

  var sendFunction = function () {
    wx.writeBLECharacteristicValue({
      deviceId: curDevice.deviceId,
      serviceId: _getServiceUUID(),
      characteristicId: _getRXUUID(),
      value: buffer,
      complete: function (res) {
        if (!leftBf) {
          if (_version == 1) {
            _reportPacketStatus(pktLen, PACKET_STATUS_COMPLETE);
            _msgIndex++;
          }
          return;
        }
        _uartSend(leftBf);
      }
    });
  };

  if (_version == 1) {
    _reportPacketStatus(pktLen, PACKET_STATUS_START, sendFunction);
  }
  else {
    sendFunction();
  }

}

function _startTask(innerCB) {
  if (_curCB) {
    innerCB(false, bleConst.ERROR.OPERATING);
    return false;
  }
  _curCB = innerCB;
  _timer = setTimeout(_overTimerCb, timeout);
  return true;
}

function _endTask() {
  if (_timer) {
    clearTimeout(_timer);
  }
  _waitCount = 0;
  _curCB = null;
}

function _overTimerCb() {
  if (_curCB) {
    var cb = _curCB;
    _endTask();

    if (cb) {
      if (isConnected) {
        cb(false, bleConst.ERROR.OPERATE_TIMEOUT);
      } else {
        cb(false, bleConst.ERROR.CONNECT_TIMEOUT);
      }
    }
  }
}


function _reportPacketStatus(length, packet_flag, cb) {
  var buffer = new ArrayBuffer(5);
  var packet = new Uint8Array(buffer);
  packet[0] = _msgIndex & 0xFF;
  packet[1] = _msgIndex >> 8 & 0xFF;
  packet[2] = packet_flag;
  packet[3] = length & 0xFF;
  packet[4] = length >> 8 & 0xFF;
  wx.writeBLECharacteristicValue({
    deviceId: curDevice.deviceId,
    serviceId: _getServiceUUID(),
    characteristicId: WRITE_UUID,
    value: buffer,
    success: cb,
    fail: function (res) {
      var cb = _curCB;
      _endTask();
      cb(false, DATA_FORMAT);
    }
  });
}

function _onConnSuc(cb) {
  isConnected = true;
  //设置数据接收的回调函数
  wx.onBLECharacteristicValueChange(_onBLEValueChanged);
  setTimeout(function () {
    checkKey(curKey, cb);
  }, 1000);
}

function _getServiceUUID() {
  if (_version == 1)
    return SERVICE_UUID;
  if (_version == 2)
    return SERVICE_UUID_V2;
  return null;
}

function _getTXUUID() {
  if (_version == 1)
    return TX_UUID;
  if (_version == 2)
    return TX_UUID_V2;
  return null;
}

function _getRXUUID() {
  if (_version == 1)
    return RX_UUID;
  if (_version == 2)
    return RX_UUID_V2;
  return null;
}

//将消息对象编码为ArrayBuffer
function _encodeMsg(msg) {
  var len = 5 + (msg.data ? msg.data.length : 0);
  var buffer = new ArrayBuffer(len);
  var array = new Uint8Array(buffer);
  array[0] = msg.head;
  array[1] = len - 4;
  array[2] = msg.cmd;

  if (msg.data) {
    for (var i = 0; i < msg.data.length; i++) {
      array[3 + i] = msg.data[i];
    }
  }
  array[len - 2] = crcHelper.calcCrc8(array, 1, len - 3);
  array[len - 1] = 0xaa;

  return buffer;
}

//将Array解码为消息对象
function _dcodeMsg(array) {
  var len = array.length;
  var crc = crcHelper.calcCrc8(array, 1, len - 3);
  if (crc != array[len - 2] || array[1] + 4 != len) {
    return;
  }

  var msg = {};

  msg.head = array[0];
  msg.cmd = array[2];
  if (len > 5) {
    msg.data = array.slice(3, len - 2);
  }

  return msg;
}

function _onBLEValueChanged(res) {
  if (_getTXUUID().indexOf(res.characteristicId) < 0) {
    return;
  }

  var _b = new Uint8Array(res.value);
  var data = [];
  for (var i = 0; i < _b.length; i++)
    data.push(_b[i]);

  console.log("接收到数据：", data);
  if (_curCB) {
    if (_buffer == null) {
      var len = data[1] + 4;
      //数据未传完
      if (len > data.length) {
        _buffer = data;
        return;
      }
    } else {
      _buffer = _buffer.concat(data);
      //数据传输完成
      if (_buffer.length >= _buffer[1] + 4) {
        data = _buffer;
        _buffer = null;
      } else {
        return;
      }
    }
    var msg = _dcodeMsg(data);
    var cb = _curCB;

    _waitCount--;
    if (_waitCount == 0) {
      _endTask();
    }

    if (msg) {
      cb(true, bleConst.ERROR.NONE, msg);
    }
    else {
      cb(false, bleConst.ERROR.DATA_FORMAT);
    }
  }
}