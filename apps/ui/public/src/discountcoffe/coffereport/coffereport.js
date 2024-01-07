(function ($) {
  Chart.defaults.global.defaultFontFamily = 'iransans-normal';

  var adminreport = function () {
    let draw = Chart.controllers.line.__super__.draw; //draw shadow

    var barChart1 = function () {
      $.ajax({
        url: '/v1/api/discountcoffe/admin/coffereports/totalReserves',
        type: 'GET',
        beforeSend: function (request) {
          beforeSendAjax(request);
        },
        success: function (data) {
          var barResults = data.result;
          var monthNames = barResults.map((item) => item.PersianMonthName);
          var totalReserves = barResults.map((item) => item.totalCnt);
          if (jQuery('#totalChart_1').length > 0) {
            const totalChart_1 = document
              .getElementById('totalChart_1')
              .getContext('2d');

            totalChart_1.height = 100;

            new Chart(totalChart_1, {
              type: 'bar',
              data: {
                // defaultFontFamily: 'Poppins',
                labels: monthNames,
                datasets: [
                  {
                    label: 'تعداد کل سفارش های ثبت شده',
                    data: totalReserves,
                    borderColor: 'rgba(64, 24, 157, 1)',
                    borderWidth: '0',
                    backgroundColor: 'rgba(64, 24, 157, 1)',
                  },
                ],
              },
              options: {
                legend: false,
                tooltips: {
                  titleAlign: 'right',
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                  xAxes: [
                    {
                      // Change here
                      barPercentage: 0.5,
                    },
                  ],
                },
              },
            });
          }
        },
        error: errorJson,
      });
    };

    var barChart2 = function () {
      $.ajax({
        url: '/v1/api/discountcoffe/admin/coffereports/totalReserves',
        type: 'GET',
        beforeSend: function (request) {
          beforeSendAjax(request);
        },
        success: function (data) {
          var barResults = data.result;
          var monthNames = barResults.map((item) => item.PersianMonthName);
          var totalReserves = barResults.map((item) => item.onlineCnt);
          if (jQuery('#totalChart_2').length > 0) {
            const totalChart_2 = document
              .getElementById('totalChart_2')
              .getContext('2d');

            totalChart_2.height = 100;

            new Chart(totalChart_2, {
              type: 'bar',
              data: {
                // defaultFontFamily: 'Poppins',
                labels: monthNames,
                datasets: [
                  {
                    label: 'تعداد سفارش های ثبت شده آنلاین',
                    data: totalReserves,
                    borderColor: 'rgba(64, 24, 157, 1)',
                    borderWidth: '0',
                    backgroundColor: 'rgba(64, 24, 157, 1)',
                  },
                ],
              },
              options: {
                legend: false,
                tooltips: {
                  titleAlign: 'right',
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                  xAxes: [
                    {
                      // Change here
                      barPercentage: 0.5,
                    },
                  ],
                },
              },
            });
          }
        },
        error: errorJson,
      });
    };

    var barChart3 = function () {
      $.ajax({
        url: '/v1/api/discountcoffe/admin/coffereports/totalReserves',
        type: 'GET',
        beforeSend: function (request) {
          beforeSendAjax(request);
        },
        success: function (data) {
          var barResults = data.result;
          var monthNames = barResults.map((item) => item.PersianMonthName);
          var totalReserves = barResults.map((item) => item.offlineCnt);
          if (jQuery('#totalChart_3').length > 0) {
            const totalChart_3 = document
              .getElementById('totalChart_3')
              .getContext('2d');

            totalChart_3.height = 100;

            new Chart(totalChart_3, {
              type: 'bar',
              data: {
                // defaultFontFamily: 'Poppins',
                labels: monthNames,
                datasets: [
                  {
                    label: 'تعداد سفارش های ثبت شده آفلاین',
                    data: totalReserves,
                    borderColor: 'rgba(64, 24, 157, 1)',
                    borderWidth: '0',
                    backgroundColor: 'rgba(64, 24, 157, 1)',
                  },
                ],
              },
              options: {
                legend: false,
                tooltips: {
                  titleAlign: 'right',
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                  xAxes: [
                    {
                      // Change here
                      barPercentage: 0.5,
                    },
                  ],
                },
              },
            });
          }
        },
        error: errorJson,
      });
    };

    var areaChart2 = function () {
      $.ajax(
        {
          url: '/v1/api/discountcoffe/admin/coffereports/totalReserves',
          type: 'GET',
          beforeSend: function (request) {
            beforeSendAjax(request);
          },
          success: function (data) {
            var barResults = data.result;
            var monthNames = barResults.map((item) => item.PersianMonthName);
            var totalReserves = barResults.map((item) => item.onlineSumPrice);
            var max = Math.max.apply(Math, totalReserves);
            var min = Math.min.apply(Math, totalReserves);
            var step = (max + min + 20) / 2;
            if (jQuery('#areaChart_2').length > 0) {
              const areaChart_2 = document
                .getElementById('areaChart_2')
                .getContext('2d');
              //generate gradient
              const areaChart_2gradientStroke =
                areaChart_2.createLinearGradient(0, 1, 0, 500);
              areaChart_2gradientStroke.addColorStop(
                0,
                'rgba(139, 199, 64, 0.2)',
              );
              areaChart_2gradientStroke.addColorStop(
                1,
                'rgba(139, 199, 64, 0)',
              );

              areaChart_2.height = 100;

              new Chart(areaChart_2, {
                type: 'line',
                data: {
                  // defaultFontFamily: 'Poppins',
                  labels: monthNames,
                  datasets: [
                    {
                      label: 'میزان فروش آنلاین',
                      data: totalReserves,
                      borderColor: '#ff6746',
                      borderWidth: '4',
                      backgroundColor: areaChart_2gradientStroke,
                    },
                  ],
                },
                options: {
                  legend: false,
                  tooltips: {
                    titleAlign: 'right',
                  },
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: false,
                          max: max + 40,
                          min: 0,
                          stepSize: step,
                          padding: 5,
                        },
                      },
                    ],
                    xAxes: [
                      {
                        ticks: {
                          padding: 5,
                        },
                      },
                    ],
                  },
                },
              });
            }
          },
          error: errorJson,
        },

        //gradient area chart
      );
    };

    return {
      init: function () {},

      load: function () {
        barChart1();
        barChart2();
        barChart3();
        areaChart2();
      },

      resize: function () {},
    };
  };

  jQuery(window).on('load', function () {
    adminreport().load();
  });

  jQuery(window).on('resize', function () {
    //dzSparkLine.resize();
    setTimeout(function () {
      adminreport.resize();
    }, 1000);
  });
})(jQuery);
