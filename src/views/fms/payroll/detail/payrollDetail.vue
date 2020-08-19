<template>
  <div>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>薪资详情</span>
        <el-button class="btn-add" size="mini" @click="addProfit">确认</el-button>
        <el-input-number v-model="profit" class="btn-add" size="mini" style="width:150px" :min="1">
          <template slot="append">汇率</template>
        </el-input-number>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-table :data="paryrollDetailList" style="width: 100%">
        <el-table-column label="客户订单SN" prop="customerOrderSn" fixed="left" width="160px"></el-table-column>
        <el-table-column label="客户姓名" width="210px">
          <template slot-scope="scope">{{scope.row.firstName}} {{scope.row.lastName}}</template>
        </el-table-column>
        <el-table-column label="客户邮箱" prop="customersEmail" width="210px"></el-table-column>
        <el-table-column label="到账金额" width="150px">
          <template slot-scope="scope">{{scope.row.customerOrderAmount}}($)</template>
        </el-table-column>
        <el-table-column label="订单时间" prop="theOrderTime" width="150px"></el-table-column>
        <el-table-column label="汇率" prop="theExchangeRate" width="150px">
          <template>{{profit}}</template>
        </el-table-column>
        <el-table-column label="业绩" prop="arrivalAmount" width="150px"></el-table-column>
        <el-table-column label="商品数量" prop="productCount" width="150px"></el-table-column>
        <el-table-column label="采购订单" prop="purchaseOrderSn" width="150px"></el-table-column>
        <el-table-column label="采购费用" prop="purchaseOrderAmount" width="150px"></el-table-column>
        <el-table-column label="子采购订单" prop="sonPurchaseOrderSn" width="150px"></el-table-column>
        <el-table-column label="子采购费用" prop="sonPurchaseOrderAmount" width="150px"></el-table-column>
        <el-table-column label="物流费用" prop="theLogisticsCost" width="150px"></el-table-column>
      </el-table>
    </el-card>
    <br />
    <br />
    <div class="operate-container" shadow="never">
      <el-table
        size="mini"
        border
        :data="[{a:11465.43,s:4218.92,l:7246.505,m:724.65,n:0}]"
        :header-cell-style="rowClass"
        :cell-style="rowClass"
      >
        <el-table-column label="到账金额" align="center" width="150px" fixed="left">
          $
          <span>{{paryroll.customerOrderAmount}}</span>
        </el-table-column>
        <el-table-column label="本月总毛利" align="center">
          <span>￥{{paryroll.grossProfitOfTheMonth}}</span>
        </el-table-column>
        <el-table-column label="基本工资" align="center">
          <span>￥{{paryroll.basePay}}</span>
        </el-table-column>
        <el-table-column label="实发底薪" align="center">
          <span>￥{{paryroll.realBasePay}}</span>
        </el-table-column>
        <el-table-column label="差旅费" align="center">
          <el-input v-model="paryroll.travelExpense" @change="totalGrossProfit" size="mini"></el-input>
        </el-table-column>
        <el-table-column label="广告费" align="center">
          <el-input v-model="paryroll.adRate" @change="totalGrossProfit" size="mini"></el-input>
        </el-table-column>
        <el-table-column label="样品费" align="center">
          <el-input v-model="paryroll.sampleExpense" @change="totalGrossProfit" size="mini"></el-input>
        </el-table-column>
        <el-table-column label="应酬费" align="center">
          <el-input v-model="paryroll.dinnerPartyCost" @change="totalGrossProfit" size="mini"></el-input>
        </el-table-column>
        <el-table-column label="推广费" align="center">
          <el-input v-model="paryroll.promotionExpenses" @change="totalGrossProfit" size="mini"></el-input>
        </el-table-column>
        <el-table-column label="品检包装费" align="center">
          <span>￥{{paryroll.packingChargesQC}}</span>
        </el-table-column>
        <el-table-column label="手续费" align="center">
          <el-input v-model="paryroll.serviceCharge" @change="totalGrossProfit" size="mini"></el-input>
        </el-table-column>
        <el-table-column label="上月累计亏损" align="center">
          <el-input v-model="paryroll.accumulatedLoss" @change="totalGrossProfit" size="mini"></el-input>
        </el-table-column>
        <el-table-column label="出勤天数" align="center">
          <el-input v-model="paryroll.attendanceDay" @change="totalGrossProfit" size="mini"></el-input>
        </el-table-column>
        <el-table-column label="节假日" align="center">
          <el-input v-model="paryroll.furloughDay" @change="totalGrossProfit" size="mini"></el-input>
        </el-table-column>
        <el-table-column label="利润" align="center">￥{{paryroll.profit}}</el-table-column>
        <el-table-column label="提成" align="center">￥{{paryroll.royalty}}</el-table-column>
      </el-table>
      <el-form class="salary" label-width="80px" label-position="left" :inline="true">
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="paryroll.remark" rows="6"></el-input>
        </el-form-item>
        <el-form-item label="凭证图：">
          <multiUpload v-model="paryroll.picPath"></multiUpload>
        </el-form-item>
      </el-form>
      <el-form class="salary" :inline="true">
        <el-form-item label="实发工资：">
          <el-input style="width:100px" v-model="paryroll.realWages" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="realSubmit" type="primary">申请</el-button>
        </el-form-item>
      </el-form>
    </div>
    <commissionTable></commissionTable>
  </div>
</template>

<script>
/**
 * 公式
 * 业绩 = 到账金额 * 汇率
 * 客户订单总金额 = 总业绩
 * 总毛利 = 客户订单总金额 - 采购费 - 物流费（快递费和运费）- 子采购费
 * 纯利润 = 总毛利 - 基本工资 - 差旅费 - 广告费 - 样品费 - 应酬费 - 推广费 - 上月累计亏损 - 手续费 - 品检包装费
 * 
 */
import { addParyroll } from "@/api/performance";
import multiUpload from "@/components/Upload/multiUpload";
import commissionTable from "./commissionTable";
import { pareTime } from "@/utils/date";
import { performanceDetail } from "@/api/performance";
import { howManySundayThisMonth } from "@/utils/date";
const defaultParyroll = {
  id: null,
  userId: null,
  gmtCreate: null,
  grossProfitOfTheMonth: 0,//本月总毛利
  basePay: 0,//基本工资
  realBasePay: 0,//实发底薪
  travelExpense: 0,//差旅费
  adRate: 0,//广告费
  customerOrderAmount: 0,//到账金额
  sampleExpense: 0,//样品费
  dinnerPartyCost: 0,//应酬费
  promotionExpenses: 0,//推广费
  attendanceDay: 0,//出勤天数
  profit: 0,//利润 
  royalty: 0,//提成
  accumulatedLoss: 0,//上月累计亏损
  releaseDate: 0,
  furloughDay: 0,//节假日
  serviceCharge: 0,//手续费
  realWages: 0,
  remark: null,
  albumId: null,
  picPath: [],
  packingChargesQC:0//品检包装费
};
export default {
  name: "payroll",
  components: { commissionTable, multiUpload },
  props: {
    userId: {
      type: Number
    },
    month: {
      type: Date
    },
    profit: {
      type: Number
    }
  },
  data() {
    return {
      paryrollDetailList: [],
      isCNY: true,
      customerOrderAmount: null,
      arrivalAmount: null,//总业绩（客户订单总金额）
      purchaseOrderAmount: null,
      actualBaseSalary: null,
      logisticsCost: null,
      sonPurcherOrderAmount: null,
      attendanceDay: null,
      paryroll: Object.assign({}, defaultParyroll)
    };
  },
  filters: {
    pareTimeFormate(str) {
      return pareTime(str);
    }
  },
  created() {
    var su = howManySundayThisMonth(this.month);
    this.attendanceDay = parseInt(su);
    this.paryroll.attendanceDay = parseInt(su);
    if (this.userId) {
      this.getPerformanceDetail();
    }
  },
  watch: {
    userId: function(newVal, oldVal) {
      if (newVal) {
        this.getPerformanceDetail();
      }
    },
    month: function(newVal, oldVal) {
      if (newVal) {
        this.getPerformanceDetail();
      }
    },
    profit: function(newVal, oldVal) {
      if (newVal) {
        this.baseHandle();
      }
    }
  },
  computed: {},
  methods: {
    realSubmit() {
      this.paryroll.userId = this.userId;
      this.paryroll.releaseDate = this.month;
      console.log(this.paryroll.userId);
      addParyroll(this.userId, this.paryroll).then(resp => {
        this.$message({
          message: resp.data,
          type: "success"
        });
      }).catch(resp=>{
        
      });
      console.log(this.paryroll);
    },
    // 表格红色样式
    rowClass({ row, column, rowIndex, columnIndex }) {
      let columnIndexList = [ 10, 11, 12, 13,14];
      if (columnIndexList.indexOf(columnIndex) >= 0) {
        return "color:red";
      }
    },
    getTotalCustomerOrderAmount(paryroll) {
      let arr = [];
      let customerOrderAmount = 0.0;
      paryroll.forEach(element => {
        if (arr.indexOf(element.customerOrderId) < 0) {
          arr.push(element.customerOrderId);
          customerOrderAmount =
            customerOrderAmount + Number(element.customerOrderAmount);
        }
      });
      this.paryroll.customerOrderAmount = customerOrderAmount;
    },
    // 获取业绩合计
    getRoralArrivalAmount(paryroll) {
      let arr = [];
      let arrivalAmount = 0.0;
      paryroll.forEach(element => {
        if (arr.indexOf(element.customerOrderId) < 0) {
          arr.push(element.customerOrderId);
          arrivalAmount = arrivalAmount + Number(element.arrivalAmount);
        }
      });
      this.arrivalAmount = arrivalAmount;
    },
    // 获取采购费用合计
    getTotalPurchaseOrderAmount(paryroll) {
      let arr = [];
      let purchaseOrderAmount = 0.0;
      let logisticsCost = 0.0;
      paryroll.forEach(element => {
        if (arr.indexOf(element.purchaseOrderId) < 0) {
          arr.push(element.purchaseOrderId);
          logisticsCost = logisticsCost + Number(element.theLogisticsCost);
          purchaseOrderAmount =
            purchaseOrderAmount + Number(element.purchaseOrderAmount);
        }
      });
      this.logisticsCost = logisticsCost;
      this.purchaseOrderAmount = purchaseOrderAmount;
    },
    //获取品检包装费 = 客户月订单总金额x2%
    getQackingChargesQC(){
      this.paryroll.packingChargesQC = this.arrivalAmount * 0.02
    },
    //合计出子采购费用
    getTotalSonPurcherOrderAmount(paryroll) {
      let arr = [];
      let purchaseOrderAmount = 0.0;
      let sonPurchaseOrderAmount = 0.0;
      paryroll.forEach(element => {
        if (arr.indexOf(element.sonPurchaseOrderId) < 0) {
          arr.push(element.sonPurchaseOrderId);
          sonPurchaseOrderAmount =
            sonPurchaseOrderAmount + Number(element.sonPurchaseOrderAmount);
        }
      });
      this.sonPurcherOrderAmount = sonPurchaseOrderAmount;
    },
    // 获取业绩，根据输入的汇率
    getArrivalAmountDetail(paryrollDetailList) {
      paryrollDetailList.forEach(e => {
        e.arrivalAmount = (
          parseFloat(e.customerOrderAmount) * parseFloat(this.profit)
        ).toFixed(4);
      });
    },
    getPerformanceDetail() {
      let params = {
        userId: this.userId,
        temporalInterval: this.month
      };
      performanceDetail(params).then(resp => {
        console.log(resp,"performanceDetail");
        this.getArrivalAmountDetail(resp.data);
        this.paryrollDetailList = resp.data;
        this.baseHandle();
      });
    },

    // 获取月累计毛利
    totalGrossProfit() {
      this.paryroll.grossProfitOfTheMonth =
        parseFloat(this.arrivalAmount) -//客户订单总金额
        parseFloat(this.purchaseOrderAmount) -//采购费
        parseFloat(this.logisticsCost) -//物流费
        parseFloat(this.sonPurcherOrderAmount);//采购费用
      this.paryroll.basePay = this.basicWage(
        this.paryroll.grossProfitOfTheMonth
      );
      this.paryroll.profit = (
        parseFloat(this.paryroll.grossProfitOfTheMonth) -//总毛利 
        parseFloat(this.paryroll.basePay) - //基本工资
        parseFloat(this.paryroll.travelExpense) - // 差旅费
        parseFloat(this.paryroll.adRate) - //广告费
        parseFloat(this.paryroll.sampleExpense) - // 样品费
        parseFloat(this.paryroll.dinnerPartyCost) - //应酬费
        parseFloat(this.paryroll.promotionExpenses) - // 推广费
        parseFloat(this.paryroll.accumulatedLoss) - // 上月累计亏损
        parseFloat(this.paryroll.serviceCharge)- // 手续费
        parseFloat(this.paryroll.packingChargesQC) // 品检包装费
      ).toFixed(4);
      this.calculateBaseSalary();
      this.paryroll.royalty = this.royaltyFnc(this.paryroll.profit);
    },
    // 获取匹配工资等级
    basicWage(val) {
      if (val > 40001) {
        return 4500;
      } else if (val > 30001) {
        return 4000;
      } else if (val > 20001) {
        return 3300;
      } else if (val > 10001) {
        return 3000;
      } else {
        return 2800;
      }
    },
    calculateBaseSalary() {
      let realAttendanceDay =
        parseInt(this.paryroll.attendanceDay) +
        parseInt(this.paryroll.furloughDay);
      this.paryroll.realBasePay = (
        (this.paryroll.basePay / this.attendanceDay) *
        realAttendanceDay
      ).toFixed(2);
    },
    royaltyFnc(val) {
      if (parseFloat(val) > 40001) {
        return parseFloat(val) * 0.35;
      } else if (parseFloat(val) > 30001) {
        return parseFloat(val) * 0.3;
      } else if (parseFloat(val) > 20001) {
        return parseFloat(val) * 0.25;
      } else if (parseFloat(val) > 10001) {
        return parseFloat(val) * 0.2;
      } else if (parseFloat(val) > 0) {
        return parseFloat(val) * 0.15;
      } else if (parseFloat(val) <= 0) {
        return 0;
      }
    },
    baseHandle() {
      this.getTotalCustomerOrderAmount(this.paryrollDetailList);
      this.getArrivalAmountDetail(this.paryrollDetailList);
      this.getRoralArrivalAmount(this.paryrollDetailList);
      this.getTotalPurchaseOrderAmount(this.paryrollDetailList);
      this.getTotalSonPurcherOrderAmount(this.paryrollDetailList);
      this.totalGrossProfit();
      this.getQackingChargesQC();
    },
    addProfit() {
      this.paryrollDetailList.forEach(e => {
        e.theExchangeRate = this.profit;
      });
    }
  }
};
</script>
<style>
.salary {
  margin: 10px;
  justify-content: end;
}
</style>