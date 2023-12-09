(function($) {
    /* "use strict" */


 var dzChartlist = function(){
	let draw = Chart.controllers.line.__super__.draw; //draw shadow
	var screenWidth = $(window).width();
	var donutChart = function(){
		$("span.donut").peity("donut", {
			width: "220",
			height: "220"
		});
	}
	var donutChart2 = function(){
		$("span.donut2").peity("donut", {
			width: "110",
			height: "110"
		});
	}
	var lineChart2 = function(){
		//dual line chart
		if(jQuery('#lineChart2').length > 0 ){
			const lineChart2 = document.getElementById("lineChart2").getContext('2d');
			//generate gradient
			const lineChart_3gradientStroke1 = lineChart2.createLinearGradient(500, 0, 100, 0);
			lineChart_3gradientStroke1.addColorStop(0, "rgba(64, 24, 157, 1)");
			lineChart_3gradientStroke1.addColorStop(1, "rgba(64, 24, 157, 1)");

			const lineChart_3gradientStroke2 = lineChart2.createLinearGradient(500, 0, 100, 0);
			lineChart_3gradientStroke2.addColorStop(0, "rgba(63, 154, 224, 1)");
			lineChart_3gradientStroke2.addColorStop(1, "rgba(63, 154, 224, 1)");

			Chart.controllers.line = Chart.controllers.line.extend({
				draw: function () {
					draw.apply(this, arguments);
					let nk = this.chart.chart.ctx;
					let _stroke = nk.stroke;
					nk.stroke = function () {
						nk.save();
						nk.shadowColor = 'rgba(78, 54, 226, .5)';
						nk.shadowBlur = 10;
						nk.shadowOffsetX = 0;
						nk.shadowOffsetY = 0;
						_stroke.apply(this, arguments)
						nk.restore();
					}
				}
			});
				
			lineChart2.height = 100;
			Chart.defaults.global.defaultFontFamily = "iransans-normal";
			new Chart(lineChart2, {
				type: 'line',
				data: {
					// defaultFontFamily: 'iransans',
					labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"],
					datasets: [
						{
							label: "اطلاعات اول",
							data: [18, 38, 38, 70, 75, 60, 75, 66, 70, 78, 69, 75, 70],
							borderColor: lineChart_3gradientStroke1,
							borderWidth: "4",
							pointHoverRadius:10,
							backgroundColor: 'transparent', 
							pointBackgroundColor: 'rgba(64, 24, 157, 1)',
						}, {
							label: "اطلاعات دوم",
							data: [18, 20, 20, 30, 45, 40, 25, 37, 20, 40, 35, 30, 45],
							borderColor: lineChart_3gradientStroke2,
							borderWidth: "4",
							backgroundColor: 'transparent', 
							pointHoverRadius:10,
							pointBorderWidth:5,
							pointBorderColor:'rgba(255, 255, 255, 1)',
							pointBackgroundColor: 'rgba(63, 154, 224, 1)'
						}
					]
				},
				options: {
					legend: false,
					tooltips: {
						mode: 'index',
						intersect: false,
						titleAlign: 'right'
					},
					hover: {
						mode: 'nearest',
						intersect: true
					},					
					scales: {
						yAxes: [{
							display: !1,
							ticks: {
								beginAtZero: true, 
								max: 100, 
								min: 0, 
								stepSize: 20, 
								padding: 10
							}
						}],
						xAxes: [{ 
							ticks: {
								padding: 5
							}
						}]
					},
					elements: {
						point: {
							radius: 0
						}
					}
				}
			});
		}
	}
	var columnChart = function(){
		var options = {
			series: [{
				name: 'دانلود اپلیکیشن',
				data: [40, 55, 15, 50, 70, 20, 55]
			}, {
				name: 'رضایت کاربر',
				data: [55, 55, 35, 15,  35, 55, 20]
			}, {
				name: 'مشتریان ناراضی',
				data: [20, 17, 55, 45, 30, 65, 50]
			}],
			chart: {
				type: 'bar',
				height: 350,
				stacked: true,
				toolbar: {
					show: false,
				}
			},
			responsive: [{
				breakpoint: 480,
				options: {
					legend: {
						position: 'bottom',
						offsetX: -10,
						offsetY: 0
					}
				}
			}],
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '35%',
					
					endingShape: "rounded",
					startingShape: "rounded",
					backgroundRadius: 10,
					colors: {
						backgroundBarColors: ['#ECECEC', '#ECECEC', '#ECECEC', '#ECECEC', '#ECECEC', '#ECECEC', '#ECECEC'],
						backgroundBarOpacity: 1,
						backgroundBarRadius: 10,
					},
				},
				
			},
			colors:['#2BC155', '#FF9B52', '#3F9AE0'],
			xaxis: {
				show: true,
				axisBorder: {
					show: false,
				},
				
				labels: {
					style: {
						colors: '#828282',
						fontSize: '12px',
						fontFamily: 'iransans',
						fontWeight: 'light',
						cssClass: 'apexcharts-xaxis-label',
					},
				},
				crosshairs: {
					show: false,
				},
				
				categories: ['شنبه', 'یک شنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه'],
			},
			yaxis: {
				show: false
			},
			grid: {
				show: false,
			},
			toolbar: {
				enabled: false,
			},
			dataLabels: {
			  enabled: false
			},
			legend: {
				show:false
			},
			fill: {
				opacity: 1
			}
		};

		var chart = new ApexCharts(document.querySelector("#columnChart"), options);
		chart.render();
	}
	/* Function ============ */
		return {
			init:function(){
			},
			
			
			load:function(){
				columnChart();
				lineChart2();
				donutChart();
				donutChart2();
			},
			
			resize:function(){
				
			}
		}
	
	}();

	jQuery(document).ready(function(){
	});
		
	jQuery(window).on('load',function(){
		setTimeout(function(){
			dzChartlist.load();
		}, 1000); 
		
	});

	jQuery(window).on('resize',function(){
		
		
	});     

})(jQuery);