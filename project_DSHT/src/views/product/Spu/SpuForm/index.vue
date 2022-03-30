<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">

      <el-form-item label="SPU名称" >
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌"  v-model="spu.tmId">
          <el-option :value="tm.id" :label="tm.tmName"  v-for="(tm) in tradeMarkList" :key="tm.id"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="请输入内容" v-model="spu.description"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handleupload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">

        <el-select :placeholder='`还有${unSelectSaleAttr.length}个未选`' v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect) in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示的是当前SPU属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width" >
            <template slot-scope="{ row }">
              <!--  " -->
              <!-- el-tag:用户展示已有属性值列表的数据的 -->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
                >{{ tag.saleAttrValueName }}</el-tag
              >
              <!-- 底下的解构可以当中咱们当年的span与input切换 -->
              <!--  @keyup.enter.native="handleInputConfirm"  -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
                @keyup.native.enter="handleInputConfirm(row)"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addorSaveSpu">保存</el-button>
        <el-button @click="cancel" >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList:[],
      spuImageList:[],
      saleAttrList:[],
      attrIdAndAttrName:'',
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.spuImageList=fileList
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleupload(respone,file,fileList){
        this.spuImageList=fileList
    },

    cancel(){
        this.$emit("changeScene",{ scene: 0, flag: this.spu.id ? "修改" : "添加"})
        Object.assign(this._data,this.$options.data())
    },

    async initSpuData(spu){
        let spuResult=await this.$API.spu.reqSpu(spu.id)
        if(spuResult.code == 200) {
            this.spu=spuResult.data
        }

        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if(tradeMarkResult.code ==200){
            this.tradeMarkList=tradeMarkResult.data
        }

        let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
        if(spuImageResult.code ==200) {
            let listArr = spuImageResult.data;
            //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
            //需要把服务器返回的数据进行修改
            listArr.forEach((item) => {
              item.name = item.imgName;
              item.url = item.imgUrl;
            });
            //把整理好的数据赋值给
            this.spuImageList = listArr;
        }

        let saleAttrResult = await this.$API.spu.reqBaseSaleAttrList()
        if(saleAttrResult.code == 200) {
            this.saleAttrList=saleAttrResult.data
        }
    },

    addSaleAttr(){
        const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':')
        let newSaleAttrList={baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
        this.spu.spuSaleAttrList.push(newSaleAttrList)
        this.attrIdAndAttrName=''
    },

    addSaleAttrValue(row){
        this.$set(row,'inputVisible',true)
        this.$set(row,'inputValue','')
    },

    handleInputConfirm(row){
        const {baseSaleAttrId,inputValue} = row
        if(inputValue.trim()==''){
            this.$message("属性名不能为空")
            return 
        }

        let result = row.spuSaleAttrValueList.every(item=>{
            return item.saleAttrValueName!=inputValue
        })

        if(!result){
            this.$message({type:'warning',message:'属性名重复'})
            return
        }

        let  newSaleAttrList={baseSaleAttrId,saleAttrValueName:inputValue}
        
        row.spuSaleAttrValueList.push(newSaleAttrList)
        row.inputVisible=false
    },

    async addorSaveSpu(){
        this.spu.spuImageList = this.spuImageList.map(item=>{
            return{
                imgName:item.name,
                imgUrl:(item.response && item.response.data) || item.url,
            }
        })
        let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)

        if (result.code == 200) {
        //提示
        this.$message({ type: "success", message: "保存成功" });
        //通知父组件回到场景0
        this.$emit("changeScene",{scene:0,flag: this.spu.id ? "修改" : "添加"});
      }
      Object.assign(this._data,this.$options.data())
    },

    async addSpuForm(category3Id){
      this.spu.category3Id=category3Id
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if(tradeMarkResult.code ==200){
          this.tradeMarkList=tradeMarkResult.data
      }
      let saleAttrResult = await this.$API.spu.reqBaseSaleAttrList()
      if(saleAttrResult.code == 200) {
          this.saleAttrList=saleAttrResult.data
      }
    }
  },
  computed:{
      unSelectSaleAttr(){
          let result = this.saleAttrList.filter(item=>{
              return this.spu.spuSaleAttrList.every(item1=>{
                  return item.name != item1.saleAttrName
              })
          })
          return result
      }
  }
};
</script>

<style>
</style>