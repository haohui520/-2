<template>
  <div class="container-welcome">
    <img src="../../assets/welcome.jpg" alt />
  </div>
</template>

<script>
export default {
  created () {
    // 测试
    // .then是开始
    this.$http.get('http://ttapi.research.itcast.cn/mp/v1_0/articles').then(res => {
      // 响应主体
      console.log(res.data)
      // .catch是结束
    }).catch(() => {
      console.log('error')
    })
  }
}
</script>

<style scoped lang='less'>
img {
  display: block;
  margin: 0 auto;
}
</style>
