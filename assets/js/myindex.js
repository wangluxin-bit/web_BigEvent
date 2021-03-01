$(function () {
    // console.log('首页');
    // 调用获取用户信息的函数
    getUseInfo();

    let layer = layui.layer
    // 给退出功能注册点击事件
    $('.user-exit').on('click', function () {
        // console.log('ok');
        layer.confirm('您真的确定退出么?', { icon: 3, title: '提示' }, function (index) {
            // 确定退出后
            // 1 先将localstorage里的数据清空
            localStorage.removeItem('token')
            // 2 然后将页面跳转到登录页
            location.href = "/login.html"
        });
    })
})
function getUseInfo() {
    // console.log("111");
    //ajax发送get请求
    $.ajax({
        method: "get",
        url: '/my/userinfo',
        // // Header就是请求头配置
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg("获取用户信息失败");
            }
            // 获取信息成功就调用渲染用户头像
            renderAvatar(res.data);
        },
        // 不论成功还是失败，最终都会调用 complete 回调函数
        // complete: function (res) {
        //     // console.log('执行了 complete 回调：')
        //     // console.log(res)
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 强制清空 token
        //         localStorage.removeItem('token')
        //         // 2. 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}
function renderAvatar(user) {
    //1 获取用户昵称
    let name = user.nickname || user.username
    //2 渲染文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3 渲染图像
    if (user.user_pic !== null) {
        // 3.1有头像就传入头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2 没有头像渲染带有文字的图片
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase();
        // console.log(first);
        $('.text-avatar').html(first).show()
    }
}

