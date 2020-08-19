<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value"
      :rules="rules"
      ref="productInfoForm"
      label-width="150px"
      style="width: 600px"
      size="small"
    >
      <el-form-item label="商品分类：" prop="productCategoryId">
        <el-cascader v-model="selectProductCateValue" :options="productCateOptions"></el-cascader>
      </el-form-item>
      <!--厂商选择-->
      <el-form-item label="厂商：" prop="factoryName">
        <factory-input :value="value.factoryName" @input="obtainInputItem"></factory-input>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.name">
          <el-button slot="append" icon="el-icon-search" @click="handleTranslateNameEn">翻译</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="商品英文名：" prop="nameEn">
        <el-tooltip content="点击上面的商品名称按钮，实现自动google翻译出商品英文名" placement="top">
          <el-input v-model="value.nameEn" placeholder="请输入商品英文名"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="商品关键词：" prop="keywords">
        <el-input v-model="value.keywords" placeholder="若有多个，请用逗号分隔"></el-input>
      </el-form-item>
      <el-form-item label="商品来源：" prop="source">
        <el-select v-model="value.source" placeholder="请选择商品来源">
          <el-option
            v-for="item in sourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品来源主题：" prop="sourceTitle">
        <el-input v-model="value.sourceTitle" placeholder="来源平台中主题"></el-input>
      </el-form-item>
      <el-form-item label="商品链接：" prop="sourceProductLink">
        <el-input v-model="value.sourceProductLink" placeholder="来源系统链接"></el-input>
      </el-form-item>
      <el-form-item label="商品货号：" prop="sn">
        <el-input v-model="value.sn" placeholder="请输入商品货号"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="brandName">
        <el-input v-model="value.brandName"></el-input>
      </el-form-item>
      <!--  <el-form-item label="商品来源货号："prop="sourceSn">
        <el-input v-model="value.sourceSn" placeholder="请输入商品货号"></el-input>
      </el-form-item>-->
      <!--  <el-form-item label="商品条形码："prop="productCode">
        <el-input v-model="value.productCode"></el-input>
      </el-form-item>-->
      <el-form-item label="商品生产时间：" prop="productionTime">
        <el-input v-model.number="value.productionTime">
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="损失率：" prop="attritionRate">
        <el-input v-model="value.attritionRate">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品重量：" prop="weight">
        <el-input-number v-model="value.weight"></el-input-number>
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="value.unit" placeholder="例如：个、只、台"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：" prop="retailPrice">
        <el-input v-model="value.retailPrice"></el-input>
      </el-form-item>

      <!-- <el-form-item label="商品库存：">
        <el-input v-model.number="value.stock"></el-input>
      </el-form-item>-->
      <el-form-item label="箱规尺寸：">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model.number="value.cartonLong" size="medium">
                <template slot="prefix">长</template>
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model.number="value.cartonWidth" size="medium">
                <template slot="prefix">宽</template>
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model.number="value.cartonHeigh" size="medium">
                <template slot="prefix">高</template>
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="箱规个数：">
        <el-input v-model.number="value.cartonCount">
          <template slot="append">{{value.unit}}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="箱规重量：">
        <el-input v-model.number="value.cartonWeight">
          <template slot="append">kg</template>
        </el-input>
      </el-form-item>
      <el-form-item label="箱规毛重：">
        <el-input v-model.number="value.cartonGw" size="medium">
          <template slot="append">最小包装长(单位cm)*宽*高/5000(单位kg/元)</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品打包说明">
        <el-input type="textarea" :rows="3" :autoSize="true" v-model="value.cartonDesc" />
      </el-form-item>
      <el-form-item label="商品起订量：">
        <el-input v-model.number="value.moq">
          <template slot="append">个</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品设计说明：">
        <el-input
          :autoSize="true"
          v-model="value.designDescription"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="商品成本价：" prop="costPrice">
        <el-input v-model="value.costPrice"></el-input>
      </el-form-item>-->

      <!-- <el-form-item label="预期毛利率：" prop="grossProfitMargin">
        <el-input v-model="grossProfitMargin" :readonly="true">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>-->
      <!-- <el-form-item label="商品销量：" v-if="value.id != null">
        <el-input v-model="value.saleAmount"></el-input>
      </el-form-item>-->
      <el-form-item label="状态：" prop="status">
        <el-switch
          active-value="normal"
          inactive-value="normal"
          :active-text="statusMap['normal']"
          :inactive-text="statusMap['delete']"
          v-model="value.status"
        ></el-switch>
      </el-form-item>
      <!-- <el-form-item label="排序">
        <el-input v-model="value.sort"></el-input>
      </el-form-item>-->
      <el-form-item label="备注：" prop="remark">
        <el-input :autoSize="true" v-model="value.remark" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-row>
          <el-col :span="12" :offset="12">
            <el-button
              type="primary"
              size="medium"
              @click="handleNext('productInfoForm')"
            >下一步，填写商品属性</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchListWithChildren } from "@/api/productCate";
import { fetchList as fetchBrandList } from "@/api/brand";
import { transZh2En } from "@/api/google";
import { getProduct } from "@/api/product";
import { STATUS_MAP, STATUS_MAP_QUERY } from "@/utils/status";
import FactoryInput from "@/components/Factory/factoryInput";

export default {
  name: "ProductInfoDetail",
  components: { FactoryInput },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const cartonValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("必填项"));
      } else if (isNaN(Number(value))) {
        callback(new Error("输入数字格式"));
      } else if (Number(value) <= 0) {
        callback(new Error("商品最小尺寸应大于0"));
      } else {
        callback();
      }
    };
    return {
      statusMap: Object.assign({}, STATUS_MAP),
      statusMapQuery: Object.assign({}, STATUS_MAP_QUERY),
      hasEditCreated: false,
      // 选中商品分类的值
      selectProductCateValue: [],
      productCateOptions: [],
      // 商品类别叶子对应枝干map
      productCateLeafBranchMap: null,
      productCategoryIdLevelMap: new Map(),
      brandOptions: [],
      cartonLong: 0,
      cartonWidth: 0,
      cartonHeigh: 0,
      sourceOptions: [
        {
          label: "1688",
          value: "1688"
        },
        {
          label: "自有工厂",
          value: "self"
        }
      ],
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur"
          }
        ],
        nameEn: [
          { required: true, message: "请输入商品英文名", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur"
          }
        ],
        sourceTitle: [
          { required: false, message: "请输入商品来源主题", trigger: "blur" }
        ],
        source: [{ required: true, message: "商品来源", trigger: "blur" }],
        sourceProductLink: [
          { required: true, message: "请输入商品来源链接", trigger: "blur" }
        ],
        productCategoryId: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ],
        brandName: [
          { required: false, message: "请选择商品品牌", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入商品介绍", trigger: "blur" }
        ],
        requiredProp: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ],
        moq: [
          {
            required: true,
            message: "请输入最小起订量",
            trigger: "blur",
            type: "number"
          }
        ],
        stock: [
          {
            required: true,
            message: "请输入商品库存",
            trigger: "blur",
            type: "number"
          }
        ],
        weight: [
          {
            required: false,
            message: "请输入商品重量",
            trigger: "blur",
            type: "number"
          }
        ],
        cartonLong: [
          {
            required: true,
            message: "请输入最小包装尺寸的长",
            trigger: "blur",
            type: "number"
          },
          { validator: cartonValidate, trigger: "blur" }
        ],
        cartonWidth: [
          {
            required: true,
            message: "请输入最小包装尺寸的宽",
            trigger: "blur",
            type: "number"
          },
          { validator: cartonValidate, trigger: "blur" }
        ],
        cartonHeigh: [
          {
            required: true,
            message: "请输入最小包装尺寸的高",
            trigger: "blur",
            type: "number"
          },
          { validator: cartonValidate, trigger: "blur" }
        ],
        cartonCount: [
          {
            required: true,
            message: "请输入最小包装个数",
            trigger: "blur",
            type: "number"
          }
        ],
        cartonWeight: [
          {
            required: true,
            message: "请输入最小包装重量",
            trigger: "blur",
            type: "number"
          }
        ],
        cartonGw: [
          {
            required: true,
            message: "请输入最小包装",
            trigger: "blur",
            type: "number"
          }
        ]
      }
    };
  },
  beforeCreate() {},
  created() {
    this.value.source = "1688";
    if (!this.value.cartonLongWidthHeigh) {
      this.value.cartonLongWidthHeigh = "0,0,0";
    }
    this.updateCartonProperties(this.value.cartonLongWidthHeigh);
    this.getProductCateList();
  },
  computed: {
    //商品的编号
    productId() {
      return this.value.id;
    },
    grossProfitMargin() {
      if (this.value.costPrice && this.value.retailPrice) {
        this.value.grossProfitMargin =
          (this.value.retailPrice / this.value.costPrice - 1) * 100;
        return this.value.grossProfitMargin;
      }
      this.value.grossProfitMargin = 0;
      return 0;
    }
  },
  watch: {
    // 提交时进行合并
    "value.cartonLong": function(newVal) {
      this.setCartonProperties(newVal, 0);
    },
    "value.cartonWidth": function(newVal) {
      this.setCartonProperties(newVal, 1);
    },
    "value.cartonHeigh": function(newVal) {
      this.setCartonProperties(newVal, 2);
    },
    productId: function(newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    },
    selectProductCateValue: function(newValue) {
      if (newValue != null) {
        this.value.productCategoryId = newValue[newValue.length - 1];
        this.value.productCategoryName = this.getCateNameById(
          this.value.productCategoryId
        );
      } else {
        this.value.productCategoryId = null;
        this.value.productCategoryName = null;
      }
    }
  },
  methods: {
    handleTranslateNameEn() {
      if (this.value.name) {
        transZh2En(this.value.name).then(data => {
          if (data) {
            let jsonData = JSON.parse(data);
            if (jsonData.length > 0) {
              this.value.nameEn = jsonData[0][0][0];
            }
          }
        });
      } else {
        this.$message({
          message: "请输入商品名称",
          type: "info",
          duration: 1000
        });
      }
    },
    setCartonProperties(val, index) {
      let arr = ["0", "0", "0"];
      if (this.value.cartonLongWidthHeigh) {
        arr = this.value.cartonLongWidthHeigh.split(",");
      }
      arr[index] = val;
      this.value.cartonLongWidthHeigh = arr.join(",");
    },
    updateCartonProperties(val) {
      let arr = ["0", "0", "0"];
      if (val) {
        arr = this.value.cartonLongWidthHeigh.split(",");
      }
      this.value.cartonLong = arr[0];
      this.value.cartonWidth = arr[1];
      this.value.cartonHeigh = arr[2];
    },
    //处理编辑逻辑
    handleEditCreated() {
      let defaultSelectProductCateValue = [];
      if (
        this.value.productCategoryId != null &&
        this.productCateLeafBranchMap
      ) {
        this.selectProductCateValue = this.productCateLeafBranchMap[
          this.value.productCategoryId
        ];
      }
      this.hasEditCreated = true;
    },
    getProductCateList() {
      fetchListWithChildren().then(response => {
        let list = response.data;
        var children = [];
        this.productCateOptions = children;

        // 分支数组
        var categoryLeafBranchsMap = {};
        this.productCateLeafBranchMap = categoryLeafBranchsMap;
        var productCategoryIdLevelMap = new Map();
        let level = [...list];
        var parentNode = {
          value: 0,
          ids: []
        };
        var levelId = 0;
        while (level.length !== 0) {
          let node = level.shift();
          if (node.children !== null) {
            level.push(...node.children);
          }
          let newNode = {
            label: node.name,
            value: node.id,
            children: null
          };

          // 父级节点变更
          if (node.parentId !== parentNode.value) {
            // 找到对应的父节点
            parentNode = productCategoryIdLevelMap.get(node.parentId);
            children = [];
            parentNode.children = children;
            levelId = parentNode.value;
          }
          // 存储枝干id
          newNode["ids"] = parentNode.ids.concat([node.id]);
          // 若是叶子节点，则收集起来
          if (
            node.children === null ||
            node.children === undefined ||
            node.children.length === 0
          ) {
            categoryLeafBranchsMap[node.id] = newNode.ids;
          }
          productCategoryIdLevelMap.set(newNode.value, newNode);
          children.push(newNode);
        }

        // 若商品商品类别后于商品初始化，则再次初始化
        if (this.productId && !this.selectProductCateValue) {
          this.selectProductCateValue = this.productCateLeafBranchMap[
            this.value.productCategoryId
          ];
        }
        this.productCategoryIdLevelMap = productCategoryIdLevelMap;
        // for (let i = 0; i < list.length; i++) {
        //   let children = [];
        //   if (list[i].children != null && list[i].children.length > 0) {
        //     for (let j = 0; j < list[i].children.length; j++) {
        //       children.push({label: list[i].children[j].name, value: list[i].children[j].id});
        //     }
        //   }
        //   this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
        // }
      });
    },
    getBrandList() {
      fetchBrandList({ pageNum: 1, pageSize: 100 }).then(response => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({
            label: brandList[i].name,
            value: brandList[i].id
          });
        }
      });
    },
    getCateNameById(id) {
      let name = null;
      let node = this.productCategoryIdLevelMap.get(id);
      if (node) {
        name = node.label;
      }
      return name;
    },
    handleNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("nextStep");
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000
          });
          return false;
        }
      });
    },
    obtainInputItem(val) {
      this.value.factoryName = val.value;
      this.value.factoryId = val.id;
    }
  }
};
</script>

<style scoped>
</style>
