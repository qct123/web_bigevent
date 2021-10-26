$(function () {

    var layer = layui.layer
    var form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                //获取成功，渲染
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //记得layui这个框架的一个问题，要记得重新渲染表单,一定要调用form.render（）方法
                form.render()
            }

        })


    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //选择文件的点击事件
    $(".btnChoose").on('click', function (res) {
        $("#coverFile").click()
    })

    //监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        //1.拿到用户选择的文件
        var file = e.target.files[0]
        //2.判断用户有没有选择文件
        if (file.length === 0) {
            return
        }
        //3.根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        //4.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })


    //定义发布文章的状态
    var art_state = '已发布'
    $("#btnDraft").on('click', function () {
        art_state = '草稿'
    })

    //为表单绑定submit提交事件，FormData.....
    $('#form-pub').on('submit', function (e) {
        //1.阻止表单的默认行为
        e.preventDefault()
        //2.基于form表单，快速创建一个FormData对象（因为里面有文件，要用FormData才行）
        var fd = new FormData($(this)[0])
        //3.将文章的发布状态，存到fd中
        fd.append('state', art_state)
        // console.log(fd);
        // fd.forEach(function (value, key) {
        //     // console.log(key,value);
        // })
        //4.将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5.将文件对象，存储到fd中
                fd.append('cover_img',blob)
                //发起ajax请求
                publishArticle(fd)
            })
        
    })

    function  publishArticle(fd){
        $.ajax({
            method:'post',
            url:'/my/article/add',
            data:fd,
            //♥♥♥♥♥♥♥♥♥♥注意FormData格式的数据fd，需要加下面2个属性才行成功发起请求♥♥♥♥♥♥
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status!==0){
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                //发布文章成功后，跳转到文章列表页面
                location.href='/article/article_list.html'
            }
        })
    }


})