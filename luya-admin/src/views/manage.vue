<template>
  <div class="home">
    <el-row style="height: 100%;min-width:1200px;">
      <el-col :span="3" style="min-height: 100%; background-color: #324057; min-width:150px;">
        <p class="title">路亚运营后台</p>
        <el-menu
          :default-active="defaultActive"
          background-color="#324057"
          text-color="#fff"
          active-text-color="#20a0ff"
          unique-opened
          router>
          <template v-for="(list,v) in pagelist">
            <el-submenu :key="v" :index="list.id" v-if="list.child.length !=0">
              <template slot="title">
                <span class="blank"></span>
                {{list.name}}
              </template>
              <el-menu-item v-for="(li,i) in list.child" :key="i" :index="li.path">{{li.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item :key="v" :index="list.path" v-if="list.child.length ==0">
              <span class="blank"></span>
              {{list.name}}
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
      <el-col :span="21" style="height: 100%;overflow: auto;min-width:1050px;">
        <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {getPage} from '@/api/page'
import { getpage } from "@/api/api";
import { setCookie, getCookie } from "@/api/axios";
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      pagelist: [],
      system: ""
    };
  },
  created() {
    let user = JSON.parse(getCookie("infodata"));
    if (user == null) {
      this.$router.push("/");
      return;
    }
    let ndata = { roleId: user.roleId, systemId:getCookie("systemId")};
    axios.post(getpage, qs.stringify(ndata)).then(res => {
      let data = res.data.data;
      this.pagelist = data;
      let SetRouterlist = [];
      for (let k in data) {
        if (data[k].path != "") {
          SetRouterlist.push(data[k].path);
        }
        if (data[k].child.length > 0) {
          for (let i in data[k].child) {
            SetRouterlist.push(data[k].child[i].path);
          }
        }
      }
      setCookie("routerList", JSON.stringify(SetRouterlist), 7);
    });
    // reportMsg().then(res=>{
    //   console.log(res)
    // })
  },

  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>
<style scoped>
.home {width: 100%;height: 100%;}
.title {color: #20a0ff;font-size: 20px;line-height: 60px;text-align: center;box-sizing: border-box;border-bottom: 1px solid #999;}
.el-menu {width: 100%;}
.blank {display: block;width: 15px;height: 56px;float: left;}
</style>
