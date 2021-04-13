<template>
  <div class="waterfall" ref="waterfall">
    <slot></slot>
    <div class="waterfall-loading" ref='loading' v-show="isLoading">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>
<script>
import {throttle} from 'throttle-debounce';
export default {
  name: 'Waterfall',
  data(){
    return {
      isLoading:false
    }
  },
  mounted(){
    // 4.绑定this到view里面 5, 优化每隔一段时间后再去执行函数,不用频繁触发 节流函数
    this.scrollHandler = throttle(400,this.scroll.bind(this))
    window.addEventListener('scroll',this.scrollHandler);
  },
  destroyed() {
    window.removeEventListener('scroll',this.scrollHandler);
  },
  methods:{
    scroll(){
      console.log(124);
      if(this.isLoading) return;
      if(this.$refs.waterfall.getBoundingClientRect().bottom < document.documentElement.clientHeight){
        console.log('已到可视区');
        this.isLoading = true
        this.$emit('view');
      }
    }
  }
}
</script>
<style lang="stylus">
.waterfall-loading
  width 100%
  height 20px
  text-align center
</style>