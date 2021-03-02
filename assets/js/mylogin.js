
$(function () {
  // console.log("111");
  // 判断注册界面还是登录界面
  // 点击注册
  $('#zhece').on('click', function () {
    // console.log("11");
    $('.login-zhuce').show()
    $('.login-denglu').hide()
  })
  // 点击登录
  $('#denglu').on('click', function () {
    $('.login-zhuce').hide()
    $('.login-denglu').show()
  })


  //导入layui文件里的form
  let form = layui.form;
  // 导入layui里的layer
  // let layer = layui.layer

  form.verify({

    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      // 这里的形参是拿到确认密码里的值
      // 然后还需要拿到密码框里的内容
      // 然后进行一次等于的判断
      // 如果判断失败的话，return一个提示框
      var pwds = $('.login-zhuce [name=password]').val()
      console.log(pwds);
      if (pwds !== value) {
        return "两次输入的密码不一致"
      }
    },
  })

  // 给注册表单添加submit事件
  $('#form-zhuce').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    // 发送ajax请求
    $.ajax({
      method: 'post',
      url: '/api/reguser',
      data: {
        username: $('.login-zhuce [name=username]').val(),
        password: $('.login-zhuce [name=password]').val()
      },
      success: function (res) {
        if (res.status != 0) {
          // return console.log(res.message);
          // 这里使用layui里的提示框内容
          return layui.layer.msg(res.message, { icon: 6 })
        }
        // console.log(res);
        // console.log("注册成功");
        layui.layer.msg('注册成功，请登录！', { icon: 6 })

      }
    })
  })
  // 给登录表单添加submit事件
  $('#form-denglu').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    // 通过ajax请求
    $.ajax({
      method: 'post',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layui.layer.msg("亲登陆失败，请重新登录");
        }

        layui.layer.msg("登录成功了，真棒");
        // 把res.token添加到localstorage
        localStorage.setItem('token', res.token)
        // 调转到index.html
        location.href = "/index.html"
        // token:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC…E5M30.SUF9gsdTi_mUkXqtN0xsAlJqTdudd7XuuWtzNJ7T6Eg
      }
    })

  })

})



