// ==UserScript==
// @name        thumbicon
// @description Динамическое изменение фавикона фкладки.
// @namespace   magicode
// @homepage    https://github.com/OpenA/MagiCcode/Tools
// @updateURL   https://github.com/OpenA/MagiCcode/raw/master/Tools/thumbicon.user.js
// @downloadURL https://github.com/OpenA/MagiCcode/raw/master/Tools/thumbicon.user.js
// @include     http://*/*/*/*
// @include     https://*/*/*/*
// @exclude     *tumblr*
// @version     1.1
// @run-at      document-end
// @grant       none
// ==/UserScript==

var eV = document.evaluate(
		'//*[contains(@class, "oppost") or contains(@class, "thumbnail") and contains(@class, "may-blank")]/descendant::img[contains(@class, "thumb") or contains(@class, "preview") or @src[contains(., "thumb")]]'
	, document.body, null, 9, null);

if (!!eV.singleNodeValue) {
	var head      = document.getElementsByTagName('head')[0],
		favs      = head.querySelectorAll('link[rel$="icon"]'),
		link      = document.createElement('link');
		link.type = 'image/x-icon';
		link.rel  = 'shortcut icon';
		link.href =  eV.singleNodeValue.src;
		
	for (var i = 0; i < favs.length; i++) {
		head.removeChild(favs[i]);
	}
	
	head.appendChild(link);
}
