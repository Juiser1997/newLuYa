<template>
    <p style="margin-left:580px">{{time}}阅读量排行榜</p>
</template>

<script>
export default {
    name: 'getTime',
    props: ['time'],
    data() {
        return {
            date: ''
        }
    }
}
</script>

<style>

</style>