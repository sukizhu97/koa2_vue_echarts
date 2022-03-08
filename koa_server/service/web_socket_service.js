// 引入path模块
const path = require('path')
// 导入读取数据的模块 我们之前写过
const fileUtils = require('../utils/file_utils')
const WebSocket = require('ws')
// 创建websocket服务端的对象 端口号是9998
const wss = new WebSocket.Server({port: 9998})

// 服务端开启了监听 
module.exports.listen = ()=>{
  // 客户端的连接事件进行监听 client代表客户端的连接socket对象
  wss.on('connection', client=>{
    console.log('有客户端连接成功了');
    // 对客户端的链接对象进行message事件的监听 msg是客户端发给服务端的数据
    client.on('message',async msg=>{
      console.log('客户端发送数据给服务端了' + msg);
      // 让字符串转化为json类型
      let payload = JSON.parse(msg)
      console.log(payload);
      const aciton = payload.action
      if( aciton === 'getData'){
        let filePath = '../data/' + payload.chartName + '.json'
        filePath = path.join(__dirname,filePath)
        const ret = await fileUtils.getFileJsonData(filePath)
        payload.data = ret // 服务端获取的数据之上增加data字段
        client.send(JSON.stringify(payload))
      }else{
        // 原封不动的转发数据转发给处于连接状态的客户端状态
        // wss.clients  表示所有客户端的连接
        wss.clients.forEach(client=>{
          client.send(msg)
        })
      }
      // client.send('hello Socket from backend')
    })
  })
}
