var globalMM;
if (Services.vc.compare(Services.appinfo.platformVersion, "16.*") <= 0) // Interface was renamed starting with Firefox 17
	globalMM = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIChromeFrameMessageManager);
else
	globalMM = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIMessageListenerManager);

globalMM.loadFrameScript("chrome://nicermediapages/content/nicermediapages.js", true);