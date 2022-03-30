<template>
  <div >
    <Card/>
    <Sale/>
    <Observe/>  
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from "./Card"
import Sale from "./Sale"
import Observe from "./Observe"
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components:{
    Card,
    Sale,
    Observe,
  },
  mounted(){
    this.$store.dispatch('getData')
  }
}
</script>

<style >

</style>
