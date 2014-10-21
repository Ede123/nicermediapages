const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");

// store the current time (it will be appended to resource URIs via "?" to work around caching issues)
var startupTime = Date.now();


/* Bootstrap entry points */
function startup(data, reason) {
	// register style sheets
	var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
	var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
	var uri = ios.newURI("chrome://nicermediapages/skin/nicermediapages.css?" + startupTime, null, null);
	if (!sss.sheetRegistered(uri, sss.AUTHOR_SHEET)) {
		sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);
	}

	// register frame script in global message manager (e10s compatibility; gets loaded into every <browser> in every chrome window)
	var globalMM;
	if (Services.vc.compare(Services.appinfo.platformVersion, "16.*") <= 0) // Interface was renamed starting with Firefox 17
		globalMM = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIChromeFrameMessageManager);
	else
		globalMM = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIMessageListenerManager);
	globalMM.loadFrameScript("chrome://nicermediapages/content/nicermediapages.js?" + startupTime, true);
}

function shutdown(data, reason) {
	// no unloading needed on Firefox shutdown
	if (reason === APP_SHUTDOWN)
		return;

	// unregister style sheets
	var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
	var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
	var uri = ios.newURI("chrome://nicermediapages/skin/nicermediapages.css?" + startupTime, null, null);
	if (sss.sheetRegistered(uri, sss.AUTHOR_SHEET)) {
		sss.unregisterSheet(uri, sss.AUTHOR_SHEET);
	}

	// unregister frame script in global message manager
	var globalMM;
	if (Services.vc.compare(Services.appinfo.platformVersion, "16.*") <= 0) // Interface was renamed starting with Firefox 17
		globalMM = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIChromeFrameMessageManager);
	else
		globalMM = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIMessageListenerManager);
	globalMM.removeDelayedFrameScript("chrome://nicermediapages/content/nicermediapages.js?" + startupTime);
}

function install(data, reason) {}

function uninstall(data, reason) {}