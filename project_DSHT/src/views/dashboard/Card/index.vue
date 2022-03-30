<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <Detail title="总销售额" count="12386">
        <template slot="charts">
          周同比 &nbsp;&nbsp;56.67%
          <svg
            t="1646362271326"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1204"
            width="16"
            height="16"
          >
            <path
              d="M929.408 202.752l-205.269333 24.661333a8.234667 8.234667 0 0 0-4.864 13.994667l61.141333 60.928-232.96 232.32-104.874667-104.533333a16.469333 16.469333 0 0 0-23.296 0l-331.52 330.752a8.234667 8.234667 0 0 0 0 11.605333l46.336 46.464a8.277333 8.277333 0 0 0 11.648 0l285.184-284.288 104.789334 104.533333c6.485333 6.357333 16.896 6.357333 23.296 0l279.722666-278.784 61.098667 60.970667c4.821333 4.821333 13.226667 1.962667 14.037333-4.821333l24.746667-204.8a8.106667 8.106667 0 0 0-9.216-9.002667z"
              fill="#d81e06"
              p-id="1205"
            ></path>
          </svg>
          日同比&nbsp;&nbsp;19.96% &nbsp;
          <svg
            t="1646362383262"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1337"
            width="16"
            height="16"
          >
            <path
              d="M152.436364 287.371636l2.792727 2.490182 244.898909 243.293091 185.6-184.343273 211.316364 209.896728c2.141091 2.117818 3.956364 4.421818 5.445818 6.912l51.223273-50.920728L930.909091 744.727273l-231.563636-76.683637 53.201454-52.829091a36.282182 36.282182 0 0 1-4.189091-2.90909l-2.792727-2.490182-159.837091-158.789818-185.576727 184.343272-296.401455-294.4a35.979636 35.979636 0 0 1 0-51.106909 36.584727 36.584727 0 0 1 48.686546-2.490182z"
              fill="#1afa29"
              p-id="1338"
            ></path>
          </svg>
        </template>
        <template slot="footer">
          <span>日销售额￥ 12423</span>
        </template>
      </Detail>
    </el-col>
    <el-col :span="6">
      <Detail title="访问量" count="84569">
        <template slot="footer">
          <span>日访问量 12423</span>
        </template>
        <template slot="charts">
            <lineCharts></lineCharts>
        </template>
      </Detail>
    </el-col>
    <el-col :span="6">
      <Detail title="支付笔数" count="1546879">
          <template slot="charts">
            <barCharts></barCharts>
        </template>
        <template slot="footer">
          <span>增长率 12423</span>
        </template>
      </Detail>
    </el-col>
    <el-col :span="6">
      <Detail title="运营活动效果" count="78%">
          <template slot="charts">
            <progressCharts></progressCharts>
        </template>
        <template slot="footer">
          <span>
            周同比 &nbsp;&nbsp;56.67%
            <svg
              t="1646362271326"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1204"
              width="16"
              height="16"
            >
              <path
                d="M929.408 202.752l-205.269333 24.661333a8.234667 8.234667 0 0 0-4.864 13.994667l61.141333 60.928-232.96 232.32-104.874667-104.533333a16.469333 16.469333 0 0 0-23.296 0l-331.52 330.752a8.234667 8.234667 0 0 0 0 11.605333l46.336 46.464a8.277333 8.277333 0 0 0 11.648 0l285.184-284.288 104.789334 104.533333c6.485333 6.357333 16.896 6.357333 23.296 0l279.722666-278.784 61.098667 60.970667c4.821333 4.821333 13.226667 1.962667 14.037333-4.821333l24.746667-204.8a8.106667 8.106667 0 0 0-9.216-9.002667z"
                fill="#d81e06"
                p-id="1205"
              ></path>
            </svg>
            日同比&nbsp;&nbsp;19.96% &nbsp;
            <svg
              t="1646362383262"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1337"
              width="16"
              height="16"
            >
              <path
                d="M152.436364 287.371636l2.792727 2.490182 244.898909 243.293091 185.6-184.343273 211.316364 209.896728c2.141091 2.117818 3.956364 4.421818 5.445818 6.912l51.223273-50.920728L930.909091 744.727273l-231.563636-76.683637 53.201454-52.829091a36.282182 36.282182 0 0 1-4.189091-2.90909l-2.792727-2.490182-159.837091-158.789818-185.576727 184.343272-296.401455-294.4a35.979636 35.979636 0 0 1 0-51.106909 36.584727 36.584727 0 0 1 48.686546-2.490182z"
                fill="#1afa29"
                p-id="1338"
              ></path>
            </svg>
          </span>
        </template>
      </Detail>
    </el-col>
  </el-row>
</template>

<script>
import Detail from "./Detail";
import lineCharts from './lineChart'
import barCharts from "./barChart"
import progressCharts from "./progressChart"
export default {
  name: "Card",
  components: { Detail ,lineCharts ,barCharts,progressCharts},
};
</script>

<style>
</style>