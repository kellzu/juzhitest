<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="物流及商品信息" description="订单中的金额单位都是美元" />
        <el-step title="订单信息" />
        <el-step title="备注信息" />
      </el-steps>
      <el-divider content-position="left">
        <!-- <el-button type="text" @click="saveOrder">保存客户订单</el-button> -->
      </el-divider>
      <!-- 订单信息 -->
      <div class="filter-container" v-show="this.active==1" style="margin-top: 50px">
        <el-form
          :rules="rules"
          label-position="right"
          label-width="80px"
          :model="orderCustomer"
          ref="orderInfoForm"
          size="mini"
        >
          <el-card>
            <el-form-item prop="source" label="订单类型">
              <el-row>
                <el-col :span="spanLeftNum">
                  <el-select
                    @change="handlerChange"
                    v-model="orderCustomer.source"
                    placeholder="选择订单来源"
                    :style="customerWidthObj"
                  >
                    <el-option label="阿里国际站" value="Alibaba"></el-option>
                    <el-option label="RTS" value="RTS"></el-option>
                    <el-option label="速卖通" value="AliExpress"></el-option>
                    <el-option label="线下交易" value="Offline"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="spanRightNum"></el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-show="needFlag" label="订单编号">
              <el-row>
                <el-col :span="spanLeftNum">
                  <el-input v-model="orderCustomer.sn" placeholder="订单编号" :style="customerWidthObj"></el-input>
                </el-col>
                <el-col :span="spanRightNum"></el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-show="needFlag" label="附加编号">
              <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 额外订单编号</el-button>
            </el-form-item>
            <el-form label-width="80px" :inline="true" size="mini">
              <el-form-item prop="orderDatetime" label="订单时间">
                <el-date-picker
                  v-model="orderCustomer.orderDatetime"
                  type="date"
                  placeholder="选择日期"
                  :style="customerWidthObj"
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="beDeliveryTime" label="交货日期">
                <el-date-picker
                  v-model="orderCustomer.beDeliveryTime"
                  type="date"
                  placeholder="期待交货日期"
                  :style="customerWidthObj"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <el-form-item v-show="needFlag" label="订单链接">
              <el-row>
                <el-col :span="spanLeftNum">
                  <el-input
                    v-model="orderCustomer.sourceOrderLink"
                    placeholder="填写客户订单链接"
                    :style="customerWidthObj"
                  ></el-input>
                </el-col>
                <el-col :span="spanRightNum"></el-col>
              </el-row>
            </el-form-item>
          </el-card>
          <br>
          <el-card>
            <el-form label-width="80px" :inline="true" size="mini">
              <el-row>
                <el-col :span="spanLeftNum">
                  <el-form-item prop="amount" label="订单金额">
                    <el-input-number
                      v-model="orderCustomer.amount"
                      :style="customerWidthObj"
                      :min="0"
                      :step="0.0001"
                      controls-position="right"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item>
                    <el-switch v-model="isFullPay" active-text="全额" inactive-text="非全额"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="spanRightNum"></el-col>
              </el-row>
            </el-form>

            <!-- 入账记录 -->
            <el-form-item v-show="!isFullPay" label="入账记录">
              <fms-bill-list ref="fmslist"></fms-bill-list>
            </el-form-item>
            <!-- end -->
            <div v-show="isFullPay">
              <el-form-item prop="payType" label="付款方式">
                <el-row>
                  <el-col :span="spanLeftNum">
                    <el-select
                      v-model="orderCustomer.payType"
                      placeholder="请输入付款方式"
                      :style="customerWidthObj"
                    >
                      <el-option
                        v-for="item in payTypeOptions"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="spanRightNum"></el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="付款凭证">
                <multi-upload v-model="picList"></multi-upload>
              </el-form-item>
            </div>
            <el-form-item label="订单描述">
              <el-row>
                <el-col :span="12">
                  <el-input
                    v-model="orderCustomer.customerRemark"
                    type="textarea"
                    placeholder="填写客户付款情况，或其他信息"
                    maxlength="255"
                    :rows="5"
                    show-word-limit
                    :style="customerWidthObj"
                  ></el-input>
                </el-col>
                <el-col :span="spanRightNum"></el-col>
              </el-row>
            </el-form-item>
          </el-card>
        </el-form>
      </div>
      <!-- 物流 / 商品信息 -->
      <div v-show="this.active==0" style="margin-top: 50px">
        <div class="app-container">
          <el-card class="box-card" shadow="never">
            <el-form
              :rules="rules"
              ref="orderDeliveryForm"
              label-position="right"
              label-suffix=":"
              :model="orderCustomer"
              label-width="100px"
              size="small"
            >
              <el-form-item label="客户名称">
                <el-row>
                  <el-col :span="spanLeftNum">
                    <el-button
                      size="big"
                      type="text"
                      @click="dialogVisible=true"
                      :style="customerWidthObj"
                    >{{orderCustomer.customerName}} --- 选择客户地址</el-button>
                  </el-col>
                  <el-col :span="spanRightNum"></el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="deliveryCountry" label="目的国家">
                <el-row>
                  <el-col :span="spanLeftNum">
                    <el-tooltip content="请点击上面的选择客户地址按钮，双击选择客户收货地址" placement="right">
                      <el-input
                        v-model="orderCustomer.deliveryCountry"
                        placeholder="请点击上面的选择地址按钮，双击选择该客户收货地址"
                        :style="customerWidthObj"
                      ></el-input>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="spanRightNum"></el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="detailAddress" label="地址详情">
                <el-row>
                  <el-col :span="spanLeftNum">
                    <el-tooltip content="请点击上面的选择地址按钮，双击选择该客户收货地址" placement="top">
                      <el-input
                        v-model="orderCustomer.detailAddress"
                        type="textarea"
                        placeholder="请点击上面的选择地址按钮，双击选择该客户收货地址"
                        maxlength="255"
                        show-word-limit
                        :style="customerWidthObj"
                      ></el-input>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="spanRightNum"></el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="货代公司" prop="forwardId">
                <el-row>
                  <el-col :span="spanLeftNum">
                    <forwarding-input v-model="orderCustomer.forwardId"></forwarding-input>
                  </el-col>
                  <el-col :span="spanRightNum"></el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="货代总价" prop="deliveryPrice">
                <el-row>
                  <el-col :span="spanLeftNum">
                    <el-input-number
                      v-model="orderCustomer.deliveryPrice"
                      :style="customerWidthObj"
                      placeholder="货代总价"
                      controls-position="right"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="spanRightNum"></el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
        <product-list ref="pros"></product-list>
      </div>
      <!-- 备注信息 -->
      <div class="filter-container" v-show="this.active==2" style="margin-top: 50px">
        <el-form label-width="80px" size="small">
          <el-form-item label="重要描述">
            <el-row>
              <el-col :span="spanLeftNum">
                <el-input
                  v-model="orderCustomer.importantNote"
                  :style="customerWidthObj"
                  type="textarea"
                ></el-input>
              </el-col>
              <el-col :span="spanRightNum"></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="备注">
            <el-row>
              <el-col :span="spanLeftNum">
                <el-input v-model="orderCustomer.remark" :style="customerWidthObj" type="textarea"></el-input>
              </el-col>
              <el-col :span="spanRightNum"></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="客户评价">
            <el-row>
              <el-col :span="spanLeftNum">
                <el-input
                  v-model="orderCustomer.customerEvaluation"
                  :style="customerWidthObj"
                  type="textarea"
                ></el-input>
              </el-col>
              <el-col :span="spanRightNum"></el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <!-- 全局按钮 -->
      <el-row>
        <el-col :span="2" :offset="2">
          <el-button
            style="margin-top: 12px;"
            @click="last"
            v-show="this.active<=3"
            :round="true"
            type="primary"
          >上一步</el-button>
        </el-col>
        <el-col :span="2" :offset="2">
          <el-button
            style="margin-top: 12px;"
            @click="next"
            v-show="this.active < 3"
            :round="true"
            type="primary"
          >下一步</el-button>
        </el-col>
        <el-col :span="4" :offset="2" :round="true">
          <el-button
            style="margin-top: 12px;"
            @click="createHandler"
            v-show="this.active == 3"
            :round="true"
            type="primary"
          >提交</el-button>
        </el-col>
      </el-row>
      <router-link to="/oms/customerOrder">
        <el-button style="margin-top: 12px;" @click="next" v-show="this.active==4">返回列表</el-button>
      </router-link>
    </el-card>

    <el-dialog title="选择客户地址" :visible.sync="dialogVisible">
      <customer-receive-address-select
        :customerId="orderCustomer.customerId"
        @select="selectAddress"
      ></customer-receive-address-select>
    </el-dialog>
  </div>
</template>

<script>
import multiUpload from "@/components/Upload/multiUpload";
import forwardingInput from "@/components/Forwarding/forwardingInput";
import productList from "../components/productList";
import AdminUserInput from "@/components/Admin/adminUserInput";
import CustomerInput from "@/components/Customer/customerInput";
import CustomerReceiveAddressSelect from "@/components/Customer/customerReceiveAddressSelect";
import { createEntity, updateEntity } from "@/api/customerOrder";
import fmsBillList from "../components/fmsBillList";
const defaultBillDetail = {
  patternPayment: "",
  amountUsd: 0,
  amountCny: 0,
  exchangeRate: 0,
  remark: "",
  picPath: []
};
const defaultOrderCustomer = {
  shopId: null,
  amount: null,
  autoConfirmDay: null,
  beDeliveryTime: null,
  businessAdminId: null,
  businessGroupId: null,
  cbm: null,
  cmbTotalPrice: null,
  customerEvaluation: null,
  customerName: null,
  customerId: null,
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
  orderDatetime: new Date(),
  orederStatus: null,
  payAmout: null,
  payType: "platform_to_pay",
  promotionAmout: 0.0,
  promotionInfo: null,
  receiveTime: null,
  remark: null,
  sn: null,
  source: "Alibaba",
  sourceOrderLink: null,
  status: null,
  totalProductCost: null,
  additionSn: null,
  customerOrderItems: [],
  billDetail: []
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
  name: "addCustomerOrder",
  components: {
    AdminUserInput,
    CustomerInput,
    CustomerReceiveAddressSelect,
    productList,
    forwardingInput,
    fmsBillList,
    multiUpload
  },
  data() {
    const defaultValidate = (rule, value, callback) => {
      if (value == null || value.length < 1) {
        callback(new Error("请输入正确的数据"));
      } else {
        callback();
      }
    };
    return {
      isFullPay: true,
      dialogVisible: false,
      viewFlag: false,
      dialogItemStyleObj: {
        width: "300px"
      },
      followerAdmin: "",
      factoryAdminName: "",
      businessAdminName: "",
      payTypeOptions: Object.assign({}, defaultPayTypeOptions),
      customerWidthObj: {
        width: "80%"
      },
      picList: [],
      dynamicTags: [], // 额外订单编号
      needFlag: true,
      inputSize: "mini",
      inputVisible: false,
      inputValue: "",
      spanLeftNum: 10,
      spanRightNum: 16,
      longCBM: 0,
      widthCBM: 0,
      heighCBM: 0,
      rules: {
        amount: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        autoConfirmDay: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        beDeliveryTime: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        forwardId: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        cbm: [
          {
            type: Number,
            required: true,
            trigger: "blur",
            validator: defaultValidate
          }
        ],
        cmbTotalPrice: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        customerEvaluation: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        customerId: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        customerOrderRemark: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        customerReceiveAddressId: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        customerRemark: [
          { required: false, trigger: "blur", validator: defaultValidate }
        ],
        deliveryCountry: [
          { required: true, trigger: "change", validator: defaultValidate }
        ],
        deliveryCompany: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        deliveryPrice: [
          {
            required: true,
            trigger: "change",
            message: "请输入预估或实际快递价格"
          }
        ],
        deliverySn: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        deliveryTime: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        deliveryUnitPrice: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        detailAddress: [
          { required: true, trigger: "change", validator: defaultValidate }
        ],
        exchangeRate: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        factoryAdsmalld: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        followerAdsmalld: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        importantNote: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        invoiceTemplate: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        name: [{ required: true, trigger: "blur", validator: defaultValidate }],
        orderDatetime: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        orederStatus: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        payAmout: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        payType: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        promotionAmout: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        promotionInfo: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        receiveTime: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        remark: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        sn: [{ required: true, trigger: "blur", validator: defaultValidate }],
        source: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        sourceOrderLink: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        status: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        totalProductCost: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        shopId: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ]
      },
      orderCustomer: Object.assign({}, defaultOrderCustomer),
      active: 0
    };
  },
  created() {
    let id = this.$route.query.customerId;
    if (id != null) {
      this.orderCustomer.customerId = Number(id);
      this.orderCustomer.customerName = this.$route.query.customerName;
    }
  },
  watch: {
    active: function(newValue, oldValue) {
      if (newValue < 4) {
        this.titleBtn = "下一步";
      } else {
        this.titleBtn = "提交";
      }
    },
    longCBM: function(newVal) {
      this.calcuCBM();
    },
    widthCBM: function(newVal) {
      this.calcuCBM();
    },
    heighCBM: function(newVal) {
      this.calcuCBM();
    },
    "orderCustomer.cbm": function() {
      this.calcuDeliveryTotalPrice();
    },
    "orderCustomer.deliveryUnitPrice": function() {
      this.calcuDeliveryTotalPrice();
    },
    "orderCustomer.deliveryTotalWeight": function() {
      this.calcuDeliveryTotalPrice();
    }
  },
  methods: {
    calcuCBM() {
      if (this.longCBM && this.widthCBM && this.heighCBM) {
        let cbm =
          Number(this.longCBM / 100.0) *
          Number(this.widthCBM / 100.0) *
          Number(this.heighCBM / 100.0);
        this.orderCustomer.cbm = cbm.toFixed(4);
        return cbm;
      }
    },
    calcuDeliveryTotalPrice() {
      let price = 0;
      // 三种数据都齐全
      if (
        this.orderCustomer.deliveryUnitPrice &&
        this.orderCustomer.deliveryTotalWeight &&
        this.orderCustomer.cbm
      ) {
        let cmbWeight = this.orderCustomer.cbm * 200;
        let weight =
          cmbWeight > this.orderCustomer.deliveryTotalWeight
            ? cmbWeight
            : this.orderCustomer.deliveryTotalWeight;
        price = this.orderCustomer.deliveryUnitPrice * weight;
      } else if (
        this.orderCustomer.deliveryUnitPrice &&
        this.orderCustomer.deliveryTotalWeight
      ) {
        price =
          Number(this.orderCustomer.deliveryUnitPrice) *
          Number(this.orderCustomer.deliveryTotalWeight);
      } else if (
        this.orderCustomer.deliveryUnitPrice &&
        this.orderCustomer.cbm
      ) {
        price =
          Number(this.orderCustomer.deliveryUnitPrice) *
          Number(this.orderCustomer.cbm) *
          200;
      }
      this.orderCustomer.deliveryPrice = price;
      return price;
    },
    next() {
      if (this.active == 0) {
        var verity = this.$refs.pros.verify();
        if (verity) {
          this.$message({
            message: "商品价格未填写,或没有添加商品",
            type: "error"
          });
          return false;
        }
        this.tryValidate(this.$refs.orderDeliveryForm);
        let itemList = this.$refs.pros.products;
        this.orderCustomer.customerOrderItems = itemList;
        this.orderCustomer.amount = 0;
        itemList.forEach(element => {
          this.orderCustomer.amount += element.saleAmount;
        });
        this.orderCustomer.amount += this.orderCustomer.deliveryPrice;
      } else if (this.active == 1) {
        this.tryValidate(this.$refs.orderInfoForm);
      } else if (this.active == 2) {
        this.active++;
      }
    },
    tryValidate(refs) {
      refs.validate(val => {
        if (val) {
          this.active++;
        } else {
          this.$message({
            message: "数据填写不正确",
            type: "error"
          });
        }
      });
    },
    last() {
      if (!this.active < 1) {
        this.active--;
      }
    },
    handleSelect(item) {
      if (item) {
        this.orderCustomer.businessAdminId = item.id;
        this.businessAdminName = item.label;
      } else {
        this.orderCustomer.businessAdminId = null;
        this.businessAdminName = "";
      }
    },
    businessAdminSelect(item) {
      if (item) {
        this.orderCustomer.followerAdminId = item.id;
        this.followerAdmin = item.label;
      } else {
        this.orderCustomer.followerAdminId = null;
        this.followerAdmin = "";
      }
    },
    selectAddress(row) {
      let addressDetail = `name：${row.name}  phone: ${row.phone}  postcode: ${row.postcode}  address: ${row.city}  city ${row.province} · ${row.country} ${row.detailAddress}`;
      this.orderCustomer.detailAddress = addressDetail;
      this.orderCustomer.customerReceiveAddressId = row.id;
      this.orderCustomer.deliveryCountry = row.country;
      this.dialogVisible = false;
    },
    // 创建 客户订单
    createHandler() {
      this.orderCustomer.additionSn = JSON.stringify(this.dynamicTags);
      if (this.isFullPay) {
        let a = Object.assign({}, defaultBillDetail);
        a.patternPayment = this.orderCustomer.payType;
        a.amountUsd = this.orderCustomer.amount;
        a.remark = this.orderCustomer.customerOrderRemark;
        let array = [];
        array.push(a);
        // todo 这里可能还会有BUG 妈个鸡儿这么麻烦
        this.orderCustomer.billDetail = array;
      } else {
        this.orderCustomer.billDetail = this.$refs.fmslist.billDatailList;
      }
      console.log(this.orderCustomer);
      
      // createEntity(this.orderCustomer).then(response => {
      //   this.$message({
      //     message: "创建成功",
      //     type: "success"
      //   });
      //   this.active++;
      // });
    },
    factoryAdminSelect(item) {
      if (item) {
        this.factoryAdminName = item.label;
        this.orderCustomer.factoryAdminId = item.id;
      } else {
        this.orderCustomer.factoryAdminId = null;
        this.factoryAdminName = "";
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && inputValue.replace(/\s+/g, "") !== "") {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    handlerChange(val) {
      if (val === "Offline") {
        this.needFlag = false;
      } else {
        this.needFlag = true;
      }
    }
  }
};
</script>
<style>
.app-main-customer-order {
  margin: 0 auto;
  top: 20px;
}
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
</style>