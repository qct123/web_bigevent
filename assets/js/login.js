$(function(){
    //点击“去注册”
    $('#link_reg').on('click',function(){
        $('.lgin-box').hide()
        $('.reg-box').show()
    })

    //点击“去登录”
    $('#link_login').on('click',function(){
        $('.lgin-box').show()
        $('.reg-box').hide()
    })


    //layui中的表单验证规则,通过layui的form对象的verify（）方法。
    //应用就是在标签中如lay-verify='pwd'（都是别人layui框架规定的）
    var form = layui.form
    //layer.msg（），layui中的一个提示
    var layer=layui.layer
    form.verify({
        //自定义了一个叫做pwd的校验规则
        pwd:[ 
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        //自定义的确认密码的校验规则
        repwd:function(value){
            var pwd = $('.reg-box [name=password]').val()
            if(value!= pwd){
                return '两次输入的密码不一致！'
            }
        }
    }) 


    //监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        //阻止表单默认提交行为
        e.preventDefault()
        //jquery发起ajax的post请求 
        var data = {
            username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',data,function(res){
            if(res.status !==0){
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            // console.log('注册成功');
            layer.msg('注册成功')
            //注册成功后，模拟‘去登录’的点击事件，让用户可以直接登录
            $('#link_login').click()
        })
    })

    // var localstorage = window.localStorage
    // var location = window.location

    //监听登录表单的提交事件
    $('#form_login').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'post',
            url:'/api/login',
            //♥♥♥♥♥♥♥♥♥  快速获取表单的所有数据serialize（）  ♥♥♥♥♥♥♥♥♥
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg('登录成功');
                //♥♥♥♥♥♥♥♥♥  拿到登录成功的res.token的token字符串值，要通过localStorage存储在浏览器（token是后端表单验证要用的）  ♥♥♥♥♥♥♥♥♥
                localStorage.setItem('token',res.token)
                //♥♥♥♥♥♥♥♥♥ 跳转到后台主页 ♥♥♥♥♥♥♥♥♥
                location.href='/index.html'
            }
        })
    })


})