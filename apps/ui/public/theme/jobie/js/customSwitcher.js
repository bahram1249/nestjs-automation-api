function changeNavHeaderBg(color) {
  setCookie("navheaderBg", color);
  localStorage.setItem("navheaderBg", color);
  body.attr("data-nav-headerbg", color);
}

function changeSidebarBg(color) {
  body.attr("data-sibebarbg", color);
  setCookie("sidebarBg", color);
  localStorage.setItem("sidebarBg", color);
}

(function ($) {
  "use strict";

  const body = $("body");
  const html = $("html");
  var color = "color_12";
  changeNavHeaderBg(color);
  changeSidebarBg(color);
})(jQuery);
