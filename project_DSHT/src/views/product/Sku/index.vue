<template>
  <div>
    <el-card>
      <el-table style="width: 100%" :data="records">
        <el-table-column type="index" label="序号" align="center" width="80">
        </el-table-column>
        <el-table-column
          prop="skuName"
          label="名称"
          align="center"
          width="width"
        >
        </el-table-column>
        <el-table-column
          prop="skuDesc"
          label="描述"
          align="center"
          width="width"
        >
        </el-table-column>
        <el-table-column label="默认图片" align="center" width="width">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px"/>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量" align="center" width="90">
        </el-table-column>
        <el-table-column prop="price" label="价格" align="center" width="90">
        </el-table-column>
        <el-table-column prop="prop" label="操作" align="center" width="width">
          <template slot-scope="{ row }">
            <el-button
              icon="el-icon-bottom"
              size="mini"
              v-if="row.isSale == 0"
              @click="downLoadSale(row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-top"
              size="mini"
              v-else
              @click="upLoadSale(row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="showInfo(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 15, 20]"
        layout="prev, pager, next,jumper,->,sizes,total"
        :total="total"
        :page-size="limit"
         @current-change="handleCurrentChange"
         @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-card>
    <el-drawer
      :title="`${sku.skuName}信息`"
      :visible.sync="drawer"
      :with-header="false"
      :direction="direction"
      size="50%"
    >
      <el-row :gutter="20">
        <el-col :span="4"
          ><div class="grid-content bg-purple">名称:</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">{{ sku.skuName }}</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple">描述:</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">{{ sku.skuDesc }}</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple">价格:</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">{{ sku.price }}</div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple">平台属性:</div></el-col
        >
        <el-col :span="18"
          ><div class="grid-content bg-purple">
            <el-tag
              type="success"
              v-for="(attr, index) in sku.skuAttrValueList"
              :key="attr.id"
              style="margin-right: 10px"
              >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
            >
          </div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content bg-purple">商品图片:</div></el-col
        >
        <el-col :span="18">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in sku.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      records: [],
      drawer: false,
      direction: "rtl",
      sku: {},
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page=pages
      const { page, limit } = this;
      
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        console.log(result.data);
        this.total = result.data.total;
      }
    },
    // reqSale
    // reqCancel
    async downLoadSale(row) {
      row.isSale = 1;
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        this.$message({ type: "info", message: "商品已下架" });
      }
    },

    async upLoadSale(row) {
      row.isSale = 0;
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "商品已上架" });
      }
    },

    async showInfo(row) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code == 200) {
        this.sku = result.data;
      }
    },

    handleCurrentChange(pager){
      this.page = pager
      this.getSkuList(this.page)
    },

    handleSizeChange(val){
      this.limit=val
      this.getSkuList()
    }
  },
};
</script>

<style lang="less">
.el-row .el-col-4 {
  font-size: 18px;
  text-align: center;
}
.el-col {
  margin: 20px 0px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>