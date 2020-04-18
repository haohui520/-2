<template>
  <el-container class="container">
    <!-- 当导航为trun时展开 不是则收起 -->
    <el-aside :width="isOpen?'200px':'64px'">
      <!-- logo 收起时触发smalla-->
      <div class="logo" :class="{smallLogo:!isOpen}"></div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="!isOpen"
        :collapse-transition="false"
        style="border-right:none"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 图标 -->
        <span class="el-icon-s-fold icon" @click="toggleMenu"></span>
        <!-- 文字 -->
        <span class="text">江苏传智播客科技教育有限公司</span>
        <!-- 下拉菜单组件 -->
        <el-dropdown class="dropdown">
          <span class="el-dropdown-link">
            <!--头像和名字 渲染 -->
            <img class="headIcon" :src="userInfo.photo" alt />
            <span class="userName">{{userInfo.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- 绑定点击事件 事件修饰符：prevent once stop  native意思是把事件绑定在原生dom上-->
            <el-dropdown-item icon="el-icon-setting" @click.native="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" @click.native="unlock">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 二级路由容器 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 传入模板
import local from '@/utils/local'
import eventBus from '@/eventBus'
export default {
  data () {
    return {
      isOpen: true,
      // 声明数据 如果是响应式数据 应该先声明
      userInfo: {
        name: '',
        photo: ''
      }
    }
  },
  created () {
    const user = local.getUser() || {}
    //  获取用户信息
    // 获取名字
    this.userInfo.name = user.name
    // 获取照片
    this.userInfo.photo = user.photo
    // 绑定事件  接收修改的name数据
    // 绑定事件  接收修改的name数据
    eventBus.$on('updateName', (name) => {
      this.userInfo.name = name
    })
    // 绑定事件  接收修改的photo数据
    eventBus.$on('updatePhoto', (photo) => {
      this.userInfo.photo = photo
    })
  },
  methods: {
    toggleMenu () {
      // 切换左菜单 展开与收起
      this.isOpen = !this.isOpen
    },
    // 事件根本没有触发  click事件
    // 给组件绑定事件，如果组件不支持，事件不会触发。
    // 把事件绑定在 组件解析后的原生dom上
    setting () {
      this.$router.push('/setting')
    },
    unlock () {
      local.delUser()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/logo_admin.png) no-repeat center /
        140px auto;
    }
    .smallLogo {
      background-image: url(../../assets/logo_admin_01.png);
      background-size: 36px auto;
    }
  }
  .el-header {
    line-height: 60px;
    border-bottom: 1px solid #ddd;
    .icon {
      font-size: 30px;
      // 垂直居中
      vertical-align: middle;
    }
    .text {
      margin-left: 10px;
      vertical-align: middle;
    }
    .dropdown {
      float: right;
      .headIcon {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .userName {
        // 加粗
        font-weight: bold;
        vertical-align: middle;
        margin-left: 5px;
      }
    }
  }
}
</style>
