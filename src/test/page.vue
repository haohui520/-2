<template>
  <div class="container-page">
    <!-- 头 -->
    <p>header</p>
    <!-- 内容 -->
    <div>
      <!-- 留一个坑 -->
      <slot name="content" :pn="pageName" test="测试">备用内容</slot>
    </div>
    <!-- 底 -->
    <p>
      <!-- 留一个坑 -->
      <slot name="footer">footer</slot>
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageName: '内部数据组件'
    }
  }
}
</script>

<style scoped lang='less'></style>
