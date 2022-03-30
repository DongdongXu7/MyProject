<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label="list.name" :value="list.id" v-for="(list,index) in list1" :key="list.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="list.name"  :value="list.id" v-for="(list,index) in list2" :key="list.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="list.name"  :value="list.id" v-for="(list,index) in list3" :key="list.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm:{
          category1Id:'',
          category2Id:'',
          category3Id:''
      }
    };
  },
  props:['show'],
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqGetCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },

    async handler1(){
        this.list2=[]
        this.list3=[]
        this.cForm.category2Id=''
        this.cForm.category3Id=''
        const {category1Id} =this.cForm
        this.$emit("getCategoryId",{categoryId:category1Id,level:1})
        let result = await this.$API.attr.reqGetCategory2List(category1Id)
        if( result.code ==200){
            this.list2=result.data
        }
    },

    async handler2(){
        this.list3=[]
        this.cForm.category3Id=''
        const {category2Id}=this.cForm
        this.$emit("getCategoryId",{categoryId:category2Id,level:2})
        let result = await this.$API.attr.reqGetCategory3List(category2Id)
        if( result.code==200){
            this.list3= result.data
        }
    },

    handler3(){
        const {category3Id}=this.cForm
        this.$emit("getCategoryId",{categoryId:category3Id,level:3})
    }
  },
};
</script>

<style>
</style>