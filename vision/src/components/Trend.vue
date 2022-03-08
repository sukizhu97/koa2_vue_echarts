<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '┃' + showTitle }}</span>
      <span
        class="iconfont title-icon"
        @click="showChoice = !showChoice"
        :style="comStyle"
        >&#xe6eb;</span
      >
      <div class="select-con" v-show="showChoice">
        <div
          class="select-item"
          v-for="item in selectType"
          :key="item.key"
          @click="handleSeclet(item.key)"
          :style="marginStyle"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      showChoice: false, // 是否显示可选项
      choiceType: 'map',
      titleFontSize: 0 // 标题的字体大小
    }
  },
  created () {
    // 组件创建完成之后  注册组件的回调函数
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted () {
    this.initChart()
    // 发送数据给服务器
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend', // 读取后端哪个json文件
      value: ''
    })
    window.addEventListener('resize', this.screenApapter)
    // 第一次调用的时候主动触发
    this.screenApapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenApapter)
    // 组件销毁的时候回调函数的取消
    this.$socket.unregisterCallBack('trendData')
  },
  computed: {
    selectType () {
      // 呈现什么类型表格
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType
        })
      }
    },
    // 呈现什么样的标题
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 设置给标题的样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle () {
      return { marginLeft: this.titleFontSize + 'px' }
    }
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          // 坐标位置
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true // 坐标轴文字在范围中
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData (ret) {
      // ret是服务端发给客户端的图表数据
      // const { data: ret } = await this.$http.get('trend')
      this.allData = ret
      console.log(ret)
      this.updateChart()
    },
    updateChart () {
      // 半透明颜色值
      const colorArr1 = [
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(254,33,30,0.5)',
        'rgba(250,105,0,0.5)'
      ]
      // 全透明颜色值
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)'
      ]
      // 处理数据
      const timeArr = this.allData.common.month // x轴
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name, // 设置图例的步骤2
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            // 设置区域面积并使其渐变是从上至下的
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                // 0%颜色值
                offset: 0,
                color: colorArr1[index]
              },
              {
                // 100%颜色值
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 图例的数据
      const legendArr = valueArr.map((item) => {
        return item.name // 上海北京深圳等等 设置图例的步骤1
      })
      const dataOption = {
        xAxis: {
          // 类型在initChart中控制
          data: timeArr
        },
        legend: {
          data: legendArr // 设置图例的步骤3
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenApapter () {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6
      console.log(this.titleFontSize)
      const adapterOpter = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOpter)
      this.chartInstance.resize()
    },
    handleSeclet (currentType) {
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = false
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  /* 层级的标识 */
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    // 鼠标箭头的更改
    cursor: pointer;
  }
  .select-item {
    cursor: pointer;
  }
  .select-con {
    background-color: #222733;
  }
}
</style>
