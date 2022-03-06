import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/SellerPage'
import TrendPage from '@/views/TrendPage'
import MapPage from '@/views/MapPage'
import ArrangePage from '@/views/ArrangePage'
import HotPage from '@/views/HotPage'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/sellerpage' },
  { path: '/sellerpage', component: SellerPage },
  { path: '/trendpage', component: TrendPage },
  { path: '/mappage', component: MapPage },
  { path: '/arrangepage', component: ArrangePage },
  { path: '/hotpage', component: HotPage }
]

const router = new VueRouter({
  routes
})

export default router
