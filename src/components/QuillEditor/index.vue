<template>
  <div>
    <quill-editor v-model="editorContext" :options="editorOption"></quill-editor>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css"; // 富文本编辑器外部引用样式  三种样式三选一引入即可
import * as Quill from "quill"; // 富文本基于quill
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
export default {
  components: { quillEditor },
  props: {
    value: {
      type: String
    }
  },
  created() {
    console.log(this.value);
    if (this.value) {
      this.editorContext = this.value;
    }
  },
  data() {
    return {
      editorContext: null,
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
      }
    };
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
  margin-top: 60px;
}
.ql-editor {
  height: 400px;
}
</style>