<template>
  <div class="container-pubish">
    <el-card>
      <div slot="header">
        <!-- 判断一下通过id是修改否则就是发布  -->
        <my-bread>{{$route.query.id?'修改':'发布'}}文章</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="120px" :model="articleForm">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <!-- @change一个方法 重置一下数据 -->
          <el-radio-group v-model="articleForm.cover.type" @change="articleForm.cover.images=[]">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封面图组件 双向绑定 -->
          <div v-if="articleForm.cover.type === 1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div v-if="articleForm.cover.type === 3">
            <!-- 遍历三次 -->
            <my-image v-for="i in 3" :key="i" v-model="articleForm.cover.images[i-1]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="$route.query.id">
          <!-- 是否存为草稿（true 为草稿）没有值的时候显示 -->
          <el-button type="success" @click="update(false)">修改</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <!-- 是否存为草稿（true 为草稿） 有只的时候显示-->
          <el-button type="primary" @click="create(false)">发表</el-button>
          <el-button @click="create(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 富文本
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      // 声明一个数据
      articleForm: {
        //   文章标题
        title: null,
        content: null,
        // 封面参数
        cover: {
          type: 1,
          images: []
        },
        // 文章所属频道id
        channel_id: null
      },
      // 富文本配置对象 在富文本功能文档里面找需要的需求
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  created () {
    // 判断当前是否是编辑
    const articlesID = this.$route.query.id
    if (articlesID) {
      // 获取当前文章信息
      this.getAbc(articlesID)
    }
  },
  methods: {
    // 获取文章信息
    async getAbc (id) {
      // 路径传参 + id
      const {
        data: { data }
      } = await this.$http.get('articles/' + id)
      // 表单填充  面包屑文字   按钮文字
      this.articleForm = data
    },
    // 后端参数
    async create (draft) {
      // 发表 存入草稿
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      // 提示
      this.$message.success(draft ? '存入草稿成功' : '上传成功')
      // 去内容管理
      this.$router.push('/article')
    },
    // 修改
    async update (draft) {
      // 修改 存入草稿  加入文章id
      await this.$http.put(
        `articles/${this.articleForm.id}?draft=${draft}`,
        this.articleForm
      )
      // 提示
      this.$message.success(draft ? '存入草稿成功' : '修改成功')
      // 去内容管理
      this.$router.push('/article')
    }
  }
}
</script>

<style scoped lang='less'></style>
