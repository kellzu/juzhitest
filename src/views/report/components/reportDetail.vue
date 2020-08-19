<template>
    <div>
      <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" size="small" :border="true">
        <el-table-column   label="统计时间" align="center" width="120px">
          <template slot-scope="{ row }">
            <template v-if="!edit">
              <!-- <el-input v-model="row.startTime" size="mini" /> -->
              <el-date-picker
                size="mini"
                v-model= "row.startTime "
                format = "yyyy-MM-dd"
                readonly
                type="date"
                placeholder="选择时间">{{row.startTime | timeFormat(row.startTime)}}
              </el-date-picker>
            </template>
            <span v-else>{{ row.startTime| timeFormat(row.startTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="负责人" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.userName" size="mini" />
            </template>
            <span v-else>{{ row.userName }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="产品数" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.productCount" size="mini" />
            </template>
            <span v-else>{{ row.productCount }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="产品曝光" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.productExposure" size="mini" />
            </template>
            <span v-else>{{ row.productExposure }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="产品点击" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.productChickCount" size="mini" />
            </template>
            <span v-else>{{ row.productChickCount }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="询盘（包含TM）" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.inquiryTm" size="mini" />
            </template>
            <span v-else>{{ row.inquiryTm }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="询盘" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.inquiry" size="mini"/>
            </template>
            <span v-else>{{ row.inquiry }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="询盘转化率" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.inquiryPercentConversion" size="mini" />
            </template>
            <span v-else>{{ row.inquiryPercentConversion }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="及时回复率" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.timelyReversionRate" size="mini" />
            </template>
            <span v-else>{{ row.timelyReversionRate }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="平均回复时间 (小时)" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.avgReplyTime" size="mini" />
            </template>
            <span v-else>{{ row.avgReplyTime }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="总下单数" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.amountOrderCount" size="mini" />
            </template>
            <span v-else>{{ row.amountOrderCount }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="成交订单数" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.completeOrderCount" size="mini" />
            </template>
            <span v-else>{{ row.completeOrderCount }}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="总到账金额" align="center">
          <template slot-scope="{ row }">
            <template v-if="edit">
              <el-input v-model="row.arrivalAmount" size="mini" />
            </template>
            <span v-else>{{ row.arrivalAmount }}</span>
          </template>
        </el-table-column>

        <el-table-column  align="center" label="操作" width="180px">
          <template slot-scope="{ row }">
            <el-button class="cancel-btn" v-if="!edit" type="danger" size="mini" @click="cancelEdit(row.id)">删除</el-button>
            <!-- <el-button v-if="!edit" type="success" size="mini" @click="confirmEdit(row)">保存</el-button> -->
            <el-button
              v-else
              type="primary"
              size="mini"
              @click="edit = !edit"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <!-- 分页工具 -->
        <!-- <div class="pagination-container">
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
        </div> -->
      </div>
    </div>
</template>

<script>
const num = 0
import { reportDetailInfo,delReport } from "@/api/report";
export default {
    props:{
      value:Object
    },
    data() {
      return {
        num:0,
        data:{},
        total:null,
        edit:false,
        list: null,
        listLoading: false,
        elementLoadingText: "正在加载...",
        startTimeFil:null
      };
    },
    filters:{
      timeFormat(time){
        return new Date(time)
      }
    },
    created() {
      this.getInfo()
    },
    watch:{
     'value.endTime':function(newVal,oldVal){
       this.getInfo()
     },
     'value.startTime':function(newVal,oldVal){
       this.getInfo()
     },
     'value.pmsShopId':function(newVal,oldVal){
       this.getInfo()
     },
     'value.groupId':function(newVal,oldVal){
       this.getInfo()
     }
    },
    methods: {
      getInfo(){
          this.data.startTime = this.value.startTime
          this.data.endTime = this.value.endTime
          this.data.pmsShopId = this.value.pmsShopId
          this.data.groupId = this.value.groupId
        //  console.log(this.data,"子组件的值");
        if(this.data){
          reportDetailInfo(this.data).then(resp=>{
            // console.log(resp,"resp");
            this.list=resp.data
            this.list.startTime=new Date(resp.data.startTime)
            })
        }else{
          this.$message.error('业务组id为空 没有详情')
        }
      },
        cancelEdit(id) {
          const h = this.$createElement;
          this.$msgbox({
            message: h('p', null, [
              h('span', null, '确定删除')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...';
                delReport(id).then(resp=>{
                  this.getInfo()
                })
                instance.confirmButtonLoading = false;
                done();
              } else {
                done();
              }
            }
          }).then(action => {
            this.fetchList();
          });
        },
        confirmEdit(row) {
            
        },
        handleSizeChange(val) {
          this.listQuery.pageNum = 1;
          this.listQuery.pageSize = val;
          this.getlist();
        },
        handleCurrentChange(val) {
          this.listQuery.pageNum = val;
          this.getlist();
        },
    },
};
</script>

<style scoped lang="scss">

</style>
