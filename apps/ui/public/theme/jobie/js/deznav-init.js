
var dezSettingsOptions = {};

function getUrlParams(dParam) 
	{
		var dPageURL = window.location.search.substring(1),
			dURLVariables = dPageURL.split('&'),
			dParameterName,
			i;

		for (i = 0; i < dURLVariables.length; i++) {
			dParameterName = dURLVariables[i].split('=');

			if (dParameterName[0] === dParam) {
				return dParameterName[1] === undefined ? true : decodeURIComponent(dParameterName[1]);
			}
		}
	}

(function($) {
	
	"use strict"
	
	// var direction =  getUrlParams('dir');
	var direction =  'rtl';
	
	dezSettingsOptions = {
		typography: localStorage.getItem('typography') || "iransans-normal",
		version: localStorage.getItem('version') || "light",
		layout: localStorage.getItem('layout') || "vertical",
		headerBg: localStorage.getItem('headerBg') || "color_1",
		navheaderBg: localStorage.getItem('navheaderBg') || "color_3",
		sidebarBg: localStorage.getItem('sidebarBg') || "color_3",
		sidebarStyle: localStorage.getItem('sidebarStyle') || "full",
		sidebarPosition: localStorage.getItem('sidebarPosition') || "fixed",
		headerPosition: localStorage.getItem('headerPosition') || "fixed",
		primary: localStorage.getItem('primary') || "",
		containerLayout: localStorage.getItem('containerLayout') || "full",
		direction: direction
		};

	
	if(direction == 'rtl')
	{
        direction = 'rtl'; 
    }else{
        direction = 'ltr'; 
    }

	new dezSettings(dezSettingsOptions);

	jQuery(window).on('resize',function(){
        /*Check container layout on resize */
        dezSettingsOptions.containerLayout = $('#container_layout').val();
        /*Check container layout on resize END */

		new dezSettings(dezSettingsOptions);
	});
	
})(jQuery);