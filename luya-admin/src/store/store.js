import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
    state : {
        list:{
            currentPage:1,
            pageSize:10, 
        }

    },
    // 下面我们定义两个方法，一个添加todoList，一个删除todoList
    mutations: {
        setpage(state,player){
            state.list.currentPage = player;
        },
    },
})
export default store;