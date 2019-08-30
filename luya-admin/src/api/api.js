// const href = "http://192.168.3.189:8080"; //本地地址
const href = 'http://luyabang.com/lyb'//线上地址
// const href = "http://192.168.3.191:8080"; //本地地址

module.exports = {
    href:href,
    //登录管理
    gettoken:'/gettoken',//获取服务器的token验证码
    slogin:'/login',//登录
    signout:'/loginout',//登出
    //系统管理
    getpage:'/role/getsystempage',//获取对应管理系统的页面
    refrush:'/sysconfig/refresh',//刷新系统
    systemlist:'/system/listall',//获取系统列表
    systemdelete:'/system/delete',//删除系统
    systemupdate:'/system/update',//修改系统信息
    systemsave:'/system/save',//新建系统
    systemPage:'/system/getpage',//获取系统可选择的的页面
    systemsavepage:'/systempage/save',//配置系统页面
    systemdeletepage:'/systempage/delete',//删除系统页面
    sysconfiglist:'/sysconfig/list',//系统配置列表
    sysconfigdelete:'/sysconfig/delete',//删除系统配置
    sysconfigsave:'/sysconfig/save',//新建配置
    sysconfigupdate:'/sysconfig/update',//修改配置
    //页面管理
    pagelist:'/page/listall',//获取所有的页面api
    pageupdate:'/page/update',//修改单个页面名字或路径
    pagesave:'/page/save',//新增页面
    pagedelete:'/page/delete',//删除页面
    //角色管理
    rolelist:'/role/listall',//获取角色列表
    addrole:'/role/save',//新增角色
    deleterole:'/role/delete',//删除角色
    modifyrole:'/role/update',//修改角色名字
    rolegetpage:'/role/getpage',//获取角色可选页面权限
    rolegetmenu:'/role/getmenu',//获取角色可选接口权限
    saverolepage:'/rolepage/save',//页面权限保存选中的值
    deleterolepage:'/rolepage/delete',//页面权限取消选中
    saverolemenu:'/rolemenu/save',//接口权限保存选中的值
    deleterolemenu:'/rolemenu/delete',//接口权限取消选中
    //系统用户管理
    userList:'/sysuser/list',//获取用户列表
    userexport:href + '/user/print',//普通用户列表导出
    highexport:href + '/user/print2',//高级用户列表导出
    becomehighuser:href + '/user/print3',//成为高级会员信息导出
    deleteUser:'/sysuser/delete',//删除用户
    updateUser:'/sysuser/update',//更新用户信息
    editPassword:'/sysuser/updatepwd',//修改用户密码
    addUser:'/sysuser/save',//新增用户
    //接口管理
    menuList:'/menu/listall',//接口列表api
    menuSave:'/menu/save',//新增接口
    menuUpdate:'/menu/update',//更新接口信息
    menuDelete:'/menu/delete',//删除接口
    menuPagelist:'/menu/list',//接口列表分页
    menuParamlist:'/menuparam/list',//接口参数信息列表
    menuParamsave:'/menuparam/save',//保存接口参数信息
    menuParamDelete:'/menuparam/delete',//删除接口参数信息
    sqllist:'/sql/list',//获取sql列表
    sqldelete:'/sql/delete',//删除
    sqlupdate:'/sql/update',//修改sql信息
    sqlsave:'/sql/save',//保存sql信息api
    //字段管理
    dictionarylist:'/dictionary/listall',//字段树
    dictionarydelete:'/dictionary/delete',//删除字典
    dictionaryupdate:'/dictionary/update',//修改字典
    dictionarysave:'/dictionary/save',//新增字典

    //内容管理
    columndetail:'/column/details',//新增资讯联动
    columnlist:'/column/listall',//栏目列表
    columnsave:'/column/save',//新增栏目
    columnupdate:'/column/update',//修改栏目
    columndelete:'/column/delete',//删除栏目
    savecontent:'/content/savecontent',//新增资讯保存
    contentlist:'/content/list',//查询资讯列表
    contentissue:'/content/update',//取消发布咨询，和发布资讯
    contentdelete:'/content/delete',//删除资讯
    contentget:'/content/get',//资讯列表详情
    carouellist:'/carousel/list', //轮播列表
    changesort:'/carousel/changsort',//轮播图改变序号
    deletecarousel:'/carousel/delete',//取消轮播
    updatecarousel:'/carousel/update',//编辑轮播
    changecarousel:'/carousel/edit',//修改

    //系统管理
    auditlist:'/user/masterlist',//大咖列表
    userupdate:'/user/applayupdate',//给大咖授权取消授权applayupdate
    contentupdate:'/content/savecarousel',//设为轮播
    

    //商家管理
    addshop:'/user/add',//新增高级用户
    shoplist:'/user/list',//商家列表
    updateshop:'/business/update',//修改商家信息
    deleteshop:'/business/delete',//删除商家
    getshop:'/business/get',//商家详情

    //用户管理
    lyuserlist:'/user/list',//普通用户列表
    highuserList:'/user/gjlist',//获取高级用户列表
    highuseredit:href + '/user/edit',//编辑高级用户
    delroleuser:href + '/user/delrole',//删除高级用户
    tgbusiuser:'/user/tgbusi',//推荐商家
    lyuserupdate:'/user/update',//更新用户状态
    lyuserreport:'/report/user',//举报管理
    redreport:'/report/msg',//消息提醒
    reportlist:'/report/list',//举报列表
    reportupdate:'/report/update',//无效举报
    reportdelete:'/report/delete',//有效举报
    dtreport:"/dynamic/get",//动态举报
    //俱乐部
    clublist:'/club/list',//会员列表
    clubexport:href + '/club/print',//会员导出
    clubupdate:'/club/update',//更新会员状态
    clubdelete:'/club/delete',//删除会员
    clubnopass:'/club/nopass',//拒绝会员
    //数据统计
    total:"/total/compra",
    Dtotal:"/total/compra",
    // totalbc:"totalbc/compra"
    //内容浏览
    contentotal:"/totalbc/compra",
    Dcontentotal:"/totalbc/compra",
    totalcontent:"/totalcontent/list",
    Dtotalcontent:"/totalcontent/list",
    //栏目浏览
    totalcl:"/totalcl/compra",
    Dtotalcl:"/totalcl/compra",
    //ip浏览
    totalip:"/totalip/list",
    Dtotalip:"/totalip/list",

}
