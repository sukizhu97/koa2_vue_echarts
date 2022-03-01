// 入口
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
app.listen('8400')