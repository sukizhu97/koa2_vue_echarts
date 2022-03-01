// 计算响应时间的中间件
module.exports = async (ctx,next)=>{
  // 记录开始的时间 
  const start = Date.now()
  // 让内层中间件得到执行 
  await next()
  // 最后记录结束的时间
  const end = Date.now()
  // 设置响应头
  const duration = end - start
  // ctx.set设置响应头
  ctx.set('X-Response-Time',duration+'ms')
}