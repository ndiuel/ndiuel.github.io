$('.w-nav-menu').click(function() {
    if (window.matchMedia("(max-width: 991px)") && !$("#navigation").hasClass("nav-height")) {
        $('.nav-menu').addClass('nav-height')
        setTimeout(function() {
            document.addEventListener("click", removeHeight)
        }, 10)
    } else {
        removeHeight
    }

    function removeHeight() {
        $('.nav-menu').removeClass('nav-height')
        document.removeEventListener("click", removeHeight)
    }
})

$(".accordian").on("click", ".accordian-title", function() {
    $(this).toggleClass("active").next().slideToggle(500);
});