// 处理业务逻辑的中间件，读取某个json文件的数据 
const path = require('path')
const fileUtils = require('../utils/file_utils')
module.exports = async(ctx, next)=>{
  // 获取url
  const url = ctx.request.url // api/seller -> ../data/seller.json
  let filePath = url.replace('/api','') 
  filePath = '../data' + filePath + '.json'
  // 获得绝对路径
  filePath = path.join(__dirname,filePath)
  try {
    const ret = await fileUtils.getFileJsonData(filePath)
    ctx.response.body = ret
  }catch(error){
    const errorMsg = {
      message: '读取文件失败',
      status: 404
    }
    ctx.response.body = JSON.stringify(errorMsg)
  }

  await next()
}

