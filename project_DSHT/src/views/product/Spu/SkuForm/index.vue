<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input style="width: 45%" v-model="skuinfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          style="width: 22.5%"
          type="number"
          v-model="skuinfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          style="width: 22.5%"
          type="number"
          v-model="skuinfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="规格描述"
          v-model="skuinfo.skuDesc"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValue">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="sale.saleAttrName"
            v-for="(sale, index) in spuSaleList"
            :key="sale.id"
          >
            <el-select placeholder="请选择" v-model="sale.saleIdAndValue">
              <el-option
                :label="saleValue.saleAttrValueName"
                :value="`${sale.id}:${saleValue.id}`"
                v-for="(saleValue, index) in sale.spuSaleAttrValueList"
                :key="saleValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          :data="spuImageLIst"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="prop" type="selection" width="80">
          </el-table-column>
          <el-table-column prop="date" label="图片" width="300">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.imgUrl"
                :alt="row.imgNme"
                style="width: 100%; height: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgNme" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="defalutSelect(row)"
                >设置默认</el-button
              >
              <el-button type="success" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageLIst: [],
      spuSaleList: [],
      attrInfoList: [],
      skuinfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: "",
        price: 0,
        weight: 0,
        skuDesc: "",
        skuDefaultImg: "",
        skuImageList: [],
        skuAttrvaluelist: [],
        skuSaleAttrValueList: [],
      },
      spu: {},
      imgList: [],
    };
  },
  methods: {
    async getData(category1Id, category2Id, row) {
      this.skuinfo.category3Id = row.category3Id;
      this.skuinfo.spuId = row.id;
      this.skuinfo.tmId = row.tmId;
      this.spu = row;
      let imgResult = await this.$API.spu.reqSpuImageLIst(row.id);
      if (imgResult.code == 200) {
        let list = imgResult.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageLIst = list;
      }

      let saleResult = await this.$API.spu.reqSpuSaleAttrList(row.id);
      if (saleResult.code == 200) {
        this.spuSaleList = saleResult.data;
      }

      let attrResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        row.category3Id
      );
      if (attrResult.code == 200) {
        this.attrInfoList = attrResult.data;
      }
    },

    handleSelectionChange(param) {
      this.imgList = param;
    },

    defalutSelect(row) {
      this.spuImageLIst.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuinfo.skuDefaultImg = row.imgUrl;
    },

    cancel() {
      this.$emit("changeSkuScene", 0);
      Object.assign(this._data, this.$options.data());
    },

    async save() {
      const { spuSaleList, attrInfoList, skuinfo } = this;

      skuinfo.skuSaleAttrValueList = spuSaleList.reduce((prev, item) => {
        if (item.saleIdAndValue) {
          const [saleId, valueId] = item.saleIdAndValue.split(":");
          prev.push({ saleId, valueId });
        }
        return prev;
      }, []);

      skuinfo.skuAttrvaluelist = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValue) {
          const [attrId, valueId] = item.attrIdAndValue.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);

      skuinfo.skuImageList = this.imgList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });

      let result  = await this.$API.spu.reqAddSku(skuinfo)
      if(result.code == 200){
        this.$message({type:"success" , message:"保存成功"})
        this.$emit('changeSkuScene',0)
      }

    },
  },
};
</script>

<style>
</style>