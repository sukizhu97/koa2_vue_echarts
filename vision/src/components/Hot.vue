<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left">&#xe6ef;</span>
    <span class="iconfont arr-right">&#xe6ed;</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0 // 当前展示的一级数据
    }
  },
  computed: {},
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref)
      const initOption = {
        series: [
          {
            type: 'pie'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const { data: ret } = await this.$http.get('hotproduct')
      this.allData = ret
      console.log(this.allData)
      this.updataData()
    },
    updataData () {
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
            value: item.value
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
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
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
  } // 生命周期 - 销毁完成
}
</script>
<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
