<template> 
  <div>
    <img style="height:80px" :src="trueUrl"/>
  </div>
</template>
<script>
  import {policyUrl} from '@/api/oss'

  export default {
    name: 'singleImg',
    props: {
      value: String,
    },
    data() {
      return {
        trueUrl: '',
      };
    },
    created() {
        let _self = this;
        let params = {
          url: this.value,
        }
        return new Promise((resolve, reject) => {
          policyUrl(params).then(response => {
            _self.trueUrl = response.data;
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val)
      },
    }
  }
</script>
<style>

</style>


