<template>
  <div>
    <el-card class="app-container" shadow="never">
      <el-form ref="messageForm" :model="msgBroad" :rules="rules">
        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput v-model="msgBroad.title" :maxlength="100" name="name" required>标题：</MDinput>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="summary">
          <MDinput v-model="msgBroad.summary" :maxlength="100" name="name" required>摘要：</MDinput>
        </el-form-item>
        <br />
        <el-form-item style="margin-bottom: 40px;" prop="content">
          <quill-editor ref="myTextEditor" v-model="msgBroad.content" :options="editorOption"></quill-editor>
        </el-form-item>
      </el-form>
      <el-button @click="submit_btn">提交</el-button>
    </el-card>
  </div>
</template>

<script>
import { fetchList, createMessage } from "@/api/message";
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
import "quill/dist/quill.snow.css"; // 富文本编辑器外部引用样式  三种样式三选一引入即可
import * as Quill from "quill"; // 富文本基于quill
import MDinput from "@/components/MDinput";
export default {
  components: {
    quillEditor,
    MDinput
  },
  data() {
    const defaultValidate = (rule, value, callback) => {
      if (value == null || !value.length > 0) {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      msgBroad: {
        title: null,
        summary: null,
        content: "<h2>I am Example</h2>"
      },
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image", "video"]
          ]
        }
      },
      rules: {
        title: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        summary: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ],
        content: [
          { required: true, trigger: "blur", validator: defaultValidate }
        ]
      }
    };
  },
  methods: {
    submit_btn() {
      this.$refs.messageForm.validate(val => {
        if (val) {
          createMessage(this.msgBroad).then(response => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          });
        } else {
          this.$message({
            message: "数据填写不正确",
            type: "error"
          });
        }
      });
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quillEditor;
    }
  }
};
</script>

<style>
.edit_container {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.ql-editor {
  height: 400px;
}
</style>