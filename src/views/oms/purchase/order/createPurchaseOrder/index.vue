<template>
  <div class="app-container">
    <div>
      <el-steps :active="active" align-center>
        <el-step title="用户组与客户订单" description="必填，必须有一条客户订单记录"></el-step>
        <el-step title="订单信息" description="添加采购商品，记得修改采购数量"></el-step>
        <el-step title="采购费用管理" description="物流费用，采购费用，其他费用，以及添加凭证"></el-step>
      </el-steps>
    </div>

    <!-- 分隔线 -->
    <el-divider></el-divider>
    <!-- 选择客户订单/业务组/必选项 -->
    <div style="margin:0 auto; top:20px; width:85%">
      <div v-show="active==0" class="filter-container" style="margin-top: 50px">
        <el-form
          size="small"
          ref="businessGroupForm"
          :model="purchaseOrder"
          :rules="rules"
          label-width="100px"
        >
          <el-card shadow="never" class="operate-container">
            <el-form-item prop="businessGroupId" label="选择业务组">
              <el-autocomplete
                class="inline-input"
                v-model="businessGroupName"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleGroupSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-card>

          <el-card shadow="never" class="operate-container">
            <coustomer-order ref="coustomerOrder"></coustomer-order>
            <br />
            <el-form-item>
              <el-button @click="last" size="small" type="primary">上一步</el-button>
              <el-button @click="next" size="small" type="primary">下一步</el-button>
            </el-form-item>
          </el-card>
        </el-form>
      </div>
      <!-- 添加采购商品 -->
      <div v-show="active==1" class="operate-container" style="margin-top: 50px">
        <el-card v-if="parentPurchase.show" shadow="never" class="operate-container">
          <el-form label-width="130px" size="small">
            <el-form-item label="父采购订单编号：">{{parentPurchase.parentSn}}</el-form-item>
          </el-form>
        </el-card>

        <el-form
          ref="purchaseOrderForm"
          :model="purchaseOrder"
          :rules="rules"
          label-width="100px"
          size="small"
          label-position="right"
        >
          <el-card shadow="never" class="operate-container">
            <el-form-item prop="sn" label="订单编号：">
              <el-tooltip content="请输入1688上采购订单编号，若有多个，请用英文逗号分隔，例如a,b,c" placement="top">
                <el-input style="width:215px" v-model="purchaseOrder.sn"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="source" label="采购途径：">
              <el-select v-model="purchaseOrder.source" @change="selectChanged" placeholder="订单归属">
                <el-option
                  v-for="item in procurement"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否生效：">
              <el-radio-group v-model="purchaseOrder.status">
                <el-radio label="normal">生效</el-radio>
                <el-radio label="freeze">无效</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-card>

          <el-card shadow="never" class="operate-container">
            <purchase-order-item
              ref="orderItem"
              @extimatedAmountPriceHandle="getExtimatedPurchaseAmountPrice"
              @averageHandle="getAverageCostUnitPrice"
              :purchaseItem="purchaseOrderItem"
            ></purchase-order-item>
            <div class="operate-container">
              <el-button @click="last" size="small" type="primary">上一步</el-button>
              <el-button @click="next" size="small" type="primary">下一步</el-button>
            </div>
          </el-card>
        </el-form>
      </div>
      <!-- 采购费用管理 -->
      <div v-show="active==2" class="filter-container" style="margin-top: 50px">
        <el-card shadow="never" class="operate-container">
          <el-divider content-position="left">
            <b style="color:#606266">物流费用</b>
          </el-divider>
          <el-form size="small" label-position="left" label-suffix="：" label-width="130px">
            <el-form-item label="物流单号" style="width: 500px">
              <el-input placeholder="填写物流单号" v-model="purchaseOrder.deliverySn"></el-input>
            </el-form-item>
            <el-form-item label="物流费用">
              <el-input-number
                controls-position="right"
                :min="0.0"
                v-model="purchaseOrder.freightAmount"
                aria-placeholder="物流费用"
              ></el-input-number>
            </el-form-item>
            <br />
            <br />
            <el-divider content-position="left">
              <b style="color:#606266">采购要求</b>
            </el-divider>
            <el-form-item label="采购要求">
              <el-input style="width: 400px" type="textarea" v-model="purchaseOrder.purchasesDesc"></el-input>
            </el-form-item>
            <el-form-item label="采购样图">
              <multi-upload v-model="productImageList"></multi-upload>
            </el-form-item>

            <br />
            <br />
            <el-divider content-position="left">
              <b style="color:#606266">其他费用</b>
            </el-divider>
            <el-form-item label="其他费用">
              <el-input-number
                controls-position="right"
                v-model="purchaseOrder.otherAmount"
                placeholder="物流费用"
              ></el-input-number>
            </el-form-item>
            <br />
            <br />
            <el-divider content-position="left">
              <b style="color:#606266">费用合计</b>
            </el-divider>
            <el-form-item label="采购费用和合计">
              <el-input-number placeholder="采购总计" v-model="totalPrice"></el-input-number>
              <span
                style="color:#909399;margin-left: 30px; font-size: 12px;"
              >采购费用合计为：采购商品费用 + 物流费用 + 其他费用</span>
            </el-form-item>
            <el-form-item label="凭证图">
              <multi-upload v-model="proofFigureImageList"></multi-upload>
            </el-form-item>
            <br />
            <br />
            <el-divider content-position="left">
              <b style="color:#606266">备注信息</b>
            </el-divider>
            <el-form-item label="采购备注: ">
              <el-input
                type="textarea"
                style="width: 400px"
                :rows="5"
                v-model="purchaseOrder.remark"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-card>

        <div class="operate-container">
          <el-button @click="last" size="small" type="primary">上一步</el-button>
          <el-button @click="createPurchaseOrder" size="small" type="primary">提交</el-button>
        </div>
      </div>
      <!-- end -->
      <!-- 采购要求
      <div v-show="active==3" class="filter-container" style="margin-top: 50px">
        <el-card shadow="never"></el-card>
      </div>-->
      <!-- 添加完成 -->
      <div v-show="active==3" class="filter-container" style="margin-top: 50px">
        <el-card shadow="never">
          <div slot="header">采购订单添加成功，等待审核</div>
          <el-form :inline="true">
            <el-form-item label="选择财务发送邮件">
              <el-select v-model="financeEmail" @change="change" placeholder="选择财务人员">
                <el-option
                  v-for="item in financeUser"
                  :key="item.note"
                  :label="item.note"
                  :value="item.email"
                >
                  <span style="float: left">{{ item.note }}</span>
                  <span
                    style="float: right;  margin-left: 20px; color: #8492a6; font-size: 12px"
                  >{{ item.email }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="sendEmailBtn">发送邮件</el-button>
            </el-form-item>
          </el-form>
          <div>
            <router-link to="/purchase/orderList">
              <el-button type="primary">返回列表</el-button>
            </router-link>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import coustomerOrder from "@/views/oms/purchase/components/coustomerOrder";
import { getAdminByRole } from "@/api/admin";
import { getCustomerProductItem } from "@/api/customerOrderItem";
import purchaseOrderItem from "@/components/PurchaseOrderItem/purchaseOrderItem";
import CosSingleUpload from "@/components/Upload/cosSingleUpload";
import CustomerInput from "@/components/Customer/customerInput";
import multiUpload from "@/components/Upload/multiUpload";
import AdminUserInput from "@/components/Admin/adminUserInput";
import { customerOrderList } from "@/api/customerOrder";
import { groupIdNameList } from "@/api/businessGroup";
import { createEntity, sendEmail, generateSn } from "@/api/purchaseOrder";
const defaultPurchaseOrder = {
  albumPics: null,
  amountFee: null,
  averageCostUnitPrice: null,
  beDeliveryTime: null,
  businessGroupId: null,
  customerId: null,
  customerOrderId: null,
  deliverySn: null,
  extimatedPurchaseAmountPrice: null,
  failureMsg: null,
  freightAmount: 0.0,
  goodsAmountFee: null,
  orderStatus: null,
  otherAmount: 0.0,
  otherPics: null,
  pcs: null,
  purchasesDesc: null,
  receiptPics: null,
  remark: null,
  sn: null,
  source: "alibaba",
  status: "normal",
  parentPurchaseId:null,
  customerOrders: [], // 客户订单集合
  purchaseOrders: [], //产品集合
  productImageList: [], //采购样
  proofFigureImageList: [] //采购凭证图
};
const defaultPurchaseItem = {
  sn: null,
  name: null,
  factoryAddressId: null,
  factoryId: null,
  productAmount: null,
  purchaseWholesaleProductId: null,
  purchasesOrderId: null,
  remark: null,
  wholeSaleProductCostPrice: null,
  wholesaleProductCount: 1,
  wholesaleProductLink: null,
  wholesaleProductRemark: null,
  wholesaleProductUnit: null
};
const defaultCustomerOrder = {
  id: null,
  customerId: null,
  customerName: "",
  customerOrderId: null,
  customerOrderSn: null,
  purchaseOrderId: null,
  remark: null
};
export default {
  components: {
    AdminUserInput,
    CustomerInput,
    multiUpload,
    CosSingleUpload,
    purchaseOrderItem,
    coustomerOrder
  },
  data() {
    const defaultValidate = (rule, value, callback) => {
      if (value == null || value.length < 1) {
        callback(new Error("请输入正确的数据"));
      } else {
        callback();
      }
    };
    const defaultNumberValidate = (rule, value, callback) => {
      if (typeof value === "number" && !isNaN(value) && value > 0) {
        callback();
      } else {
        callback(new Error("请输入正确的数据"));
      }
    };
    return {
      active: 0,
      dialogItemStyleObj: {
        width: "300px"
      },
      parentPurchase: {
        show: false,
        parentId: NaN,
        parentSn: null
      },
      parentId: NaN,
      parentSn: null,
      //
      procurement: [
        {
          label: "1688",
          value: "alibaba"
        },
        {
          label: "线下",
          value: "offline"
        },
        {
          label: "多单合并",
          value: "merge"
        }
      ],
      productImageList: [],
      proofFigureImageList: [],
      timeout: null,
      purchaseOrder: Object.assign({}, defaultPurchaseOrder),
      orderSn: "",
      businessGroupName: null,
      businessGroup: [],
      // 财务账号集合
      financeUser: [
        {
          id: 0,
          note: "无效",
          email: "无效"
        }
      ],
      financeEmail: "",
      //客户订单集合
      customerOrderList: [],
      // 创建完成后返回的数据，用来生成链接
      resultDetail: {},
      rules: {
        albumPics: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        amountFee: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        approvalDesc: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        approvalStatus: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        averageCostUnitPrice: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        beDeliveryTime: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        businessGroupId: [
          { required: true, trigger: "blur", validator: defaultNumberValidate }
        ],
        customerId: [
          {
            required: true,
            trigger: "change",
            validator: defaultNumberValidate
          }
        ],
        customerOrderId: [
          { required: true, trigger: "blur", validator: defaultNumberValidate }
        ],
        deliverySn: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        extimatedPurchaseAmountPrice: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        failureMsg: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        freightAmount: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        goodsAmountFee: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        orderStatus: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        otherAmount: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        otherPics: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        pcs: [{ required: true, trigger: "blur", validator: defaultValidate }],
        purchasesDesc: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        receiptPics: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        remark: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        sn: [
          {
            required: true,
            trigger: "blur",
            message:
              "请输入1688上采购订单编号，若有多个，请用英文逗号分隔，例如a,b,c"
          }
        ],
        source: [
          { required: true, trigger: "blur", message: "请选择采购平台" }
        ],
        status: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ]
      },
      //订单商品集合-- 冗余表
      purchaseOrderItem: []
    };
  },
  watch: {},
  created() {
    this.getGroupList();
    this.getAdminByRole();
    if (this.$route.query.id) {
      let ids = [];
      ids.push(this.$route.query.id);
      this.judgeCoustomer();
      this.selectProductByOrderId(ids);
    }
    if (this.$route.query.parentId) {
      this.parentPurchase.parentId = this.$route.query.parentId;
      this.purchaseOrder.parentPurchaseId = this.$route.query.parentId
      this.parentPurchase.parentSn = this.$route.query.parentSn;
      this.parentPurchase.show = true;
      this.active = 1;
    }
  },
  computed: {
    totalPrice: {
      get: function() {
        let total =
          this.purchaseOrder.otherAmount +
          this.purchaseOrder.freightAmount +
          this.purchaseOrder.extimatedPurchaseAmountPrice;
        this.purchaseOrder.amountFee = total;
        return total;
      },
      set: function(val) {}
    }
  },
  methods: {
    // 客户订单列表页跳转来的处理-k
    judgeCoustomer() {
      let customerOrderItem = Object.assign({}, defaultCustomerOrder);
      customerOrderItem.customerOrderId = this.$route.query.id;
      this.customerOrderList.push(customerOrderItem);
      this.active = 1;
    },
    getAdminByRole() {
      getAdminByRole(9).then(response => {
        this.financeUser = response.data;
      });
    },
    // 选择 业务组
    handleGroupSelect(item) {
      if (item) {
        this.purchaseOrder.businessGroupId = item.id;
        this.businessGroupName = item.value;
      } else {
        this.purchaseOrder.businessGroupId = null;
        this.businessGroupName = null;
      }
    },
    // 业务组集合获取
    getGroupList() {
      groupIdNameList().then(response => {
        let businessGroup = [];
        response.data.forEach(e => {
          businessGroup.push({
            id: e.id,
            value: e.name
          });
        });
        this.businessGroup = businessGroup;
      });
    },
    querySearch(queryString, cb) {
      var businessGroup = this.businessGroup;
      var results = queryString
        ? businessGroup.filter(this.createFilter(queryString))
        : businessGroup;
      cb(results);
    },
    createFilter(queryString) {
      return e => {
        return e.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0;
      };
    },
    //提交按钮
    createPurchaseOrder() {
      this.purchaseOrder.proofFigureImageList = this.proofFigureImageList;
      this.purchaseOrder.productImageList = this.productImageList;
      this.purchaseOrder.purchaseOrders = this.purchaseOrderItem;
      this.purchaseOrder.customerOrders = this.customerOrderList;
      createEntity(this.purchaseOrder)
        .then(response => {
          this.$message({
            message: "创建成功",
            type: "success"
          });
          this.resultDetail = response.data;
          this.active++;
        })
        .catch(() => {
          this.$message({
            message: "创建失败，请联系相关人员",
            type: "error"
          });
        });
    },
    // 下一步按钮
    next() {
      if (this.active === 0) {
        // 调取子组件的方法
        let arr = this.$refs.coustomerOrder.judgeContinue();
        if (!arr) {
          return false;
        } else {
          if (arr.length < 1) {
            return false;
          }
        }
        this.customerOrderList = arr;
        let ids = [];
        this.customerOrderList.forEach(e => {
          ids.push(e.customerOrderId);
        });

        this.selectProductByOrderId(ids);
        this.tryValidate(this.$refs.businessGroupForm);
      } else if (this.active === 1) {
        let newArr = this.$refs.orderItem.judgeContinue();
        if (newArr) {
          if (newArr.length > 0) {
            this.purchaseOrderItem = newArr;
            this.tryValidate(this.$refs.purchaseOrderForm);
          } else {
            this.$message({
              message: "必须存在一条有效数据",
              type: "error"
            });
          }
        } else {
          this.$message({
            message: "必须存在一条有效数据",
            type: "error"
          });
        }
      } else if (this.active === 2) {
        // if (this.proofFigureImageList.length < 1) {
        //   this.$message({
        //     message: "您尚未添加采购凭证,请添加采购后继续",
        //     type: "error"
        //   });
        // } else {
        this.active++;
        // }
      } else if (this.active === 3) {
        this.active++;
      }
    },
    // 根据客户订单查询商品集合
    selectProductByOrderId(ids) {
      getCustomerProductItem(ids).then(response => {
        this.pushCustomerOrderItem(response.data);
      });
    },
    // 把客户订单的商品信息复制给 采购订单的商品列表
    pushCustomerOrderItem(array) {
      let orderItem = [];
      array.forEach(element => {
        var purItem = Object.assign({}, defaultPurchaseItem);
        purItem.customerOrderItemId = element.id;
        purItem.quantityPurchased = element.quantityPurchased;
        purItem.name = element.productName;
        purItem.sn = element.productSn;
        purItem.purchaseWholesaleProductId = element.wholesaleProductId;
        purItem.wholesaleProductCount = element.quantity;
        purItem.productAmount = element.saleAmount;
        purItem.wholesaleProductUnit = "件";
        purItem.quantityAvailable = element.quantityAvailable;
        purItem.wholeSaleProductCostPrice = element.salePrice;
        orderItem.push(purItem);
      });
      this.purchaseOrderItem = orderItem;
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
      if (this.active > 0) {
        this.active--;
      }
    },
    getExtimatedPurchaseAmountPrice(val) {
      this.purchaseOrder.extimatedPurchaseAmountPrice = val;
    },
    getAverageCostUnitPrice(val) {
      this.purchaseOrder.averageCostUnitPrice = val;
    },
    // 发送邮件
    sendEmailBtn() {
      if (this.financeEmail == null || this.financeEmail === "") {
        this.$message({
          message: "请选择财务后点击邮件发送",
          type: "error"
        });
        return;
      }
      let params = {
        // purcherOrderId: this.resultDetail.id,
        purcherOrderId: this.resultDetail.id,
        purchaseOrderLink:
          "http://49.234.145.241/purchase/purchaseDetail?id=" +
          this.resultDetail.id,
        emailAddress: this.financeEmail
      };
      sendEmail(params).then(response => {
        this.$message({
          message: "邮箱发送成功",
          type: "success"
        });
      });
    },
    change(item) {
      this.$forceUpdate();
      console.log(item);
    },
    selectChanged(val) {
      if (val != "alibaba") {
        generateSn()
          .then(response => {
            this.purchaseOrder.sn = response.data;
          })
          .catch(e => {
            this.$message({
              message: e,
              type: "error"
            });
          });
      }
    }
  }
};
</script>
<style>
.app {
  margin: 0 auto;
}
</style>