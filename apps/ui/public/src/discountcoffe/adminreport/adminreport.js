(function ($) {
  Chart.defaults.global.defaultFontFamily = 'iransans-normal';

  var adminreport = function () {};

  jQuery(window).on('load', function () {
    dzSparkLine.load();
  });

  jQuery(window).on('resize', function () {
    //dzSparkLine.resize();
    setTimeout(function () {
      dzSparkLine.resize();
    }, 1000);
  });
})(jQuery);
