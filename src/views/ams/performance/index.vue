<template>
    <div>
            <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="用户名">
            <el-input
              v-model="listQuery.username"
              class="input-width"
              placeholder="用户名或昵称"
              @keyup.native.enter="handleResetSearch()"
              @blur="getList"
            ></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <el-input
              v-model="listQuery.email"
              class="input-width"
              placeholder="时间"
              @keyup.native.enter="handleResetSearch()"
              @blur="getList"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>KPI考核打分</span>
      <el-button size="mini"  @click="beginGrade()">进入考核</el-button>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>


    <el-card>
      <div slot="header" class="clearfix">
        <span>个人绩效</span>
        <el-form>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              :label="title.a">
            </el-table-column>
            <el-table-column
              prop="name"
              :label="title.j">
            </el-table-column>
            <el-table-column
              prop="name"
              :label="title.k">
            </el-table-column>
            <el-table-column
              prop="name"
              :label="title.l">
            </el-table-column>
            <el-table-column
              prop="name"
              :label="title.z">
            </el-table-column>
            <el-table-column
              prop="name"
              :label="title.b"
              width="140px">
                <el-button size="mini" type="text" @click="handleAdd()">添加</el-button>
                <el-button size="mini" type="text" @click="handleEdit()">修改</el-button>
                <el-button size="mini" type="text" @click="handleEdit()">详情</el-button>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </el-card>

    </div>
</template>

<script>
export default {
    data() {
        return {

           listQuery:'',
           tableData: [{
          date: '2016-05月份',
          name: '1分',
          s: '尊重他人，随时随地维护聚知公司形象',
          d: '微笑面对投诉和受到的委屈，积极主动地在工作中为客户解决问题',
          f: '与客户交流过程中，即使不是自己的责任，也不推诿',
          g: '站在客户的立场思考问题，在坚持原则的基础上，最终达到客户和公司都满意',
          h: '具有超前服务意识，未雨绸缪，超出客户的期望',
          
        }],
        title:{
          a: '价值观',
          j:"过程",
          k:"结果",
          l:"考勤",
          z:"合计"
        },

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {  

       getDate(){

           this.listQuery = {}

        },
        handleSearchList(){},
        handleResetSearch(){},
        beginGrade(){
            this.$router.push('grade')
        }
    }
}
</script>

<style scoped lang="scss">

</style>
