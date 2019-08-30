import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import login from '@/views/login'
import manage from '@/views/manage'
import BaiduMap from 'vue-baidu-map'
import {getCookie} from '@/api/axios';
import { Message } from 'element-ui'

NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

Vue.use(BaiduMap, {ak: 'PQEDnbGU7Z2uOiSFG4MQ14yVDKkY9AEZ'})
Vue.use(Router)

const router =  new Router({
  mode:'hash',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path:'/manage',
      name:'',
      component:manage,
      children:[
        {path:'',component:()=>import('@/views/home'),meta:{title:['欢迎页'],keepAlive:false}},
        {path:'/adminpage',component:()=>import('@/views/adminpage'),meta:{title:['页面管理','页面编辑'],keepAlive:true}},
        {path:'/adminpowe',component:()=>import('@/views/adminpowe'),meta:{title:['角色管理','角色列表'],keepAlive:true}},
        {path:'/adminuser',component:()=>import('@/views/adminuser'),meta:{title:['用户管理','用户编辑'],keepAlive:true}},
        {path:'/numbcreate',component:()=>import('@/views/numbcreate'),meta:{title:['高级账号生成'],keepAlive:true}},
        {path:'/adminSQl',component:()=>import('@/views/adminSql'),meta:{title:['接口管理','sql管理'],keepAlive:true}},
        {path:'/apiConfig',component:()=>import('@/views/apiConfig'),meta:{title:['接口管理','接口编辑'],keepAlive:true}},
        {path:'/apilist',component:()=>import('@/views/apilist'),meta:{title:['接口管理','接口列表'],keepAlive:true}},
        {path:'/setSystem',component:()=>import('@/views/setSystem'),meta:{title:['系统管理','系统配置'],keepAlive:true}},
        {path:'/sysConfig',component:()=>import('@/views/sysConfig'),meta:{title:['系统管理','系统字段配置'],keepAlive:true}},
        {path:'/dictionary',component:()=>import('@/views/dictionary'),meta:{title:['字典管理'],keepAlive:true}},
        {path:'/columnMage',component:()=>import('@/views/columnMage'),meta:{title:['栏目管理'],keepAlive:true}},
        {path:'/carouselList',component:()=>import('@/views/carouselList'),meta:{title:['轮播列表'],keepAlive:true}},
        {path:'/addNew',component:()=>import('@/views/addNew'),meta:{title:['新增资讯'],keepAlive:true}},
        {path:'/newAdver',component:()=>import('@/views/newAdver'),meta:{title:['新建广告'],keepAlive:true}},
        {path:'/newList',component:()=>import('@/views/newList'),meta:{title:['资讯列表'],keepAlive:false}},
        {path:'/audit',component:()=>import('@/views/audit'),meta:{title:['大咖审核'],keepAlive:true}},
        {path:'/highuserList',component:()=>import('@/views/highuserList'),meta:{title:['高级用户列表'],keepAlive:false}},
        {path:'/userList',component:()=>import('@/views/userList'),meta:{title:['普通用户列表'],keepAlive:false}},
        {path:'/editColumn',component:()=>import('@/views/editColumn'),meta:{title:['栏目编辑'],keepAlive:true}},
        {path:'/compileInfo',component:()=>import('@/views/compileInfo'),meta:{title:['编辑资讯'],keepAlive:false}},
        {path:'/articleList',component:()=>import('@/views/articleList'),meta:{title:['文章列表'],keepAlive:false}},
        {path:'/addshop',component:()=>import('@/views/addshop'),meta:{title:['新增商家'],keepAlive:false}},
        {path:'/shoplist',component:()=>import('@/views/shoplist'),meta:{title:['商家列表'],keepAlive:false}},
        {path:'/editshop',component:()=>import('@/views/editshop'),meta:{title:['修改商家'],keepAlive:false}},
        {path:'/reportComment',component:()=>import('@/views/reportComment'),meta:{title:['评论举报'],keepAlive:false}},
        {path:'/reportArticle',component:()=>import('@/views/reportArticle'),meta:{title:['文章举报'],keepAlive:false}},
        {path:'/reportDynamic',component:()=>import('@/views/reportDynamic'),meta:{title:['动态管理'],keepAlive:false}},
        {path:'/article',component:()=>import('@/views/article'),meta:{title:['文章详情'],keepAlive:false}},
        {path:'/applyclub',component:()=>import('@/views/applyclub'),meta:{title:['会员审核'],keepAlive:true}},
        {path:'/clublist',component:()=>import('@/views/clublist'),meta:{title:['会员列表'],keepAlive:true}},
        {path:'/brandList',component:()=>import('@/views/brandList'),meta:{title:['品牌商列表'],keepAlive:true}},
        {path:'/higherUps',component:()=>import('@/views/higherUps'),meta:{title:['用户列表'],keepAlive:true}},
        // {path:'/tjshopsort',component:()=>import('@/views/tjshopsort'),meta:{title:['推荐商家排序'],keepAlive:true}},
        {path:'/dongtai',component:()=>import('@/views/dongtai'),meta:{title:['动态举报'],keepAlive:true}},
        {path:'/statistics',component:()=>import('@/views/statistics'),meta:{title:['评论/点赞'],keepAlive:true}},
        {path:'/contentviews',component:()=>import('@/views/contentviews'),meta:{title:['内容浏览量'],keepAlive:true}},
        {path:'/ipstatistics',component:()=>import('@/views/ipstatistics'),meta:{title:['文章阅读量'],keepAlive:true}},
        {path:'/totalcl',component:()=>import('@/views/totalcl'),meta:{title:['各栏目访问量'],keepAlive:true}},
        {path:'/iptotals',component:()=>import('@/views/iptotals'),meta:{title:['ip访问量'],keepAlive:true}},
        
      ]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  //任何用户都可以的权限
  let routerList = JSON.parse(getCookie('routerList'));
  let list = ['manage','editgoodsdetail','compileInfo','editshop','article','higherUps','dongtai'];
  if(routerList){
    list.push.apply(list,routerList)
  }
  let path = to.path.substr(1);
  let haveGo = false;
  // console.log(to)
  for(let k in list){
    if(path==list[k]){
        haveGo = true;
    }
  }
  if(to.path == '/' || to.path == '/manage' || haveGo){
    NProgress.start()
    next();
  }else{
    Message.warning('该页面不存在哦！')
    next(false)
  }
})
router.afterEach((to,form) => {
  NProgress.done()
})
export default router;
