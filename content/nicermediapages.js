var nicermediapages = (function() {

	initSVG = function() {
		var doc = content.document;

		// get SVG root element
		var svg = doc.documentElement;
		var viewBox = svg.viewBox;

		// add a "foreignObject" element with 100% width/height to the bottom of the SVG
		// to the contained "body" element we can apply all necessary customizations
		var rect = doc.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		rect.setAttribute("width", svg.width.baseVal.value);
		rect.setAttribute("height", svg.height.baseVal.value);
		var body = doc.createElementNS("http://www.w3.org/1999/xhtml", "body");
		// adjust position and scaling of the "foreignObject" if the SVG's size is manipulated using the viewBox attribute
		// check for "viewBox.baseVal.width != 0" needed for compatibility with older Firefox versions < 22 (bugs 888307 and 785606)
		if (viewBox && viewBox.baseVal && viewBox.baseVal.width != 0) {
			var mx = viewBox.baseVal.width / svg.width.baseVal.value;
			var my = viewBox.baseVal.height / svg.height.baseVal.value;
			var m = Math.max(mx,my);
			rect.setAttribute("x", (viewBox.baseVal.width/2 + viewBox.baseVal.x) / m - svg.width.baseVal.value/2);
			rect.setAttribute("y", (viewBox.baseVal.height/2 + viewBox.baseVal.y) / m - svg.height.baseVal.value/2);
			rect.setAttribute("transform", "scale(" + m + ")");
		}
		// add the elements
		rect.appendChild(body);
		svg.insertBefore(rect, svg.firstChild);
		
		// event listeners to implement transparency on hover
		svg.addEventListener("mouseover", mouseEvent, true);
		svg.addEventListener("mouseout", mouseEvent, true);
	};
	
	mouseEvent = function(aEvent) {
		var svg = content.document.getElementsByClassName("nicermediapages-SVG")[0];
		if (aEvent.type == "mouseover" && !aEvent.target.classList.contains("nicermediapages-SVG")) {
			svg.classList.add("hovered");
		}
		else if (aEvent.type == "mouseout" && !aEvent.target.classList.contains("nicermediapages-SVG")) {
			svg.classList.remove("hovered");
		}
	};


	// public functions
	return {
		init: function(aEvent) {
			// only act when "interactive" (document has finished parsing)
			// ignore "complete" (document has finished loading)
			if (content.document.readyState != "interactive") {
				return;
			}
			
			// if loaded document is an SVG/Image/Video/ document
			// add the respective class names and do any necessary initializing
			if (content.document.contentType.indexOf("image/svg") == 0) /* SVG Document */ {
				content.document.documentElement.classList.add("nicermediapages-SVG");
				initSVG();
			} else if (content.document.contentType.indexOf("image/") == 0) /* Image Document */  {
				content.document.documentElement.classList.add("nicermediapages-Image");
			} else if (content.document.contentType.indexOf("video/") == 0) /* Video Document */  {
				content.document.documentElement.classList.add("nicermediapages-Video");
			}
		}
	};

})();

// add event listener for page load
//   "DOMContentLoaded" does not fire on Image/Video Documents for some reason,
//   therefore use "readystatechange" with readyState == "interactive"
addEventListener("readystatechange", nicermediapages.init, true);