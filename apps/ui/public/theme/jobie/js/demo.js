

var themeOptionArr = {
			typography: '',
			version: '',
			layout: '',
			primary: '',
			headerBg: '',
			navheaderBg: '',
			sidebarBg: '',
			sidebarStyle: '',
			sidebarPosition: '',
			headerPosition: '',
			containerLayout: '',
			direction: 'rtl',
		};
		
		

/* Cookies Function */
function setCookie(cname, cvalue, exhours) 
	{
		var d = new Date();
		d.setTime(d.getTime() + (30*60*1000)); /* 30 Minutes */
		var expires = "expires="+ d.toString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

function getCookie(cname) 
	{
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

function deleteCookie(cname) 
	{
		var d = new Date();
		d.setTime(d.getTime() + (1)); // 1/1000 second
		var expires = "expires="+ d.toString();
		//document.cookie = cname + "=1;" + expires + ";path=/";
		document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"+";path=/";
	}

function deleteAllCookie(reload = true)
	{
		jQuery.each(themeOptionArr, function(optionKey, optionValue) {
				deleteCookie(optionKey);
		});
		if(reload){
			location.reload();
		}
	}
 	
/* Cookies Function END */


// var direction =  getUrlParams('dir');
var direction =  'rtl';
var theme =  getUrlParams('theme');

/* Dz Theme Demo Settings  */

var dezThemeSet0 = { /* Default Theme */
	typography: "iransans-normal",
	version: "light",
	layout: "vertical",
	headerBg: "color_1",
	primary: "color_1",
	navheaderBg: "color_3",
	sidebarBg: "color_3",
	sidebarStyle: "full",
	sidebarPosition: "fixed",
	headerPosition: "fixed",
	containerLayout: "full",
	direction: direction
};

var dezThemeSet1 = {
	typography: "iransans-normal",
	version: "light",
	layout: "vertical",
	headerBg: "color_1",
	primary: "color_9",
	navheaderBg: "color_9",
	sidebarBg: "color_9",
	sidebarStyle: "compact",
	sidebarPosition: "fixed",
	headerPosition: "fixed",
	containerLayout: "full",
	direction: direction
};

var dezThemeSet2 = {
	typography: "iransans-normal",
	version: "light",
	layout: "vertical",
	primary: "color_6",
	headerBg: "color_6",
	navheaderBg: "color_1",
	sidebarBg: "color_1",
	sidebarStyle: "compact",
	sidebarPosition: "fixed",
	headerPosition: "fixed",
	containerLayout: "full",
	direction: direction
};

var dezThemeSet3 = {
	typography: "iransans-normal",
	version: "dark",
	layout: "vertical",
	primary: "color_10",
	headerBg: "color_1",
	navheaderBg: "color_10",
	sidebarBg: "color_10",
	sidebarStyle: "modern",
	sidebarPosition: "static",
	headerPosition: "fixed",
	containerLayout: "full",
	direction: direction
};

var dezThemeSet4 = {
	typography: "iransans-normal",
	version: "dark",
	layout: "vertical",
	primary: "color_11",
	headerBg: "color_1",
	navheaderBg: "color_11",
	sidebarBg: "color_11",
	sidebarStyle: "full",
	sidebarPosition: "fixed",
	headerPosition: "fixed",
	containerLayout: "full",
	direction: direction
};

var dezThemeSet5 = {
	typography: "iransans-normal",
	version: "light",
	layout: "vertical",
	primary: "color_1",
	headerBg: "color_1",
	navheaderBg: "color_1",
	sidebarBg: "color_1",
	sidebarStyle: "full",
	sidebarPosition: "fixed",
	headerPosition: "fixed",
	containerLayout: "full",
	direction: direction
};

var dezThemeSet6 = {
	typography: "iransans-normal",
	version: "light",
	layout: "horizontal",
	primary: "color_5",
	headerBg: "color_1",
	navheaderBg: "color_1",
	sidebarBg: "color_1",
	sidebarStyle: "full",
	sidebarPosition: "static",
	headerPosition: "fixed",
	containerLayout: "full",
	direction: direction
};

var dezThemeSet7 = {
	typography: "iransans-normal",
	version: "light",
	layout: "horizontal",
	primary: "color_15",
	headerBg: "color_1",
	navheaderBg: "color_15",
	sidebarBg: "color_1",
	sidebarStyle: "modern",
	sidebarPosition: "static",
	headerPosition: "fixed",
	containerLayout: "full",
	direction: direction
};

var dezThemeSet8 = {
	typography: "iransans-normal",
	version: "light",
	layout: "horizontal",
	primary: "color_1",
	headerBg: "color_3",
	navheaderBg: "color_1",
	sidebarBg: "color_1",
	sidebarStyle: "full",
	sidebarPosition: "static",
	headerPosition: "fixed",
	containerLayout: "full",
	direction: direction
};

function themeChange(theme, direction){
	direction = 'rtl';
	var themeSettings = {};
	themeSettings = eval('dezThemeSet'+theme);
	themeSettings.direction = direction;
	dezSettingsOptions = themeSettings; /* For Screen Resize */
	new dezSettings(themeSettings);

	setThemeInCookie(themeSettings);
}

function setThemeInCookie(themeSettings)
{
	//console.log(themeSettings);
	jQuery.each(themeSettings, function(optionKey, optionValue) {
		setCookie(optionKey,optionValue);
	});
}

function setThemeLogo() {
	var logo = getCookie('logo_src');

	var logo2 = getCookie('logo_src2');

	if(logo != ''){
		jQuery('.nav-header .logo-abbr').attr("src", logo);
	}

	if(logo2 != ''){
		jQuery('.nav-header .logo-compact, .nav-header .brand-title').attr("src", logo2);
	}
}

function setThemeOptionOnPage()
{
	if(getCookie('version') != '')
	{
		jQuery.each(themeOptionArr, function(optionKey, optionValue) {
			var optionData = getCookie(optionKey);
			themeOptionArr[optionKey] = (optionData != '')?optionData:dezSettingsOptions[optionKey];
		});
		console.log(themeOptionArr);
		dezSettingsOptions = themeOptionArr;
		new dezSettings(dezSettingsOptions);

		setThemeLogo();
	}
}

jQuery(document).on('click', '.dz_theme_demo', function(){
	var demoTheme = jQuery(this).data('theme');
	themeChange(demoTheme, 'ltr');
});


jQuery(document).on('click', '.dz_theme_demo_rtl', function(){
	var demoTheme = jQuery(this).data('theme');
	themeChange(demoTheme, 'rtl');
});

function OnloadChangeTheme(themeData){
	themeChange(themeData, 'rtl');
	/* Set Theme On Page From Cookie */
	setThemeOptionOnPage();
}
