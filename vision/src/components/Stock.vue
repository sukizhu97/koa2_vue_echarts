<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref">aaa</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {},
  data () {
    // 这里存放数据
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0, // 当前显示的页数
      timerId: null
    }
  },
  created () {
    // 组件创建完成之后  注册组件的回调函数
    this.$socket.registerCallBack('stockData', this.getData)
  },
  // 计算属性 类似于 data 概念
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      console.log('主题切换了')
      this.chartInstance.dispose() // 销毁当前图表
      this.initChart() // 重新以最新的主题名称初始化
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart()
    }
  },

  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: '┃ 库存与销量分析',
          left: 20,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    getData (ret) {
      // const { data: ret } = await this.$http.get('stock')
      this.allData = ret
      console.log(ret)
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          center: centerArr[index],
          data: [
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                // 渐变
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: colorArr[index][0] },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ],
          hoverAnimation: false, // 关闭鼠标移入饼图时的效果
          labelLine: {
            show: false // 隐藏指示线
          },
          label: {
            position: 'center',
            color: colorArr[index][0]
          }
        }
      })
      const updataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(updataOption)
    },
    screenAdapter () {
      const titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6
      const innerRadius = titleFontSize * 2.5
      const outterRadius = titleFontSize * 1.125
      const adapterOpter = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              fontSize: titleFontSize / 2
            },
            radius: [outterRadius, innerRadius]
          },
          {
            type: 'pie',
            label: {
              fontSize: titleFontSize / 2
            },
            radius: [outterRadius, innerRadius]
          },
          {
            type: 'pie',
            label: {
              fontSize: titleFontSize / 2
            },
            radius: [outterRadius, innerRadius]
          },
          {
            type: 'pie',
            label: {
              fontSize: titleFontSize / 2
            },
            radius: [outterRadius, innerRadius]
          },
          {
            type: 'pie',
            label: {
              fontSize: titleFontSize / 2
            },
            radius: [outterRadius, innerRadius]
          }
        ]
      }
      this.chartInstance.setOption(adapterOpter)
      this.chartInstance.resize()
    },
    startInterval () {
      this.timerId = setInterval(() => {
        if (this.timerId) {
          clearInterval(this.timerId)
        }
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart() // 更改完之后需要更新界面的显示
      }, 5000)
    }
  },
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted () {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock', // 读取后端哪个json文件
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('stockData')
    clearInterval(this.timerId)
  } // 生命周期 - 销毁完成
}
</script>
<style lang="less" scoped></style>
