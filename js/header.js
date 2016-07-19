// 打开/关闭菜单的效果
$('.menu-link').click(function () {
    $('.menu-cover').toggleClass('hide');
    $('.menu').toggleClass('hide');
    $('.guide').toggleClass('hide');
    $(this).toggleClass('menu-link-close');
});

// 菜单按钮hover效果
$('.menu-btn-list a').mouseover(function () {
    $(this).css('color', '#fff85f');
    $(this).siblings('hr').css('border-top-color', '#fff85f');
}).mouseout(function () {
    $(this).css('color', '#ffffff');
    $(this).siblings('hr').css('border-top-color', '#ffffff');
});