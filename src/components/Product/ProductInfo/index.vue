<template>
	<div>
		<el-image :src="productsList.picPath" style="width:200px;">
			<div slot="error" class="image-slot">
        		<i class="el-icon-picture-outline"></i>
      		</div>
		</el-image>
		
		 <el-form
		      label-width="150px"
		      style="width: 600px"
		      size="small"
		    >
		      <el-form-item label="商品分类：" prop="productCategoryId">
		        <el-input v-model="productsList.productCategoryName" ></el-input>
		      </el-form-item>
		      <!--厂商选择-->
		      <el-form-item label="厂商：" prop="factoryName">
		        <el-input :value="productsList.factoryName"></el-input>
		      </el-form-item>
		      <el-form-item label="商品名称：" prop="name">
		        <el-input v-model="productsList.name">
		         
		        </el-input>
		      </el-form-item>
		      <el-form-item label="商品英文名：" prop="nameEn">
		          <el-input v-model="productsList.nameEn" placeholder="请输入商品英文名"></el-input>
		      </el-form-item>
		      <el-form-item label="商品关键词：" prop="keywords">
		        <el-input v-model="productsList.keywords" placeholder="若有多个，请用逗号分隔"></el-input>
		      </el-form-item>
		      <el-form-item label="商品来源：" prop="source">
		        <el-select v-model="productsList.source" placeholder="请选择商品来源">
		      <!--     <el-option
		            v-for="item in sourceOptions"
		            :key="item.value"
		            :label="item.label"
		            :value="item.value"
		          ></el-option> -->
		        </el-select>
		      </el-form-item>
		      <el-form-item label="商品来源主题：" prop="sourceTitle">
		        <el-input v-model="productsList.sourceTitle" placeholder="来源平台中主题"></el-input>
		      </el-form-item>
		      <el-form-item label="商品链接：" prop="sourceProductLink">
		        <el-input v-model="productsList.sourceProductLink" placeholder="来源系统链接"></el-input>
		      </el-form-item>
		      <el-form-item label="商品货号：" prop="sn">
		        <el-input v-model="productsList.sn" placeholder="请输入商品货号"></el-input>
		      </el-form-item>
		      <el-form-item label="商品品牌：" prop="brandName">
		        <el-input v-model="productsList.brandName"></el-input>
		      </el-form-item>
		      <!--  <el-form-item label="商品来源货号："prop="sourceSn">
		        <el-input v-model="value.sourceSn" placeholder="请输入商品货号"></el-input>
		      </el-form-item>-->
		      <!--  <el-form-item label="商品条形码："prop="productCode">
		        <el-input v-model="value.productCode"></el-input>
		      </el-form-item>-->
		      <el-form-item label="商品生产时间：" prop="productionTime">
		        <el-input v-model.number="productsList.productionTime">
		          <template slot="append">天</template>
		        </el-input>
		      </el-form-item>
		      <el-form-item label="损失率：" prop="attritionRate">
		        <el-input v-model="productsList.attritionRate">
		          <template slot="append">%</template>
		        </el-input>
		      </el-form-item>
		      <el-form-item label="商品重量：" prop="weight">
		        <el-input-number v-model="productsList.weight"></el-input-number>
		      </el-form-item>
		      <el-form-item label="计量单位：">
		        <el-input v-model="productsList.unit" placeholder="例如：个、只、台"></el-input>
		      </el-form-item>
		      <el-form-item label="商品售价：" prop="retailPrice">
		        <el-input v-model="productsList.retailPrice"></el-input>
		      </el-form-item>

		      <!-- <el-form-item label="商品库存：">
		        <el-input v-model.number="value.stock"></el-input>
		      </el-form-item>-->
		      <el-form-item label="箱规尺寸：">
		        <el-row>
		          <el-col :span="8">
		            <el-form-item>
		              <el-input v-model.number="productsList.cartonLong" size="medium">
		                <template slot="prefix">长</template>
		                <template slot="append">cm</template>
		              </el-input>
		            </el-form-item>
		          </el-col>
		          <el-col :span="8">
		            <el-form-item>
		              <el-input v-model.number="productsList.cartonWidth" size="medium">
		                <template slot="prefix">宽</template>
		                <template slot="append">cm</template>
		              </el-input>
		            </el-form-item>
		          </el-col>
		          <el-col :span="8">
		            <el-form-item>
		              <el-input v-model.number="productsList.cartonHeigh" size="medium">
		                <template slot="prefix">高</template>
		                <template slot="append">cm</template>
		              </el-input>
		            </el-form-item>
		          </el-col>
		        </el-row>
		      </el-form-item>
		      <el-form-item label="箱规个数：">
		        <el-input v-model.number="productsList.cartonCount">
		          <template slot="append">{{value.unit}}</template>
		        </el-input>
		      </el-form-item>
		      <el-form-item label="箱规重量：">
		        <el-input v-model.number="productsList.cartonWeight">
		          <template slot="append">kg</template>
		        </el-input>
		      </el-form-item>
		      <el-form-item label="箱规毛重：">
		        <el-input v-model.number="productsList.cartonGw" size="medium">
		          <template slot="append">最小包装长(单位cm)*宽*高/5000(单位kg/元)</template>
		        </el-input>
		      </el-form-item>
		      <el-form-item label="商品打包说明">
		        <el-input type="textarea" :rows="3" :autoSize="true" v-model="productsList.cartonDesc" />
		      </el-form-item>
		      <el-form-item label="商品起订量：">
		        <el-input v-model.number="productsList.moq">
		          <template slot="append">个</template>
		        </el-input>
		      </el-form-item>
		      <el-form-item label="商品设计说明：">
		        <el-input
		          :autoSize="true"
		          v-model="productsList.designDescription"
		          type="textarea"
		          placeholder="请输入内容"
		        ></el-input>
		      </el-form-item>
		            <!-- 批发商品阶梯表 -->
		      <el-form-item label="批发阶梯价格">
		        <el-table :data="productsList.wholesaleProductPriceList" style="width: 100%" border>
		          <el-table-column label="数量" align="center" width="100">
		            <template slot-scope="scope">
		              <el-input v-model="scope.row.quantity"></el-input>
		            </template>
		          </el-table-column>
		          <el-table-column label="成本价" align="center" width="100">
		            <template slot-scope="scope">
		              <el-input
		                v-model="scope.row.costUnitPrice"
		              ></el-input>
		            </template>
		          </el-table-column>
		          <el-table-column label="批发价" align="center" width="100">
		            <template slot-scope="scope">
		              <el-input
		                v-model="scope.row.wholesaleUnitPrice"
		              ></el-input>
		            </template>
		          </el-table-column>
		          <el-table-column label="毛利率" align="center" width="150">
		            <template slot-scope="scope">
		              <el-input
		                v-model="scope.row.grossProfitMargin"
		              >
		                <template slot="append">%</template>
		              </el-input>
		            </template>
		          </el-table-column>
		          <el-table-column label="快递" align="center" width="150">
		            <template slot-scope="scope">
		              <el-select v-model="scope.row.shippingWay">
		               <!--  <el-option
		                  v-for="item in shippingOptions"
		                  :key="item.value"
		                  :label="item.label"
		                  :value="item.value"
		                ></el-option> -->
		              </el-select>
		            </template>
		          </el-table-column>
		          <el-table-column label="快递费用" align="center" width="100">
		            <template slot-scope="scope">
		              <el-input v-model="scope.row.shippingCost"></el-input>
		            </template>
		          </el-table-column>
		        </el-table>
		      </el-form-item>
		      <el-form-item label="备注：" prop="remark">
		        <el-input :autoSize="true" v-model="productsList.remark" type="textarea" placeholder="请输入内容"></el-input>
		      </el-form-item>
		    </el-form>
		    <cascader ></cascader>
	</div>
</template>
<script>
import { getProduct } from  "@/api/wholesaleProduct";
import cascader from "@/components/Cascader/CountryCascader/index"
	export default{
		components:{cascader},
		props:{
			value:Array
		},
		data(){
			return {
				productsList:{}
			}	
		},
		created(){
			this.getList()
		},
		methods:{
			getList(){
				getProduct(this.value[0].wholesaleProductId).then(resp=>{
					this.productsList = resp.data
				})
			}
		}
	}
</script>