<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row>
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" >
                    <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table :data="orderList" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="订单编号" prop='order_number'></el-table-column>
            <el-table-column label="订单价格" prop="order_price"></el-table-column>
            <el-table-column label="是否付款" prop="pay_status">
                <template slot-scope="{row}">
                    <el-tag type="success" effect="dark" v-if="row.pay_status === '1'">已付款</el-tag>
                    <el-tag type="danger" effect="dark" v-else>未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send"></el-table-column>
            <el-table-column label="下单时间" prop="create_time">
                <template slot-scope="{row}">
                    {{row.create_time | dateFormat}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template>
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                    <el-button type="primary" class="el-icon-edit" size="mini" @click="showBox"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="定位" placement="top" :enterable="false">
                    <el-button type="success" class="el-icon-location-outline" size="mini" @click="showProgressBox"></el-button>
                  </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </el-card>
    <!-- 修改地址表单 -->
    <el-dialog title="收货地址" :visible.sync="dialogTableVisible" width="40%" @close="addressDialogClosed">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef">
            <el-form-item label="省市区/县" prop="address1" label-width="90px">
                <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2" label-width="90px">
                <el-input v-model="addressForm.address2" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 展示物流进度 -->
    <el-dialog
    title="物流进度"
    :visible.sync="processDialogVisible"
    width="50%">
    <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
        </el-timeline-item>
    </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
import processData from './processData'
export default {
  name: 'orders',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      dialogTableVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cityData,
      processDialogVisible: false,
      processData,
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) this.$message.error('获取数据列表失败！')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    searchGoods() {
      this.getOrderList()
    },
    showBox() {
      this.dialogTableVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    showProgressBox() {
      const res = processData
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.progressInfo = res.data
      this.processDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../plugins/timeline/timeline.css';
@import '../../../plugins/timeline-item/timeline-item.css';

.el-cascader{
    width: 100%;
}
</style>
