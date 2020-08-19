<template>
  <div>
    <el-card class="operate-container" shadow="never">
      <el-card shadow="never">
        <el-form :inline="true" label-width="100px" size="small">
          <el-form-item label="账单金额">
            <el-input style="width:150px" v-model="billDetailDtos.totalCostUsd">
              <template slot="append">$</template>
            </el-input>
          </el-form-item>
          <el-form-item label="汇率">
            <el-input style="width:150px" v-model="billDetailDtos.exchangeRate"></el-input>
          </el-form-item>
          <el-form-item label="付款情况">
            <el-tag v-if="billDetailDtos.isFull==1||!billDetailDtos.isFull" type="success">全额</el-tag>
            <el-tag v-else type="danger">非全额</el-tag>
          </el-form-item>
        </el-form>
      </el-card>
      <br />
      <el-card shadow="never">
        <el-divider content-position="left">
          <el-button type="text" style="margin-right:30px" @click="addBillDetailBtn">添加付款记录</el-button>切换价格单位
          <el-button
            type="primary"
            plain
            size="mini"
            @click="cny_or_usd=!cny_or_usd"
          >{{cny_or_usd | monetaryUnitZh}}</el-button>
        </el-divider>
        <br />
        <el-table :data="billDetailList">
          <el-table-column label="付款时间" width="200px">
            <template slot-scope="scope">
              <el-date-picker
                style="width:150px"
                v-if="scope.row.add"
                v-model="scope.row.gmtCreate"
                type="date"
                size="mini"
                placeholder="选择日期"
              ></el-date-picker>
              <a v-else>{{scope.row.gmtCreate |dataTimeFormat }}</a>
            </template>
          </el-table-column>

          <el-table-column label="付款金额">
            <template slot-scope="scope">
              <el-input-number
                v-if="scope.row.add && !cny_or_usd"
                v-model="scope.row.amountUsd"
                size="mini"
              ></el-input-number>
              <el-input-number
                v-if="scope.row.add && cny_or_usd"
                v-model="scope.row.amountCny"
                size="mini"
              ></el-input-number>
              <a v-if="!cny_or_usd">{{scope.row.amountUsd }}</a>
              <a v-else>{{scope.row.amountCny }}</a>
              {{cny_or_usd| monetaryUnit}}
            </template>
          </el-table-column>

          <el-table-column label="付款方式">
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.add"
                v-model="scope.row.patternPayment"
                placeholder="请输入付款方式"
                size="mini"
              >
                <el-option
                  v-for="item in payTypeOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <a v-else>{{scope.row.patternPayment|payTypeFormat }}</a>
            </template>
          </el-table-column>

          <el-table-column label="付款凭证">
            <template slot-scope="scope">
              <multiUpload v-if="scope.row.add" v-model="scope.row.picPaths"></multiUpload>
              <imageList
                v-else
                :imgs="scope.row.picPaths"
                istyle="width: 80px;height: 80px;"
              ></imageList>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input v-if="scope.row.add" v-model="scope.row.remark"></el-input>
              <a v-else>{{scope.row.remark}}</a>
            </template>
          </el-table-column>
          <el-table-column label="汇率($)" prop="exchangeRate"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.add" type="text" @click="commitBillDetail(scope.row)">提交</el-button>
              <el-button v-if="scope.row.add" @click="deleteBillDetail(scope.$index)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>
<script>
import { billDetail, addBillDetail } from "@/api/bill";
import imageList from "@/components/imageList/imageList";
import multiUpload from "@/components/Upload/multiUpload";
import { pareTime } from "@/utils/date";

const defaultBillDetail = {
  id: null,
  amountCny: null,
  amountUsd: null,
  billId: null,
  billType: null,
  createName: null,
  createUserId: null,
  exchangeRate: null,
  gmtCreate: null,
  gmtModify: null,
  patternPayment: null,
  picPaths: [],
  project: null,
  projectId: null,
  remark: null
};

const defaultPayTypeOptions = [
  {
    value: "platform_to_pay",
    label: "平台支付",
    key: "platform_to_pay"
  },
  {
    value: "alipay",
    label: "支付宝",
    key: "alipay"
  },
  {
    value: "Paypay",
    label: "Paypay",
    key: "Paypay"
  },
  {
    value: "wechatPay",
    label: "微信支付",
    key: "wechatPay"
  },
  {
    value: "applePay",
    label: "苹果支付",
    key: "applePay"
  },
  {
    value: "bandCard",
    label: "银行卡",
    key: "bandCard"
  },
  {
    value: "other",
    label: "其他",
    key: "other"
  }
];
export default {
  name: "fmsBillDetail",
  props: {
    value: Number
  },
  components: { imageList, multiUpload },
  filters: {
    dataTimeFormat(data) {
      return pareTime(data);
    },
    payTypeFormat(value) {
      if (value === "platform_to_pay") return "平台支付";
    },
    monetaryUnitZh(value) {
      if (value) return "人民币";
      return "美元";
    },
    monetaryUnit(value) {
      if (value) return "￥";
      return "$";
    },
    monetaryUnitPrice(value) {
      if (value) return this.billDetailDtos.totalCostCny;
      return this.billDetailDtos.totalCostUsd;
    }
  },
  data() {
    return {
      cny_or_usd: false,
      billDetailList: [],
      payTypeOptions: Object.assign([], defaultPayTypeOptions),
      billDetailDtos: {}
    };
  },
  created() {
    if (this.value) {
      this.getBillDetail(this.value);
    }
  },
  watch: {
    value: function(newVal, oldVal) {
      if (newVal) this.getBillDetail(newVal);
    }
  },
  methods: {
    getBillDetail(id) {
      billDetail(id).then(resp => {
        this.billDetailList = resp.data.billDetailDtos;
        this.billDetailDtos = resp.data;
        console.log(resp);
      });
    },
    addBillDetailBtn() {
      let billDetail = Object.assign({}, defaultBillDetail);
      billDetail.add = true;
      this.billDetailList.push(billDetail);
    },
    deleteBillDetail(index) {
      this.billDetailList.splice(index, 1);
    },
    commitBillDetail(row) {
      console.log(row);
      row.add = false;
      addBillDetail(this.value, row)
        .then(resp => {
          this.$message({
            message: resp.data,
            type: "success"
          });
        })
        .catch(resp => {
          row.add = true;
        });
    }
  }
};
</script>
<style>
</style>