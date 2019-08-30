<template>
    <div class="login"> 
        <div class="login-box">
            <h3>路亚帮管理后台</h3>
            <el-input v-model="account" placeholder="账号名"></el-input>
            <el-input v-model="password" placeholder="密码" type="password"></el-input>
            <el-row>
              <el-col :span="12">
                <el-input v-model="code" placeholder="验证码"></el-input>
              </el-col>
              <el-col :span="6">
                  <img :src="cimg" class="cimg">
              </el-col>
              <el-col :span="6">
                <p @click="getCode" class="changecode">换一张</p>
              </el-col>
            </el-row>
            <el-button type="primary" class="login-btn" @click="login" >登录</el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs'
import {setCookie,getCookie} from '@/api/axios';
import {gettoken,slogin,href} from '@/api/api'
import { setTimeout } from 'timers';
import {check} from '@/util/util'
import md5 from 'js-md5';
export default {
    inject:['reload'],//注入刷新方法
    data(){
        return {
            account:'',
            password:'',
            code:'',
            cimg:'',
        }
    },
    created(){
        axios.get(gettoken,{}).then(res=>{
            setCookie('token_',res.data.data.token_,7);
            this.cimg = href+'/getcode?token_='+res.data.data.token_;
        })
    },
    methods:{
        getCode(){
            let token = getCookie('token_');
            this.cimg = href+"/getcode?token_="+token +'&'+ new Date().getTime();
        },
        login(){
            let data = {
                account:this.account,
                password:md5(this.password),
                check_code:this.code,
                token_:getCookie('token_'),
            };
            if(!check(data)){return}
            axios.post(slogin,qs.stringify(data)).then(res=>{
                if(res.data.code == 200){
                    setCookie('token_',res.data.token_,7);
                    setCookie('check_code',res.data.check_code,7);
                    setCookie("infodata",JSON.stringify(res.data.data),7);
                    switch(res.data.data.roleId){
                        case '0':
                            setCookie("systemId", "1", 7);
                            break;
                        case 'master':
                            setCookie("systemId", "2019052717054073780", 7);
                            break;
                        case '2019062611323672620':
                            setCookie("systemId", "2019052113553137390", 7);
                            break;
                        case '2019080214441887640':
                            setCookie("systemId", "2019080214590375090", 7);
                            break;
                        case '2019080214444277130':
                            setCookie("systemId", "2019080214591435420", 7);
                            break;
                    }
                    this.$message.success('登录成功');
                    setTimeout(()=>{
                        this.$router.push('/manage');
                    },1000)
                }else if(res.data.code == 110){
                    this.$message(res.data.msg);
                    setTimeout(()=>{
                        this.reload();
                    },1000)
                }
            })
        },
    }
}
</script>

<style scoped>
    .login{width: 100%;height: 100%;background: url('../assets/bg.jpg') no-repeat;background-size:cover;overflow: hidden; }
    .login-box{color: #fff;width: 300px;overflow: hidden;margin: 0 auto; margin-top: 250px;text-align: center;background: #324057;padding: 25px;border-radius:8px; }
    .login-box h3{font-size: 30px;line-height: 56px;}
    .login-box>div{margin-top: 15px;}
    .login-btn{margin-top: 15px;width: 300px;}
    .cimg{margin-top: 5px;margin-left: 10px;}
    .changecode{line-height: 40px;cursor: pointer;margin-left: 10px;}
</style>
