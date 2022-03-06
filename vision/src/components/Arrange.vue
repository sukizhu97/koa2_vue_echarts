<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    // 这里存放数据
    return {
      allData: null,
      startValue: 0, // 区域缩放的起点值
      endValue: 9, // 区域缩放的终点值
      timerId: null
    }
  },
  // 计算属性 类似于 data 概念
  computed: {},
  methods: {
    initChart () {
      this.charInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      const initOption = {
        title: {
          text: '┃ 地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [{ type: 'bar' }]
      }
      this.charInstance.setOption(initOption)
      this.charInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.charInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData () {
      const { data: ret } = await this.$http.get('rank')
      console.log(ret)
      this.allData = ret
      // 从大到小排序
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.updateData()
      this.startInterval()
    },
    updateData () {
      // 定义颜色渐变值
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      // 所有省份形成的数组
      const proviceArr = this.allData.map((item) => {
        return item.name
      })
      // 省份对应的销售金额
      const valueArr = this.allData.map((item) => {
        return item.value
      })
      const updataOption = {
        xAxis: {
          data: proviceArr
        },
        // 平移效果的实现
        dataZoom: {
          show: false, // 出现一个区域缩放的横条
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: targetColorArr[0] },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.charInstance.setOption(updataOption)
    },
    screenAdapter () {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.charInstance.setOption(adapterOption)
      this.charInstance.resize()
    },
    // 增加定时器来改变起点与终点的值
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      // 用timerId接收是为了能够在销毁周期时停止定时器
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateData()
      }, 2000)
    }
  },
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    // 停止定时器
    clearInterval(this.timerId)
  }
}
</script>
<style lang="less" scoped></style>
