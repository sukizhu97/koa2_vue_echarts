<!-- 针对 /sellpage 这个路径显示出来的 在这个组件中，通过子组件注册的方式显示seller.vue -->
<template>
  <div class="com-page">
    <seller></seller>
  </div>
</template>

<script>
import Seller from '../components/Seller.vue'
export default {
  data () {
    return {}
  },
  methods: {},
  components: {
    seller: Seller
  }
}
</script>

<style></style>
