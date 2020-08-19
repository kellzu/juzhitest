<template>
  <div>
    <el-card shadow="never">
      <el-collapse>
        <el-collapse-item title="国际物流信息">
          <template slot="title">
            <i class="header-icon el-icon-info" style="margin-right: 5px;"></i>
            <B style="margin-right: 10px;">国际物流信息</B>
          </template>
          <el-row :gutter="20">
            <el-col :span="11">
              <!-- 物流信息 -->
              <el-card shadow="never">
                <el-form label-width="100px" size="mini">
                  <el-form-item label="物流单号：">
                    <el-input v-model="globalLogistics.deliverySn"></el-input>
                  </el-form-item>
                  <el-form-item label="物流公司：">
                    <el-input v-model="globalLogistics.deliveryCompany"></el-input>
                  </el-form-item>
                  <el-form-item label="货品体积：">
                    <el-input-number v-model="globalLogistics.totalVolume"></el-input-number>
                  </el-form-item>
                  <el-form-item label="货品重量：">
                    <el-input-number v-model="globalLogistics.totalWeight"></el-input-number>
                  </el-form-item>
                  <el-form-item label="物流金额：">
                    <el-input-number v-model="globalLogistics.price"></el-input-number>
                  </el-form-item>
                  <el-form-item label="付款方式：">
                    <el-input v-model="globalLogistics.patternpayment"></el-input>
                  </el-form-item>
                  <el-form-item label="付款凭证：">
                    <imageList :images="globalLogistics.picList" istyle="width: 50px; height: 50px"></imageList>
                  </el-form-item>
                  <el-form-item label="发货打包图：">
                    <imageList
                      :images="globalLogistics.logisticsPic"
                      istyle="width: 50px; height: 50px"
                    ></imageList>
                  </el-form-item>
                  <el-form-item label="客户地址：">
                    <el-input type="textarea" v-model="globalLogistics.detailAddress"></el-input>
                  </el-form-item>
                  <el-form-item label="备注：">
                    <el-input type="textarea" v-model="globalLogistics.remark"></el-input>
                  </el-form-item>
                  <br />
                  <span v-if="toShow" style="font-size: 16px; color: #909399;">暂无物流信息</span>
                </el-form>
              </el-card>
            </el-col>
            <!-- 审核 -->
            <el-col :span="12">
              <approval v-model="globalLogistics.apId"></approval>
            </el-col>
          </el-row>
          <br />
          <logistticsLog :toShow="toShow" :logisticsResult="logisticsResult"></logistticsLog>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <br />
  </div>
</template>
<script>
import imageList from "./imageList";
import approval from "@/components/approval/index";
import logistticsLog from "@/components/logistticsLog/logistticsLog";
import { getGlobalLogistics } from "@/api/delivery";
const defaultGetGlobalLogistics = {
  id: null,
  customerOrderId: null,
  customerId: null,
  totalWeight: null,
  totalVolume: null,
  expressCompanyId: null,
  detailAddress: null,
  price: null,
  remark: null,
  gmtCreate: null,
  gmtModify: null,
  createUserId: null,
  deliverySn: null,
  deliveryEvidenceAlbumId: null,
  paymentAlbumId: null,
  priceBillId: null,
  apId: null,
  patternpayment: null
};
export default {
  name: "globalLogistics",
  props: {
    value: Number
  },
  components: { logistticsLog, imageList, approval },
  data() {
    return {
      toShow: true,
      globalLogistics: Object.assign({}, defaultGetGlobalLogistics),
      logisticsResult: null
    };
  },
  created() {
    if (this.value != null) {
      this.getGlobalLogistics();
    }
  },
  watch: {
    value: function(newVal, oldVal) {
      if (newVal != null) {
        this.getGlobalLogistics();
      }
    }
  },
  methods: {
    getGlobalLogistics() {
      getGlobalLogistics(this.value).then(resp => {
        this.globalLogistics = Object.assign({}, resp.data);
        if (resp.data != null && resp.data.logisticsEntity != null) {
          this.toShow = false;
          this.logisticsResult = resp.data.logisticsEntity.result;
        }
      });
    }
  }
};
</script>
<style>
</style>