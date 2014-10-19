// register the style sheet for SVGs
var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
                    .getService(Components.interfaces.nsIStyleSheetService);
var ios = Components.classes["@mozilla.org/network/io-service;1"]
                    .getService(Components.interfaces.nsIIOService);
var uri = ios.newURI("chrome://nicermediapages/skin/TopLevelSVGDocument.css", null, null);
if (!sss.sheetRegistered(uri, sss.USER_SHEET)) {
	sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
}


// register frame script in global message manager (e10s compatibility; gets loaded into every <browser> in every chrome window)
var globalMM;
if (Services.vc.compare(Services.appinfo.platformVersion, "16.*") <= 0) // Interface was renamed starting with Firefox 17
	globalMM = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIChromeFrameMessageManager);
else
	globalMM = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIMessageListenerManager);

globalMM.loadFrameScript("chrome://nicermediapages/content/nicermediapages.js", true);