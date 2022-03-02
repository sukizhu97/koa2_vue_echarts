<!-- 针对 /sellpage 这个路径显示出来的 在这个组件中，通过子组件注册的方式显示seller.vue -->
<template>
  <div>
    <p>sellerpage</p>
    <Seller></Seller>
  </div>
</template>

<script>
import Seller from '../components/Seller.vue'
export default {
  data (){
    return {}
  },
  methods: {},
  components: {
    Seller
  }
}
</script>

<style>
</style>
