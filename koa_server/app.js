// 入口: 
// 1. 创建koa的实例对象
const Koa = require('koa')
const app = new Koa()
// 2. 绑定中间件
  // 第一层
    // 导入中间件
  const respDurationMiddleware = require('./middleware/koa_response_duration')
  app.use(respDurationMiddleware)
  // 第二层
  const respHeaderMiddleware = require('./middleware/koa_response_header')
  app.use(respHeaderMiddleware)
  // 第三层
  const respDataMiddleware = require('./middleware/koa_response_data')
  app.use(respDataMiddleware)
// 3. 绑定端口号
app.listen('8888')

const webSocketService = require('./service/web_socket_service')
// 开启服务端的监听 监听客户端的连接
// 当某个客户端连接成功后，就会对这个客户端进行message事件的监听 
webSocketService.listen()
