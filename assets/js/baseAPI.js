//每次发起$.get()、$.post()、$.ajax()都要写好多遍url中的根路径
//如果有100次要写100次，根路径换了很难维护
//jquery中其实每次调用$.get()、$.post()、$.ajax()的之前，都会自动调用一次$.ajaxPrefilter()这个函数，因此我们可以在这个函数里做根路径的拼接

//♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥

$.ajaxPrefilter(function(options){
    //发起真正的ajax之前，统一拼接请求的根路径
    //options.url 表示的是$.get()、$.post()、$.ajax()中的url的路径
    options.url = 'http://api-breakingnews-web.itheima.net'+options.url



    //统一为有权限的接口，设置headers请求头
    ////headers就是请求头配置对象，这个页面有访问权限，因此要写headers中的Authorization属性，获取token以供后端jwt验证身份使用
    //以 /my 开头的请求路径，要求访问需要权限，因此发起请求时要有headers
    if(options.url.indexOf('/my/' !== -1)){
        //不等于-1说明找得到/my/，即路径中包含了/my/，所以要请求要携带
        options.headers = {
            Authorization:localStorage.getItem('token')||''
        }
    }

    //全局统一挂载complete回调函数
    options.complete = function(options){
         // console.log(options);
            //options.responseJSON可以拿到服务器响应回的数据
            if(options.responseJSON.status ===1 && options.responseJSON.message==='身份认证失败！'){
                //1.强制清空token  2.跳转到登录页面
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
    }
 

})