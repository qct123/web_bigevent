//每次发起$.get()、$.post()、$.ajax()都要写好多遍url中的根路径
//如果有100次要写100次，根路径换了很难维护
//jquery中其实每次调用$.get()、$.post()、$.ajax()的之前，都会自动调用一次$.ajaxPrefilter()这个函数，因此我们可以在这个函数里做根路径的拼接

$.ajaxPrefilter(function(options){
    //发起真正的ajax之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net'+options.url

    //options.url表示的是$.get()、$.post()、$.ajax()中的url的路径
})