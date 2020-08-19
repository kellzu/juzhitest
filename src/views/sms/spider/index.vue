<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="url">
            <el-input v-model="listQuery.name" class="input-width" placeholder="要搜索的链接" v-on:blur.enter="getList()"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="listQuery.resultCode" placeholder="全部" clearable class="input-width" @change.enter="getList()">
              <el-option v-for="(v, k) in resultCodeMap"
                         :key="k"
                         :label="v"
                         :value="k">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="homeSpiderLogTable"
                :data="list"
                style="width: 100%;"
                :stripe="true"
                v-loading="listLoading" 
                border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="平台">
                <span>{{ props.row.type }}</span>
              </el-form-item>
              <el-form-item label="链接" style="width: 100%;">
                <span>
                  <a :href="props.row.url" target="_blank">{{ props.row.url}}</a>
                </span>
              </el-form-item>
              <el-form-item label="结果">
                <span>{{ resultCodeMap[props.row.resultCode] }}</span>
              </el-form-item>
              <el-form-item label="错误消息">
                <span>{{ props.row.errorMsg }}</span>
              </el-form-item>
              <el-form-item label="http状态码">
                <span>{{ props.row.code }}</span>
              </el-form-item>
              <el-form-item label="耗时">
                <span>{{ props.row.elapsedTime }}ms</span>
              </el-form-item>
              <el-form-item label="创建人">
                <span>{{ props.row.createUser.username }}({{ props.row.createUser.note }})</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.gmtCreate | gmtCreateTimeFormat}}</span>
              </el-form-item>
              <el-form-item label="修改时间">
                <span>{{ props.row.gmtModify | gmtCreateTimeFormat}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="ID" width="40" align="center" prop="id"/>
        <el-table-column label="平台" width="80" align="center" prop="type"/>
        <el-table-column label="链接" width="240" align="center" prop="url">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
          </template>
        </el-table-column>
        <el-table-column label="结果" align="center" width="150" >
          <template slot-scope="scope">
            {{resultCodeMap[scope.row.resultCode]}}
          </template>
        </el-table-column>
        <el-table-column label="错误消息" align="center" width="120" prop="errorMsg" />
        <el-table-column label="耗时" align="center" width="120" prop="elapsedTime">
          <template slot-scope="scope">
            {{scope.row.elapsedTime}}ms
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" width="120" prop="createUserId" >
          <template slot-scope="scope">
            <span>{{ scope.row.createUser.username }}({{ scope.row.createUser.note }})</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.gmtCreate | gmtCreateTimeFormat}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date'
  import {STATUS_MAP, STATUS_MAP_QUERY} from '@/utils/status'
  import {LEVEL_MAP, CONTROLLER_LEVEL_MAP} from '@/utils/level'
  import {fetchList, } from '@/api/spiderLog'
  import AdminUserInput from '@/components/Admin/adminUserInput'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    url: null,
    type: null,
    resultCode: null,
    spiderId: null,
  };
  const defaultResultCodeMap = {
      0: '成功',
      99: '初始化失败',
      100: '爬取失败',
      200: '解析失败',
  };
  export default {
    name: 'spiderLogList',
    props: {
      spiderId: {
        type: Number,
        default: null,
      }
    },
    components:{AdminUserInput},
    data() {
      return {
        fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
        listQuery: Object.assign({}, defaultListQuery),
        resultCodeMap: Object.assign({}, defaultResultCodeMap),
        list: [],
        total: null,
        listLoading: false,
        dialogItemStyleObj: {
        },
      }
    },
    computed: {
    },
    watch: {
      spiderId: (newVal) => {
        this.listQuery.spiderId = this.spiderId;
        this.getList();
      },
    },
    created() {
      this.listQuery.spiderId = this.spiderId;
      this.getList();
    },
    filters:{
      gmtCreateTimeFormat(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList();
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        if (val != defaultListQuery.pageSize) {
          this.getList();
        }
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        })
      },
    }
  }
</script>
<style>
/* .el-table .deleted-row {
  background: #909399;
} */
.el-tag + .el-tag {
    margin-left: 10px;
  }
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
  .demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
