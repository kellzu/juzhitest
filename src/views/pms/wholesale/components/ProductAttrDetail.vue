<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value"
      :rules="rules"
      ref="productAttrForm"
      label-width="120px"
      style="width: 1000px"
      size="small"
    >
      <el-form-item label="属性类型：">
        <el-select
          v-model="value.productAttributeCategoryId"
          placeholder="请选择属性类型"
          @change="handleProductAttrChange"
        >
          <el-option
            v-for="item in productAttributeCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardBg">
          <div
            v-for="(item,index) in selectProductParam"
            :class="{littleMarginTop:index!==0}"
            v-bind:key="item.id"
          >
            <div class="paramInputLabel">{{item.name}}:</div>
            <el-select
              v-if="item.inputType===1"
              class="paramInput"
              v-model="selectProductParam[index].value"
            >
              <el-option
                v-for="item in getParamInputList(item.inputList)"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            <el-input v-else class="paramInput" v-model="selectProductParam[index].value"></el-input>
          </div>
        </el-card>
      </el-form-item>
      <!-- 批发商品阶梯表 -->
      <el-form-item label="批发阶梯价格">
        <el-table :data="value.wholesaleProductPriceList" style="width: 100%" border>
          <el-table-column label="数量" align="center" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="成本价" align="center" width="100">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.costUnitPrice"
                @change="handleCostPriceMargin(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="批发价" align="center" width="100">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.wholesaleUnitPrice"
                @change="handleUnitPriceMargin(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" align="center" width="150">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.grossProfitMargin"
                @change="handleGrossProftMargin(scope.row)"
              >
                <template slot="append">%</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="快递" align="center" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.shippingWay" placeholder="请选择属性类型">
                <el-option
                  v-for="item in shippingOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="快递费用" align="center" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.shippingCost"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRemoveProductLadder(scope.$index, scope.row)">删除</el-button>
              <el-button type="text" @click="handleAddProductLadder(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="商品相册：" prop="albumPics">
        <multi-upload v-model="selectProductPics" @input="handleUpdateProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="图文详情：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="详情" name="pc">
            <tinymce :width="595" :height="300" v-model="value.detailDesc"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
        <!--
          <el-button type="primary" size="medium" @click="handleNext">下一步，选择商品关联</el-button>
        -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchList as fetchProductAttrCateList } from "@/api/productAttrCate";
import { fetchList as fetchProductAttrList } from "@/api/productAttr";
import {
  batchGetEntity as batchGetAlbum,
  batchCreateEntity as batchCreateAlbum,
  batchDeleteEntity as batchDeleteAlbum
} from "@/api/album.js";
import SingleUpload from "@/components/Upload/singleUpload";
import MultiUpload from "@/components/Upload/multiUpload";
import Tinymce from "@/components/Tinymce";

export default {
  name: "ProductAttrDetail",
  components: { SingleUpload, MultiUpload, Tinymce },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //编辑模式时是否初始化成功
      hasEditCreated: false,
      //商品属性分类下拉选项
      productAttributeCategoryOptions: [],
      //选中的商品属性
      selectProductAttr: [],
      //选中的商品参数
      selectProductParam: [],
      //选中的商品属性图片
      selectProductAttrPics: [],
      //可手动添加的商品属性
      addProductAttrValue: "",
      selectProductPics: [],
      // 商品图片路径和id对应值
      selectProductPicFlag: {},
      //商品富文本详情激活类型
      activeHtmlName: "pc",
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
      DEFAULT_WHOLESALE_PRODUCTPRICE_INSTANCE: JSON.parse(
        JSON.stringify(this.value.wholesaleProductPriceList[0])
      ),
      rules: {
        albumPics: [
          { required: true, message: "请上传商品图片信息", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    //商品的编号
    productId() {
      return this.value.id;
    }
  },
  created() {
    console.log(this.value);
    
    this.getProductAttrCateList();
  },
  watch: {
    productId: function(newValue) {
      if (!this.isEdit) {
        return null;
      }

      if (this.hasEditCreated) {
        return null;
      }
      if (!newValue) {
        return null;
      }

      this.handleEditCreated();
    },
    "value.albumPics": function(newVal) {}
  },
  methods: {
    handleEditCreated() {
      //根据商品属性分类id获取属性和参数
      if (this.value.productAttributeCategoryId != null) {
        this.handleProductAttrChange(this.value.productAttributeCategoryId);
      }
      // 若批发阶梯数组属性大小为0，这添加默认值
      if (this.value.wholesaleProductPriceList.length === 0) {
        this.value.wholesaleProductPriceList.push(
          this.DEFAULT_WHOLESALE_PRODUCTPRICE_INSTANCE
        );
      }
      this.editModeInitSelectsPics();
      this.hasEditCreated = true;
    },
    handleUpdateGrossProftMargin(row) {
      if (row.costUnitPrice && row.wholesaleUnitPrice) {
        row.grossProfitMargin =
          (Number(row.wholesaleUnitPrice) / Number(row.costUnitPrice) - 1) *
          100;
      } else {
        row.grossProfitMargin = 0;
      }
    },
    getProductAttrCateList() {
      let param = { pageNum: 1, pageSize: 100 };
      fetchProductAttrCateList(param).then(response => {
        this.productAttributeCategoryOptions = [];
        let list = response.data.list;
        for (let i = 0; i < list.length; i++) {
          this.productAttributeCategoryOptions.push({
            label: list[i].name,
            value: list[i].id
          });
        }
      });
    },
    getProductAttrList(type, cid) {
      let param = { pageNum: 1, pageSize: 100, type: type };
      fetchProductAttrList(cid, param).then(response => {
        let list = response.data.list;
        this.selectProductParam = [];
        for (let i = 0; i < list.length; i++) {
          let value = null;
          if (this.isEdit) {
            //编辑模式下获取参数属性
            value = this.getEditParamValue(list[i].id);
          }
          this.selectProductParam.push({
            id: list[i].id,
            name: list[i].name,
            value: value,
            inputType: list[i].inputType,
            inputList: list[i].inputList
          });
        }
      });
    },
    //获取属性的值
    getEditParamValue(id) {
      for (
        let i = 0;
        i < this.value.wholesaleProductAttributeValueList.length;
        i++
      ) {
        if (
          id ===
          this.value.wholesaleProductAttributeValueList[i].productAttributeId
        ) {
          return this.value.wholesaleProductAttributeValueList[i].value;
        }
      }
    },
    handleProductAttrChange(value) {
      this.getProductAttrList(1, value);
    },
    handleRemoveProductLadder(index, row) {
      let wholesaleProductPriceList = this.value.wholesaleProductPriceList;
      if (wholesaleProductPriceList.length === 1) {
        // wholesaleProductPriceList.pop();
        // wholesaleProductPriceList.push(
        //   Object.assign({}, DEFAULT_WHOLESALE_PRODUCTPRICE_INSTANCE)
        // );
        this.$message({
          message: "至少留有一条记录",
          type: "warning"
        });
      } else {
        wholesaleProductPriceList.splice(index, 1);
      }
    },
    handleAddProductLadder(index, row) {
      let wholesaleProductPriceList = this.value.wholesaleProductPriceList;
      if (wholesaleProductPriceList.length <= 4) {
        let val = Object.assign(
          {},
          this.DEFAULT_WHOLESALE_PRODUCTPRICE_INSTANCE
        );
        val.grossProfitMargin = 25;
        wholesaleProductPriceList.push(val);
      } else {
        this.$message({
          message: "最多只能添加4条",
          type: "warning"
        });
      }
    },
    editModeInitSelectsPics() {
      //编辑模式下，还未初始化完成，初始化相册图片
      if (!this.value.albumPics) {
        this.selectProductPics = [];
        return;
      }
      var pics = new Set();
      var picAndIds = new Map();
      // 过滤空字符串，过滤路径相同图片
      this.value.albumPics = this.value.albumPics
        .split(",")
        .filter(e => e)
        .join(",");
      let ids = this.value.albumPics
        .split(",")
        .filter(e => e)
        .map(e => parseInt(e));
      batchGetAlbum(ids).then(resp => {
        resp.data.forEach(e => {
          pics.add(e.coverPic);
          picAndIds.set(e.coverPic, {
            flag: false,
            id: e.id
          });
        });
        this.selectProductPics = [...pics];
        this.selectProductPicFlag = picAndIds;
        this.value.albumPics = [...picAndIds.keys()].join(",");
      });
    },
    handleUpdateProductPics(newVal) {
      if (this.isEdit && this.hasEditCreated) {
        // 添加
        let addPics = [];
        let delPics = [];
        newVal.forEach(e => {
          // 若之前的数组中不存在图片，则添加，反之，打标存在
          if (!this.selectProductPicFlag.has(e)) {
            addPics.push({
              name: this.value.name + "图片",
              coverPic: e,
              picCount: newVal.length,
              sort: 0,
              description: this.value.name
            });
          } else {
            // 打标，说明新数组中还存在
            this.selectProductPicFlag.get(e).flag = true;
          }
        });

        for (let [k, v] of this.selectProductPicFlag) {
          if (v.flag === false) {
            // 兼容垃圾数据，图片路径一样
            if (v.id) {
              delPics.push(v.id);
            }
          }
        }
        if (addPics.length > 0) {
          // 批量添加图片元素
          batchCreateAlbum(addPics).then(response => {
            let data = response.data;
            let ids = [];
            data.forEach(e => {
              ids.push(e.id + "");
            });
            ids = this.value.albumPics.split(",").concat(ids);
            this.value.albumPics = ids.filter(e => e).join(",");
          });
        }

        if (delPics.length > 0) {
          // 批量删除图片元素
          batchDeleteAlbum(delPics);
        }
        // 删除老数组中的元素
        let oldIds = this.value.albumPics.split(",");
        for (let i in oldIds) {
          if (delPics.indexOf(oldIds[i]) !== -1) {
            oldIds.splice(i, 1);
          }
        }
        this.value.albumPics = oldIds.join(",");

        let newSelectProductPicFlag = new Map();
        // 重新生成selectProductPicFlag
        newVal.forEach(e => {
          newSelectProductPicFlag.set(e, {
            flag: false,
            id: e.id
          });
        });
        this.selectProductPicFlag = newSelectProductPicFlag;
      } else {
        this.value.albumPics = this.selectProductPics.join(",");
      }

      // 第一张图片设置为主图
      if (newVal != null && newVal.length > 0) {
        this.value.picPath = newVal[0];
      }
    },
    //合并商品属性
    mergeProductAttrValue() {
      this.value.wholesaleProductAttributeValueList = [];
      for (let i = 0; i < this.selectProductParam.length; i++) {
        let param = this.selectProductParam[i];
        this.value.wholesaleProductAttributeValueList.push({
          productAttributeId: param.id,
          value: param.value
        });
      }
    },
    // 成本价修改时发生的改变
    handleCostPriceMargin(row) {
      if (row.grossProfitMargin != null) {
        row.wholesaleUnitPrice = (
          row.costUnitPrice /
          (1 - row.grossProfitMargin / 100)
        ).toFixed(3);
      } else if (row.wholesaleUnitPrice != null) {
        row.grossProfitMargin = (
          ((row.wholesaleUnitPrice - row.costUnitPrice) /
            row.wholesaleUnitPrice) *
          100
        ).toFixed(3);
      }
    },
    // 利率修改时发生的改变
    handleGrossProftMargin(row) {
      if (row.costUnitPrice != null) {
        row.wholesaleUnitPrice = (
          row.costUnitPrice /
          (1 - row.grossProfitMargin / 100)
        ).toFixed(3);
      } else if (row.wholesaleUnitPrice != null) {
        row.costUnitPrice = (
          row.wholesaleUnitPrice *
          (1 - row.grossProfitMargin / 100)
        ).toFixed(3);
      }
    },
    // 售价修改时发生的改变
    handleUnitPriceMargin(row) {
      if (row.costUnitPrice != null) {
      } else if (row.grossProfitMargin != null) {
      }
    },
    getOptionStr(arr) {
      let str = "";
      for (let i = 0; i < arr.length; i++) {
        str += arr[i];
        if (i != arr.length - 1) {
          str += ",";
        }
      }
      return str;
    },
    getParamInputList(inputList) {
      return inputList.split(",");
    },
    handlePrev() {
      this.$emit("prevStep");
    },
    handleFinishCommit() {
      this.mergeProductAttrValue();
      this.$emit("finishCommit", this.isEdit);
    }
  }
};
</script>

<style scoped>
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}
</style>
