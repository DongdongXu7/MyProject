<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSpu"
          :disabled="!category3Id"
          >添加SPU</el-button
        >

        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{ row, $index }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="waring"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="showSku(row)"
              ></hint-button>
              <el-popconfirm
                :title="`确定删除${row.spuName}吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog :title="`${spu.spuName}的SKU列表`" :visible.sync="dialogTableVisible" :before-close="close">
          <el-table :data="skuList" style="width:100%" v-loading="loading">
            <el-table-column
              prop="skuName"
              label="名称"
            ></el-table-column>
            <el-table-column
              prop="price"
              label="价格"
            ></el-table-column>
            <el-table-column  prop="weight" label="重量"></el-table-column>
            <el-table-column  label="图片">
              <template slot-scope="scope">
                  <img :src="scope.row.skuDefaultImg" alt="" style="width:100px;height:100px">
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>

        <el-pagination
          style="textalign: center"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          layout="prev, pager, next,jumper , -> , sizes , total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeSkuScene="changeSkuScene"
      ></SkuForm>
    </el-card>
  </div>
</template>
<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 3,
      total: 0,
      records: [],
      scene: 0,
      spu: {},
      dialogTableVisible: false,
      skuList:[],
      loading:true,
    };
  },
  methods: {
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
        this.getSpuList();
      }
    },

    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqGetSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },

    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },

    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuForm(this.category3Id);
    },

    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },

    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },

    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "warning", message: "删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },

    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },

    changeSkuScene(scene) {
      this.scene = scene;
    },

    async showSku(row) {
      this.dialogTableVisible=true
      this.spu=row
      let result = await this.$API.spu.reqSkuList(row.id)
      if(result.code == 200){
        this.skuList=result.data
        this.loading=false
      }
    },

    close(){
      this.dialogTableVisible =false
      this.loading = true
      this.skuList=[]
    },
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>