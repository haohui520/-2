<template>
  <div class="container-article">
    <!-- 筛选添加条件布局 -->
    <el-card>
      <div slot="header">
        <!-- 面包屑导航 饿了么插件 -->
        <!-- 全局更新 -->
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <!-- small 缩小 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态">
          <!-- status文章状态 -->
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
            <!-- v-model本质： 绑定value属性  绑定了input事件 -->
            <!-- 频道组件 -->
             <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期">
          <!-- v-model 绑定的数组  [起始时间,结束时间] -->
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <!-- 组件绑定值。格式与绑定值一致，可受 value-format 控制 -->
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选之后结果布局 -->
    <el-card>
      <div slot="header" style="margin-top:20px">
        <span>根据筛选结果得到{{total}}条数据</span>
      </div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <!-- 用作用域插槽自定义渲染 -->
          <template slot-scope="scope">
            <!-- fit平铺方式  第一张封面 0-->
            <el-image :src="scope.row.cover.images[0]" fit="fill" style="width:150px;height:100px">
              <div slot="error">
                <!-- 写入加载失败图片 -->
                <img src="../../assets/error.gif" width="150px;height:100px" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <!-- status文章状态 -->
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作">
          <!-- 写入插槽 -->
          <template slot-scope="scope">
            <!-- plain circle 设置圆角和朴素淡化颜色 -->
            <el-button
              @click="toEdit(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              plain
              circle
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" plain circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 插件 -->
      <!-- 分页 -->
      <!-- total 是总条数 -->
      <!-- page-size 默认显示10条每一页 -->
      <!-- current-page 动态激活当前的页码对应的按钮 -->
      <!-- current-change 事件：当页码改变（点击页码按钮，上一页，下一页）就执行  参数当前改变后的页码-->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        :total="total"
        @current-change="abc"
      ></el-pagination>
      <!-- 动态分页切换 @current-change="pager"-->
    </el-card>
    <!-- <page-one> -->
    <!-- scope 作用域意思  作用：收集该插槽传入的所有数据 -->
    <!-- v-slot:插槽名称="所有数据变量名称" -->
    <!-- <template v-slot:content="scope">内容 {{scope.pn}}</template>
      <div slot="footer">底部</div>
    </page-one>-->
  </div>
</template>

<script>
export default {
  // 注册组件
  data () {
    return {
      // 筛选参数
      // 使用axios提交数据时候  如果数据的值为null是不会提交该字段
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        // 页数
        page: 1,
        per_page: 20
      },
      // 频道选项数据
      channelOptions: [
        { value: 1, label: '我是你爹' },
        { value: 2, label: '是你亲爹' }
      ],
      // 日期数组
      dateArr: [],
      // 文章列表数组
      articles: [],
      // 文章总条数
      total: 0
    }
  },
  created () {
    // 写方法接口
    // this.getChannelOptions()
    this.getArticles()
  },
  methods: {
    // 获取频道选项数据
    // async getChannelOptions () {
    //   // 整个列表是个data 解构里面的data 拿到接口
    //   const {
    //     data: { data }
    //   } = await this.$http.get('channels')
    //   // 赋值给下拉频道选项数据
    //   this.channelOptions = data.channels
    // },
    // 获取文章列表数据
    async getArticles () {
      // 第一种： axios.get(url?key=value&key1=vaule1&...) get传参
      // 第二种： axios.get(url, {params:参数对象})
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      // 赋值文章列表依赖数据
      // results文章列表
      this.articles = data.results
      // 赋值文章总条数依赖数据
      this.total = data.total_count
    },
    // 分页功能
    abc (newPage) {
      // 根据新的页码和当前的筛选条件 重新查询数据即可 page页数
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 选择日期触发的事件函数
    changeDate (dateArr) {
      // dateArr 的数据格式：[date,date]
      // 后端需要的是字符串格   dateArr 的数据格式：[string,string]
      // 注意：清除选择的日期后  dateArr的值 null
      if (dateArr) {
        // 日期控件，把你选择的起始与结束日期分别赋值（选择过日期之后）给
        // - begin_pubdate
        // - end_pubdate
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        // 不需要传的时候等于空
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 筛选
    search () {
      // 进行数据获取
      // 如果频道的值 '' 时候 修改为 null channel_id 频道id 为null的时候就不会传给后台
      if (this.reqParams.channel_id === '') this.reqParams.channel_id = null
      // 重新筛选回到第一页
      this.reqParams.page = 1
      // 重新拿回数据
      this.getArticles()
    },
    // 编辑事件
    toEdit (id) {
      //  query就是传参 后面Id是对象 传几个都可以
      this.$router.push({ path: '/publish', query: { id } })
    }
    // 删除组件
  }
}
</script>

<style scoped lang='less'></style>
