"use strict"

function addSwitcher() {
    var dzSwitcher = '<div class="sidebar-right">\n' +
        '    <div class="bg-overlay"></div>\n' +
        '    <a class="sidebar-right-trigger wave-effect wave-effect-x shadow-lg" data-toggle="tooltip" data-placement="right"\n' +
        '       data-original-title="Change Layout" href="javascript:void(0);"><span><i\n' +
        '            class="fa fa-cog fa-spin"></i></span><span class="text">تنظیم</span></a>\n' +
        '    <div class="sidebar-right-inner"><h4>ظاهر مورد نظر خودتو بساز <a onclick="removeCustomSet()" \n' +
        '                                                            class="btn btn-primary btn-rounded btn-sm pull-right">حالت پیش فرض</a></h4>\n' +
        '        <div class="admin-settings">\n' +
        '            <div class="row">\n' +
        '                <div class="col-sm-12"><p>بک گروند</p> <select class="default-select form-control" id="theme_version"\n' +
        '                                                                 name="theme_version">\n' +
        '                    <option value="light">روشن</option>\n' +
        '                    <option value="dark">تیره</option>\n' +
        '                </select></div>\n' +
        '                <div class="col-sm-6"><p>رنگ اصلی</p>\n' +
        '                    <div><span data-placement="top" data-toggle="tooltip" title="Color 1"> <input\n' +
        '                            class="chk-col-primary filled-in" id="primary_color_1" name="primary_bg" type="radio"\n' +
        '                            value="color_1"> <label for="primary_color_1" class="bg-label-pattern"></label> </span>\n' +
        '                        <span> <input class="chk-col-primary filled-in" id="primary_color_2" name="primary_bg"\n' +
        '                                      type="radio" value="color_2"> <label for="primary_color_2"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_3" name="primary_bg" type="radio"\n' +
        '                                value="color_3"> <label for="primary_color_3"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_4" name="primary_bg" type="radio"\n' +
        '                                value="color_4"> <label for="primary_color_4"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_5" name="primary_bg" type="radio"\n' +
        '                                value="color_5"> <label for="primary_color_5"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_6" name="primary_bg" type="radio"\n' +
        '                                value="color_6"> <label for="primary_color_6"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_7" name="primary_bg" type="radio"\n' +
        '                                value="color_7"> <label for="primary_color_7"></label> </span><span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_8" name="primary_bg" type="radio"\n' +
        '                                value="color_8"> <label for="primary_color_8"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_9" name="primary_bg" type="radio"\n' +
        '                                value="color_9"> <label for="primary_color_9"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_10" name="primary_bg" type="radio"\n' +
        '                                value="color_10"> <label for="primary_color_10"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_11" name="primary_bg" type="radio"\n' +
        '                                value="color_11"> <label for="primary_color_11"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_12" name="primary_bg" type="radio"\n' +
        '                                value="color_12"> <label for="primary_color_12"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_13" name="primary_bg" type="radio"\n' +
        '                                value="color_13"> <label for="primary_color_13"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_14" name="primary_bg" type="radio"\n' +
        '                                value="color_14"> <label for="primary_color_14"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="primary_color_15" name="primary_bg" type="radio"\n' +
        '                                value="color_15"> <label for="primary_color_15"></label> </span></div>\n' +
        '                </div>\n' +
        '                <div class="col-sm-6"><p>رنگ Nav Header</p>\n' +
        '                    <div><span> <input class="chk-col-primary filled-in" id="nav_header_color_1"\n' +
        '                                       name="navigation_header" type="radio" value="color_1"> <label\n' +
        '                            for="nav_header_color_1" class="bg-label-pattern"></label> </span> <span> <input\n' +
        '                            class="chk-col-primary filled-in" id="nav_header_color_2" name="navigation_header"\n' +
        '                            type="radio" value="color_2"> <label for="nav_header_color_2"></label> </span> <span> <input\n' +
        '                            class="chk-col-primary filled-in" id="nav_header_color_3" name="navigation_header"\n' +
        '                            type="radio" value="color_3"> <label for="nav_header_color_3"></label> </span> <span> <input\n' +
        '                            class="chk-col-primary filled-in" id="nav_header_color_4" name="navigation_header"\n' +
        '                            type="radio" value="color_4"> <label for="nav_header_color_4"></label> </span> <span> <input\n' +
        '                            class="chk-col-primary filled-in" id="nav_header_color_5" name="navigation_header"\n' +
        '                            type="radio" value="color_5"> <label for="nav_header_color_5"></label> </span> <span> <input\n' +
        '                            class="chk-col-primary filled-in" id="nav_header_color_6" name="navigation_header"\n' +
        '                            type="radio" value="color_6"> <label for="nav_header_color_6"></label> </span> <span> <input\n' +
        '                            class="chk-col-primary filled-in" id="nav_header_color_7" name="navigation_header"\n' +
        '                            type="radio" value="color_7"> <label for="nav_header_color_7"></label> </span> <span> <input\n' +
        '                            class="chk-col-primary filled-in" id="nav_header_color_8" name="navigation_header"\n' +
        '                            type="radio" value="color_8"> <label for="nav_header_color_8"></label> </span> <span> <input\n' +
        '                            class="chk-col-primary filled-in" id="nav_header_color_9" name="navigation_header"\n' +
        '                            type="radio" value="color_9"> <label for="nav_header_color_9"></label> </span> <span> <input\n' +
        '                            class="chk-col-primary filled-in" id="nav_header_color_10" name="navigation_header"\n' +
        '                            type="radio" value="color_10"> <label for="nav_header_color_10"></label> </span>\n' +
        '                        <span> <input class="chk-col-primary filled-in" id="nav_header_color_11"\n' +
        '                                      name="navigation_header" type="radio" value="color_11"> <label\n' +
        '                                for="nav_header_color_11"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="nav_header_color_12" name="navigation_header"\n' +
        '                                type="radio" value="color_12"> <label for="nav_header_color_12"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="nav_header_color_13" name="navigation_header"\n' +
        '                                type="radio" value="color_13"> <label for="nav_header_color_13"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="nav_header_color_14" name="navigation_header"\n' +
        '                                type="radio" value="color_14"> <label for="nav_header_color_14"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="nav_header_color_15" name="navigation_header"\n' +
        '                                type="radio" value="color_15"> <label for="nav_header_color_15"></label> </span></div>\n' +
        '                </div>\n' +
        '                <div class="col-sm-6"><p>رنگ Header</p>\n' +
        '                    <div><span> <input class="chk-col-primary filled-in" id="header_color_1" name="header_bg"\n' +
        '                                       type="radio" value="color_1"> <label for="header_color_1"\n' +
        '                                                                            class="bg-label-pattern"></label> </span>\n' +
        '                        <span> <input class="chk-col-primary filled-in" id="header_color_2" name="header_bg"\n' +
        '                                      type="radio" value="color_2"> <label for="header_color_2"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_3" name="header_bg" type="radio"\n' +
        '                                value="color_3"> <label for="header_color_3"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_4" name="header_bg" type="radio"\n' +
        '                                value="color_4"> <label for="header_color_4"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_5" name="header_bg" type="radio"\n' +
        '                                value="color_5"> <label for="header_color_5"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_6" name="header_bg" type="radio"\n' +
        '                                value="color_6"> <label for="header_color_6"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_7" name="header_bg" type="radio"\n' +
        '                                value="color_7"> <label for="header_color_7"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_8" name="header_bg" type="radio"\n' +
        '                                value="color_8"> <label for="header_color_8"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_9" name="header_bg" type="radio"\n' +
        '                                value="color_9"> <label for="header_color_9"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_10" name="header_bg" type="radio"\n' +
        '                                value="color_10"> <label for="header_color_10"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_11" name="header_bg" type="radio"\n' +
        '                                value="color_11"> <label for="header_color_11"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_12" name="header_bg" type="radio"\n' +
        '                                value="color_12"> <label for="header_color_12"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_13" name="header_bg" type="radio"\n' +
        '                                value="color_13"> <label for="header_color_13"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_14" name="header_bg" type="radio"\n' +
        '                                value="color_14"> <label for="header_color_14"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="header_color_15" name="header_bg" type="radio"\n' +
        '                                value="color_15"> <label for="header_color_15"></label> </span></div>\n' +
        '                </div>\n' +
        '                <div class="col-sm-6"><p>رنگ Sidebar</p>\n' +
        '                    <div><span> <input class="chk-col-primary filled-in" id="sidebar_color_1" name="sidebar_bg"\n' +
        '                                       type="radio" value="color_1"> <label for="sidebar_color_1"\n' +
        '                                                                            class="bg-label-pattern"></label> </span>\n' +
        '                        <span> <input class="chk-col-primary filled-in" id="sidebar_color_2" name="sidebar_bg"\n' +
        '                                      type="radio" value="color_2"> <label for="sidebar_color_2"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_3" name="sidebar_bg" type="radio"\n' +
        '                                value="color_3"> <label for="sidebar_color_3"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_4" name="sidebar_bg" type="radio"\n' +
        '                                value="color_4"> <label for="sidebar_color_4"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_5" name="sidebar_bg" type="radio"\n' +
        '                                value="color_5"> <label for="sidebar_color_5"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_6" name="sidebar_bg" type="radio"\n' +
        '                                value="color_6"> <label for="sidebar_color_6"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_7" name="sidebar_bg" type="radio"\n' +
        '                                value="color_7"> <label for="sidebar_color_7"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_8" name="sidebar_bg" type="radio"\n' +
        '                                value="color_8"> <label for="sidebar_color_8"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_9" name="sidebar_bg" type="radio"\n' +
        '                                value="color_9"> <label for="sidebar_color_9"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_10" name="sidebar_bg" type="radio"\n' +
        '                                value="color_10"> <label for="sidebar_color_10"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_11" name="sidebar_bg" type="radio"\n' +
        '                                value="color_11"> <label for="sidebar_color_11"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_12" name="sidebar_bg" type="radio"\n' +
        '                                value="color_12"> <label for="sidebar_color_12"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_13" name="sidebar_bg" type="radio"\n' +
        '                                value="color_13"> <label for="sidebar_color_13"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_14" name="sidebar_bg" type="radio"\n' +
        '                                value="color_14"> <label for="sidebar_color_14"></label> </span> <span> <input\n' +
        '                                class="chk-col-primary filled-in" id="sidebar_color_15" name="sidebar_bg" type="radio"\n' +
        '                                value="color_15"> <label for="sidebar_color_15"></label> </span></div>\n' +
        '                </div>\n' +
        '                <div class="col-sm-6"><p>نوع لایه منو</p> <select class="default-select form-control" id="theme_layout"\n' +
        '                                                            name="theme_layout">\n' +
        '                    <option value="vertical">عمودی</option>\n' +
        '                    <option value="horizontal">افقی</option>\n' +
        '                </select></div>\n' +
        '                <div class="col-sm-6"><p>نوع Header</p> <select class="default-select form-control"\n' +
        '                                                                     id="header_position" name="header_position">\n' +
        '                    <option value="static">ایستا</option>\n' +
        '                    <option value="fixed">ثابت</option>\n' +
        '                </select></div>\n' +
        '                <div class="col-sm-6"><p>نوع نمایش Sidebar</p> <select class="default-select form-control" id="sidebar_style"\n' +
        '                                                             name="sidebar_style">\n' +
        '                    <option value="full">کامل</option>\n' +
        '                    <option value="mini">کوچک</option>\n' +
        '                    <option value="compact">جمع و جور</option>\n' +
        '                    <option value="modern">مدرن</option>\n' +
        '                    <option value="overlay">پنهان (نمایش روی صفحه)</option>\n' +
        '                    <option value="icon-hover">فقط آیکن</option>\n' +
        '                </select></div>\n' +
        '                <div class="col-sm-6"><p>نوع Sidebar</p> <select class="default-select form-control"\n' +
        '                                                                      id="sidebar_position" name="sidebar_position">\n' +
        '                    <option value="static">ایستا</option>\n' +
        '                    <option value="fixed">ثابت</option>\n' +
        '                </select></div>\n' +
        '                <div class="col-sm-6"><p>اندازه کادر صفحه</p> <select class="default-select form-control" id="container_layout"\n' +
        '                                                               name="container_layout">\n' +
        '                    <option value="wide">پهن</option>\n' +
        '                    <option value="boxed">باکس</option>\n' +
        '                    <option value="wide-boxed">پهن و باکس</option>\n' +
        '                </select></div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';


    var demoPanel = '';
    if ($("#dzSwitcher").length == 0) {
        jQuery('body').append(dzSwitcher + demoPanel);


        const ps = new PerfectScrollbar('.admin-settings');
        //console.log(ps.reach.x);
        ps.isRtl = false;

        $('.sidebar-right-trigger').on('click', function () {
            $('.sidebar-right').toggleClass('show');
        });
        $('.sidebar-close-trigger,.bg-overlay').on('click', function () {
            $('.sidebar-right').removeClass('show');
        });
    }
}

(function ($) {
    "use strict"
    addSwitcher();


    const body = $('body');
    const html = $('html');

    //get the DOM elements from right sidebar
    const typographySelect = $('#typography');
    const versionSelect = $('#theme_version');
    const layoutSelect = $('#theme_layout');
    const sidebarStyleSelect = $('#sidebar_style');
    const sidebarPositionSelect = $('#sidebar_position');
    const headerPositionSelect = $('#header_position');
    const containerLayoutSelect = $('#container_layout');
    const themeDirectionSelect = $('#theme_direction');

    //change the theme typography controller
    typographySelect.on('change', function () {
        body.attr('data-typography', this.value);

        setCookie('typography', this.value);
        localStorage.setItem('typography' , this.value);
    });

    //change the theme version controller
    versionSelect.on('change', function () {
        body.attr('data-theme-version', this.value);

        if (this.value === 'dark') {
            //jQuery(".nav-header .logo-abbr").attr("src", "images/logo-white.png");
            jQuery(".nav-header .logo-compact").attr("src", "images/logo-text-white.png");
            jQuery(".nav-header .brand-title").attr("src", "images/logo-text-white.png");

            setCookie('logo_src', 'images/logo-white.png');
            setCookie('logo_src2', 'images/logo-text-white.png');
            localStorage.setItem('logo_src' , 'images/logo-white.png');
            localStorage.setItem('logo_src2' , 'images/logo-text-white.png');
        } else {
            jQuery(".nav-header .logo-abbr").attr("src", "images/logo.png");
            jQuery(".nav-header .logo-compact").attr("src", "images/logo-text.png");
            jQuery(".nav-header .brand-title").attr("src", "images/logo-text.png");

            setCookie('logo_src', 'images/logo.png');
            setCookie('logo_src2', 'images/logo-text.png');
            localStorage.setItem('logo_src' , 'images/logo.png');
            localStorage.setItem('logo_src2' , 'images/logo-text.png');
        }

        setCookie('version', this.value);
        localStorage.setItem('version' , this.value);
    });

    //change the sidebar position controller
    sidebarPositionSelect.on('change', function () {
        this.value === "fixed" && body.attr('data-sidebar-style') === "modern" && body.attr('data-layout') === "vertical" ?
            alert("متد مورد نظر شما نمی تواند با ساید بار ثابت نمایش داده شود ، لطفا یکی از آن ها را تغییر دهید") :
            body.attr('data-sidebar-position', this.value);
        setCookie('sidebarPosition', this.value);
        localStorage.setItem('sidebarPosition' , this.value);
    });

    //change the header position controller
    headerPositionSelect.on('change', function () {
        body.attr('data-header-position', this.value);
        setCookie('headerPosition', this.value);
        localStorage.setItem('headerPosition' , this.value);
    });

    //change the theme direction (rtl, ltr) controller
    themeDirectionSelect.on('change', function () {
        html.attr('dir', this.value);
        html.attr('class', '');
        html.addClass(this.value);
        body.attr('direction', this.value);
        setCookie('direction', this.value);
        localStorage.setItem('direction' , this.value);
    });

    //change the theme layout controller
    layoutSelect.on('change', function () {
        if (body.attr('data-sidebar-style') === 'overlay') {
            body.attr('data-sidebar-style', 'full');
            body.attr('data-layout', this.value);
            return;
        }

        body.attr('data-layout', this.value);
        setCookie('layout', this.value);
        localStorage.setItem('layout' , this.value);
    });

    //change the container layout controller
    containerLayoutSelect.on('change', function () {
        if (this.value === "boxed") {

            if (body.attr('data-layout') === "vertical" && body.attr('data-sidebar-style') === "full") {
                body.attr('data-sidebar-style', 'overlay');
                body.attr('data-container', this.value);

                setTimeout(function () {
                    $(window).trigger('resize');
                }, 200);

                return;
            }


        }

        body.attr('data-container', this.value);
        setCookie('containerLayout', this.value);
        localStorage.setItem('containerLayout' , this.value);
    });

    //change the sidebar style controller
    sidebarStyleSelect.on('change', function () {
        if (body.attr('data-layout') === "horizontal") {
            if (this.value === "overlay") {
                alert("متد انتخابی شما در لایه افقی نمی تواند کار کند");
                return;
            }
        }

        if (body.attr('data-layout') === "vertical") {
            if (body.attr('data-container') === "boxed" && this.value === "full") {
                alert("منو کامل در نمایش عمودی و باکس نمی تواند کار کند");
                return;
            }

            if (this.value === "modern" && body.attr('data-sidebar-position') === "fixed") {
                alert("متد مورد نظر شما در حالت ثابت بودن ساید بار نمی تواند کار کند");
                return;
            }
        }

        body.attr('data-sidebar-style', this.value);

        if (body.attr('data-sidebar-style') === 'icon-hover') {
            $('.deznav').on('hover', function () {
                $('#main-wrapper').addClass('iconhover-toggle');
            }, function () {
                $('#main-wrapper').removeClass('iconhover-toggle');
            });
        }

        setCookie('sidebarStyle', this.value);
        localStorage.setItem('sidebarStyle' , this.value);
    });

    //change the nav-header background controller
    $('input[name="navigation_header"]').on('click', function () {
        body.attr('data-nav-headerbg', this.value);
        setCookie('navheaderBg', this.value);
        localStorage.setItem('navheaderBg' , this.value);
    });

    //change the header background controller
    $('input[name="header_bg"]').on('click', function () {
        body.attr('data-headerbg', this.value);
        setCookie('headerBg', this.value);
        localStorage.setItem('headerBg' , this.value);
    });

    //change the sidebar background controller
    $('input[name="sidebar_bg"]').on('click', function () {
        body.attr('data-sibebarbg', this.value);
        setCookie('sidebarBg', this.value);
        localStorage.setItem('sidebarBg' , this.value);
    });

    //change the primary color controller
    $('input[name="primary_bg"]').on('click', function () {
        body.attr('data-primary', this.value);
        setCookie('primary', this.value);
        localStorage.setItem('primary' , this.value);
    });


})(jQuery);


function removeCustomSet(){
    localStorage.removeItem('typography');
    localStorage.removeItem('version');
    localStorage.removeItem('layout');
    localStorage.removeItem('headerBg');
    localStorage.removeItem('navheaderBg');
    localStorage.removeItem('sidebarBg');
    localStorage.removeItem('sidebarStyle');
    localStorage.removeItem('sidebarPosition');
    localStorage.removeItem('headerPosition');
    localStorage.removeItem('primary');
    localStorage.getItem('containerLayout')

    location.reload();
}