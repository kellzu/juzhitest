<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="给自己评分" name="me">给自己评分</el-tab-pane>
            <el-tab-pane label="给他人评分" name="he">给他人评分</el-tab-pane>
        </el-tabs>
        <el-card>
            <el-steps :active="active" align-center>
                <el-step title="价值观" description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title="过程" description="开发中..."></el-step>
                <el-step title="预期结果" description="开发中..."></el-step>
                <el-step title="提交考核结果" description="这是一段很长很长很长的描述性文字"></el-step>
            </el-steps>
            <el-button style="margin-top: 12px;" v-show="this.active != 1" @click="prev">上一步</el-button>
            <el-button style="margin-top: 12px;" v-show="this.active != 4" @click="next">下一步</el-button>
            <el-button style="margin-top: 12px;" v-show="this.active == 4" @click="next">提交</el-button>
        </el-card>
        <el-card v-show="this.active == 1">
            <div slot="header" class="clearfix">
                <span>价值观</span>
                <el-button size="mini" > 添加</el-button>
                <el-form>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="s"
                        label="一、感动客户------客户第一，超出期望">
                    </el-table-column>
                    <!-- <el-table-column
                    prop="s"
                    label="打分补充说明">
                    </el-table-column> -->
                    <el-table-column
                    prop="f"
                    label="评分">
                        <div class="block">
                            <el-rate
                                v-model="value2"
                                :colors="colors">
                        </el-rate>
                        </div>
                    </el-table-column>
                </el-table>
                </el-form>
            </div>
        </el-card>
        <h1 style="font-size: 60px" v-show="this.active == 2">开发中...</h1>
        <h1 style="font-size: 60px" v-show="this.active == 3">开发中...</h1>
        <el-card v-show="this.active == 4">
            <el-form>
            <el-table
                :data="tableData1"
                border
                style="width: 100%">
                <el-table-column
                prop="date"
                label="价值观合计"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
                label="工作效率得分">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.a"></el-input>
                </template>
                
                </el-table-column>
                <el-table-column
                label="目标达成率">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.a"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                prop="date"
                label="时间">
                </el-table-column>
                <el-table-column
                prop="pep"
                label="考核人">
                </el-table-column>
            </el-table>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active: 1,
        activeName:"me",
            value1: null,
        value2: null,
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'] , // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
        listQuery:'',
        tableData1:[{
            date: '2016-05月份',
            name: '一、感动客户------客户第一，超出期望',
            a:12,
            pep:"K"
            },],
        tableData: [{
          date: '2016-05月份',
          name: '一、感动客户------客户第一，超出期望',
          s: '尊重他人，随时随地维护聚知公司形象',
        },{
          date: '2016-05月份',
          name: '一、感动客户------客户第一，超出期望',
          s: '微笑面对投诉和受到的委屈，积极主动地在工作中为客户解决问题',
        },
        {
          date: '2016-05月份',
          name: '一、感动客户------客户第一，超出期望',
          s: '与客户交流过程中，即使不是自己的责任，也不推诿',
          g: '站在客户的立场思考问题，在坚持原则的基础上，最终达到客户和公司都满意',
          h: '具有超前服务意识，未雨绸缪，超出客户的期望',
        },
        {
          date: '2016-05月份',
          name: '一、感动客户------客户第一，超出期望',
          s: '站在客户的立场思考问题，在坚持原则的基础上，最终达到客户和公司都满意',
        },{
          date: '2016-05月份',
          name: '一、感动客户------客户第一，超出期望',
          s: '具有超前服务意识，未雨绸缪，超出客户的期望',
        }],

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {

       getDate(){

           this.listQuery = {}
        },
        next(){
            if (this.active++ > 3) this.active = 0;
        },
        prev(){
            this.active--
        },
        handleClick(tab, event) {
        console.log(tab, event);
      }

    }
}
</script>

<style scoped lang="scss">

</style>
