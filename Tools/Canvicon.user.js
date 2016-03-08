// ==UserScript==
// @name        Canvicon
// @namespace   magicode
// @description Динамическое изменение фавикона фкладки.
// @include     http://*/*/*/*
// @include     https://*/*/*/*
// @exclude     *tumblr*
// @version     1.0
// @run-at      document-end
// @grant       none
// ==/UserScript==

var eV = document.evaluate(
		'//*[contains(@class, "oppost")]//img[contains(@class, "thumb") or contains(@class, "preview")]'
	, document.body, null, 9, null);

if (!!eV.singleNodeValue) {
	eV.singleNodeValue.onload = imageLoad;
	imageLoad.bind(eV.singleNodeValue)();
}

function imageLoad() {
	try {
		var x_offs = this['naturalWidth' ] / 5,
			y_offs = this['naturalHeight'] / 5;
			
		var canvas = document.createElement('canvas');
			canvas.width  = 16;
			canvas.height = 16;
			
		var contxt = canvas.getContext("2d");
			contxt.webkitImageSmoothingEnabled = false;
			contxt.mozImageSmoothingEnabled    = false;
			contxt.msImageSmoothingEnabled     = false;
			contxt.imageSmoothingEnabled       = false;
			contxt.drawImage(this, x_offs, y_offs, this.naturalWidth - x_offs, this.naturalHeight - y_offs, 0, 0, 16, 16);
			
		var head      = document.getElementsByTagName('head')[0],
			favs      = head.querySelectorAll('link[rel$="icon"]'),
			link      = document.createElement('link');
			link.type = 'image/x-icon';
			link.rel  = 'shortcut icon';
			link.href = canvas.toDataURL("image/jpeg;base64,");
			
		for (var i = 0; i < favs.length; i++) {
			head.removeChild(favs[i]);
		}
		
		head.appendChild(link);
	} catch(e) {
		console.error(e)
	}
}
