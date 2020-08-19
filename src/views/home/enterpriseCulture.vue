<template>
  <div>
    <div class="un-handle-layout">
      <div class="layout-title">六大价值观</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-button
              type="text"
              class="font-medium"
              @click="moveCustomers = true"
            >感动客户---客户第一，超出期望</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="text" class="font-medium" @click="teamwork = true">团队合作---共享共担，平凡人做非凡事</el-button>
          </el-col>
          <el-col :span="8">
            <el-button
              type="text"
              class="font-medium"
              @click="embraceChange = true"
            >拥抱变化---迎接变化，勇于创新</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-button type="text" class="font-medium" @click="integrity = true">诚信----诚实正直，言行坦荡</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="text" class="font-medium" @click="passion = true">激情---乐观向上，永不放弃</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="text" class="font-medium" @click="introspection = true">自省---见贤思齐，追求卓越</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="layout-title">公司使命</div>
      <div class="un-handle-content">
        <div class="font-medium dream">成就有梦想的人</div>
      </div>
    </div>
    <el-dialog title="感动客户" :visible.sync="moveCustomers" width="55%">
      <span class="values">
        <b>感动客户---客户第一，超出期望</b>
        <br />
        <br />
        <li>1：尊重他人，随时随地维护聚知公司形象</li>
        <li>2：微笑面对投诉和受到的委屈，积极主动地在工作中为客户解读问题</li>
        <li>3：与客户交流工程中，即使不是自己的责任，也不推诿</li>
        <li>4：站在客户的立场思考问题，在坚持原则的基础上，最终达到客户和公司都满意</li>
        <li>5：具有超前服务意识，未雨绸缪，超出客户的期望</li>
      </span>
    </el-dialog>
    <el-dialog title="团队合作" :visible.sync="teamwork" width="55%">
      <span class="values">
        <b>团队合作---共享共担，平凡人做非凡事</b>
        <br />
        <br />
        <li>1：积极融入团队，乐于接受同时的帮助，配合团队完成工作</li>
        <li>2：决策前积极发表建设性意见，充分参与团队讨论，决策后，无论个人是否有异议，必须从言行上完全给予支持</li>
        <li>3：积极主动分享业务知识和经验，主动给予同时必要的帮助；善于利用团队的力量解决问题和困难</li>
        <li>4：善于和不同类型的同事合作，不将个人喜好带入工作，充分体现“对事不对人”的原则</li>
        <li>5：有主人翁意识，积极正面地影响团队，改善团队士气和气围</li>
      </span>
    </el-dialog>
    <el-dialog title="拥抱变化" :visible.sync="embraceChange" width="55%">
      <span class="values">
        <b>拥抱变化---迎接变化，勇于创新</b>
        <br />
        <br />
        <li>1：适应公司的日常变化，不抱怨</li>
        <li>2：面对变化，理性对待，充分沟通，诚意配合</li>
        <li>3：对变化产生的困难和挫折，能自我调整，并能够正面影响和积极带动同事</li>
        <li>4：在工作有前瞻意识，建立新方法，新思路</li>
        <li>5：创造变化，并带来绩效突破性的提高</li>
      </span>
    </el-dialog>
    <el-dialog title="诚信" :visible.sync="integrity" width="55%">
      <span class="values">
        <b>诚信----诚实正直，言行坦荡</b>
        <br />
        <br />
        <li>1：诚实正直，言行一致</li>
        <li>2：通过正确的渠道和流程，准确表达自己的观点；表达批评意见的同时能提出相应意见，直言有讳</li>
        <li>3：不传播未经证实的消息，不背后不负责任地议论事和人，并能正面引导，对于任何意见和反馈“有则改之，无则加勉”</li>
        <li>4：勇于承认错误，敢于承担责任，并及时改正</li>
        <li>5：对损害公司利益的不诚信行为能够正确有效的制止</li>
      </span>
    </el-dialog>
    <el-dialog title="激情" :visible.sync="passion" width="55%">
      <span class="values">
        <b>激情---乐观向上，永不放弃</b>
        <br />
        <br />
        <li>1：喜欢自己的工作，认同聚知公司文化</li>
        <li>2：热爱聚知，顾全大局，不计较个人得失</li>
        <li>3：以积极乐观的心态面对日常工作，碰到困难和挫折的时候永不放弃，不断自我激励，努力提升业绩</li>
        <li>4：始终以乐观主义的精神和必胜的信念，影响并带动同事和团队</li>
        <li>5：不断设定更高的目标，今天的最好表现事明天的最低要求</li>
      </span>
    </el-dialog>
    <el-dialog title="自省" :visible.sync="introspection" width="55%">
      <span class="values">
        <b>自省---见贤思齐，追求卓越</b>
        <br />
        <br />
        <li>1：勇于发表、接纳反对和批判的声音，不追究发言者的责任</li>
        <li>2：主动向行业中的佼佼者学习，找出差距，不断超越并做到卓越</li>
        <li>3：持续学习，自我完善，做事情充分体现以结果为导向</li>
        <li>4：时刻保持惊醒和忧患的意识，乐于接受挑战、迭代，勇于奋斗</li>
        <li>5：每天进行思想、行为的自我反省，复盘得失，总结经验，避免再犯同样的错误</li>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "enterpriseCulture",
  data() {
    return {
      moveCustomers: false,
      teamwork: false,
      embraceChange: false,
      integrity: false,
      passion: false,
      introspection: false
    };
  }
};
</script>
<style>
.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}
.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #f2f6fc;
  font-weight: bold;
}
.dream{
  text-align: center;
  font-size:20px;
  font-weight:  900  
}
.un-handle-content {
  padding: 20px 40px;
}
</style>