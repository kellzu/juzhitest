<template>
  <div class="imageList">
    <div v-for="(item,index) in imgs" :key="index">
      <el-image :style="istyle" :src="item" :preview-src-list="imgs" fit="none"></el-image>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    imgs: Array,
    istyle: String
  },
  name: "imageList"
};
</script>
<style>
.imageList {
  display: flex;
  justify-content: center;
  
}
</style>