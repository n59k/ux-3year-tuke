$(function() {
    var header = $(".header--outer");
    var underline = $(".item-active");
    var item = $(".header--main-menu--item");

    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll >= 200) {
            header.removeClass('header--outer').addClass("header--scroll");
            underline.removeClass('item-active').addClass("item-active-scroll");
            item.removeClass('header--main-menu--item').addClass("header--main-menu--item-scroll");

        } else {
            header.removeClass("header--scroll").addClass('header--outer');
            underline.removeClass('item-active-scroll').addClass("item-active");
            item.removeClass('header--main-menu--item-scroll').addClass("header--main-menu--item");

        }
    });
});