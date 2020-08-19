<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button @click="queryBtn" style="float: right" type="primary" size="small">查询结果</el-button>
        <el-button @click="rest" style="float: right;margin-right: 15px" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="mini" label-width="100px">
          <el-form-item label="时间：">
            <!-- <el-input v-model="listQuery.name" @keyup.native.enter="queryBtn()"></el-input> -->
            <!-- <el-date-picker
                v-model="listQuery.name"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周">
            </el-date-picker> -->
            <el-date-picker
              v-model="queryTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeDate">
            </el-date-picker>
          </el-form-item>

          
          <el-form-item label="业务组：">
            <el-select size="small" v-model="listQuery.groupId" placeholder="选择业务组">
              <el-option
                v-for="item in emsBusinessGroupList"
                :key="item.groupName"
                :label="item.groupName"
                :value="item.groupId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="店铺：">
            <el-select size="small" v-model="listQuery.pmsShopId" placeholder="选择店铺">
              <el-option
                v-for="item in pmsShopList"
                :key="item.value"
                :label="item.shopName"
                :value="item.shopId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" size="mini">添加</el-button>
    </el-card>

    <el-card class="operate-container" shadow="never">
    <el-table 
        v-loading="listLoading" 
        :data="forwardList" 
        :element-loading-text="elementLoadingText" 
        size="small" :border="true" 
        @selection-change="handleSelectionChange">
      <el-table-column show-overflow-tooltip type="selection" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip label="序号" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column show-overflow-tooltip  label="业务组" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.groupName" size="mini" />
          </template>
          <span v-else>{{ row.groupName }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip  label="组长" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.groupLeaderName" size="mini"  />
          </template>
          <span v-else>{{ row.groupLeaderName }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="总产品数" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.sumProductCount" size="mini" />
          </template>
          <span v-else>{{ row.sumProductCount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="总曝光数" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.sumProductExposure" size="mini" />
          </template>
          <span v-else>{{ row.sumProductExposure }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="总点击量" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.sumProductChickCount" size="mini" />
          </template>
          <span v-else>{{ row.sumProductChickCount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="总询盘" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.sumInquiry" size="mini" />
          </template>
          <span v-else>{{ row.sumInquiry }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="总转化率" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.BigDecimal" size="mini" />
          </template>
          <span v-else>{{ row.BigDecimal }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="总下单数" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.sumAmountOrderCount" size="mini" />
          </template>
          <span v-else>{{ row.sumAmountOrderCount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="总成交订单数" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.sumCompleteOrderCount" size="mini" />
          </template>
          <span v-else>{{ row.sumCompleteOrderCount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="总到账金额" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.sumArrivalAmount" size="mini" />
          </template>
          <span v-else>{{ row.sumArrivalAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作" width="200">
        <template >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showReportDetail(newReportDetail)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
      <div>
        <!-- <div class="batch-operate-container">
          <el-button
            style="margin-left: 20px"
            class="search-button"
            @click="batchOperation()"
            type="primary"
            size="small"
          >确定</el-button>
        </div> -->
        <!-- 分页工具 -->
        <div class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes,prev, pager, next,jumper"
            :page-size="listQuery.size"
            :page-sizes="[10,20,30,40,50]"
            :current-page.sync="listQuery.page"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="报表详情"
      :visible.sync="dialogVisible"
      width="70%"
      :close-on-click-modal="false"
      :fullscreen="true"
    >
      <reportDetail v-model="this.listQuery"></reportDetail>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findGroup, findShop,getReportList,reportDetailInfo } from "@/api/report";
import reportDetail from "./components/reportDetail";
const defaultListQuery = {
  page: 1,
  size: 10,
  groupId: null,
  startTime: null,
  endTime:null,
  pmsShopId:null
};
const defaultForwardEntity = {};
export default {
    components:{reportDetail},
  data() {
    return {
      queryTime:[],
      newReportDetail:{},
      reportDetailInfo:[],
      listLoading: false,
      elementLoadingText: "正在加载...",
      dialogVisible:false,
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      operateType: null,
      emsBusinessGroupList: [ ],
      pmsShopList:[],
      selectListIds: [],
      forwardList: []
    };
  },
  created() {
    this.getBaseInfo()
    this.FristGetlist()
  },
  methods: {
    // 展示详情报表
    showReportDetail(data){
      this.dialogVisible = true
      this.newReportDetail = this.listQuery
      console.log(this.listQuery);
      // console.log(id)
    },
    handleSizeChange(val) {
      this.listQuery.page = 1;
      this.listQuery.size = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getlist();
    },
    // 重置
    rest() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    getlist() {
      getReportList(this.listQuery).then(response => {
        this.forwardList = response.data        
        if(response.data.length===0){
            this.$message({
            showClose: true,
            message: '查询失败,无数据',
            type: 'warning'
          });
        }else{
            this.$message({
            showClose: true,
            message: '查询成功',
            type: 'success'
          });
        }
      });
    },
    FristGetlist() {
      getReportList(this.listQuery).then(response => {
        this.forwardList = response.data
      });
    },
    getBaseInfo(){
      findGroup().then(resp=>{
        // console.log(resp)
        this.emsBusinessGroupList.push(...resp.data)
      })

      findShop().then(resp=>{
        this.pmsShopList.push(...resp.data)
      })
    },
    // 查询
    queryBtn() {
      this.getlist();
    },

    handleSelectionChange(val) {
      let ids = [];
      val.forEach(element => {
        ids.push(element.id);
      });
      this.selectListIds = ids;
    },
    // batchOperation() {
    //   if (this.selectListIds.length == 0) {
    //     this.$message({
    //       message: "尚未选取任意一条记录",
    //       type: "error"
    //     });
    //   } else {
    //     this.$confirm("是否要确认?", "提示", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     })
    //       .then(() => {
    //         if (this.operateType === "normal") {
    //           this.batchUpdateStatus(this.selectListIds, "normal");
    //         } else if (this.operateType === "freeze") {
    //           this.batchUpdateStatus(this.selectListIds, "freeze");
    //         } else if (this.operateType === "delete") {
    //           this.batchUpdateStatus(this.selectListIds, "delete");
    //         } else {
    //           this.$message({
    //             message: "您尚未选取操作方式",
    //             type: "error"
    //           });
    //         }
    //       })
    //       .catch(() => {
    //         this.$message({
    //           message: "您已取消执行",
    //           type: "warning"
    //         });
    //       });
    //   }
    // },
    toUpdate(id) {
      this.$router.push({
        path: "/forward/forwarDetail",
        query: {
          id
        }
      });
    },
    changeDate(){
      if(this.queryTime){
        this.listQuery.startTime = this.queryTime[0]
        this.listQuery.endTime = this.queryTime[1]
      }
      
    }
  }
};
</script>