$(function() {
    $('.comment').click(function(e) {
        var target = $(this);//通过e.target,能够获取到被点击的那个
        var toId = target.data('tid');
        var commentId = target.data('cid');

        if($('#toId').length > 0) {
            $('#toId').val(toId);
        }else {
            $('<input>').attr({
                type: 'hidden',
                id: 'toId',
                name: 'comment[tid]',
                value: toId
            }).appendTo('#commentForm');
        }

        if($('#commentId').length > 0){
            $('#commentId').val(commentId);
        }else {
            $('<input>').attr({
                type: 'hidden',
                id: 'commentId',
                name: 'comment[cid]',
                value: commentId
            }).appendTo('#commentForm');
        }
    })
})