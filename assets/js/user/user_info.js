$(function () {

    //用layui提供的，自定义表单验证规则(记得在对应表单项加上这个规则)
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }

    })

    //调用初始化用户信息函数
    initUserInfo()


    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                //调用layui框架中提供的快速为表单赋值(不懂为什么运行不出来....我就自己写了底下3行结果渲染不出来！找了很久的bug，最后还是用回了这个)
                form.val("formUserInfo", res.data)
                // $('#username').val(res.data.username)
                // $('#nickname').val(res.data.nickname)
                // $('#email').val(res.data.email)
            }
        })
    }

    //“重置”表单按钮
    $('#btnReset').on('click',function(e){
        e.preventDefault()
        //重新填充最开始的用户信息数据
        initUserInfo()
    })


    //监听表单的提交事件
    $(".layui-form").on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'post',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('修改用户信息失败')
                }
                layer.msg('修改用户信息成功')
                
                //调用父页面中的自定义获取数据并且渲染数据方法getUserInfo（），重新渲染用户的头像和用户的信息（iframe是子页面，index.html是父页面.window表示当前即iframe页面，window.parent就表示index.html了）
                window.parent.getUserInfo()
            }
        })
    })



})




// $(function() {
//     var form = layui.form
//     var layer = layui.layer
  
//     form.verify({
//       nickname: function(value) {
//         if (value.length > 6) {
//           return '昵称长度必须在 1 ~ 6 个字符之间！'
//         }
//       }
//     })
  
//     initUserInfo()
  
//     // 初始化用户的基本信息
//     function initUserInfo() {
//       $.ajax({
//         method: 'GET',
//         url: '/my/userinfo',
//         success: function(res) {
//           if (res.status !== 0) {
//             return layer.msg('获取用户信息失败！')
//           }
//           // console.log(res)
//           // 调用 form.val() 快速为表单赋值
//           form.val('formUserInfo', res.data)
//         }
//       })
//     }
  
//     // 重置表单的数据
//     $('#btnReset').on('click', function(e) {
//       // 阻止表单的默认重置行为
//       e.preventDefault()
//       initUserInfo()
//     })
  
//     // 监听表单的提交事件
//     $('.layui-form').on('submit', function(e) {
//       // 阻止表单的默认提交行为
//       e.preventDefault()
//       // 发起 ajax 数据请求
//       $.ajax({
//         method: 'POST',
//         url: '/my/userinfo',
//         data: $(this).serialize(),
//         success: function(res) {
//           if (res.status !== 0) {
//             return layer.msg('更新用户信息失败！')
//           }
//           layer.msg('更新用户信息成功！')
//           // 调用父页面中的方法，重新渲染用户的头像和用户的信息
//           window.parent.getUserInfo()
//         }
//       })
//     })
//   })
  