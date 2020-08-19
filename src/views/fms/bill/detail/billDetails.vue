<template>
  <div>
    <el-card class="operate-container" shadow="never">
      <el-row :gutter="20">
        <el-form :model="billDetail" :inline="true" size="mini">
          <el-col :span="6">
            <el-form-item label="客户订单编号">
              <el-input v-model="billDetail.customerOrderSn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购订单编号">
              <el-input v-model="billDetail.purchaseOrderSn"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row :gutter="20">
        <el-form :model="billDetail" :inline="true" size="mini">
          <el-col :span="6">
            <el-form-item label="入账合计">
              <el-input v-model="billDetail.customerOrderSn">
                <template slot="append">$</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="成本支出">
              <el-input v-model="billDetail.totalCostUsd">
                <template slot="append">￥</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>账单列表</span>
        <el-button class="btn-add" size="mini" @click="isCNY = !isCNY">切换单位</el-button>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-table :data="billDetail.billDetailDtos">
        <el-table-column label="费用项目" prop="project"></el-table-column>
        <el-table-column label="金额" v-show="isCNY">
          <template slot-scope="scope">
            <span v-show="!isCNY">{{scope.row.amountUsd}} /$</span>
            <span v-show="isCNY">{{scope.row.amountCny}} /￥</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">{{scope.row.patternPayment}}</template>
        </el-table-column>
        <el-table-column label="时间" prop="gmtCreate">
          <template slot-scope="scope">{{scope.row.gmtCreate | pareTimeFormate}}</template>
        </el-table-column>
        <el-table-column label="操作人" prop="createName"></el-table-column>
        <el-table-column label="收支" prop="billType">
          <template slot-scope="scope">
            <el-tag :type="type[scope.row.billType]">{{scope.row.billType|billTypeFormate}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="汇率" prop="exchangeRate"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { pareTime } from "@/utils/date";
import { billDetail } from "@/api/bill";
const defaultBillDetail = {
  id: null,
  createUse: null,
  createId: null,
  gmtCreate: null,
  remark: null,
  totalCostUsd: null,
  totalCostCny: null,
  createUserName: null,
  purchaseOrderSn: null,
  customerOrderSn: null,
  billDetailDtos: []
};
export default {
  name: "billDetail",
  props: {
    value: Number
  },
  data() {
    return {
      type: {
        income: "success",
        expend: ""
      },
      billDetail: Object.assign({}, defaultBillDetail),
      isCNY: true
    };
  },
  filters: {
    pareTimeFormate(str) {
      return pareTime(str);
    },
    billTypeFormate(str) {
      if (str === "income") return "收入";
      if (str === "expend") return "支出";
    }
  },
  created() {
    if (this.value != null) {
      this.selectBillDetail(this.value);
    }
  },
  watch: {
    value: function(newVal, oldVal) {
      this.selectBillDetail(newVal);
    }
  },
  methods: {
    selectBillDetail(id) {
      billDetail(id).then(resp => {
        this.billDetail = resp.data;
      });
    }
  }
};
</script>