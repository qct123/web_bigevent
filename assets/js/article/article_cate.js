$(function () {

    var layer = layui.layer

    initArtCateList()

    //初始化文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    layui.layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)
            }
        })
    }

    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章类别',
            //直接在content这里面写html没有代码提示特别不方便
            //因此在html中制定了一个<script type="text/html">用来存放html标签，最后再用它的html（）获取内容
            content: $('#dialog-add').html(),
            area: ['500px', '250px']
        });

    })

    //通过代理方式，为表单绑定提交事件
    //表单提交事件，因为这个是弹出层我们写在script中要动态添加的，因此要用代理方式监听才行
    $('body').on('submit', '#dialog_add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增类别失败')
                }
                layer.msg('新增类别成功')
                //重新渲染文章分类数据
                initArtCateList()
                //关闭layui中的弹出层
                layer.close(indexAdd)
            }
        })
    })


    //通过代理形式，为btn-edit按钮绑定事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '编辑文章类别',
            //直接在content这里面写html没有代码提示特别不方便
            //因此在html中制定了一个<script type="text/html">用来存放html标签，最后再用它的html（）获取内容
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        });

        //点击编辑按钮时，点击哪个数据呢？看他们的id值（我们在模板中定义自定义属性值）
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败')
                }
                layui.form.val('form-edit', res.data)
            }
        })


    })


    //通过代理方式，为修改文章分类表单监听提交事件，能确认更改
    $('body').on('submit', '#dialog_edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败')
                }
                layer.msg('更新分类成功')
                //重新渲染文章分类数据
                initArtCateList()
                //关闭layui中的弹出层
                layer.close(indexEdit)
            }
        })
    })

    //通过代理形式，给删除绑定事件
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确定要删除这个文章分类吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }

                    layer.msg('删除文章分类成功')
                    //重新渲染文章分类数据
                    initArtCateList()
                }
            })
            layer.close(index);
        });

    })

})