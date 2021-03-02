$(function () {
    // console.log("1111");
    // 通过获取用户信息来获取头像URL地址
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败");
            }
            // console.log(res)
            $('#image').attr('src', res.data.user_pic)
        }
    });

    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 给上传按钮注册点击事件
    $('#upfiles').on('click', function () {
        // 当点击上传按钮时自动触发input框上传
        $("#files").click()
    })

    // 给文件选择框绑定change事件
    $("#files").on('change', function (e) {
        // console.log(e);
        // 获取用户选择的图片
        let filelist = e.target.files
        if (filelist.length === 0) {
            return layui.layer.msg("请选择照片");
        }

        // 1 拿到用户选择的文件
        let file = filelist[0]
        // 2 将文件，转化为路径
        let imgUrl = URL.createObjectURL(file)
        // 3 重新初始化裁剪区域
        $image.cropper('destroy')//销毁旧的裁剪区域
            .attr('src', imgUrl)// 重新设置图片路径
            .cropper(options)//重新初始化裁剪区域

        // 为确定按钮，绑定点击事件
        $('#btnUpload').on('click', function () {
            var dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png')  // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            // 2 调用接口，把头像上传到服务器
            $.ajax({
                method: 'post',
                url: '/my/update/avatar',
                data: {
                    avatar: dataURL
                },
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg("更新头像失败！");
                    }
                    layui.layer.msg("更换头像成功");
                    window.parent.getUseInfo()
                }
            })
        })
    })
})