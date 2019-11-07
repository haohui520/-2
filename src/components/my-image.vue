<template>
  <div class="my-image">
    <!-- 绑定按钮 -->
    <div class="btn_box" @click="open">
      <!-- 插入图片 -->
      <img :src="value||btnImage" alt />
    </div>
    <!-- 插入对话框组件 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <!-- 插入标签页组件 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <!-- 按钮 -->
          <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 列表 -->
          <div class="img_list">
            <!-- url   将来需要使用它 预览封面图。 -->
            <div
              class="img_item"
              v-for="item in images"
              :key="item.id"
              @click="selectedImage(item.url)"
              :class="{selected: selectedImageUrl === item.url}"
            >
              <!-- 当图片地址一样的时候就选中 -->
              <img :src="item.url" />
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
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
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
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- 绑定事件 -->
        <el-button type="primary" @click="confirmImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 注意：携带token
import local from '@/utils/local'
import defaultImage from '../assets/default.png'
export default {
  data () {
    return {
      // 关闭对话框
      dialogVisible: false,
      //   激活选项卡的name值
      activeName: 'image',
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
      // 记录选中的图片地址
      selectedImageUrl: null,
      //   上传的图片地址
      uploadImageUrl: null,
      imageUrl: null,
      // 请求头 注意：携带token
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      btnImage: defaultImage
    }
  },
  // 接受封装图地址
  props: ['value'],
  methods: {
    // 判断当激活的选项卡（activeName）是谁？
    // 确认图片
    confirmImage () {
      if (this.activeName === 'image') {
        // 素材库 如果是素材就用sele作为封面
        if (!this.selectedImageUrl) {
          // warning 警告提醒
          return this.$message.success.warning('请选择一张图片')
        }
        // this.btnImage = this.selectedImageUrl
        // 提交父组件
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else {
        if (!this.uploadImageUrl) {
          // 如果是上传图片就用uplo作为封面
          return this.$message.success.warning('请选择一张上传图片')
        }
        // this.btnImage = this.uploadImageUrl
        this.$emit('input', this.uploadImageUrl)
        this.dialogVisible = false
      }
    },
    open () {
      // 打开对话框
      this.dialogVisible = true
      //   重新加载列表
      this.getImages()
    },
    // 选中图片方法
    selectedImage (url) {
      // 思路 :class={selected:条件}
      // 条件 记录上去点击图片的唯一标识 然后 去比对每次遍历的图片的唯一标识
      // 如果一致  选中  不一致  不选中
      // 此时图片地址做为唯一标识  将来提交的数据是地址不是ID
      this.selectedImageUrl = url
    },
    // 上传成功
    handleSuccess (res) {
      // 预览
      this.uploadImageUrl = res.data.url
      this.$message.success('上传成功')
    },
    // 分页自定义一个值
    pager (abc) {
      this.reqParams.page = abc
      this.getImages()
    },
    // 切换列表事件- 把当前页面改为 1  重新发请求即可
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
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
    }
  }
}
</script>

<style scoped lang='less'>
.my-image {
  display: inline-block;
  margin-right: 20px;
}
.btn_box {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  text-align: center;
  width: 100%;
  display: block;
}
.img_item {
  width: 150px;
  height: 120px;
  position: relative;
  border: 1px dashed #ddd;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
  img {
    width: 100%;
    height: 100%;
  }
  &.selected::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat center /
      50px 50px;
  }
}
</style>
