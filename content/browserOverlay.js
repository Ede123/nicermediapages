window.addEventListener("load", function load(event){
	window.removeEventListener("load", load, false); //remove listener, no longer needed
	nicermediapages.init();
},false);

var nicermediapages = {
	init: function() {
		// register the style sheet for SVGs
		var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
		                    .getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes["@mozilla.org/network/io-service;1"]
		                    .getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI("chrome://nicermediapages/skin/TopLevelSVGDocument.css", null, null);
		sss.loadAndRegisterSheet(uri, sss.USER_SHEET);

		document.addEventListener("DOMContentLoaded", nicermediapages.onPageLoad, true);
	},

	onPageLoad: function(aEvent) {
		var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
		
		// immediately return if the loaded document is not an SVG file
		if (doc.documentElement.tagName != "svg") {
			return;
		}

		var svg = doc.documentElement;
		svg.setAttribute("id","nicermediapages-SVG");
		var viewBox = svg.viewBox;
		
		// add a "foreignObject" with 100% width/height to the bottom of the SVG
		// to the contained "body" element we can apply all necessary customizations
		var rect = doc.createElementNS("http://www.w3.org/2000/svg","foreignObject");
		rect.setAttribute("width","100%");
		rect.setAttribute("height","100%");
		if (viewBox && viewBox.baseVal) {
			rect.setAttribute("x",viewBox.baseVal.x);
			rect.setAttribute("y",viewBox.baseVal.y);
		}
		var body = doc.createElementNS("http://www.w3.org/1999/xhtml","body");
		body.setAttribute("id","nicermediapages-body");
		rect.appendChild(body);
		svg.insertBefore(rect,svg.firstChild);
	}
};