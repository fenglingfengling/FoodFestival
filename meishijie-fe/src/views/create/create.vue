<template>
  <div class="create">
    <h2>欢迎发布新菜谱，先介绍一下你的大作！</h2>
    <section class="create-introduce">
      <h5>标题</h5>
      <!-- 14 渲染标题 渲染属性 后端传入数据,可添加扩展标题,菜谱大全,根据属性不同,进行不同筛选的下拉菜单 -->
      {{ backData.title }}
      <el-input
        class="create-input"
        placeholder="请输入内容"
        v-model="backData.title"
      ></el-input>
      <h5>属性</h5>
      <div>
        <!-- {{ backData.property }} -->
        <el-select
          v-for="item in properties"
          :key="item.parent_type"
          :placeholder="item.parent_name"
          v-model="backData.property[item.title]"
        >
          <el-option
            v-for="option in item.list"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          >
          </el-option>
        </el-select>
      </div>
      <h5>菜谱分类</h5>
      <div>
        <!-- {{ backData.classify }} -->
        <el-select placeholder="请选择菜谱分类" v-model="backData.classify">
          <el-option-group
            v-for="group in classifies"
            :key="group.parent_type"
            :label="group.parent_name"
          >
            <el-option
              v-for="options in group.list"
              :key="options.type"
              :label="options.name"
              :value="options.type"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <h5>成品图 (328*440)</h5>
      <div class="upload-img-box clearfix">
        <div class="upload-img">
          <!-- 监听后的数据  @res-url -->
          <upload-img
            action="/api/upload?type=product"
            :image-url="backData.product_pic_url"
            @res-url="
              (data) => {
                backData.product_pic_url = data.resImgUrl;
              }
            "
          ></upload-img>
        </div>
        <!-- {{ backData.product_story }} -->
        <el-input
          class="introduce-text"
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          v-model="backData.product_story"
        >
        </el-input>
      </div>
    </section>
    <!--  使用v-model完成原材料填写 -->
    <h2>记录所有原材料</h2>
    <section class="create-introduce">
      <h5>主料</h5>
      <!--[ { "name": "", "specs": "" }, { "name": "", "specs": "" }, { "name": "", "specs": "" } ]-->
      <Stuff v-model="backData.raw_material.main_material"></Stuff>
      <h5>辅料</h5>
      <Stuff v-model="backData.raw_material.accessories_material"></Stuff>
    </section>

    <h2>开始写步骤了！能否简单易学就看你怎么写了，加油！</h2>
    <section class="create-introduce">
      <!--13 :key="index"  解决用index为key值得复用问题 使用index可以用来展示,用作操作数据变化,会有复用问题,解决用做别的Date.now+n时间戳自增解决
      14 自定义remove父元素 this.$emit("remove", this.n); 提交给父元素子事件触发 @remove="removeStep" 父元素也跟着触发 this.backData.steps.splice(index - 1, 1);
      -->
      <Upload
        v-for="(item, index) in backData.steps"
        :key="item.customeId"
        :n="index + 1"
        v-model="backData.steps[index]"
        @remove="removeStep"
      ></Upload>
      <el-button
        class="eaeaea add-step-button"
        type="primary"
        size="medium"
        icon="el-icon-plus"
        @click="addStep"
        >增加一步</el-button
      >
      <h5>烹饪小技巧</h5>
      <el-input
        class="introduce-text"
        type="textarea"
        :rows="8"
        placeholder="分享下你做这道菜的过程中的心得和小技巧吧！"
        v-model="backData.skill"
      >
      </el-input>
    </section>
    <h5></h5>
    <!-- 
      createError.js?2d83:16 Uncaught (in promise) Error: Request failed with status code 500
      冒500看后端数据,是否出错,createError.js?2d83:16 Uncaught (in promise) Error: Request failed with status code 500.
     -->
    <!--:icon="el - icon - loading" -->
    <el-button class="send" @click="send" type="primary" size="medium" :icon="icon"
      >搞定，提交审核</el-button
    >
  </div>
</template>
<script>
import Stuff from "./stuff";
import Upload from "./step-upload";
import UploadImg from "@/components/upload-img";
import { getProperty, getClassify, publish } from "@/service/api";
import { publicEncrypt } from "crypto";
// 向后端发送的数据结构
const backData = {
  title: "", // 标题
  product_pic_url: "", // 成品图URL
  product_story: "", // 成品图故事
  property: {
    craft: 0, // 工艺 enum: [1,2,3,4],
    flavor: 0, // 口味  enum: [1,2,3,4],
    hard: 0, // 难度 enum: [1,2,3,4],
    pepole: 0, // pepole 人数: [1,2,3,4],
  }, // 属性
  raw_material: {
    // 料
    main_material: [{ name: "", specs: "" }], // 主料
    accessories_material: [{ name: "", specs: "" }], // 辅料
  },
  setps: [{ img_url: "", describe: "" }], //步骤
  classify: "", // 菜谱分类
  skill: "",
};
const raw_material_struct = { name: "", specs: "" };
const steps_struct = { img_url: "", describe: "" };
// 页面中展示的数据 用户长生的,像后端发送的数据
let n = 1;
const mockData = {
  title: "青菜萝卜蘑菇红烧肉摆盘加上牡丹花",
  property: {
    craft: "1-1",
    flavor: "2-3",
    hard: "3-2",
    people: "4-4",
  },
  classify: "1-2",
  product_pic_url:
    "http://127.0.0.1:7001\\static\\upload\\product\\328X440（2）15652798643781607415851751.jpg",
  product_story: "入口香脆,香味弥漫,一顺喜欢.",
  raw_material: {
    main_material: [
      {
        name: "",
        specs: "",
        main_material: "爽肤水蓝色的",
        accessories_material: "流流的",
      },
      {
        name: "",
        specs: "",
        main_material: "天然水",
        accessories_material: "淡的",
      },
      {
        name: "",
        specs: "",
        main_material: "开水",
        accessories_material: "等凉喝",
      },
    ],
    accessories_material: [
      {
        name: "",
        specs: "",
        main_material: "白糖",
        accessories_material: "甜的",
      },
      {
        name: "",
        specs: "",
        accessories_material: "甜的",
        main_material: "雪梨",
      },
      {
        name: "",
        specs: "",
        main_material: "杏子",
        accessories_material: "酸甜",
      },
    ],
  },
  steps: [
    {
      img_url:
        "http://127.0.0.1:7001\\static\\upload\\step\\210X210X215642686347731607415941137.jpg",
      describe: "牡丹花",
    },
    {
      img_url:
        "http://127.0.0.1:7001\\static\\upload\\step\\210X21015642688745881607415955038.jpg",
      describe: "花开富贵",
    },
    {
      img_url:
        "http://127.0.0.1:7001\\static\\upload\\step\\210X21015642688745881607415964406.jpg",
      describe: "褐色的艳",
    },
  ],
  skill: "下油,炸油葱姜蒜,青菜萝卜蘑菇小炒加热,放肉混炒4分钟.",
};
export default {
  name: "create",
  components: { Stuff, Upload, UploadImg },
  data() {
    return {
      properties: [], // 页面展示的数据
      classifies: [],
      icon: "",
      backData: {
        title: "",
        property: {
          // 不够灵活,用接口返回来的数据,来接受属性,利于扩展
          // craft: '',
          // flavor: ''
        },
        classify: "",
        product_pic_url:
          "https://s1.c.meishij.net/n/images/upload_big_img.png?_=1561906961",
        product_story: "",
        raw_material: {
          //主料 需要剩余参数解构...raw_material_struct 直接对象会相同对象,不定参数会解构返回新对象, 实现浅复制或者用Object.assign()浅复制
          main_material: Array(3)
            .fill(1)
            .map(() => ({ ...raw_material_struct })), // 主料  //
          accessories_material: Array(3)
            .fill(1)
            .map(() => ({ ...raw_material_struct })), // 辅料
        },
        steps: Array(3)
          .fill(1)
          .map(() => ({ ...steps_struct, customeId: this.uuid() })),
        skill: "",
      },
    };
  },
  mounted() {
    getProperty().then(({ data }) => {
      console.log(data);
      this.properties = data;
      this.backData.property = data.reduce((o, item) => {
        o[item.title] = "";
        return o;
      }, {});
      console.log(this.backData.property);
    });
    getClassify().then(({ data }) => {
      console.log(data);
      this.classifies = data;
    });
  },
  methods: {
    uuid() {
      n++;
      return Date.now() + n;
    },
    addStep() {
      this.backData.steps.push({
        ...steps_struct,
        customeId: this.uuid(),
      });
    },
    removeStep(index) {
      this.backData.steps.splice(index - 1, 1);
    },
    send() {
      this.icon = "el-icon-loading";
      let param = this.backData;
      /*
      上传菜谱 信息上传后端, 后端没有customeId
      1.删除字段 删除字段后,当前页面需要用到这个字段的地方可能会有问题
      2. 精确上传由我们定义提取,提取我们需要的字段
       爽肤水  流流的 天然水 淡的 开水 等凉喝
       白糖 雪梨  杏子  甜的  酸甜 牡丹花 花开富贵 褐色的艳 下油,炸油葱姜蒜,青菜萝卜蘑菇小炒加热,放肉混炒4分钟.
      */
      param.steps = param.steps.map((item) => {
        return {
          img_url: item.img_url,
          describe: item.describe,
        };
      });
      /*
      1.测试过程中不跳转,手动去打开指定的跳转到的页面去看数据对不对 用来测数据
      2. mock数据, 模拟一套数据， 预先准备一套 json字符串序列化一下 JSON.stringify(param, null, 2)
      */
      // console.log(param); console.log(JSON.stringify(param, null, 2));
      param = mockData;
      publish(param).then((data) => {
        console.log(data);
        this.$router.push({
          name: "space",
        });
      });
      // console.log(this.backData);
    },
  },
};
</script>
<style lang="stylus">

.create-introduce
  background-color #fff
  padding 20px

  .add-step-button
    margin-left 100px

.create
  width 100%
  h2
    text-align center
    margin 20px 0
  .send
    // ff3232()
    height: 70px;
    width: 220px;
    background #ff3232
    color #fff
    border none
    margin 20px auto
    display block


  h5
    margin 20px 0

.create-input input
  width 446px
  line-height 22px
.upload-img-box
  .upload-img
    float left
  .introduce-text
    float left
  .el-textarea
    width 60%
    margin-left 10px
</style>
