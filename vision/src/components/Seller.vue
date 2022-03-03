<!-- 商家销量统计横向柱状图 -->
<template>
  <div class="com-container">
    <!-- 真正显示图表div -->
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 一共多少页
      timerId: null // 定时器标识
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 在界面完成加载的时候， 主动进行屏幕的适配
    this.screenAdapter('resize', this.screenAdapter)
  },
  destroyed () {
    clearInterval(this.timerId)
    // 销毁的时候取消监听器
    window.removeEventListener()
  },
  methods: {
    // 初始化echart对象
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk') // 使用refs拿到dom元素
      // 对图表初始化的控制 拿出与数据相关的
      const initOption = {
        title: {
          text: '┃ 商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          // 放在坐标轴上该柱会有背景颜色
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0, // 定义层级 在最下面
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              // itemStyle可以控制柱状图里面的每一项
              // 颜色渐变 通过线性渐变
              // 指明颜色渐变的方向
              // 不同百分比之下颜色的值 前四个数用来表示建碧昂的方向 后面的数组表示
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  // 0%状态下的颜色值
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  // 100%
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            },
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 对图表的鼠标事件进行监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器数据
    async getData () {
      // 获取的是http://127.0.0.1:8888/api/seller 地址里面的数据
      // 但是不需要写上面这么长一段 因为我们在main.js中已经配置了基本的URL
      // const ret = await this.$http.get('seller')
      // 通过解构赋值 取ret中的data出来
      const { data: ret } = await this.$http.get('seller')
      console.log(ret)
      this.allData = ret
      // 数组排序 后方的回调函数是说明从小到大 or 从大到小
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      // 每5个元素显示一页
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1
      // 数据调用完之后调用updataChart进行图表的更新
      this.updateChart()
      this.startInterval()
    },
    // 更新数据
    updateChart () {
      const start = (this.currentPage - 1) * 5 // 0
      const end = this.currentPage * 5 // 1
      const showData = this.allData.slice(start, end) // 不包含end
      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
      var dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval () {
      // 在定时器前一般会有个保险操作 就是判断接下来用到的timerId是否存在
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1 // 从头展示
        }
        this.updateChart()
      }, 3000)
    },
    // 浏览器大小发生变化的时候，完成屏幕大额适配
    screenAdapter () {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              // itemStyle可以控制柱状图里面的每一项
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表对象的resize， 才能产生效果
      this.chartInstance.resize()
    }
  }
}
</script>

<style></style>
