<template>
  <div>
    <orderDetail v-model="purchaseOrderId"></orderDetail>
  </div>
</template>
<script>
import orderDetail from "./orderDetail";
export default {
  components: { orderDetail },
  name: "purchaseDetail",
  created() {
    let id = this.$route.query.id;
    if (id != null) {
      this.purchaseOrderId = Number(id);
    }
  },
  data() {
    return {
      purchaseOrderId: null
    };
  },
  methods: {}
};
</script>
<style>
</style>