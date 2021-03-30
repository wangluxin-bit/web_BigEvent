$(function () {
    // console.log("111");
    let form = layui.form
    // 调用getArtCatelist函数
    getArtCatelist()
    // 通过ajax请求获取文章内容
    function getArtCatelist() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("获取文章列表失败");
                }
                // 获取成功后 渲染数据
                let textHtml = template('tpl-table', res)
                $('tbody').html(textHtml)
            }
        });
    }

    // 给添加类别按钮注册点击事件
    let indexAdd = 0;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });
    })
    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', "#form-add", function () {
        // 通过ajax获取数据
        $.ajax({
            type: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("添加内容失败");
                }
                // 在重新调用一次getArtCatelist()
                getArtCatelist()
                layui.layer.msg("添加内容成功");
                layer.close(indexAdd)
            }
        });
    })

    // 给编辑类别按钮注册点击事件
    let indexEdit = 0;
    // 通过代理的形式，为btn-edit表单绑定点击事件
    $('tbody').on('click', "#btn-edit", function () {
        // console.log("02");
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html()
        });
        // 自定义属性获取所编辑对应的ID值
        let id = $(this).attr("data-id")
        console.log(id);
        // console.log(id);
        // 通过ajax来获取文章内容
        $.ajax({
            type: "get",
            url: "/my/article/cates/" + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        });
    })

    // 通过代理的形式  为form-edit表单绑定submit事件
    $('body').on('submit', "#form-edit", function (e) {
        e.preventDefault()
        // 通过ajax请求获取数据
        $.ajax({
            type: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("修改信息失败");
                }

                layui.layer.msg("修改信息成功");

                layer.close(indexEdit)
                // 再调用一次更新列表函数
                getArtCatelist()
            }
        });
    })

    // 通过代理的形式，为btn-del表单绑定点击事件
    $('tbody').on('click', "#btn-del", function () {
        // console.log("02");
        let id = $(this).attr('data-id')

        layer.confirm('亲亲，确认要删除么？', { icon: 3, title: '提示' }, function (index) {
            // 通过ajax删除
            $.ajax({
                type: "get",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg("删除信息失败");
                    }
                    layui.layer.msg("删除信息成功");
                    layer.close(index);
                    getArtCatelist()
                }
            });
        });
    })
    // 屏蔽回车键
    document.onkeydown = function (e) {
        if (e.keycode == 13) {
            return false
        }
    }
})