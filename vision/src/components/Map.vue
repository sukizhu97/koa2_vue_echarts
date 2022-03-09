<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref" @dblclick="revertMap"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { getProvinceMapInfo } from '../utils/map_utils'
export default {
  data () {
    // 这里存放数据
    return {
      chartInstance: null,
      allData: null,
      mapData: {} // 获取省份信息的缓存
    }
  },
  created () {
    // 组件创建完成之后  注册组件的回调函数
    this.$socket.registerCallBack('mapData', this.getData)
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
      this.updateData()
    }
  },
  // 方法集合
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      // 获取中国地图的矢量数据 现在的数据并不是位于后台 所以不能使用this.$http
      // 直接使用axios
      const ret = await axios.get('http://localhost:8080/static/map/china.json')
      console.log(ret)
      // 地图适量数据进行注册
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        geo: {
          type: 'map',
          map: 'china',
          // 位置的配置
          top: '5%',
          bottom: '5%',
          // 省份颜色
          itemStyle: {
            areaColor: '#2E72BF',
            // 省份间隔
            borderColor: '#333'
          }
        },
        title: {
          text: '┃ 商家分布',
          left: 20,
          top: 20
        },
        legend: {
          left: '5%',
          bottom: '5%',
          // 图例方向 设为竖着
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async (arg) => {
        //  return arg.name // 得到所点击的省份 是中文 在后端是拼音
        const provienceInfo = getProvinceMapInfo(arg.name)
        if (!this.mapData[provienceInfo.key]) {
          const ret = await axios.get(
            'http://localhost:8080' + provienceInfo.path
          )
          this.allData = ret
          console.log(ret)
          // 接下来注册地图
          this.$echarts.registerMap(provienceInfo.key, ret.data)
        }
        // 切换对象
        const changeOption = {
          geo: {
            map: provienceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    getData (ret) {
      this.allData = ret
      console.log(ret)
      this.updateData()
    },
    updateData () {
      const legendArr = this.allData.map((item) => {
        return item.name
      })
      const seriesArr = this.allData.map((item) => {
        // 如果在地图中显示散点的数据 所以需要给散点的图表增加一个配置，叫做coordinateSystem
        return {
          // return 代表一个类别下的所有散点数据
          type: 'effectScatter',
          rippleEffect: {
            // 设置涟漪
            scale: 5,
            brushType: 'stroke' // 动画效果呈现为空心状态
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo' // 散点使用地图坐标系统
        }
      })
      const dataOption = {
        series: seriesArr,
        // 图例数据
        legend: {
          data: legendArr
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    revertMap () {
      // 回到中国地图
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    },
    screenAdapter () {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6
      const adaptOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          },
          // 之间间隔
          itemGaP: titleFontSize / 2
        }
      }
      this.chartInstance.setOption(adaptOption)
      this.chartInstance.resize() // 这里可以自动的帮助图表进行缩小和放大
    }
  },
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted () {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map', // 读取后端哪个json文件
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter() // 第一次显示的时候主动调用函数 使其能适配屏幕
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  } // 生命周期 - 销毁完成
}
</script>
<style scoped></style>
