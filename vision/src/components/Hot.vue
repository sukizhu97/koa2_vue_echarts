<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle"
      >&#xe6ef;</span
    >
    <span class="iconfont arr-right" @click="toRight" :style="comStyle"
      >&#xe6ed;</span
    >
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0 // 当前展示的一级数据
      // titleFontSize: 0
    }
  },
  created () {
    // 组件创建完成之后  注册组件的回调函数
    this.$socket.registerCallBack('hotData', this.getData)
  },
  computed: {
    catName () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle () {
      return {
        // fontSize: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      const initOption = {
        title: {
          text: '┃ 热销商品占比',
          left: 20,
          top: 20
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ],
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach((item) => {
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach((item) => {
              retStr += `${item.name}: ${
                parseInt((item.value / total) * 100) + '%  '
              }`
            })
            return retStr
          }
        }
      }
      this.chartInstance.setOption(initOption)
    },
    getData (ret) {
      this.allData = ret
      console.log(this.allData)
      this.updateData()
    },
    updateData () {
      // 图例数据
      const legnedData = this.allData[this.currentIndex].children.map(
        (item) => {
          return item.name
        }
      )
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children
          }
        }
      )
      const dataOption = {
        series: [
          {
            data: seriesData
          }
        ],
        legend: {
          data: legnedData
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize,
          itemHeight: titleFontSize,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSzie: titleFontSize / 2
          }
        },
        series: [
          {
            radius: titleFontSize * 6.5,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
    },
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateData()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateData()
    }
  },
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted () {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hotproduct', // 读取后端哪个json文件
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('hotData')
  } // 生命周期 - 销毁完成
}
</script>
<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20%;
  color: white;
}
</style>
