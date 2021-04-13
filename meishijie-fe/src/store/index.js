import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state:{
    userInfo: {}
  },
 // 9 判断是空对象是进行登录
  
  getters:{
    isLogin(state){
      return !!Object.keys(state.userInfo).length;
    }
  },
  mutations:{
    changeUserInfo(state, data){
      console.log(data,data.avatar);
      state.userInfo = data;
    }
  },
  actions:{}
})

export default store;