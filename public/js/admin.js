$(function() {
    $(".del").click(function(e) {
        var target = $(e.target);//通过e.target,能够获取到被点击的那个
        var id = target.data("id");
        var tr = $(".item-id-" + id);
        $.ajax({
            type:"DELETE",
            url:"/admin/list?id=" + id
        })
            .done(function(results) {
                if(results.success === 1) {
                    if(tr.length > 0) {
                        tr.remove();
                    }
                }
            })
    })
})
//这段js实现的是list页面删除电影条目的功能:
    //主要是通过target获取button标签记录的_id的值,在把他赋给对应条目的class,通过remove()方法将具有_id标识的的class删除
    //然后在app.js里通过app.delete()中间件,条用mongoose的remove({})方法,删除数据库中对应_id的条目