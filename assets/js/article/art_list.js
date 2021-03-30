$(function () {
  // console.log("111");
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    let y = padZero(dt.getFullYear());
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());

    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + "     " + hh + ":" + mm + ":" + ss;
  };
  // 定义一个时间补0函数
  function padZero(e) {
    return e > 9 ? e : "0" + e;
  }

  let q = {
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 5, //每页显示几条数据，默认每页显示2条
    cate_id: "", //文章分类的id
    state: "", //文章的发布
  };
  initTable();
  // 获取文章列表数据
  function initTable() {
    $.ajax({
      type: "get",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layui.layer.msg("获取文章列表失败");
        }
        // 使用模板引擎来渲染数据
        let textHtml = template("tpl-table", res);
        $("tbody").html(textHtml);
        // 给渲染页数传入实参
        renderPage(res.total);
      },
    });
  }
  initCate();
  // 获取分类可选项
  function initCate() {
    $.ajax({
      type: "get",
      url: "/my/article/cates",
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layui.layer.msg("获取分类信息失败");
        }
        // 通过模板引擎 渲染结构
        let texthtml = template("tpl-cate", res);
        // console.log(texthtml);
        $("[name=cate_id]").html(texthtml);
        // 通知layui重新渲染表单区域的UI结构
        layui.form.render();
      },
    });
  }

  // 给筛选按钮submit事件
  $("#form-search").on("submit", function (e) {
    // console.log("111");
    e.preventDefault();
    // 获取表单中选项的值
    let cate_id = $("[name=cate_id]").val();
    let state = $("[name=state]").val();
    // 给查询对象q赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件，从新渲染表单的值
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    // console.log(total);
    // 调用laypage.render()方法来渲染分页的结构
    layui.laypage.render({
      elem: "pageBox", //分页容器的id
      count: total, //总数据条数
      limit: q.pagesize, //每页显示多少条数据
      curr: q.pagenum, //设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [5, 10, 13, 15],
      // 分页发生切换的时候，触发jump回调
      // 触发jump回调的两种方式
      // 1 点击页码时  会触发jump回调
      // 2 只要调用了laypage.render()方法 jump也会被调用
      jump: function (obj, first) {
        // console.log(obj.curr);
        // 把最新的页码值，赋值到q这个查询参数对象中
        q.pagenum = obj.curr;
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit;
        // 根据最新的q获取最新的列表
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 为删除按钮添加点击事件
  $("tbody").on("click", "#btn-del", function () {
    let id = $(this).attr("data-id");
    // 获取删除按钮的个数
    var len = $(".btn-delete").length;
    layer.confirm(
      "亲亲，确定要删除么?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        $.ajax({
          type: "get",
          url: "/my/article/delete/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layui.layer.msg("删除信息失败");
            }
            layui.layer.msg("删除成功");
            // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
            // 如果没有剩余的数据了,则让页码值 -1 之后,
            // 再重新调用 initTable 方法
            // 4
            if (len === 1) {
              // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
              // 页码值最小必须是 1
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
            }
            initTable();
          },
        });
        layer.close(index);
      }
    );
  });

  // 为编辑按钮添加点击事件

  $("tbody").on("click", "#btn-edit", function () {
    // console.log("1111");
    //1.获取编辑id
    let id = $(this).attr("data-id");
    //2.将id存储起来
    localStorage.setItem("id", id);
    // 3 完成页面的跳转
    location.href = "/article/art_pub.html";
  });

  // 屏蔽回车键
  document.onkeydown = function (e) {
    if (e.keycode == 13) {
      return false;
    }
  };
});
