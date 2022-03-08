// 创建一个默认的类
export default class SocketService {
  // 1. 定义为单例设计模式
  static instance = null
  // 只要通过Instance得到实例对象 一定是同一个实例对象
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 和服务端链接的socket对象
  ws = null

  callBackMapping = {}

  connnected = false
  // 记录重试的次数
  sendRetryCount = 0
  // 记录重新连接的实验次数
  coonectRetryCount = 0

  // 2. 定义连接服务器的方法
  connect () {
    // 连接服务器
    if (!window.WebSocket) {
      console.log('您的浏览器不支持websocket代码')
    }
    this.ws = new WebSocket('ws://localhost:9998') // 与服务器的连接对象

    // 连接成功
    this.ws.onopen = () => {
      this.connnected = true
      console.log('连接服务端成功')
      this.coonectRetryCount = 0
    }
    // 连接失败
    this.ws.onclose = () => {
      this.coonectRetryCount++
      // 1. 服务器连接失败
      this.connnected = false
      console.log('连接服务器失败')
      // 2. 服务器连接成功之后，服务器关闭的情况
      // 进行重新连接的展示
      setTimeout(() => {
        this.connect()
      }, 500 * this.coonectRetryCount)
    }
    // 得到服务端过来的数据
    this.ws.onmessage = (msg) => {
      console.log('从服务端获取的数据')
      // console.log(msg.data)
      const recvData = JSON.parse(msg.data)
      // 得到回调函数的标识
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          // 会有data字段
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
        } else if (action === 'themeChange') {
        }
      }
    }
  }

  // 回调函数的注册
  registerCallBack (socketType, callBack) {
    // console.log(socketType)
    this.callBackMapping[socketType] = callBack
    console.log(this.callBackMapping[socketType])
  }

  // 取消某一个回调函数
  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  send (data) {
    if (this.connnected) {
      this.sendRetryCount = 0
      // 通过stringify变成字符串
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, 500 * this.sendRetryCount)
    }
  }
}
