<template>
  <div class="stuff">
    <div class="clearfix">
      <!-- {{ value }} -->
      <div class="raw-item" v-for="(item, index) in value" :key="index">
        <el-input
          placeholder="请输入内容"
          v-model="item.main_material"
          style="width: 200px"
        ></el-input>
        <el-input
          placeholder="请输入内容"
          v-model="item.accessories_material"
          style="width: 100px"
        ></el-input>
        <i
          class="delete-icon el-icon-close"
          v-show="value.length !== 1"
          @click="remove(index)"
        ></i>
      </div>
    </div>
    <el-button
      class="eaeaea"
      type="primary"
      size="medium"
      icon="el-icon-plus"
      @click="add"
      >增加一项</el-button
    >
  </div>
</template>
<script>
// v-model 在组件上面双向绑定 value 发布事件input
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  //跟着这段字段来添加 [ { "name": "", "specs": "" }, { "name": "", "specs": "" }, { "name": "", "specs": "" } ]
  methods: {
    remove(index) {
      // if (index > 0) {
      //   // this.value.splice(index, 1); 不要再元数组操作,或当前对象是原数字操作会弹出警告,使用筛选生成新数组,通过提交父元素emit事先过滤事件通知
      //   const newValue = this.value.filter((item, i) => {
      //     return i !== index;
      //   });
      //   this.$emit("input", [...newValue]); //对象里面每一个数组
      // }
      // this.value.splice(index, 1); 不要再元数组操作,或当前对象是原数字操作会弹出警告,使用筛选生成新数组,通过提交父元素emit事先过滤事件通知
      const newValue = this.value.filter((item, i) => {
        return i !== index;
      });
      // this.$emit("input", [...newValue]); //对象里面每一个数组
      this.$emit("input", newValue); //对象里面每一个数组
    },

    add() {
      this.$emit("input", [...this.value, { name: "", specs: "" }]);
    },
  },
};
</script>

<style lang="stylus">
.delete-icon
  background-color #ccc
  border-radius 50%
  color #fff
  :hover
    background: #ff3232;
    color: #fff;
.raw-item
  float left
  margin-right 65px
  margin-bottom 20px
  .el-input
    margin-right 5px
</style>
