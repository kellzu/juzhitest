<template>
  <div class="app-container" style="width: 80%; margin: 0 auto;">
    <!-- 订单基本描述 -->
    <el-card class="filter-container bgcolor" shadow="never">
      <el-form size="small" :inline="true" label-width="80px">
        <el-form-item label="订单编号">
          <el-input v-model="orderCustomer.sn" style="width:200px" placeholder="订单编号"></el-input>
        </el-form-item>
        <el-form-item label="附属编号">
          <el-tag v-for="item in sonNumber" :key="item" type="info">{{item}}</el-tag>
        </el-form-item>
      </el-form>
      <el-form size="small" :inline="true" label-width="80px">
        <el-form-item label="客户名称">
          <el-input v-model="orderCustomer.customerName"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺">
          <el-input v-model="orderCustomer.shopName"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-tag type="success">{{orderCustomer.orderStatus | formatOrderStatus}}</el-tag>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="80px" size="small">
        <el-form-item label="订单时间">
          <el-date-picker
            :style="dialogItemStyleObj"
            v-model="orderCustomer.orderDatetime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="交货日期">
          <el-date-picker
            :style="dialogItemStyleObj"
            v-model="orderCustomer.beDeliveryTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="订单来源">
          <el-select
            :style="dialogItemStyleObj"
            v-model="orderCustomer.source"
            placeholder="选择订单来源"
          >
            <el-option label="阿里巴巴" value="Alibaba"></el-option>
            <el-option label="速卖通" value="AliExproess"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="80px" size="small">
        <el-form-item label="业务人员">
          <el-input :style="dialogItemStyleObj" v-model="orderCustomer.businessAdminName"></el-input>
        </el-form-item>
        <el-form-item label="业务组">
          <el-input
            :style="dialogItemStyleObj"
            v-model="orderCustomer.businessGroup"
            placeholder="业务组"
          ></el-input>
        </el-form-item>
        <el-form-item label="厂商开发">
          <el-input
            :style="dialogItemStyleObj"
            v-model="orderCustomer.factoryAdminName"
            placeholder="厂商开发人员"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form size="small" label-width="80px">
        <el-form-item label="订单链接">
          <el-input v-model="orderCustomer.sourceOrderLink" placeholder="填写客户订单链接">
            <template slot="prepend">Http://</template>
          </el-input>
        </el-form-item>
        <el-form-item label="订单描述">
          <el-input
            v-model="orderCustomer.customerRemark"
            type="textarea"
            placeholder="填写客户描述"
            maxlength="255"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 付款记录 -->
    <el-card class="operate-container bgcolor" shadow="never">
      <div slot="header" class="clearfix">
        <span>付款记录</span>
      </div>
      <fmsBillDetail v-model="orderCustomer.billId"></fmsBillDetail>
    </el-card>
    <!-- 商品列表 -->
    <el-card class="operate-container bgcolor" shadow="never">
      <product-list :orderId="orderId"></product-list>
      <div class="dialog-footer">
        <el-button type="primary" @click="productListUpdate">修改商品</el-button>
      </div>
    </el-card>
    <!-- <el-card class="operate-container bgcolor" shadow="never">
      <el-form label-width="80px" size="small">
        <el-form-item label="活动信息">
          <el-input v-model="orderCustomer.promotionInfo" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </el-card>-->
    <!-- 物流 -->
    <el-card class="operate-container bgcolor" shadow="never">
      <div slot="header" class="clearfix">
        <span>物流信息</span>
      </div>
      <el-form label-width="80px" :inline="true" size="small">
        <el-form-item label="物流费用">
          <el-input v-model="orderCustomer.deliveryPrice" style="width:200px">
            <template slot="append">$</template>
          </el-input>
        </el-form-item>
        <el-form-item label="国家">
          <el-input v-model="orderCustomer.deliveryCountry" placeholder="目的地国家"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="80px" size="small">
        <el-form-item label="地址详情">
          <el-input
            v-model="orderCustomer.detailAddress"
            type="textarea"
            placeholder="地址详情"
            maxlength="255"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- <el-form :inline="true" label-width="80px" size="small">
        <el-form-item label="物流公司">
          <el-input v-model="orderCustomer.deliveryCompany" placeholder="物流公司"></el-input>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="orderCustomer.deliverySn" placeholder="物流单号"></el-input>
        </el-form-item>
      </el-form>-->
      <!-- <el-form :inline="true" label-width="80px" size="small">
        <el-form-item label="快递总重">
          <el-input v-model="orderCustomer.deliveryUnitWeight" placeholder="快递总重">
            <template slot="append">g</template>
          </el-input>
        </el-form-item>
        <el-form-item label="快递单价">
          <el-input v-model="orderCustomer.deliveryUnitPrice" placeholder="快递单价">
            <template slot="append">元/kg</template>
          </el-input>
        </el-form-item>
        <el-form-item label="总体积">
          <el-input v-model="orderCustomer.cbm" placeholder="运输总体积">
            <template slot="append">CBM</template>
          </el-input>
        </el-form-item>
        <el-form-item label="总单价">
          <el-input v-model="orderCustomer.deliveryTotalWeight" placeholder="运输总单价">
            <template slot="append">元/CBM</template>
          </el-input>
        </el-form-item>
        <el-form-item label="采购图片"></el-form-item>
      </el-form>-->
    </el-card>
    <!-- 发票 -->
    <el-card class="operate-container bgcolor" shadow="never">
      <el-form :inline="true" label-width="80px" size="small">
        <el-form-item label="发票模板">
          <el-select v-model="orderCustomer.invoiceTemplate" placeholder="选择模板">
            <el-option label="形式发票" value="1"></el-option>
            <el-option label="商务发票" value="2"></el-option>
            <el-option label="税务发票" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getInvoiceTemplate()" size="small">生成发票</el-button>
      </el-form>
    </el-card>
    <el-card class="operate-container bgcolor" shadow="never">
      <el-form label-width="80px" size="small">
        <el-form-item label="重要描述">
          <el-input v-model="orderCustomer.importantNote" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="orderCustomer.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="客户评价">
          <el-input v-model="orderCustomer.customerEvaluation" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="updateHandler">修 改</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import fmsBillDetail from "../components/fmsBillDetail";
import AdminUserInput from "@/components/Admin/adminUserInput";
import productList from "../components/productList";
import { getEntity, updateEntity, invoiceProforma } from "@/api/customerOrder";
const defaultOrderCustomer = {
  amount: null,
  autoConfirmDay: null,
  beDeliveryTime: null,
  businessAdminId: null,
  businessGroupId: null,
  cbm: null,
  cmbTotalPrice: null,
  customerEvaluation: null,
  customerId: null,
  customerName: null,
  businessAdminName: null,
  followerAdminName: null,
  factoryAdminName: null,
  businessGroup: null,
  customerOrderRemark: null,
  customerReceiveAddressId: null,
  customerRemark: null,
  deliveryCompany: null,
  deliveryCountry: null,
  deliveryPrice: null,
  deliverySn: null,
  deliveryTime: null,
  deliveryUnitPrice: null,
  deliveryTotalWeight: null,
  detailAddress: null,
  exchangeRate: null,
  factoryAdminId: null,
  followerAdminId: null,
  grossProfit: null,
  grossProfitMargin: null,
  importantNote: null,
  invoiceTemplate: null,
  orderDatetime: null,
  orederStatus: null,
  payAmout: null,
  payType: null,
  promotionAmout: null,
  promotionInfo: null,
  receiveTime: null,
  remark: null,
  sn: null,
  source: null,
  sourceOrderLink: null,
  status: null,
  totalProductCost: null,
  additionSn: null
};
const defaultPayTypeOptions = [
  {
    value: "platform_to_pay",
    label: "平台支付",
    key: "platform_to_pay"
  }
];
export default {
  name: "customerOderDetail",
  created() {
    if (this.value != null) {
      this.orderId = this.value;
      this.getDetail();
    }
  },
  props: {
    value: Number
  },
  components: { AdminUserInput, productList, fmsBillDetail },
  filters: {
    payTypeFormat(value) {
      if (value === "platform_to_pay") return "平台支付";
    },
    formatOrderStatus(status) {
      if (status === "create") return "创建中";
      if (status === "be_purchased") return "已采购";
    }
  },
  data() {
    return {
      dialogItemStyleObj: {
        width: "200px"
      },
      spanLeftNum: 8,
      orderId: null,
      payTypeOptions: Object({}, defaultPayTypeOptions),
      followerAdmin: "",
      orderCustomer: Object.assign({}, defaultOrderCustomer)
    };
  },
  computed: {
    sonNumber() {
      return JSON.parse(this.orderCustomer.additionSn);
    }
  },
  watch: {
    value: function(newVal, oldVal) {
      if (newVal != null) {
        this.orderId = newVal;
        this.getDetail();
      }
    }
  },
  methods: {
    handleSelect(item) {
      if (item) {
        this.orderCustomer.businessAdminId = item.id;
        this.orderCustomer.businessAdminName = item.label;
      } else {
        this.orderCustomer.businessAdminId = null;
        this.orderCustomer.businessAdminName = "";
      }
    },
    businessAdminSelect(item) {
      if (item) {
        this.orderCustomer.followerAdminId = item.id;
        this.orderCustomer.followerAdminName = item.label;
      } else {
        this.orderCustomer.followerAdminId = null;
        this.orderCustomer.followerAdminName = "";
      }
    },
    getDetail() {
      getEntity(this.orderId).then(response => {
        this.orderCustomer = response.data;
        console.log(response.data)
      });
    },
    productListUpdate() {
      this.$message({
        message: "商品列表修改功能即将上线",
        type: "success"
      });
    },
    getInvoiceTemplate() {
      //下载PDF文件
      invoiceProforma(this.orderId)
        .then(response => {
          // console.log(res)
          // const fileName = response.headers["Content-Disposition"].split("=")[1];
          const _res = response;
          let blob = new Blob([_res], { type: "application/pdf" });
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          // downloadElement.download = fileName; //下载后文件名
          downloadElement.download = "invoice"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(res => {
          console.log(res);
        });
    },
    updateHandler() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        updateEntity(this.orderCustomer.id, this.orderCustomer)
          .then(response => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          })
          .catch(() => {
            this.$message({
              type: "success",
              message: "已取消操作"
            });
          });
      });
    }
  }
};
</script>
<style scoped>
.bgcolor {
  background-color: #f2f6fc;
}
</style>