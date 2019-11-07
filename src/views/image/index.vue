<template>
  <div class="container-image">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮盒子 -->
      <div class="btn_1">
        <!-- 按钮单选框 label就是值 绑定单选框的值改变事件-->
        <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
          <!-- radio组件 -->
          <!-- label加了冒号是布尔类型  不加是字符串 -->
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 添加素材按钮 -->
        <!-- 添加点击事件 -->
        <el-button @click="open" type="success" size="small" style="float:right">添加素材</el-button>
        <!-- 素材列表布局 -->
        <div class="img_list">
          <!-- 遍历素材列表 id url接口 -->
          <div class="img_item" v-for="item in images" :key="item.id">
            <img :src="item.url" alt />
            <!-- 加上一个v-if ! 隐藏底部操作栏 是否收藏了图片取反  -->
            <div class="footer" v-if="!reqParams.collect">
              <!-- is_collected api里是否收藏 -->
              <!-- 绑定收藏点击事件item包含id和状态 -->
              <span
                @click="toggleStatus(item)"
                class="el-icon-star-off"
                :class="{red:item.is_collected}"
              ></span>
              <!-- 绑定删除 -->
              <!-- 只需要一个id 不需要其他的 -->
              <span @click="deleteImage(item.id)" class="el-icon-delete"></span>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="reqParams.per_page"
          :current-page="reqParams.page"
          @current-change="pager"
        ></el-pagination>
        <!-- page-size 每页显示条数个数 -->
        <!-- current-page 当前页数 -->
        <!-- current-change 事件：当页码改变（点击页码按钮，上一页，下一页）就执行  参数当前改变后的页码-->
      </div>
    </el-card>
    <!-- 弹出对话框 插入饿了么上传组件 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        name="image"
        :on-success="handleSuccess"
        :show-file-list="false"
      >
        <!-- 设置请求头 上传字段名后端参数 文件上传之后成功的钩子:带自定义函数 -->
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
// 引入less文件
// 样式在里写：当前组件下生效（在模版中能看到的标签就是当前组件）
// 使用其他组件：组件内部是存在标签
// 引入用户信息
import locol from '@/utils/local'
export default {
  data () {
    return {
      reqParams: {
        // collect是否收藏图片 false全部 trun收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      // 依赖数据素材列表
      images: [],
      // 总条数为0
      total: 0,
      // 对话框控制显示隐藏
      dialogVisible: false,
      // 上传成功后的图片地址
      imageUrl: null,
      // 在头部里面加上token 用户信息
      headers: {
        Authorization: `Bearer ${locol.getUser().token}`
      }
    }
  },
  created () {
    // 写入一个接口数据
    this.getImages()
  },
  methods: {
    // 上传图片成功
    handleSuccess (res) {
      // res就是响应体 后端获取图片地址data,url
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // 关闭对话框
        this.dialogVisible = false
        //  更新列表
        this.getImages()
      }, 2000)
    },
    // 写入一个open方法 打开的回调打开对话框的时候图片重置为null
    // 获取列表数据
    open () {
      // 打开对话框
      this.dialogVisible = true
      // 重置图片
      this.imageUrl = null
    },
    async getImages () {
      // params 参数对象
      const {
        data: { data }
        // 地址路径加参数
      } = await this.$http('/user/images', { params: this.reqParams })
      // results 文章列表
      this.images = data.results
      // 赋值总条数 图片总数total_count
      this.total = data.total_count
    },
    // 分页 自定义一个值
    pager (abc) {
      this.reqParams.page = abc
      this.getImages()
    },
    // 切换列表事件- 把当前页面改为 1  重新发请求即可
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 添加收藏与取消收藏
    async toggleStatus (item) {
      // 修改请求
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        // 后面带个传参当前状态取反交给后台
        collect: !item.is_collected
      })
      // 成功后  修改样式
      item.is_collected = data.collect
      // 提示一下
      this.$message.success((data.collect ? '添加收藏' : '取消收藏') + '成功')
    },
    // 删除功能 api只有一个id参数 所以写入id即可
    async deleteImage (id) {
      // 引入饿了么组件
      this.$confirm('此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // 增加一个感叹号图标
        type: 'warning'
      })
        .then(async () => {
          // 点击了确认
          await this.$http.delete(`user/images/${id}`)
          this.$message.success('删除成功')
          // 更新列表
          this.getImages()
        })
        .catch(() => {
          // 点击了取消
        })
    }
  }
}
</script>

<style scoped lang='less'>
// 样式
.img_list {
  padding-top: 20px;
  .img_item {
    width: 180px;
    height: 180px;
    position: relative;
    border: 1px #ddd dashed;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 30px;
    width: 100%;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
    span {
      margin: 0 20px;
      &.red {
        color: red;
      }
    }
  }
}
</style>
