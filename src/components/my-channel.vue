<template>
  <el-select :value="value" @change="fn" placeholder="请选择" clearable>
    <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  // 在封装组件的时候，使用props选项获取父组件数据
  // 和data中的数据使用方式是一样的，数据是单向的（仅读）
  props: ['value'],
  data () {
    return {
      channelOptions: []
    }
  },
  created () {
    //   写方法接口
    this.getChannelOptions()
  },
  methods: {
    //   值改变函数
    fn (channelsID) {
      // 把数据提交到父组件
      if (channelsID === '') channelsID = null
      // 如果是原生事件  $event是事件对象
      // 如果是自定义事件  $event是触发事件的时候提交数据
      //   触发：在封装子组件的时候，使用$emit('自定义事件名称'，子组件数据)
      this.$emit('input', channelsID)
    },
    // 获取频道选项数据
    async getChannelOptions () {
      // 整个列表是个data 解构里面的data 拿到接口
      const {
        data: { data }
      } = await this.$http.get('channels')
      // 赋值给下拉频道选项数据
      this.channelOptions = data.channels
    }
  }
}
</script>

<style scoped lang='less'></style>
