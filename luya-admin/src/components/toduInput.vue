<template>
    <div id="input">
        <div class="form-group">
            <div class="row">
                <el-input type="text" class="form-control " @keyup.enter="addTodo" v-model="newTodo" size="mini"/>
                <el-button class="tbn btn-success  form-control" @click.enter="addTodo" >添加</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default({
        name :'input',
        data(){
            return {
                newTodo : '',
            }
        },
        methods : {
            addTodo(){
                //这里使用commit来提交 addTodoList mutations
                this.$store.commit('addTodoList',this.newTodo)
            }
        }
    })
</script>