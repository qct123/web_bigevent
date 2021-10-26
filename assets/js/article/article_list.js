$(function () {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    //利用模板引擎提供的时间过滤器，来美化时间
    template.defaults.imports.dateFormat = function (date) {
        var da = new Date(date)
        var y = da.getFullYear()
        var m = addZero(da.getMonth() + 1)
        var d = addZero(da.getDay())
        var hh = addZero(da.getHours())
        var mm = addZero(da.getMinutes())
        var ss = addZero(da.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零函数
    function addZero(n) {
        return n < 9 ? '0' + n : n
    }



    //发起请求时的data
    var q = {
        pagenum: '1',   //页码值，默认是1
        pagesize: '2',  //每页显示多少条数据，默认是2
        cate_id: '',    //文章分类的 Id，默认是空
        state: '' //	文章的发布状态，默认是空
    }

    initTable()
    initCate()

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败')
                }
                //   console.log(res);
                //   console.log(res.data);
                // //模板引擎渲染
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //渲染完表格，再渲染分页 。传递一下表格中总数据的条数即res.total
                renderPage(res.total)
            }
        })

    }


    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('getallcate', res)
                $('[name=cate_id]').html(htmlStr)
                //解决layui框架的自己的小问题，重新渲染表单以显示分类
                form.render()
            }

        })

    }

    //筛选表单的提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // console.log(cate_id);
        // console.log(state);
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //获取文章列表数据的方法
        initCate()

    })


    //定义渲染分页的方法 
    function renderPage(total) {
        //调用 laypage.render（）方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的ID
            count: 50,       //总数据条数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum,    //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //把当前页码值赋值给 q 这个查询参数对象身上，然后可以重新发起ajax请求
                q.pagenum = obj.curr
                //♥♥♥♥♥♥错误写法！！！直接调用initTable() 渲染表格数据
                //因为会发生死循环（发现jump回调一直被触发从而死循环）
                //（笔记的第18个是说具体死循环的原因过程（可以去看看））
                //解决方法：利用first的值......（笔记有说，我就不写了）

                //把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit

                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }

            }
        });
    }


    //通过代理形式，为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function () {

        //获取删除按钮的个数
        var len = $('.btn-delete').length

        var id = $(this).attr('data-id')
        layer.confirm('确认要删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!')

                    //♥♥♥♥♥♥♥♥一个小bug（比如当前在第4页，但是把当前页数据都删除完了，能跳转到第3页，但是数据并没有出来（这是因为直接initTable但是里面的页码值还是4））
                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据（还有就直接initTable(),没有了就让页码值-1再initTable（））
                    //如果len的值为1，说明页面上只要1个删除按钮即1条数据，成功删除后页面就没有数据了，因此len===1时，让页码值-1
                    if (len === 1) {
                        //♥♥♥♥♥♥♥♥♥♥注意页码值最小是1，所以要判断
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()
                }
            })

            layer.close(index);
        });
    })





    //通过代理事件，编辑文章
    var indexhhh=null
    $('tbody').on('click', '.btn-edit', function () {
        // console.log('ok');
         indexhhh = layer.open({
            content: $('#edittemplate').html(),
            type: 1,
            title: '编辑文章内容',
            area: ['550px', '350px']
        });


        //把信息渲染上去
        var id = $(this).attr('data-id')
        //   console.log(id);
        $.ajax({
            method: 'get',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败')
                }
                // console.log('111');
                layui.form.val('formedit', res.data)
            }
        })


    })

/*自己写的，修改不了，请求体错误，不懂怎么写
    //编辑提交事件的监听
    $('body').on('submit','#formedit',function(e){
        e.preventDefault()
        console.log('ok');
        var fd=new FormData($(this)[0])
        fd.append('title', $('#inputTitle').val())
        fd.append('pub_date', $('#inputTime').val())
        fd.append('state',$('#inputState').val())
        $.ajax({
            method:'post',
            url:'/my/article/edit',
            data:fd,
            //♥♥♥♥♥♥♥♥♥♥注意FormData格式的数据fd，需要加下面2个属性才行成功发起请求♥♥♥♥♥♥
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status!==0){
                    return layer.msg('更新文章内容失败')
                }
                layer.msg('更新文章内容成功')
                //关闭layui中的弹出层
                layer.close(indexhhh)
                initTable()
                form.render()
            }
        })
        
    })

*/



})