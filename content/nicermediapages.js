/*
 * Copyright (C) 2018 Eduard Braun
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
const nicermediapages = (() => {
	const initSVG = () => {
		// Get the SVG root element
		const svg = document.documentElement;
		const viewBox = svg.viewBox;

		// Add a "foreignObject" element with 100% width/height to the bottom of the SVG
		// to the contained "body" element we can apply all necessary customizations
		const rect = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		rect.setAttribute("width", svg.width.baseVal.value);
		rect.setAttribute("height", svg.height.baseVal.value);
		const body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");

		// Adjust position and scaling of the "foreignObject" if the SVG's size is manipulated using the viewBox attribute
		if (viewBox && viewBox.baseVal) {
			const mx = viewBox.baseVal.width / svg.width.baseVal.value;
			const my = viewBox.baseVal.height / svg.height.baseVal.value;
			const m = Math.max(mx,my);
			rect.setAttribute("x", (viewBox.baseVal.width/2 + viewBox.baseVal.x) / m - svg.width.baseVal.value/2);
			rect.setAttribute("y", (viewBox.baseVal.height/2 + viewBox.baseVal.y) / m - svg.height.baseVal.value/2);
			rect.setAttribute("transform", "scale(" + m + ")");
		}
		// Add the elements
		rect.appendChild(body);
		svg.insertBefore(rect, svg.firstChild);

		// Add event listeners to implement transparency on hover
		const mouseEvent = (event) => {
			if (!event.target.classList.contains("nicermediapages-SVG")) {
				switch (event.type) {
					case "mouseover":
						svg.classList.add("hover");
						break;
					case "mouseout":
						svg.classList.remove("hover");
						break;
				}
			}
		};
		svg.addEventListener("mouseover", mouseEvent, {capture: true, passive: true});
		svg.addEventListener("mouseout", mouseEvent, {capture: true, passive: true});
	};

	// public functions

	/**
	 * Initialize Nicer Media Pages.
	 */
	const init = () => {
		// If the loaded document is an SVG/Image/Video/ document
		// add the respective class names and do any necessary initializing
		if (document.contentType.indexOf("image/svg") === 0) /* SVG Document */ {
			if (window.location.protocol !== "view-source:") { // prevent modifying "view source" page
				document.documentElement.classList.add("nicermediapages-SVG");
				initSVG();
			}
		} else if (document.contentType.indexOf("image/") === 0) /* Image Document */  {
			document.documentElement.classList.add("nicermediapages-Image");
		} else if (document.contentType.indexOf("video/") === 0) /* Video Document */  {
			document.documentElement.classList.add("nicermediapages-Video");
		}
	};

	return {
		init
	};
})();

// This script now runs at the "interactive" (or "complete") DOM state,
// because the "run_at" manifest.json key was set to "document_end"
nicermediapages.init();
