import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import {userInfo} from '@/service/api';
import Store from '@/store'

import Home from '@/views/home/Home.vue'   // 引入组件 打包会打包在文件中，如果都用import的话，所有组件都会打包在一个文件中，导致文件很大

// 按需加载，访问路径的时候才会加载，不访问，不加载

/*
后端 yarn dev http://127.0.0.1:7001/banner
TypeError: Cannot read property 'parseComponent' of undefined 
Vue packages version mismatch:
- vue@2.6.12 (C:\xampp\htdocs\02HTML\day02\layui-v2.4.5\layui\kaikeba\FullStack\meishijie2\meishijie-fe不带功能代码\meishijie-fe\node_modules\vue\dist\vue.runtime.common.js)      
- vue-template-compiler@2.6.11 (C:\xampp\htdocs\02HTML\day02\layui-v2.4.5\layui\kaikeba\FullStack\meishijie2\meishijie-fe不带功能代码\meishijie-fe\node_modules\vue-template-compiler\package.json)
第一步： 抄答案
yarn add --dev @vue/component-compiler-utils@3.2.0 现在
或者
npm install --dev @vue/component-compiler-utils@3.2.0
第二步：鉴于大佬们都说是编译器的问题，我又将 "vue-template-compiler": "2.6.10"的版本号调整为2.6.11或者调整为最新`latest`
"devDependencies": {
    ....,"vue-template-compiler": "2.6.11"||"latest"}, 现在是12
3 yarn add --dev vue-template-compiler 这个解决上面的步骤问题
*/ 


const Recipe = () => import( '@/views/recipe/recipe' );
const Create = () => import( '@/views/create/create' );
const Edit = () => import( '@/views/user-space/edit' );

const Space = () => import( /* webpackChunkName: "space" */ '@/views/user-space/space');
const MenuList = () => import( /* webpackChunkName: "space" */ '@/views/user-space/menu-list');
const Fans = () => import( /* webpackChunkName: "space" */ '@/views/user-space/fans');

const Detail = () => import( '@/views/detail/detail');
const Login = () => import( '@/views/user-login/index');

const viewsRoute = [
  {
    path: '/recipe',
    name: 'recipe',
    title: '菜谱大全',
    component: Recipe
  },
  {
    path: '/create',
    name: 'create',
    title: '发布菜谱',
    component: Create,
    meta: {
      login: true
    }
  },
  {
    path: '/edit',
    title: '编辑个人资料',
    name: 'edit',
    meta: {login: true},
    component: Edit
  },
  {
    path: '/space',
    title: '个人空间',
    name: 'space',
    component: Space,
    redirect: {
      name: 'works'
    },
    meta: {
      login: true
    },
    children: [
      {
        path: 'works',
        name: 'works',
        title: '作品',
        component: MenuList,
        meta: {
          login: true
        },
      },
      {
        path: 'fans',
        name: 'fans',
        title: '我的粉丝',
        component: Fans,
        meta: {
          login: true
        },
      },
      {
        path: 'following',
        name: 'following',
        title: '我的关注',
        component: Fans,
        meta: {
          login: true
        },
      },
      {
        path: 'collection',
        name: 'collection',
        title: '收藏',
        component: MenuList,
        meta: {
          login: true
        },
      }
    ]
  },
  {
    path: '/detail',
    name: 'detail',
    title: '菜谱细节',
    component: Detail
  }
]



const router = new Router({
  mode: 'history',  // hash http://localhost:8081#home   http://localhost:8081/home
  routes: [
    {
      path: '/',
      name: 'home',
      title: '首页',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      title: '登录页',
      component: Login,
      meta: {
        login: true
      },
    },
    ...viewsRoute,
    {
      path: '*',
      name: 'noFound',
      title: '未找到',
      redirect: {
        name: 'home'
      }
    }
  ]
})
// 分析路由信息中登陆的标识
router.beforeEach(async (to,from,next)=>{
  // console.log(to)
  const token = localStorage.getItem('token');
  const isLogin = !!token;//转为布尔值
  // const isLogin = false; //false
  // 进入路由的时候,都要向后端发送token,验证合法不合法
  // 不管路由需要不需要登录,都需要展示用户信息 
  // 都需要向后端请求,拿到用户信息接口
  const data = await userInfo();
  // console.log(data); token判断userInfo提示登录成功不成功
  Store.commit('changeUserInfo',data.data)
  if(to.matched.some(item=>item.meta.login)){
    // 需要登录,判断登陆状态 meta是可子路由登录 works {login: true} matched是可登录,需要父级登录的可能. /space /space/works some一些条件上里面一个想登录就筛选登录
    console.log('需要登录')
    if(isLogin) {
      if(data.error === 400){  // 后端告诉你，登录没成功
        next({name: 'login'});
        localStorage.removeItem('token');
        return;
      }
      if(to.name === 'login'){
        next({name: 'home'})
      }else {
        next();
      }
      return;
    }
    // 没登录，进入login，直接进入
    if(!isLogin && to.name === 'login'){
      next();
    }
    // 没登录, 进入的不是login, 跳到login 跳转到什么名字的组件to.name
    if(!isLogin && to.name !== 'login'){
      next({name: 'login'})
    }
  }else{
    next();
  }
})


export default router;