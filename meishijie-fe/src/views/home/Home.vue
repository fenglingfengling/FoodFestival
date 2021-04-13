<template>
  <div class="home">
    <!-- 轮播 start -->
    <el-carousel :interval="5000" type="card" height="300px">
      <!--_id 唯一性 -->
      <el-carousel-item v-for="item in banners" :key="item._id">
        <!--1. /detail?menuId=5d83bfba2f7cb93a4009cf98 跳到那个页面名字name属性, 跳到那个详情页的数据query属性 {menuId:item._id} 根据menuId来跳转-->
        <router-link :to="{ name: 'detail', query: { menuId: item._id } }">
          <img :src="item.product_pic_url" width="100%" alt="" />
        </router-link>
      </el-carousel-item>
    </el-carousel>
    <!-- 轮播 end -->
    <!-- 获取菜谱内容 去service/api.js文件  menu-card使用-->
    <!-- 内容精选 瀑布流形式 start waterfall实现-->
    <div>
      <h2>内容精选</h2>
      <!-- :info='info' 来自menu-card文件中info 接收外面传来的信息,渲染页面 -->
      <waterfall ref="waterfall" @view="loadingMenuHandle">
        <menu-card :margin-left="13" :info="menuList"></menu-card>
      </waterfall>
    </div>
    <!-- 内容精选 瀑布流形式 end -->
  </div>
</template>

<script>
import MenuCard from "@/components/menu-card.vue";
import Waterfall from "@/components/waterfall.vue";
import { getBanner, getMenus } from "@/service/api.js";
// 引入 注册 使用
export default {
  name: "home",
  components: {
    MenuCard: MenuCard,
    Waterfall,
  },
  data() {
    return {
      banners: [],
      menuList: [],
      page: 1,
      isLoading: false,
    };
  },
  mounted() {
    getBanner().then((data) => {
      this.banners = data.data.list;
    });
    // 3 缩减页面数量,初始化page
    getMenus({ page: this.page }).then((data) => {
      this.menuList = data.data.list;
      this.pages = Math.ceil(data.data.total / data.data.page_size);
    });
  },
  methods: {
    loadingMenuHandle() {
      console.log("在外监听的，已到可视区");
      this.page++;
      if (this.page > this.pages) {
        this.$refs.waterfall.isLoading = false;
        return;
      }
      this.$refs.waterfall.isLoading = true;

      getMenus({ page: this.page }).then((data) => {
        this.menuList.push(...data.data.list); //6 自增就用push数组来实现,所以取里面要用数组
        this.$refs.waterfall.isLoading = false;
      });
    },
  },
};
</script>
<style lang="stylus">
.home
  h2
    text-align center
    padding 20px 0;

  .el-carousel__item h3
    color #475669
    font-size 14px
    opacity 0.75
    line-height 200px
    margin 0


  .el-carousel__item:nth-child(2n)
    background-color #99a9bf


  .el-carousel__item:nth-child(2n+1)
    background-color #d3dce6
</style>
