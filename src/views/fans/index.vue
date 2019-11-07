<template>
  <div class="container-fans">
    <el-card>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <!-- 列表 -->
          <div class="fans_list">
            <div class="fans_item" v-for="item in fansList" :key="item.id">
              <!-- 图片大小和头像url地址 -->
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <!-- 关注按钮 -->
              <el-button type="primary" size="small" plain>+关注</el-button>
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
        <el-tab-pane label="粉丝画像" name="pic">
          <div ref="dom" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import defaultImage from '../../assets/avatar.jpg'
import echarts from 'echarts'
export default {
  data () {
    return {
      // 默认为粉丝画像
      activeName: 'pic',
      defaultImage,
      //   定义
      fansList: [],
      //   页数参数
      reqParams: {
        page: 1,
        per_page: 21
      },
      total: 0
    }
    // 使用配置及数据
  },
  created () {
    this.getFansList()
  },
  mounted () {
    // 注意：获取dom需要在dom渲染完毕后
    const dom = this.$refs.dom
    const myEcharts = echarts.init(dom)
    // 配置及数据
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: [
          '直达',
          '营销广告',
          '搜索引擎',
          '邮件营销',
          '联盟广告',
          '视频广告',
          '百度',
          '谷歌',
          '必应',
          '其他'
        ]
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],

          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: 335, name: '直达', selected: true },
            { value: 679, name: '营销广告' },
            { value: 1548, name: '搜索引擎' }
          ]
        },
        {
          name: '访问来源',
          type: 'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                // abg: {
                //     backgroundColor: '#333',
                //     width: '100%',
                //     align: 'right',
                //     height: 22,
                //     borderRadius: [4, 4, 0, 0]
                // },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          data: [
            { value: 335, name: '直达' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1048, name: '百度' },
            { value: 251, name: '谷歌' },
            { value: 147, name: '必应' },
            { value: 102, name: '其他' }
          ]
        }
      ]
    }
    // 使用配置及数据
    myEcharts.setOption(option)
  },
  methods: {
    async getFansList () {
      // params 参数对象
      const {
        data: { data }
        // 地址路径加参数
      } = await this.$http.get('/followers', { params: this.reqParams })
      // results 文章列表
      this.fansList = data.results
      // 赋值总条数 图片总数total_count
      this.total = data.total_count
    },
    // 分页自定义一个值
    pager (newPage) {
      this.reqParams.page = newPage
      this.getFansList()
    }
  }
}
</script>

<style scoped lang='less'>
.fans_list {
  .fans_item {
    width: 150px;
    height: 190px;
    text-align: center;
    border: 1px dashed #ddd;
    padding-top: 20px;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
</style>
