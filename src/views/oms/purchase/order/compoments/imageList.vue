<template>
  <div class="imageList">
    <div v-for="(item,index) in images" :key="index">
      <el-image :style="istyle" :src="item" :preview-src-list="images"></el-image>
    </div>
  </div>
</template>
<script>
export default {
  name: "imageList",
  props: {
    images: {
      type: Array
    },
    istyle: {
      type: String
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>
<style>
.imageList {
  display: flex;
  justify-content: center;
}
</style>