<template>
  <section class="detail-header">
    <img class="detail-img" :src="info.product_pic_url" :alt="info.product_pic_url"/>
    <div class="detail-header-right">
      <div class="detail-title clearfix">
          <h1 class="title">{{info.title}}</h1>
          <!--
            1. 不显示，这个菜谱是当前用户发布的
            2. 显示，后端返回一个是否收藏的字段
          -->
          <div class="detail-collection" v-if="!isOnwer">
            <!-- collection-at  no-collection-at-->
            <a 
              href="javascript:;" 
              class="collection-at" 
              :class="{'no-collection-at': info.isCollection}"
              @click="toggleCollection"
            > 
                {{
                  info.isCollection ? '已收藏'  : '收藏'
                }}
            </a>
          </div>
      </div>
      
        <ul class="detail-property clearfix">
        <li v-for="item in info.properties_show" :key="item.type">
          <strong>{{item.parent_name}}</strong>
          <span>{{item.name}}</span>
        </li>
      </ul>

      <div class="user">
        <router-link id="tongji_author_img" class="img" :to="{name:'space',query:{userId:info.userInfo.userId}}">
          <img :src="info.userInfo.avatar">
        </router-link>
        <div class="info">
          <h4>
            <!--Error in render: "TypeError: Cannot set property 'userId' of undefined" 没有找到info.userInfo.userIdd <router-link id="tongji_author"  :to="{name:'space',query:{userId:info.userInfo.userId}}" v-if='info.userInfo.name' 因为  data() {return { menuInfo: {{}} 在detail.vue上只定义了menuInfo 也就是:info="menuInfo" 深层不能判断 1 加判断,不过判断用在逻辑上而不是用在属性判断是否存在>  2.加默认字段  data() {return { menuInfo: {{userInfo: {},}}-->
            <router-link id="tongji_author"  :to="{name:'space',query:{userId:info.userInfo.userId}}">
              {{info.userInfo.name}}
            </router-link>
          </h4>
          <span>菜谱： {{info.userInfo.work_menus_len}} /　关注：{{info.userInfo.following_len}}　/　粉丝：{{info.userInfo.follows_len}}</span>
          <strong v-if="info.userInfo">{{info.userInfo.createdAt}}</strong>

        </div>
      </div>
    </div>
    </div>
  </section>
</template>
<script>
import {toggleCollection} from '@/service/api'
export default {
  props:{
    info: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isOnwer(){
      return this.info.userInfo.userId === this.$store.state.userInfo.userId
    }
  },
  methods:{
    async toggleCollection(){
      // 先判断一下是否登录
      if(!this.$store.getters.isLogin){
        this.$message({
          showClose: true,
          message: '请先登录，再收藏',
          type: 'warning'
        });
        return;
      }
      const data = await toggleCollection({menuId: this.info.menuId});
      // console.log(data);
      this.info.isCollection = data.data.isCollection;
    }
  }
}
</script>

<style lang="stylus">
.detail-header
  margin-top 40px
  display flex
  background-color #fff
  .detail-img
    width 328px
  .detail-header-right
    width 662px
    
    .detail-title
      box-sizing border-box
      width 100%
      padding-left: 25px;
      border-bottom: 1px solid #eee;
      .title
        max-width: 288px;
        height: 44px;
        padding: 28px 0px;
        line-height: 44px;
        font-size: 36px;
        color: #333;
        float left
      .collected
        background: #999;
      .collecte
        background: #ff3232;
      .detail-collection
        float right
        display block
        height: 50px;
        line-height: 44px;
        color #fff
        padding: 0px 14px;
        text-align center
        
        margin-top 25px
        cursor pointer
        a 
          display: inline-block;
          padding: 3px 0;
          width: 50px;
          color: #fff;
          text-align: center;
          line-height 20px
        .collection-at
          background-color: #ff3232;
        .no-collection-at
          background-color: #999;
    
    .detail-property
      margin-left 2px
      overflow hidden
      li 
        width 199px
        float left
        height 48px
        border-right 1px solid #eee
        padding 18px 0px 18px 20px
        border-bottom 1px solid #eee
        strong 
          color #999
          line-height 18px
          display block
          height 18px
        span 
          display block
          font-size 24px
          color #ff3232
          line-height 30px
          width 100px
        
    .user
      height 70px
      padding 20px 0px 20px 20px
      overflow hidden
      font-size 12px
      a.img
        display block
        height 70px
        width 70px
        float left
        position relative
        border-radius 35px
        overflow hidden
        img
          display block
          height 70px
          width 70px
      .info
        float left
        padding-left 10px
        height 70px
      h4
        height 22px
        line-height 22px
        font-size 14px
        color #ff3232
        position relative
        a
          color #ff3232
          display inline-block
          vertical-align top
          padding-right 0px
          height 22px
      span 
        line-height 24px
        display block
        color #666
        padding-top 4px
      strong 
        line-height 22px
        color #999


</style>
