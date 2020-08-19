<template>
  <div  class="app-container">
    <div>
      <i class="el-icon-search"></i>
      <span>报表详情</span>
      <uploadExcel-component
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        />
    </div>
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" size="mini" label-width="100px">          
          <el-form-item label="业务组：">
            <el-select size="small" v-model="emsBusinessGroupId" placeholder="选择业务组">
              <el-option
                v-for="item in emsBusinessGroupList"
                :key="item.groupName"
                :label="item.groupName"
                :value="item.groupId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="店铺：">
            <el-select size="small" v-model="pmsShopId" placeholder="选择店铺">
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

     <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" size="small" :border="true">
      <el-table-column   label="统计时间" align="center" width="120px">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-date-picker
              size="mini"
              v-model="row.startTime"
              type="date"
              placeholder="选择时间">
            </el-date-picker>
          </template>
          <span v-else>{{ row.startTime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="负责人" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.userName" size="mini" />
          </template>
          <span v-else>{{ row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="产品数" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.productCount" size="mini" />
          </template>
          <span v-else>{{ row.productCount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="产品曝光" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.productExposure" size="mini" />
          </template>
          <span v-else>{{ row.productExposure }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="产品点击" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.productChickCount" size="mini" />
          </template>
          <span v-else>{{ row.productChickCount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="询盘（包含TM）" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.inquiryTm" size="mini" />
          </template>
          <span v-else>{{ row.inquiryTm }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="询盘" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.inquiry" size="mini"/>
          </template>
          <span v-else>{{ row.inquiry }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="询盘转化率" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.inquiryPercentConversion" size="mini" />
          </template>
          <span v-else>{{ row.inquiryPercentConversion }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="及时回复率" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.timelyReversionRate" size="mini" />
          </template>
          <span v-else>{{ row.timelyReversionRate }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="平均回复时间 (小时)" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.avgReplyTime" size="mini" />
          </template>
          <span v-else>{{ row.avgReplyTime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="总下单数" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.amountOrderCount" size="mini" />
          </template>
          <span v-else>{{ row.amountOrderCount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="成交订单数" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.completeOrderCount" size="mini" />
          </template>
          <span v-else>{{ row.completeOrderCount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="总到账金额" align="center">
        <template slot-scope="{ row }">
          <template v-if="edit">
            <el-input v-model="row.arrivalAmount" size="mini" />
          </template>
          <span v-else>{{ row.arrivalAmount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="btnBox">
      <div class="btnCenter">
        <el-button @click="submitreport()" style="width: 200px;" type="primary" size="small">提交</el-button>
      </div>
    </div>
    
  </div>
</template>

<script>
const defaultListQuery =
  {
    startTime: "",//startTime
    userName: "",//负责人
    createId: 3,
    productCount: "",//产品数
    inquiryTm: "",//询盘（包含TM）
    inquiry: "",//询盘
    inquiryPercentConversion: "",//询盘转化率
    timelyReversionRate: "",//及时回复率
    avgReplyTime: "",//平均回复时间 (小时)
    amountOrderCount: "",//总下单数
    completeOrderCount: "", //成交订单数    
    productExposure: "",//产品曝光
    productChickCount: "",//产品点击
    arrivalAmount: "",//总到账金额 
    emsBusinessGroupId:null,
    pmsShopId:null

  }

import UploadExcelComponent from "@/components/Upload/uploadExcel.vue";
import { insertReport,findGroup,findShop } from "@/api/report.js"
import { getInfo } from "@/api/login"
export default {
  components:{UploadExcelComponent},
  data() {
    return {
      newExcelList:[],
      emsBusinessGroupId:null,
      pmsShopId:null,
      list: [Object.assign({}, defaultListQuery)],
      listLoading: false,
      elementLoadingText: "正在加载...",
      // 上传的数据
      tableData: [],
      tableHeader: [],
      edit: true,
      emsBusinessGroupList: [ ],
      pmsShopList:[],
    };
  },
  created() {
    this.getBaseInfo()
    getInfo().then(resp=>{
      this.list.createId = resp.userId
      // this.createIds = resp.userId
    })
  },
  methods: {
    getBaseInfo(){
      findGroup().then(resp=>{
        this.emsBusinessGroupList.push(...resp.data)
      })

      findShop().then(resp=>{
        this.pmsShopList.push(...resp.data)
      })
    },
    cancelEdit(row) {
      this.list= [Object.assign({}, defaultListQuery)]   
    },
    confirmEdit(row) {
      insertReport(this.list).then(resp=>{
        this.$message.success('创建成功')
      })
    },
    upLoadBtn(){
      console.log("OK")
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (isLt1M) {
          return true;
      }

      this.$message({
          message: "Please do not upload files larger than 1m in size.",
          type: "warning",
      });
      return false;
    },
    handleSuccess({ results, header }) {
      
      if(!this.emsBusinessGroupId || !this.pmsShopId){
        this.$alert('业务组或店铺为空，请先选择', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            return
          }
        }) 
      }else{
        this.excelDateEdie(results,header)
      }
    },
    excelDateEdie(results,header){
      this.list = []
      // 根据中文排序好所对应的请求字段的数组
      const apiKeysArr = [
          "productChickCount",
          "productExposure",
          "productCount",
          "completeOrderCount",
          "userName",
          "timelyReversionRate",
          "endTime",
          "avgReplyTime",
          "startTime",
          "inquiry",
          "inquiryTm",
          "inquiryPercentConversion",
          "arrivalAmount",
          "amountOrderCount"]
      // excel 表格全部 数据     
      const newArr = []
      // 按照中文排序后的excel 数组对象的键名数组
      const resultArray = []
      
      results.forEach((item,index)=>{
          if(Object.keys(item).length>=14){ 
              newArr.push(item)
          }
      })      
      newArr.forEach((item,index)=>{
        const newObj1={};
        const newObj={};
        const keysArr = Object.keys(item)
        const resultArray = keysArr.sort(
          function (param1, param2) {
            return param1.localeCompare(param2,"zh");
          }
        );
        resultArray.forEach((ele,i)=>{
          newObj[resultArray[i]]=item[resultArray[i]]
          newObj1[apiKeysArr[i]]=item[resultArray[i]]
          newObj1.emsBusinessGroupId = this.emsBusinessGroupId
          newObj1.pmsShopId = this.pmsShopId
          if (i===6 || i===8) {
              newObj1[apiKeysArr[i]]=new Date(item[resultArray[i]])
          } 
        })       
        this.list.push(newObj1)
      })
        this.tableData = results;
        this.tableHeader = header;
        this.newExcelList = newArr        
    },
    submitreport(){
      const h = this.$createElement;
      this.$msgbox({
        message: h('p', null, [
        h('span', null, '一共有'+this.list.length+"条数据,确定创建吗？")
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            insertReport(this.list).then(resp=>{
            // console.log(resp,"cgl")
                this.$message.success('创建成功')
            })
            instance.confirmButtonLoading = false;
            done();
          } else {
            done();
          }
        }
      }).then(action => {
        this.tableData = []
      }); 
    }
  },
};
</script>

<style scoped lang="scss">
.app-container{
  padding-bottom: 60px;
  .btnBox{
  display: flex;
    justify-content: center;
  .btnCenter{
    position: fixed;
  bottom: 0;
    
  }
}
}

</style>
