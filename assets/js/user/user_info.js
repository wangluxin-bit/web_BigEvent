$(function () {
    // console.log("1111");
    let form = layui.form;
    // 设置表单输入字数限制
    form.verify({
        nickname: function (val) {
            if (val.length > 6) {
                return "请输入 1~6 位之间的数值"
            }
        }
    })

    getUserInfo()
    //获取用户信息
    function getUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取用户信息失败");
                }
                console.log(res);
                // layui里form.val方法表单赋值和取值
                form.val('formUserInfo', res.data);
            }
        })
    }


    // 重置表单数据
    $('#resetBtn').on('click', function (e) {
        // 阻止默认行为
        e.preventDefault()
        // 重新获取数据
        getUserInfo();
    })

    // 表单提交数据行为
    $('.layui-form').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault()
        // 通过ajax来更新数据
        $.ajax({
            type: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("修改用户信息失败");
                }
                layui.layer.msg("修改用户信息成功");
                // console.log(res);

                // 在用户信息修改成功之后然后调用myindex.js里的getuserinfo函数
                window.parent.getUseInfo()
            }
        });
    })
})