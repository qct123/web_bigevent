$(function(){

    getUserInfo();

    var layer=layui.layer

    //点击“退出”案例
    $('#btnLohout').on('click',function(){
        layer.confirm('确定退出登录吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            //清空localStorage中的token
            localStorage.removeItem('token')
            //跳转到login页面
            location.href='/login.html'
            layer.close(index);
          });
    })

})


//获取用户信息的函数
function getUserInfo(){
    $.ajax({
        method:'get',
        //要写简便的url，记得在html页面导入自己封装好的baseAPI文件
        url:'/my/userinfo',
        //♥♥♥♥♥♥♥♥♥ 不用我们调用headers了，我们写的baseAPI里有了
        // headers:{
        //     Authorization:localStorage.getItem('token')||''
        // },
        success:function(res){
            if(res.status !==0){
                return layui.layer.msg('获取用户信息失败')
            }
            // console.log(res);

            //自定义渲染用户头像的函数
            renderAvatar(res.data)
        },    
        //挂载了，放到了baseAPI.js文件中
        /*♥♥♥♥♥♥♥♥♥ $.ajax()中的回调函数complete无论成功还是失败都会执行
        complete:function(res){
            // console.log(res);
            //complete中res.responseJSON可以拿到服务器响应回的数据
            if(res.responseJSON.status ===1 && res.responseJSON.message==='身份认证失败！'){
                //1.强制清空token  2.跳转到登录页面
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
 
        }  */
    })
}

//自定义渲染用户头像的函数
function renderAvatar(data){
    //逻辑或，有nickname则name的值为nickname，没有就是username
    var name = data.nickname||data.username
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)

    if(data.user_pic){   //如果有头像路径
        //渲染头像
        $('.layui-nav-img').attr('src',data.user_pic).show()
        $('.text-avatar').hide()
    }else{
        //渲染文字头像
        //文字头像是展示用户名的第一个字符
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()

    }

}