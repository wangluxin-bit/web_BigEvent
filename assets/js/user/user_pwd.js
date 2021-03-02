$(function () {
    // console.log("1111");

    let form = layui.form;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samPwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新旧密码不能相同"
            }
        },
        repwd: function (value) {
            if (value !== $('[name=newPwd').val()) {
                return "确认密码与新密码不一致"
            }
        }

    })

    // 重置密码
    $('.layui-form').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault()
        // 通过ajax请求来获取密码信息
        $.ajax({
            type: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("获取用户密码失败");
                }
                layui.layer.msg("获取用户密码成功");

                // 重置按钮
                $(".layui-form")[0].reset()

                //当用户密码修改成功提示用户重新登录并跳转到首页
                layer.alert('密码修改成功，请重新登录', function (index) {
                    // 1 首先  清空token值
                    localStorage.removeItem('token')
                    // 2 强制跳转到用户登录页
                    window.parent.location.href = "/login.html"

                    layer.close(index);
                });
            }
        });

    })
})