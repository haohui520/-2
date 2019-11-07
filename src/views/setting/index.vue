<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <!-- 进行插值板修改内容 -->
            <el-form-item label="编号：">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机：">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：">
              <el-input v-model="userInfo.intro" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <!-- 先绑定一个事件 -->
              <el-button type="primary" @click="saveInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传 -->
          <!-- <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
          <!-- 上传 -->
          <!-- 使用属性 http-request  指定函数，在函数内自行上传 -->
          <el-upload
            class="avatar-uploader"
            action
            :http-request="uploadPhoto"
            :show-file-list="false"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/eventBus'
import local from '@/utils/local'
export default {
  data () {
    return {
      // 如果是响应式数据 应当先声明
      userInfo: {
        name: '',
        intro: '',
        email: ''
      },
      imageUrl: null
    }
  },
  //   首先 先拿到用户信息
  created () {
    this.getUserinfo()
  },
  methods: {
    //   声明一个方法 获取用户信息
    async getUserinfo () {
      const {
        data: { data }
      } = await this.$http.get('user/profile')
      this.userInfo = data
    },
    // 保存用户信息(去除头像不能)
    async saveInfo () {
      const { name, intro, email } = this.userInfo
      await this.$http.patch('user/profile', {
        name,
        intro,
        email
      })
      //   提示一下
      this.$message.success('保存成功')
      //   改home组件
      eventBus.$emit('updateName', name)
      //   改本地存储 拿出来,修改,放回去
      const user = local.getUser()
      user.name = name
      local.setUser(user)
    },
    // 修改用户头像
    async uploadPhoto ({ file }) {
      const formdata = new FormData()
      //   photo 头像url地址
      formdata.append('photo', file)
      const {
        data: { data }
      } = await this.$http.patch('user/photo', formdata)
      //   提示
      this.$message.success('修改头像成功')
      //   预览
      this.userInfo.photo = data.photo
      //   修改home组件
      eventBus.$emit('updatePhoto', name)
      //   修改本地储存
      const user = local.getUser()
      user.photo = data.photo
      local.setUser(user)
    }
  }
}
</script>

<style scoped lang='less'></style>
