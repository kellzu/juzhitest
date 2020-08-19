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
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.sn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader clearable v-model="selectProductCateValue" :options="productCateOptions"></el-cascader>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAddProduct()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img style="height: 80px" :src="scope.row.picPath" />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品来源" width="120" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.source}}</p>
          </template>
        </el-table-column>
        <el-table-column label="成本价/货号" width="150" align="center">
          <template slot-scope="scope">
            <p>价格：{{scope.row.costPrice}}￥</p>
            <p>货号：{{scope.row.sourceSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.saleAmount}}</template>
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
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import { getEntityIdName } from "@/api/customerReceiveAddress";
import {
  fetchList,
  updateDeleteStatus,
  updateRecommendStatus,
  updatePublishStatus
} from "@/api/wholesaleProduct";
import { fetchList as fetchPriceList } from "@/api/wholesaleProductPrice";
import { fetchListWithChildren } from "@/api/productCate";

const defaultListQuery = {
  sn: null,
  keyword: null,
  status: "normal",
  pageNum: 1,
  pageSize: 5,
  productCategoryId: null
};
export default {
  name: "wholesaleProductIndex",
  inheritAttrs: true,
  props: {
    // 若存在客户订单编号， 则只查询客户订单编号中的商品信息，反之全部商品信息
    customerOrderId: {
      type: Number,
      default: null
    }
  },
  watch: {
    customerId: function(newVal, oldVal) {
      this.loadDatas(newVal);
    }
  },
  computed: {},
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      selectProductCateValue: [],
      operates: [
        {
          label: "加入购物车",
          value: 0
        }
      ],
      productCateOptions: [],
      operateType: 0,
      idNameList: [],
      username: this.value,
      list: null,
      total: null,
      listLoading: false
    };
  },
  beforeUpdate() {},
  created() {
    this.getList();
    this.getProductCateList();
  },
  filters: {
    gmtCreateTimeFormat(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    gmtModifyTimeFormat(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleBatchOperate() {
      if (this.multipleSelection < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
          duration: 1000
        });
        return;
      }
      // 完成批量修改功能
      var selectProducts = {};
      for (let i = 0; i < this.multipleSelection.length; i++) {
        selectProducts[this.multipleSelection[i].id] = this.multipleSelection[
          i
        ];
      }
      if (this.operateType === 0) {
        //启用
        // 批量添加进购物车, 传递Object类型(id: 'xx', name: 'xx', nameEn: 'xx', picPath: 'xx', costPrice: 'xx', retailPrice: '')
        this.multiAddProductsToCart(selectProducts);
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000
        });
        return;
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      if (val != defaultListQuery.pageSize) {
        this.getList();
      }
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    multiAddProductsToCart(selectProducts) {
      // 批量添加进购物车, 传递Object类型(id: 'xx', name: 'xx', nameEn: 'xx', picPath: 'xx', costPrice: 'xx', retailPrice: '')
      this.$emit("add", selectProducts);
    }
  }
};
</script>