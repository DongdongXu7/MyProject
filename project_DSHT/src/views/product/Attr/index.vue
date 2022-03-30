<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card> 
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="address" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名" >
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table :data="attrInfo.attrValueList" border>
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
            
          ></el-table-column>
          <el-table-column
            porp="porp"
            label="属性值名称"
            width="width"
          >
          <template slot-scope="{ row, $index }">
              <!-- 这里结构需要用到span与input进行来回的切换 -->
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            porp="porp"
            label="操作"
            width="width"
          >
          <template slot-scope="{row,$index}">
            <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="delectAttrValue($index)">
              <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
            </el-popconfirm>
            
          </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="adddOrUpdataAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,
      attrInfo:{
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    };
  },
  methods: {
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqGetAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },

    addAttrValue(){
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
        valueName: "",
        flag:true
      })

      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },

    addAttr(){
      this.isShowTable=false
      this.attrInfo={
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      }
    },

    updateAttr(row){
      this.isShowTable = false
      this.attrInfo=cloneDeep(row)

      this.attrInfo.attrValueList.forEach(item=>{
        this.$set(item,'flag',false)
      })
    },

    toLook(row){
      if(row.valueName.trim()==''){
        this.$message("请输入一个正常的数值")
        return ;
      }
      let isRepat = this.attrInfo.attrValueList.some(item=>{
        if(row!=item){
          return row.valueName==item.valueName
        }
      })
      row.flag=false
    },

    toEdit(row,index){
      row.flag=true
      this.$nextTick(()=>{
        this.$refs[index].focus()
      })
    },

    delectAttrValue(index){
      this.attrInfo.attrValueList.splice(index,1)
    },

    async adddOrUpdataAttr(){
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        if(item.valueName!==''){
          delete item.flag
          return true
        }
      })

    try{
      await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
      this.isShowTable=true
      this.$message({type:'success',message:'保存成功'})
      this.getAttrList()
    }catch(error){
      this.$message({type:'error',message:'保存失败'})
    }
      
    }
  },
};
</script>

<style>
</style>