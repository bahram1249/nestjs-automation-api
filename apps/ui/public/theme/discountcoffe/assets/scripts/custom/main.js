import "slick-carousel/slick/slick.min";
(function ($) {
  $(function () {
    $(".luxCarousel").slick({
      rtl: true,
      slidesToShow: 1,
      prevArrow: "<i class='icon-left'></i>",
      nextArrow: "<i class='icon-right'></i>",
      appendArrows: ".arrows",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ],
    });
    $(".offersSlider").slick({
      rtl: true,
      slidesToShow: 2,
      prevArrow: "<i class='icon-left'></i>",
      nextArrow: "<i class='icon-right'></i>",
      // appendArrows: ".arrows",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ],
    });
    $(".offersSliderMultiple").slick({
      rtl: true,
      slidesToShow: 4,
      prevArrow: "<i class='icon-left'></i>",
      nextArrow: "<i class='icon-right'></i>",
      // appendArrows: ".arrows",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ],
    });

    $(".productSlider").slick({
      centerMode: false,
      slidesToShow: 1,
      rtl: true,
      arrows: true,
      dots: true,
      draggable: false,
      prevArrow: "<i class='icon-left'></i>",
      nextArrow: "<i class='icon-right'></i>",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ],
    });

    $(".newsSlider").slick({
      centerMode: false,
      slidesToShow: 2,
      rtl: true,
      rows: 2,
      arrows: true,
      dots: true,
      prevArrow: "<i class='icon-left'></i>",
      nextArrow: "<i class='icon-right'></i>",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ],
    });

    $(".videosCarousel").slick({
      centerMode: false,
      slidesToShow: 4,
      rtl: true,
      rows: 2,
      arrows: true,
      dots: true,
      prevArrow: "<i class='icon-left'></i>",
      nextArrow: "<i class='icon-right'></i>",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            rows: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            rows: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            rows: 1,
          },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ],
    });

    $(".productSliderMultiple").slick({
      centerMode: false,
      rtl: true,
      infinite: true,
      dots: true,
      arrows: true,
      adaptiveHeight: true,
      swipeToSlide: true,
      draggable: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      prevArrow: "<i class='icon-left'></i>",
      nextArrow: "<i class='icon-right'></i>",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ],
    });

    $(".megaLink").click(function () {
      $(".items").removeClass("active");
      $(".items[data-mega-item=" + $(this).data("mega-item") + "]").addClass(
        "active"
      );
    });

    $(".hamburger").click(function () {
      $(this).toggleClass("is-active");
      $(".menuBase").toggleClass("active");
    });

    $(".icon-times").click(function () {
      $(".searchBox").slideUp();
    });
  });

  $(".radio").click(function () {
    console.log($(this));
    $(".radio").find("input[type='radio']").prop("checked", false);
    $(".radio").removeClass("active");
    $(this).find("input[type='radio']").prop("checked", true);
    $(this).addClass("active");
  });

  $(".filterItemSingle").click(function () {
    $(this).toggleClass("active");
  });
  $(
    ".filterItemSingle select, .filterWrapper , .filterItemSingle .controls, .filterItemSingle .checkbox"
  ).click(function (e) {
    e.stopPropagation();
  });
  $(function () {
    $("#price-range").slider({
      range: true,
      min: 0,
      max: 1000,
      values: [0, 1000],
      slide: function (event, ui) {
        $("#price-min").val(ui.values[0]);
        $("#price-max").val(ui.values[1]);
      },
    });
  });

  $("#price-min").change(function (event) {
    var minValue = $("#price-min").val();
    var maxValue = $("#price-max").val();
    if (minValue <= maxValue) {
      $("#price-range").slider("values", 0, minValue);
    } else {
      $("#price-range").slider("values", 0, maxValue);
      $("#price-min").val(maxValue);
    }
  });
  // This isn't very DRY but it's just for demo purpose... oh well.
  $("#price-max").change(function (event) {
    var minValue = $("#price-min").val();
    var maxValue = $("#price-max").val();
    if (maxValue >= minValue) {
      $("#price-range").slider("values", 1, maxValue);
    } else {
      $("#price-range").slider("values", 1, minValue);
      $("#price-max").val(minValue);
    }
  });
  $(".order a").click(function () {
    $(".order a").removeClass();
    $(this).addClass("active");
  });
  $(document).ready(function () {
    function updateTimer() {
      var now = new Date();
      var nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0
      );
      var timeRemaining = nextMidnight - now;

      var hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      // نمایش ساعت در <div>
      var clockText =
        hours + " ساعت " + minutes + " دقیقه " + seconds + " ثانیه";
      $("#clock").text(clockText);

      // نمایش متن‌های زمان در <span>
      $("#hours").text(hours);
      $("#minutes").text(minutes);
      $("#seconds").text(seconds);
    }

    updateTimer();
    setInterval(updateTimer, 1000); // هر یک ثانیه تایمر به‌روزرسانی می‌شود
  });
  $(".icon-heart").click(function () {
    $(this).toggleClass("icon-heart-filed icon-heart");
  });
  $(".controls").click(function () {
    console.log($(this).parent());
    $(this).parent().find("video").get(0).play();
  });

  //BEGIN
  $(".accordion__title").on("click", function (e) {
    e.preventDefault();
    var $this = $(this);

    if (!$this.hasClass("accordion-active")) {
      $(".accordion__content").slideUp(400);
      $(".accordion__title").removeClass("accordion-active");
      $(".accordion__arrow").removeClass("accordion__rotate");
    }

    $this.toggleClass("accordion-active");
    $this.next().slideToggle();
    $(".accordion__arrow", this).toggleClass("accordion__rotate");
  });
  $(".accordion-toggle").click(function () {
    $(this).parent().next(".accordion-content").slideToggle();
    $(this).parent().find(".accordion-toggle").toggleClass("active");
  });
  $(".accordion-title").click(function () {
    $(this).parent().next(".accordion-content").slideToggle();
    $(this).parent().find(".accordion-toggle").toggleClass("active");
  });
  $("radios");
  // $(".accordion-header").click(function () {
  //   $(this).next(".accordion-content").slideToggle();
  //   $(this).find(".accordion-toggle").toggleClass("active");
  // });
  //END
  var logID = "log",
    log = $('<div id="' + logID + '"></div>');

  $('.radios [type*="radio"]').change(function () {
    $(this).parent().parent().find(".radioItem").removeClass("active");
    var me = $(this).parent().addClass("active");
    // console.log(me);
    console.log($(this).attr("value"));
  });

  $(".searchFilter").click(function () {
    const type = {
      name: $('input[name="type"]:checked').attr("name"),
      value: $('input[name="type"]:checked').val(),
    };
    const price = {
      name: $('input[name="price"]:checked').attr("name"),
      value: $('input[name="price"]:checked').val(),
    };
    const location = {
      name: "location",
      value: $("#location option:selected").val(),
    };
    const data = [type, price, location];
    console.log(data);
  });

  $(".expand").click(function () {
    if ($(".expand").hasClass("active-expand")) {
      $(this).removeClass("active-expand");
      $(".singleCafe .features .items").removeClass("active");

      $(".singleCafe .features .items").animate({ height: "400px" }, 800);
    } else {
      $(this).addClass("active-expand");
      $(".singleCafe .features .items").addClass("active");
      $(".singleCafe .features .items").animate(
        { height: $(".singleCafe .features .items").get(0).scrollHeight },
        800
      );
    }
  });

  // $(document).on("click", "active-expand", function () {
  //   $(this).removeClass("active");
  //   $(".singleCafe .features .items").animate({ height: "200px" }, 800);
  // });
})(jQuery);
