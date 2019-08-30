// const href = "http://192.168.3.192:8080"; //本地地址
const href = 'https://luyabang.com/lyb'//线上地址
// const href = "http://192.168.3.191:8080"; //本地地址

module.exports = {
  href: href,
  login: href + "/wx/login", //登录
  loginOpenID: href + '/wx/openlogin',//用户已授权 但是请求错误的再次静默登录
  sendMsg: href + "/user/sendMessage", //发送验证码
  regist: href + "/user/regist", //注册
  homeData: href + "/column/indexpage", //首页最新数据
  nextmenu: href + "/column/nextmenu", //首页二级菜单数据
  writelist:href+'/user/lyb',//大咖列表
  articledetail: href + "/content/detail", //文章详情
  contentlist:href+'/user/content',//大咖文章列表
  commentsave: href + "/comment/save", //评论
  commentlist: href + "/comment/list", //评论列表
  commentdelete: href + "/comment/deltecomment", //删除评论
  praisesave: href + "/praise/save", //点赞
  nolike:href+'/praise/nolike',//不喜欢
  replaysave: href + "/reply/save", //回复
  replaydelete: href + "/reply/delete", //删除回复
  replylist: href + "/reply/list", //回复列表
  fanssave: href + "/fans/save", //关注
  report: href + "/report/save", //举报

  //用户信息（我的）
  usercontent:href + "/user/content", //用户信息内容
  usergetcolm: href + "/user/get", //用户信息中的文章列表
  usemyattention: href + "/user/myattention", //我的关注
  usermyfans: href + '/user/myfans',//我的粉丝
  usermycomment: href + '/user/mycomment', //我的评论
  fansdelete: href + '/fans/delete', //关注取消
  userget: href + '/user/get', //用户信息
  userupdate:href+'/user/update',//用户信息修改
  readhistory: href + '/readhistory/list', //阅读记录  
  readdelete:href+'/readhistory/delete',//删除阅读纪录
  userapplay:href+'/user/applaymaster',
  collectsave:href+'/collect/save',//文章收藏
  collectlist:href+'/collect/list',//收藏列表
  collectdelete:href+'/collect/delete',//取消收藏
  msgpush:href+'/push/list',//消息推送
  msgnum:href+'/push/msgnumber',//未读消息数量
  tglogin: href + '/user/checkvip',
  //路亚圈
  dynamicgetall: href + '/dynamic/getall', //所有路亚圈
  dynamicsave: href + '/dynamic/saves', //发布路亚圈
  dynamicatention:href+'/dynamic/attention',//关注的人的圈子
  dynamicnearby:href+'/dynamic/nearby',//附近的圈子
  dynamiclist:href+'/dynamic/list',//我的圈子
  contentdetail:href+'/dynamic/detail',//动态详情
  dynamicdelete:href+'/dynamic/delete',//删除动态
  dynamicmsg:href+'/dynamic/msg',//动态消息

  clubsave:href+'/club/save',
  shoplist:href+'/business/lists',//商家列表
  tjshoplist: href +'/user/lyb',//推荐商家列表
  totalip:href+'/totalip/count'
}