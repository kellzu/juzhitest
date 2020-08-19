<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input
              style="width: 203px"
              @keyup.native.enter="handleSearchList()"
              v-model="listQuery.keyword"
              placeholder="商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input
              style="width: 203px"
              @keyup.native.enter="handleSearchList()"
              v-model="listQuery.sn"
              placeholder="商品货号"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品状态">
            <el-select v-model="listQuery.status">
              <el-option
                v-for="item in productStatus"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader clearable v-model="selectProductCateValue" :options="productCateOptions"></el-cascader>
          </el-form-item>
          <el-form-item label="业务员：">
            <admin-user-input v-model="listQuery.createUserName" @input="handleSeletCreateUserName"></admin-user-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>

      <el-button class="btn-add" @click="import1688DialogVisible=true" size="mini">导入</el-button>
      <el-button class="btn-add" @click="handleAddProduct()" size="mini">添加</el-button>
      <el-button class="btn-add" type="primary" @click="searchOnSale()" size="mini">查询已上架商品</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="40px" align="center"></el-table-column>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{scope.row.sn}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120px" align="center">
          <template slot-scope="scope">
            <img
              style="height: 80px"
              :src="scope.row.picPath"
              @click="handleUpdateProduct(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="商品Title" align="center">
          <template slot-scope="scope">
            <a
              :href="productSourceLink(scope.row.sourceProductLink)"
              target="_blank"
            >{{scope.row | nameFormatter}}</a>
          </template>
        </el-table-column>
        <el-table-column label="商品来源" width="100px" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.source}}</p>
          </template>
        </el-table-column>
        <el-table-column width="80px" label="成本价" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.costPrice}}￥</p>
          </template>
        </el-table-column>
        <el-table-column label="上架" width="230px" align="center">
          <template slot-scope="scope">
            <el-tooltip :content="'Switch value: ' + scope.row.publishStatus" placement="top">
              <el-switch
                v-model="scope.row.publishStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="已上架"
                active-value="on_sale"
                inactive-text="未上架"
                inactive-value="take_off"
                @change="handleDeleteStatusChange(scope.$index,scope.row)"
              ></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="批发价格" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleShowPriceEditDialog(scope.$index, scope.row)"
              circle
            ></el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.saleAmount}}</template>
        </el-table-column>-->
        <!-- <el-table-column label="预期毛利率" width="100" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.grossProfitMargin}}</span>%
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">查看</el-button> -->
            <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="success">报价表</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small"
      >确定</el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,20,30,40,50]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="编辑货品信息" :visible.sync="editPriceInfo.dialogVisible" width="50%">
      <p>
        <span>商品名称：</span>
        <span>{{editPriceInfo.productName}}</span>
      </p>
      <el-input
        placeholder="按批发数量搜索"
        @change="handleSearchEditPrice"
        v-model.number="editPriceInfo.keyword"
        size="small"
        style="width: 50%;margin-left: 20px"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditPrice"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px" :data="editPriceInfo.priceList" border>
        <el-table-column label="批发数量" align="center" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quantity">
              <template slot="prefix">>=</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="批发成单价" align="center" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.costUnitPrice">
              <template slot="append">￥</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="批发售单价" align="center" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.wholesaleUnitPrice">
              <template slot="append">$</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="毛利率" align="center" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.grossProfitMargin">
              <template slot="append">%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="快递" width="180" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.shippingWay" placeholder="请选择属性类型">
              <el-option
                v-for="item in shippingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.value }}</span>
                &nbsp;&nbsp;
                <span
                  style="float: right; color: #8492a6; font-size: 13px"
                >{{ item.text }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="批发运费" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.shippingCost"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPriceInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditPriceConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="导入1688商品" :visible.sync="import1688DialogVisible" width="50%">
      <p>
        <span>1688导入商品功能说明：</span>
        <span>
          <p>1. 阿里巴巴反爬虫很厉害，若导入一直失败，请不要频繁重试，会导致ip被封</p>
          <p>2. chrome可以安装Examine Offline Data插件，点击插件图标即可获取cookie，若还不知道，请咨询@邵建豪</p>
          <p>3. cookie可以重复使用</p>
        </span>
      </p>

      <el-form
        :model="spider1688"
        ref="spider1688Form"
        label-width="120px"
        :rules="spider1688Rules"
      >
        <el-form-item label="1688网址：" prop="url">
          <el-input v-model="spider1688.url" placeholder="请输入浏览器地址栏1688网址"></el-input>
        </el-form-item>
        <el-form-item label="1688网址的cookie：" prop="cookie">
          <el-input
            type="textarea"
            :rows="3"
            v-model="spider1688.cookie"
            placeholder="请输入1688网址的cookie"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="import1688DialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleImportProduct" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  updateDeleteStatus,
  updateRecommendStatus,
  updatePublishStatus,
  import1688Product,
  putOnShelf,
  stopProduction
} from "@/api/wholesaleProduct";
import { fetchList as spiderFetchList, getByUrlApi } from "@/api/spiderLog";
import AdminUserInput from "@/components/Admin/adminUserInput";
import {
  fetchList as fetchPriceList,
  batchUpdateEntity as batchUpdatePrice
} from "@/api/wholesaleProductPrice";
import { fetchList as fetchProductAttrList } from "@/api/productAttr";
import { fetchListWithChildren } from "@/api/productCate";

const defaultListQuery = {
  createUserId: null,
  publishStatus:null,
  keyword: null,
  status: null,
  pageNum: 1,
  pageSize: 10,
  productCategoryId: null,
  sn: null,
  createUserId: null,
  createUserName: null
};
const validate1688Url = (rule, value, callback) => {
  if (!value.startsWith("https://detail.1688.com/offer/")) {
    callback(new Error("url地址必须是1688商品网址!"));
  } else {
    let data = {
      url: value
    };
    getByUrlApi(data).then(resp => {
      if (resp.data !== null) {
        callback(new Error("该商品信息已爬取，无需重复爬取!"));
      } else {
        callback();
      }
    });
  }
};
const defaultProductStatus = [
  {
    value: "normal",
    label: "正常"
  },
  { value: "delete", label: "已删除" }
];
export default {
  name: "productList",
  components: { AdminUserInput },
  data() {
    return {
      adminName: "",
      editPriceInfo: {
        dialogVisible: false,
        wholesaleProductId: null,
        productName: null,
        productAttributeCategoryId: null,
        stockList: [],
        priceList: [],
        productAttr: [],
        keyword: null
      },
      productStatus: Object.assign({}, defaultProductStatus),
      operates: [
        {
          label: "转移到分类",
          value: "transferCategory"
        },
        {
          label: "移入回收站",
          value: "recycle"
        }
      ],
      import1688DialogVisible: false,
      spider1688: {
        url: null,
        cookie: null
      },
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
      shippingOptions: [
        {
          label: "air express",
          text: "空运快递7-9d",
          value: "air express"
        },
        {
          label: "air cargo",
          text: "航空邮件13d+",
          value: "air cargo"
        },
        {
          label: "sea",
          text: "海运30d+",
          value: "sea"
        }
      ],
      spider1688Rules: {
        url: [
          { trigger: "blur", required: true, message: "请输入1688商品链接" },
          { trigger: "blur", validator: validate1688Url }
        ],
        cookie: [
          { trigger: "blur", required: true, message: "请输入1688网址cookie" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getProductCateList();
  },
  watch: {
    selectProductCateValue: function(newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }
    }
  },
  filters: {
    nameFormatter: function(row) {
      if (row.nameEn) {
        return row.nameEn;
      }
      if (row.name) {
        return row.name;
      }
      return row.sourceTitle;
    }
  },
  methods: {
    productSourceLink(url) {
      if (url) {
        return url;
      }
      return "#";
    },
    handleSeletCreateUserName(item) {
      if (item) {
        (this.listQuery.createUserId = item.id),
          (this.listQuery.createUserName = item.label);
      } else {
        this.listQuery.createUserId = null;
        this.listQuery.createUserName = "";
      }
    },
    getProductSkuSp(row, index) {
      if (index === 0) {
        return row.sp1;
      } else if (index === 1) {
        return row.sp2;
      } else {
        return row.sp3;
      }
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getProductCateList() {
      fetchListWithChildren().then(response => {
        let list = response.data;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({
                label: list[i].children[j].name,
                value: list[i].children[j].id
              });
            }
          }
          this.productCateOptions.push({
            label: list[i].name,
            value: list[i].id,
            children: children
          });
        }
      });
    },
    handleShowPriceEditDialog(index, row) {
      this.editPriceInfo.dialogVisible = true;
      this.editPriceInfo.wholesaleProductId = row.id;
      this.editPriceInfo.productName = row.name;
      this.editPriceInfo.productAttributeCategoryId =
        row.productAttributeCategoryId;
      this.editPriceInfo.keyword = null;

      let params = new URLSearchParams();
      params.append("wholesaleProductId", row.id);
      if (this.editPriceInfo.keyword) {
        params.append("quantity", this.editPriceInfo.keyword);
      }
      fetchPriceList(params).then(response => {
        this.editPriceInfo.priceList = response.data.list;
      });
    },
    handleSearchEditPrice() {
      let params = new URLSearchParams();
      params.append(
        "wholesaleProductId",
        this.editPriceInfo.wholesaleProductId
      );
      params.append("quantity", parseInt(this.editPriceInfo.keyword));
      fetchPriceList(params).then(response => {
        this.editPriceInfo.priceList = response.data.list;
      });
    },
    handleEditPriceConfirm() {
      if (
        this.editPriceInfo.priceList == null ||
        this.editPriceInfo.priceList.length <= 0
      ) {
        this.$message({
          message: "暂无价格信息",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$confirm("是否要进行修改", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        batchUpdatePrice(this.editPriceInfo.priceList).then(response => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000
          });
          this.editPriceInfo.dialogVisible = false;
        });
      });
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleAddProduct() {
      this.$router.push({ path: "/pms/wholesale/addProduct" });
    },
    handleImportProduct() {
      // 校验传参
      // 调用导入接口
      this.$refs.spider1688Form.validate(valid => {
        if (valid) {
          this.$confirm("是否要导入该商品?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let data = {
              url: this.spider1688.url,
              cookie: this.spider1688.cookie
            };
            import1688Product(data).then(resp => {
              this.$message({
                type: "success",
                message: "导入任务创建完成，即将跳转商品记录菜单查看任务结果",
                duration: 3000
              });
              // 跳转到爬虫日志页面
              this.$router.push({
                name: "spiderIndex",
                query: { spiderId: resp.data.id }
              });
            });
          });
        } else {
          this.$message({
            message: "请填写url和cookie",
            type: "error",
            duration: 3000
          });
        }
      });
    },
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: "请选择操作类型",
          type: "warning",
          duration: 1000
        });
        return;
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的商品",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$confirm("是否要进行该批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        // 文档;
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        switch (this.operateType) {
          case this.operates[0].value:
            //todo
            this.handleUpdateDeleteStatus("normal", ids);
            break;
          case this.operates[1].value:
            this.handleUpdateDeleteStatus("delete", ids);
            break;
          default:
            break;
        }
        this.getList();
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDeleteStatusChange(index, row) {
      if (row.publishStatus === "on_sale") {
        this.putOnShelf(index, row);
      } else if (row.publishStatus === "take_off") {
        let arr = [];
        arr.push(row.id);
        this.$confirm(
          "此产品已存在静态页面，是否要删除，保留可以避免下次上架重新生成",
          "提示",
          {
            confirmButtonText: "删除静态页面",
            cancelButtonText: "保留静态页面",
            type: "warning"
          }
        )
          .then(() => {
            stopProduction(arr, true).then(resp => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
            });
          })
          .catch(() => {
            stopProduction(arr, false).then(resp => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
            });
          });
      }
    },
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        this.handleUpdateDeleteStatus("delete", ids);
      });
    },
    handleUpdateProduct(index, row) {
      this.$router.push({
        path: "/pms/wholesale/updateProduct",
        query: { id: row.id }
      });
    },
    handleShowProduct(index, row) {
      this.$message({
        type: "success",
        message: "功能暂未开发"
      });
    },
    handleShowVerifyDetail(index, row) {
      this.$message({
        type: "success",
        message: "功能暂未开发"
      });
    },
    handleShowLog(index, row) {
      this.$message({
        type: "success",
        message: "功能暂未开发"
      });
    },
    handleUpdateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", deleteStatus);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: "操作成功",
          type: "success",
          duration: 1000
        });
        this.getList();
      });
    },
    updateStatus(status, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", status);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: "更改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    handleSelect(data) {
      this.adminName = data.value;
      this.listQuery.createUserId = data.id;
    },
    searchOnSale() {
      let iListQuery = Object.assign({}, this.listQuery);
      iListQuery.publishStatus = "on_sale";
      fetchList(iListQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    putOnShelf(index, row) {
      let ids = [];
      ids.push(row.id);
      putOnShelf(ids).then(response => {
        this.$message({
          message: "上架成功",
          type: "success"
        });
      });
    }
  }
};
</script>
<style></style>


