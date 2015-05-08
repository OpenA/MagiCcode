// ==UserScript==
// @name    		Simple Magic Extension for Dobrochan Imageboard
// @description 	Включает в себя: Ajax подгрузку постов, Ajax постинг и удаление, Превращение рейтингов в спойлеры, Умные кнопки разметки, а так же опции раскрытия текстовых спойлеров, звуковых уведомлений и перетаскиваемых превью.
// @namespace   	magicode
// @homepage		https://github.com/OpenA/MagiCcode/Dobrochan
// @updateURL   	https://github.com/OpenA/MagiCcode/raw/master/Dobrochan/HanabiraSimpleMagicExtension.user.js
// @downloadURL 	https://github.com/OpenA/MagiCcode/raw/master/Dobrochan/HanabiraSimpleMagicExtension.user.js
// @include 		*dobrochan.*
// @run-at  		document-start
// @version 		1.2.1
// @grant   		none
// ==/UserScript==

/* Tinycon - A small library for manipulating the Favicon Tom Moor, http://tommoor.com */
(function(){var Tinycon={};var currentFavicon=null;var originalFavicon=null;var faviconImage=null;var canvas=null;var options={};var r=window.devicePixelRatio||1;var size=16*r;var defaults={width:7,height:9,font:10*r+'px arial',colour:'#fff',background:'#F03D25',fallback:true,crossOrigin:true,abbreviate:true};var ua=(function(){var agent=navigator.userAgent.toLowerCase();return function(browser){return agent.indexOf(browser)!==-1}}());var browser={ie:ua('msie'),chrome:ua('chrome'),webkit:ua('chrome')||ua('safari'),safari:ua('safari')&&!ua('chrome'),mozilla:ua('mozilla')&&!ua('chrome')&&!ua('safari')};var getFaviconTag=function(){var links=document.getElementsByTagName('link');for(var i=0,len=links.length;i<len;i++){if((links[i].getAttribute('rel')||'').match(/\bicon\b/)){return links[i]}}return false};var removeFaviconTag=function(){var links=document.getElementsByTagName('link');var head=document.getElementsByTagName('head')[0];for(var i=0,len=links.length;i<len;i++){var exists=(typeof(links[i])!=='undefined');if(exists&&(links[i].getAttribute('rel')||'').match(/\bicon\b/)){head.removeChild(links[i])}}};var getCurrentFavicon=function(){if(!originalFavicon||!currentFavicon){var tag=getFaviconTag();originalFavicon=currentFavicon=tag?tag.getAttribute('href'):'/favicon.ico'}return currentFavicon};var getCanvas=function(){if(!canvas){canvas=document.createElement("canvas");canvas.width=size;canvas.height=size}return canvas};var setFaviconTag=function(url){removeFaviconTag();var link=document.createElement('link');link.type='image/x-icon';link.rel='icon';link.href=url;document.getElementsByTagName('head')[0].appendChild(link)};var log=function(message){if(window.console)window.console.log(message)};var drawFavicon=function(label,colour){if(!getCanvas().getContext||browser.ie||browser.safari||options.fallback==='force'){return updateTitle(label)}var context=getCanvas().getContext("2d");var colour=colour||'#000';var src=getCurrentFavicon();faviconImage=document.createElement('img');faviconImage.onload=function(){context.clearRect(0,0,size,size);context.drawImage(faviconImage,0,0,faviconImage.width,faviconImage.height,0,0,size,size);if((label+'').length>0)drawBubble(context,label,colour);refreshFavicon()};if(!src.match(/^data/)&&options.crossOrigin){faviconImage.crossOrigin='anonymous'}faviconImage.src=src};var updateTitle=function(label){if(options.fallback){var originalTitle=document.title;if(originalTitle[0]==='('){originalTitle=originalTitle.slice(originalTitle.indexOf(' '))}if((label+'').length>0){document.title='('+label+') '+originalTitle}else{document.title=originalTitle}}};var drawBubble=function(context,label,colour){if(typeof label=='number'&&label>99&&options.abbreviate){label=abbreviateNumber(label)}var len=(label+'').length-1;var width=options.width*r+(6*r*len),height=options.height*r;var top=size-height,left=size-width-r,bottom=16*r,right=16*r,radius=2*r;context.font=(browser.webkit?'bold ':'')+options.font;context.fillStyle=options.background;context.strokeStyle=options.background;context.lineWidth=r;context.beginPath();context.moveTo(left+radius,top);context.quadraticCurveTo(left,top,left,top+radius);context.lineTo(left,bottom-radius);context.quadraticCurveTo(left,bottom,left+radius,bottom);context.lineTo(right-radius,bottom);context.quadraticCurveTo(right,bottom,right,bottom-radius);context.lineTo(right,top+radius);context.quadraticCurveTo(right,top,right-radius,top);context.closePath();context.fill();context.beginPath();context.strokeStyle="rgba(0,0,0,.3)";context.moveTo(left+radius/2.0,bottom);context.lineTo(right-radius/2.0,bottom);context.stroke();context.fillStyle=options.colour;context.textAlign="right";context.textBaseline="top";context.fillText(label,r===2?29:15,browser.mozilla?7*r:6*r)};var refreshFavicon=function(){if(!getCanvas().getContext)return;setFaviconTag(getCanvas().toDataURL())};var abbreviateNumber=function(label){var metricPrefixes=[['G',1000000000],['M',1000000],['k',1000]];for(var i=0;i<metricPrefixes.length;++i){if(label>=metricPrefixes[i][1]){label=round(label/metricPrefixes[i][1])+metricPrefixes[i][0];break}}return label};var round=function(value,precision){var number=new Number(value);return number.toFixed(precision)};Tinycon.setOptions=function(custom){options={};for(var key in defaults){options[key]=custom.hasOwnProperty(key)?custom[key]:defaults[key]}return this};Tinycon.setImage=function(url){currentFavicon=url;refreshFavicon();return this};Tinycon.setBubble=function(label,colour){label=label||'';drawFavicon(label,colour);return this};Tinycon.reset=function(){setFaviconTag(originalFavicon)};Tinycon.setOptions(defaults);window.Tinycon=Tinycon;if(typeof define==='function'&&define.amd){define(Tinycon)}})();
//Copyright (c) 2012 Tom Moor @license MIT Licensed @version 0.6.3

/* SpelzZ - */
(function(){
	var _z = {
		each: $each, setup: $setup, route: $route,
		getlSVal: getlSValue, setlSVal: setlSValue, fall: fallback,
		append:  function(el, nodes) { $nodeUtil('append',  el, nodes) },
		prepend: function(el, nodes) { $nodeUtil('prepend', el, nodes) },
		after:   function(el, nodes) { $nodeUtil('after',   el, nodes) },
		before:  function(el, nodes) { $nodeUtil('before',  el, nodes) },
		replace: function(el, nodes) { $nodeUtil('replace', el, nodes) },
		remove:  function(el, nodes) { $nodeUtil('remove',  el, nodes) }
	}
	function $each(obj, Fn) {
		var el = typeof obj === 'string' ? document.querySelectorAll(obj) : obj;
		Array.prototype.slice.call(el, 0).forEach(Fn)
	}
	function $setup(obj, attr, events) {
		var el = typeof obj === 'string' ? document.createElement(obj) : obj;
		if (attr) {
			for (var key in attr) {
				attr[key] === undefined ? el.removeAttribute(key) :
				key === 'html'    ? el.innerHTML   = attr[key] :
				key === 'text'    ? el.textContent = attr[key] :
				key === 'value'   ? el.value       = attr[key] :
				key === 'checked' ? el.checked     = attr[key] :
				el.setAttribute(key, attr[key]);
			}
		}
		if (events) {
			for (var key in events) {
				el.addEventListener(key, events[key], false);
			}
		}
		return el;
	}
	function $nodeUtil(p, el, nodes) {
		var i, node, Child, Parent = el.parentNode;
		if (typeof el === 'string')
			el = document.querySelector(el);
		if (nodes && !Array.isArray(nodes))
			nodes = [nodes];
		switch (p.toLowerCase()) {
			case 'append':
				for (i = 0, len = nodes.length; i < len; i++) {
					if (nodes[i])
						el.appendChild(nodes[i]);
				}
				break;
			case 'remove':
				_z.each(el, function(child) {
					child.parentNode.removeChild(child);
				});
				break;
			case 'replace':
				Parent.replaceChild(nodes[0], el);
				break;
			default:
				switch (p.toLowerCase()) {
					case 'after': Child = el.nextSibling;
						break;
					case 'before': Child = el;
						break;
					case 'prepend': Child = el.childNodes[0], Parent = el;
				}
				for (i = 0; node = nodes[i++];) {
					Parent.insertBefore(node, Child);
				}
		}
	}
	function $route(el, Fn) {
		while (el) {
			var tn = (typeof Fn === 'string' ? el.querySelector(Fn) : Fn(el));
			if (tn)
				return (typeof tn === 'object' ? tn : el);
			el = el.parentNode;
		}
	}
	function probeStore(name, val, sess) {
		var stor = sess ? sessionStorage : localStorage;
		try {
			stor.setItem(name, val);
		} catch(e) {
			stor.removeItem(name);
			stor.setItem(name, val);
		}
	}
	function setlSValue(name, value, sess) {
		if (typeof name === 'object') {
			for (var key in name) {
				probeStore(key, (name[key] === null ? value : name[key]), sess);
			}
		} else {
			probeStore(name, value, sess);
		}
	}
	function getlSValue(name, def, sess) {
		var stor = sess ? sessionStorage : localStorage;
		if (name in stor) {
			var v = stor.getItem(name);
			v = v == 'false' ? false : 
				v == 'true' ? true : v;
			return v;
		} else {
			probeStore(name, def, sess);
			return def;
		}
	}
	function fallback(e) {
		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;
	}
	window._z = _z;
})();

var GlobalStyle = _z.setup('style', {'text': '.hide,.reply_,#postform,#hideinfodiv hr{display:none!important;position:absolute;left:-9999;}.reply-button,.cpop,.callpop{margin-left:.4em;}\
.unexpanded,.rated{max-width:200px!important;max-height:200px!important;}.expanded{width:100%;height:auto;}#hideinfodiv{margin:5px;}.sp-r.rate{color:darkred;}#music_player{right:5px;position:fixed;bottom:5px;}\
.search_google{background-image:url(/src/png/1407/google_14_icon.png)!important;}.search_derpibooru{background-image:url(/src/png/1407/derpibooru_reverse_search_14_icon.png);}.search_saucenao{background-image:url(/src/png/1502/saucenao_favicon1.png);}\
.yuki_clickable,.txt-btn,.wmark-button{cursor:pointer;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}\
.replylinks{line-height:2em;font-size:75%;clear:both;}.hideinfo{text-align:center!important;}.post-count,.txt-btn{color:#999;}.mapped,.mapped:hover{cursor:default;color:#666!important;}.dpop{cursor:move;}\
.postername:after, .userdelete:after{content:"";-webkit-animation:onReady 1s linear 2;animation:onReady 1s linear 2;}.dpop,.sp-r,.wmark-buttons-panel,#yuki-close-form,#yuki-newThread-create{float:right;text-align:right;}.err-msg{color:#ff3428;}.deleted{opacity:.6;}.reply.new{background:#ee9;}\
@keyframes onReady{50% {opacity:0;}} @-webkit-keyframes onReady{50% {opacity:0;}}'}, null);
document.head.appendChild(GlobalStyle);

(function() {
	var hideinfo, showinfo, postForm, pfplaceh, topForm, delForm, deli, pass, lng, btn, thread_updating,
		unread_count = 0, timer_id = 0, updInt = 45,
	HM = {
		Sage: false, zIndex: 0, RefTab: null,
		RepliesMap: {}, LoadedPosts: {}, URL: ParseUrl(),
		RemoveExif: _z.getlSVal('RemoveExif', true),
		SoundNotify: _z.getlSVal('SoundNotify', false, true),
		AttachPopups: _z.getlSVal('AttachPopups', true),
		RemoveFileName: _z.getlSVal('RemoveFileName', false),
		DiscloseTextSpoilers: _z.getlSVal('DiscloseTextSpoilers', false),
		UpdateInterval: function() {
			var i = updInt > 180 ? 180 :
					updInt < 45  ? 45  : updInt;
			return i * 1000;
		},
		defaultName: function(name) {
			var i, l = LC.lng[lng];
			if (name) {
				i = LC.names['ru'].indexOf(name)
				return (i >= 0 ? LC.names[l][i] : name)
			} else {
				switch (HM.URL.board) {
					case 's'   : i = 1; break;
					case 'sw'  : i = 2; break;
					case 'wn'  : i = 3; break;
					case 'slow': i = 4; break;
					case 'mad' : i = 5; break;
					default    : i = 0;
				}
				return LC.names[l][i]
			}
		}},
	Target = {
		board: HM.URL.board,
		tid: HM.URL.thread,
		thread: function(num) {
			return document.getElementById('thread_'+ (num || Target.tid));
		},
		last: function() {
			var tlel = Target.thread().lastElementChild;
			return tlel.nodeName === 'FORM' ? tlel.previousElementSibling : tlel;
		}}, 
	Files = {
		audio: ["flac", "alac", "wav", "m4a", "m4r", "aac", "ogg", "mp3", "opus"],
		video: ['webm', 'ogv', 'ogm', 'mp4', 'm4v', 'flv', "3gp"],
		image: ["jpeg", "jpg", "png", "svg", "gif"],
		arch: ['zip', 'rar', '7z']},
	LC = {
		lng: ['en', 'ru'],
		file: ["File", "файл"],
		repl: ["Reply", "Ответ"],
		edit: ["Edit", "Изменить"],
		omit: [" omited ", " ответов "],
		wsec: ['Wait a Second...', 'Секунду...'],
		updprog: ["Updating...", "Обновление..."],
		postdel: ["Post is deleted.", "Пост удалён."],
		loadnew: ["Load New Posts", "Подгрузить посты"],
		clipopup: ["Clipping Popup Posts", "Закреплять превью постов"],
		txtspoils: ["Disclose text spoilers", "Раскрывать текстовые спойлеры"],
		snd_notify: ["Sound Notifications", "Звуковые уведомления"],
		fnd_src_wth: ["Find source with", "Искать оригинал в"],
		remv: ["Remove", "Убрать"],
		clos: ["Close", "Закрыть"],
		all: [" All", " все"],
		add: ["Add", "Добавить"],
		names: {
			'en': ['Anonymous', 'Developer', 'Lawrense', 'Anonymous Expert', 'Slowpoke', 'Experimenter'],
			'ru': ['Анонимус', 'Доброкодер', 'Лоуренс', 'Анонимный эксперт', 'Добропок', 'Экспериментатор']
		},
		few: {
			'u-a': ["\'s", "а"],
			'u-b': ["s", "ов"],
			'u-c': ["s", "ы"],
			'u-d': ["\'s", "и"],
			'en': ["s", ""],
			'ru': ["", "а"]
		}
	}
	
	/***--[ Utilites ]--***/
	Array.prototype.isThere = matchIndex
	String.prototype.isThere = matchIndex
	String.prototype.allReplace = function(obj, r) {
		var retStr = this;
		for (var x in obj) {
			retStr = retStr.replace((r ? x : new RegExp(x, 'g')), obj[x])
		}
		return retStr
	}
	String.prototype.repeat = function(num) {
		return new Array(num + 1).join(this);
	}
	String.prototype.fext = function() {
		return this.split('.').pop().toLowerCase();
	}
	function matchIndex(str) {
		return this.indexOf(str) >= 0;
	}
	function setupOptions(obj, option, sess) {
		if (obj.type === 'checkbox')
			val = obj.checked;
		if (obj.tagName === 'SELECT')
			val = obj.value;
		HM[option] = val;
		_z.setlSVal(option, val, sess);
	}
	
	function ParseUrl(url) {
		var m = (url || document.location.href).match(/(?:https?:\/\/([^\/]+))?\/([^\/]+)\/(?:(\d+)|res\/(\d+)|(\w+))(?:\.x?html)?(#i?(\d+))?/);
		return m ? {host: m[1], board: m[2], page: m[3], thread: m[4], desk: m[5], pointer: m[6], pid: m[7]} : {};
	}
	function GetElements(el) { 
		var node = el || document;
		return { posts: node.getElementsByClassName('post'), hoos: node.querySelectorAll('.reply-button, .reply-link, .spr-image, .sp-r'),
			links: node.querySelectorAll('.message a, img.thumb[alt="unrated"], img.thumb[alt^="r-1"], img.thumb[alt="illegal"], .file > a[href$=".svg"] > img, a.search_iqdb.icon, .reflink')
		}
	}
	function _show (el) { el.classList.remove('hide') }
	function _shide(el) { el.classList.toggle('hide') }
	function _hide (el) { el.classList.add('hide') }
	function _cid(pid) {
		var n = new RegExp(/(\d+)/).exec(pid);
		return Number((n[1] || 0));
	}
	
	/************************************************************************/
	function getDataResponse(uri, Fn) {
		var apiReq = new XMLHttpRequest();
		apiReq.open('GET', uri, true);
		apiReq.onreadystatechange = function() {
			if (this.readyState !== 4)
				return;
			if (this.status === 304) {
				console.log('304 ' + this.statusText);
			} else {
				try {
					var json = JSON.parse(this.responseText);
				} catch(e){
				} finally {
					Fn(this.status, this.statusText, (json || this.responseText), this);
					Fn = null;
				}
			}
		}
		apiReq.send(null);
	}
	function updateThread(e) {
		if (thread_updating)
			return;
		thread_updating = true;
		HM.Settings['LoadButton'].textContent = LC.updprog[lng];
		getDataResponse('/api/thread/'+ HM.URL.board +'/'+ Target.tid +'/new.json?new_format&post_html&last_post='+ _cid(Target.last().id),
			function parseNewPosts(status, sText, json, xhr) {
				var i, temp, el, pCount, len, errorMsg;
				if (status !== 200 || json.error) {
					errorMsg = !json.error ? status +' '+ sText : json.error.message +' '+ json.error.code;
					HM.Settings['UpdateStatBox'].innerHTML = this['ErrorMsg'].replace('r{Text}', errorMsg);
					setTimeout(function() {
						_z.setup(HM.Settings['UpdateStatBox'], {
							'html': ''
						}, null).appendChild(HM.Settings['LoadButton'])
						updateTimer();
					}, 5000);
				} else {
					pCount = json.result.posts_count;
					el = json.result.posts;
					len = el ? el.length : 0;
					if (len > 0) {
						updInt = 45;
						unread_count += len;
						if (window.HTMLAudioElement && HM.SoundNotify)
							new Audio("/src/mp3/1406/musbox.mp3").play();
						_z.each(el, function(xhtml) {
							var temp = _z.setup('div', {'html': xhtml}, null);
							hooLinksElement(GetElements(temp).links);
							_z.setup(temp.querySelector('.reply'), {'class': 'reply new'}, {'click': markAsRead });
							temp.querySelector('.delete_checkbox').addEventListener('click', function(e) {
								this.parentNode.classList.toggle('checked');
							}, false);
							Target.thread().appendChild(temp.firstElementChild);
						});
						Tinycon.setBubble(unread_count);
						HM.Settings['PostCountStat'].textContent = pCount + LC.omit[lng];
					} else if (e === true)
						updInt += 15;
				}
				if (e && !errorMsg)
					updateTimer();
				genReplyMap(GetElements().posts);
				HM.Settings['LoadButton'].textContent = LC.loadnew[lng];
				thread_updating = false;
			}
		);
	}
	function markAsRead(e) {
		unread_count--;
		this.removeEventListener('click', markAsRead, false);
		this.classList.remove('new');
		Tinycon.setBubble(unread_count);
	}
	function updateTimer() {
		clearTimeout(timer_id);
		timer_id = setTimeout(function() {
			updateThread(true)
		}, HM.UpdateInterval());
	}
	
	/*** Wakabamark Buttons Engine ***/
	function wmarkText(TextArea, openTag, closeTag) {
		var val = TextArea.value, ins, ql, sp, c, s, e,
			end = TextArea.selectionEnd,
			start = TextArea.selectionStart,
			selected = val.substring(start, end),
			ws = window.getSelection().toString(),
			getext = start === end ? ws : selected,
			cont = (typex()).exec(selected);
			switch (closeTag.slice(0, 1)) {
				case '+' : ins = true; break;
				case '\n': ql  = true; break;
				case '%' : sp  = true; break;
				case '`' : c   = true; break;
				case '~' : s   = true;
			}
			function typex(gmi) {
				return new RegExp('^(\\s*)(.*?)(\\s*)$', (gmi || ''))
			}
		if (ins) {
			return _z.setup(TextArea, {'value': val.substr(0, end) + openTag + val.substr(end)}, null)
					.setSelectionRange(start + openTag.length, start + openTag.length);
		}
		if (ql) {
			if (ws && ws != getext){
				start = end = TextArea.value.length;
				getext = ws; openTag = closeTag;
			}
			markedText = openTag + getext.replace(/\n/gm, closeTag);
		} else {
			e = c ? '`' : '';
			if (s && (selected.slice(0, 1) === '~' || val.substring(end, end + 1) === '~'))
				openTag = openTag.slice(0, 1), closeTag = closeTag.slice(0, 1);
			markedText = cont === null ? (sp || c ? openTag + e + '\n' + getext + '\n' + e + closeTag :
				selected.replace(typex('gm'), '$1'+ openTag +'$2'+ closeTag +'$3')) :
				cont[1] + openTag + cont[2] + closeTag + cont[3];
		}
		eOfs = markedText.length, sOfs = 0;
		if (cont != null && !cont[2] && !ql) {
			sOfs = openTag.length;
			eOfs = sOfs + selected.length;
		}
		_z.setup(TextArea, {'class': 'ta-inact', 'value': val.substring(0, start) + markedText + val.substring(end)}, null).focus();
		_z.setlSVal('SafeText', JSON.stringify(TextArea.value), true);
		TextArea.setSelectionRange(start + sOfs, start + eOfs);
	}
	
	/*** Strike Converter ***/
	//* @ by 		DesuDesuTalk
	function StrikeConvert(TextArea) {
		var sregex = /(?:\~\~\~(.*?[^\s])\~\~\~)|(?:\~\~(.*?[^\s])\~\~)/g;
		TextArea.value = TextArea.value.replace(sregex,
		function(match, str, str2, len, prefix) {
			var sMarked, sT, lm;
			if (str) {
				sMarked = str.replace(/[^\s]+/g, function(word){ 
					return word + word.replace(/./g, '^H');
				});
			}
			if (str2) {
				var word = str2.trim().split(/\s+/g).length;
				if (word === 1)
					sT = '^H', lm = str2.length;
				else if (word > 1)
					sT = '^W', lm = word;
				sMarked = str2 + sT.repeat(lm);
			}
			return sMarked;
		})
	}
	
	/*** Enchanted Hanabira ***/
	//* @ original code 	http://dobrochan.com/js/hanabira-0.5.1311-.js
	//* @ copyright 		Dobrochan
	function BindDragRef(e) {
		if (HM.RefTab) {
			HM.RefTab.style.top = 9 + e.pageY - HM.RefTab.offsetHeight +'px';
			HM.RefTab.style.left = 9 + e.pageX - HM.RefTab.offsetWidth +'px';
		}
	}
	function RemoveAllRefs(e) {
		var popups = document.getElementsByClassName('popup'),
			i = popups.length - 1;
		if (popups[0]) {
			switch (e.type) {
				case 'keydown':
					if (i == 0)
						HM.zIndex = 0;
					popups[i].remove();
					break;
				case 'click':
					HM.zIndex = 0;
					_z.remove(popups);
					break;
			}
		}
	}
	function BindCloseRef(reftab) {
		var tr = _z.setup('tbody', {'style': 'line-height:15px;', 'html': '<tr><td>'}, null),
			drag = _z.setup('span', {'class': 'dpop txt-btn', 'text': '\n.:'}, {
				'mousedown': function(e) {
					reftab.style['z-index'] = HM.zIndex + 1
					HM.RefTab = reftab; 
					return _z.fall(e) }}),
			close = _z.setup('span', {'class': 'cpop txt-btn', 'title': LC.clos[lng], 'text': '\n✕'}, {
				'click': function(e) { reftab.remove() }}),
			closeAll = _z.setup('span', {'class': 'callpop txt-btn', 'title': LC.clos[lng] + LC.all[lng], 'text': '\n☒'}, {
				'click': RemoveAllRefs });
			_z.setup(reftab, {}, {
				'click': function(e) {
					HM.zIndex++
					reftab.style['z-index'] = HM.zIndex }}).appendChild(tr).click();
		_z.append(tr.firstChild.firstChild, [close, closeAll, drag]);
	}
	function BindRemoveRef(a, reftab) {
		var to, timer = function(e) {
			to = setTimeout(function() {
				reftab.remove()
			}, 300) }
		reftab.onmouseleave = a.onmouseleave = timer;
		reftab.onmouseenter = a.onmouseenter = function(e) {
			clearTimeout(to);
			to = 0;
		}
	}
	
	function MagicPostView(e) {
		var a = e.target, attach = HM.AttachPopups, L = ParseUrl(a.href),
			brd = L.board, tid = L.thread, pid = L.pid, op = tid === pid,
			postid = (op ? 'post_' : 'reply') + pid, id = brd +'-'+ postid,
			refl = _z.route(a, '.reflink a'), href = refl.getAttribute('href'),
			reftab = _z.setup('table', {'class': (op ? 'oppost popup' : 'popup'), 'id': 'ref-'+ id,
				'html': '<tbody><tr><td class="loading"><span class="waiting'+ Math.floor(Math.random() * 3) +
				' icon"><img src="/images/blank.png"></span>\n'+ LC.wsec[lng] +'</td></tr></tbody>'}, null),
			loading = reftab.querySelector('.loading'), active = document.getElementById('ref-'+ id),
			post = HM.LoadedPosts[id] || document.getElementById(postid);
		function add_mapping(mapp) {
			if (!mapp)
				return;
			mapp.classList.add('mapped');
			if (attach) {
				mapp.classList.add('locked');
				mapp.removeEventListener('mouseover', MagicPostView, false);
			} else {
				a.onmouseout = function(e) {
					mapp.classList.remove('mapped');
				}
			}
		}
		function set_style(r) {
			var w = window.innerWidth, mw,
			x = e.pageX, y = e.pageY + 30,
			wx = w - x, y2 = y - r.offsetHeight - 45;
			if (a.classList[1] !== 'cview') {
				if (y2 > 0)
					y = y2;
				if ((wx < 600 || wx < w / 2) && r.offsetWidth > wx) {
					mw = w - 400;
					x = null;
				}
			}
			r.setAttribute('style', 'top:'+ y +'px;max-width:'+
				(mw || wx) +'px;'+ (x == null ? 'right:0' : 'left:'+ x) +'px'+
				(attach ? ';z-index:'+ HM.zIndex : ''));
		}
		function binded(el) {
			var load = !el ? _z.setup('td', {'class': 'stub', 'text': LC.postdel[lng]}, null) :
				_z.setup(el.cloneNode(true), {'id': 'load-' + id, 'class': undefined}, null);
			attachEvents(load);
			if (el && attach) {
				BindCloseRef(reftab);
			} else {
				BindRemoveRef(a, reftab);
			}
			_z.replace(loading, load);
			add_mapping(reftab.querySelector('a[href="'+ href +'"]'));
		}
		if (active) {
			var loc = active.querySelector('.locked');
			if (loc && loc.hash !== refl.hash) {
				loc.className = 'reply-link cview';
				attachEvents(active);
			}
			add_mapping(active.querySelector('a[href="'+ href +'"]'));
			set_style(active);
			return active.click();
		} else if (post) {
			binded(post == 'stub' ? null : post);
		} else if (HM.URL.thread == tid) {
			binded(null);
		} else {
			getDataResponse('/api/post/'+ brd +'/'+ tid +'/'+ pid +'.xhtml',
			function(status, sText, xhtml, xhr) {
				var node;
				if (status !== 200) {
					loading.innerHTML = Btn['ErrorMsg'].replace('r{Text}', status +' '+ sText);
					setTimeout(function() {
						reftab.remove();
					}, 7000)
					return;
				} else if (xhtml == "Specified element does not exist.") {
					node = 'stub';
				} else {
					node = _z.setup('td', {'id': 'load-'+ id, 'html': xhtml}, null);
					hooLinksElement(GetElements(node).links);
					genReplyMap([node]);
				}
				HM.LoadedPosts[id] = node;
				binded(node == 'stub' ? null : node);
				set_style(reftab);
			});
		}
		document.body.appendChild(reftab);
		set_style(reftab);
	}
	
	function genReplyMap(posts) {
		_z.each(posts, function(post) {
			var cid = _cid(post.id), replies_links = new Array(0);
			if (HM.RepliesMap[cid]) {
				_z.each(HM.RepliesMap[cid], function(Id) {
					replies_links.push(Btn['reflink'].allReplace({'r{N}': 'class="reply-link cview"', 'r{brd}': Id[0], 'r{tid}':
					(!Id[1] ? Id[2] : Id[1]), 'r{pid}': Id[2], 'r{L}': (Id[3] ? Id[0] +'/' : '')}));
				});
				var replies_div_arr = post.getElementsByClassName('replylinks'),
					replies_div = _z.setup('div', {'class': 'replylinks'}, null);
				if (replies_div_arr.length == 0)
					post.getElementsByClassName('abbrev')[0].appendChild(replies_div);
				else
					replies_div = replies_div_arr[0];
				replies_div.innerHTML = LC.repl[lng] + LC.few['u-c'][lng] +': '+ replies_links.join(', ');
				attachEvents(replies_div);
			}
		})
	}
	function hRate(el, img) {
		if (el.classList[2]) {
			el.classList.remove('rate')
			img.src = img.parentNode.href
		} else {
			el.classList.add('rate')
			img.src = '/images/'+ img.alt +'.png'
		}
	}
	function MagicSpoirate(e) {
		if (this.classList[3]) {
			var finf = _z.route(this, '.fileinfo'), iMg = this,
				href = this.parentNode.href,
				fid = this.parentNode.parentNode.id.split('_'),
				btnRate = _z.setup('a', {'class': 'sp-r txt-btn', 'text': this.alt}, {
					'click': function(e) { hRate(this, iMg) }
				}),
				buttons = Btn['default'].allReplace({'r{Fn}': "edit_", 'r{title}': LC.edit[lng], 'r{alt}': '✎', 
				'r{Act}': 'href="/utils/image/edit/'+ fid[2] +'/'+ fid[1] +'"'}) +'\n'+
			Btn['Google'] +'\n'+ Btn['Iqdb'] +'\n'+ Btn['Derpibooru'] +'\n'+ Btn['Saucenao'];
			finf.replaceChild(btnRate, finf.lastChild);
			finf.insertAdjacentHTML('beforeend', buttons.replace(/@img_src/g, href));
			this.classList.remove('rated');
			this.src = href;
		} else if (this.alt.fext() == 'svg') {
			this.alt = this.src;
			this.src = this.parentNode.href;
		}
		this.classList.toggle('unexpanded')
		this.classList.toggle('expanded')
		return _z.fall(e);
	}
	
	function hooLinksElement(links) {
		_z.each(links, function(link) {
			var href = link.href;
			if (href && href.isThere("/res/") && href.isThere("dobrochan")) {
				var targ = ParseUrl(href), refl = _z.route(link, '.reflink a'),
					from = ParseUrl(refl.href);
				if (targ != null && targ.thread) {
					var reply_id = !targ.pid ? targ.thread : targ.pid,
						diffb = (targ.board !== from.board) || (from.board !== HM.URL.board),
						dataArr = [from.board, from.thread, from.pid, (diffb ? targ.board : '')];
					if (!link.textContent.isThere(">>"))
						_z.setup(link, {'href': href.replace(/https?:\/\/dobrochan\.\w+/, ''), 'onclick': 'Highlight(event, "'+ reply_id +'")',
						'text': '>>'+ (diffb ? targ.board +'/' : '') + reply_id}, null);
					_z.setup(link, {'class': 'reply-link', 'onmouseover': undefined}, {
						'mouseover': MagicPostView
					});
					if (!HM.RepliesMap[reply_id])
						HM.RepliesMap[reply_id] = new Array(0);
					if (!JSON.stringify(HM.RepliesMap[reply_id]).isThere(JSON.stringify(dataArr)))
						HM.RepliesMap[reply_id].push(dataArr);
				}
			}
			switch (link.classList[0]) {
				case 'search_iqdb':
					var img_src = link.href.split('=').pop(),
						buttons = '\n'+ Btn['Derpibooru'] +'\n'+ Btn['Saucenao'];
					link.insertAdjacentHTML('afterend', buttons.replace(/@img_src/g, img_src));
					break;
				case 'reflink':
					var url = ParseUrl(link.firstElementChild.href),
						targ = _z.setup('a', {'class': 'reply-button txt-btn', 'title': LC.repl[lng], 'text': '➤➤'}, {
							'click': function(e) {
								HM.Form.getForm(e, url.board, url.thread, url.pid)
							}
						});
					_z.after(link, targ)
					break;
				case 'thumb':
					var a = link.parentNode;
					if (!a.href) {
						var finf = _z.route(link, '.fileinfo'),
							na = _z.setup('a', {'href': finf.querySelector('a').href, 'target': "_blank"}, null);
						if (Files.image.isThere(na.href.fext())) {
							link.parentNode.appendChild(na); na.appendChild(link);
							_z.setup(link, {'class': 'spr-image thumb expanded rated'}, {'click': MagicSpoirate});
						}
					} else if (a.href.fext() == 'svg')
						_z.setup(link, {'class': 'spr-image thumb unexpanded', 'onclick': undefined}, {'click': MagicSpoirate});
			}
		});
	}
	
	function attachEvents(node) {
		_z.each(GetElements(node).hoos, function(a) {
			switch (a.classList[0]) {
				case 'reply-link':
					if (a.classList[2] !== 'locked')
						a.addEventListener('mouseover', MagicPostView, false)
					break;
				case 'sp-r':
					a.addEventListener('click', function(e) {
						hRate(this, this.parentNode.parentNode.querySelector('img.spr-image'))
					}, false)
					break;
				case 'spr-image':
					a.addEventListener('click', MagicSpoirate, false)
					break;
				case 'reply-button':
					var url = ParseUrl(_z.route(a, '.reflink a').href)
					a.addEventListener('click', function(e){
						HM.Form.getForm(e, url.board, url.thread, url.pid)
					}, false)
			}
		});
	}
	
	/*** Form Serialization ***/
	//* @ original code 	https://gist.github.com/bullgare/5336154
	//* @ copyright 		bullgare
	function serializeArray(form) {
		var i, j, arr = new Array();
		if (!form || form.nodeName !== "FORM") {
			return;
		}
		for (i = form.elements.length - 1; i >= 0; i = i - 1) {
			if (form.elements[i].name === "") {
				continue;
			}
			switch (form.elements[i].nodeName) {
				case 'INPUT':
					switch (form.elements[i].type) {
						case 'text':
						case 'hidden':
						case 'password':
						case 'button':
						case 'reset':
						case 'submit':
							arr.push({
								name: form.elements[i].name,
								value: form.elements[i].value });
							break;
						case 'checkbox':
						case 'radio':
							if (form.elements[i].checked) {
								arr.push({
									name: form.elements[i].name,
									value: form.elements[i].value });
							}
							break;
						case 'file':
							break;
					}
					break;
				case 'TEXTAREA':
					arr.push({
						name: form.elements[i].name,
						value: form.elements[i].value });
					break;
				case 'SELECT':
					switch (form.elements[i].type) {
						case 'select-one':
							arr.push({
								name: form.elements[i].name,
								value: form.elements[i].value });
							break;
						case 'select-multiple':
							for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
								if (form.elements[i].options[j].selected) {
									arr.push({
										name: form.elements[i].name,
										value: form.elements[i].options[j].value });
								}
							}
							break;
					}
					break;
				case 'BUTTON':
					switch (form.elements[i].type) {
						case 'reset':
						case 'submit':
						case 'button':
							arr.push({
								name: form.elements[i].name,
								value: form.elements[i].value });
							break;
					}
					break;
			}
		}
		return arr;
	}
	
	/*** Yuki ReplyForm ***/
	//* @ original code 	https://github.com/tranquility-yuki/yukiscript
	//* @ copyright 		2013+, You
	function Yuki(h) {
		var Yu = this, fileList = [],
		LCY = {
			acap: ["Attach Captcha Image", 'Прикрепить капчу'],
			subj: ["Subject", "Тема"],
			newt: ["New Thread in", "Новый тред в"],
			post: ["Post", "Отправить"],
			txar: ["Message Text", "Текст сообщения"],
			inps: ['In Progress...', 'Работаем...'],
			ufrm: ['Unhide form', 'Раскрыть форму'],
			rmv: ["Remove", "Убирать"],
			fnm: ["File Name", "имя файла"],
			wmark: {
				'~': ['Wakabamark Strike Conversion', 'Перевод символов страйка в нотацию wakabamark'],
				'ul': ['Unordered List', 'Неупорядоченный список'],
				's': ['Strike', 'Зачеркнутый'],
				'i': ['Italic', 'Курсивный'],
				'b': ['Bold', 'Жирный'],
				'c': ['Code', 'Код'],
				'sp': ['Spoiler', 'Спойлер'],
				'q': ['Quote Selected', 'Цитировать выделенное']
			},
			cerr: {
				'en': ['captcha', 'human.'],
				'ru': ['капча', 'человек.']
			}
		},
		style = '#yuki-captcha,#yuki-pass{width:295px;}#yuki-captcha-image{vertical-align:middle;margin:2px;}#yuki-dropBox{width:7em;height:18em;border:3px dashed rgba(99,99,99,.3);padding:2px;}\
#convert-strike,.topformtr #yuki-replyForm #yuki-close-form{visibility:hidden;}.sagearrow{background:url(/src/svg/1409/Sage.svg)no-repeat center bottom;}.wmark-button .spoiler{text-shadow:none;}\
#yuki-errorMsg{text-align:center;color:#FFF;background-color:#E04000;}.wmark-button{color:#fefefe;text-shadow:0 1px 0 rgba(0,0,0,.4);}.inactive{opacity:.4;}\
.rating_SFW{background:green;}.rating_R15{background:yellow;}.rating_R18{background:orange;}.rating_R18G{background:red;}.line-sect,.yukiFile{display:inline-block;}\
.yukiFile,.yukiFileSets{font-size:66%;}.yukiFile{text-align:center;width:210px;background:#fefefe;-webkit-border-radius:5px;margin:5px;padding:2px;}\
#yuki-files-placeholder > *{vertical-align:top;}.yukiFile img{max-width:150px;margin:5px 0;}.yukiFile span{max-width:200px;word-wrap:break-word;}\
#yuki-replyForm{text-align:left;padding:4px 8px;}.selected:before{content:"✓ ";color:green;}.reply #yuki-newThread-create{display:none!important;}\
#yuki-dropBox tr{display:block;text-align:center!important;}.droparrow{background:url(/src/svg/1409/DropArrow.svg)no-repeat center;display:block;padding:9em 3em;}';
		filepreview_tamplate = '[\n<a class="yuki_clickable">убрать</a>\n]<br><img class="preview_img" src="r{img}"><br><span class="file_name">r{fname}</span><br>'+
			'<span class="file_name">r{size}&nbsp;</span><select name="file_1_rating" class="rating_SFW" onchange="$(this).attr(\'class\', $(this).find(\'option:checked\')[0].className)">'+
			'<option class="rating_SFW">SFW</option><option class="rating_R15">R-15</option><option class="rating_R18">R-18</option><option class="rating_R18G">R-18G</option></select>',
		replyform_tamplate = '<input id="yuki-targetThread" name="thread_id" value="'+ (HM.URL.thread || 0) +'" type="hidden"><input name="task" value="post" type="hidden">'+
			'<div id="yuki-errorMsg"></div>'+
			'<table><tbody id="yuki-dropBox" class="line-sect"><tr class="post-count"></tr><tr class="droparrow inactive"></tr></tbody><tbody class="line-sect">'+
			'<tr id="trname"><td><input placeholder="'+ HM.defaultName() +'" name="name" size="30" value="" type="text">'+
				'<label class="sagearrow'+ (HM.Sage ? '' : ' inactive') +'"><input id="yuki-sage" name="sage" type="checkbox" hidden><img src="/src/png/1411/blank20.png"></label>'+
				'<label id="yuki-newThread-create" class="yuki_clickable inactive">'+ LCY.newt[lng] +'<span class="t-sec">\n/'+ HM.URL.board +
				'/</span></label><span>&nbsp;<a id="yuki-close-form" title="'+ LC.remv[lng] +'"><img src="/images/delete.png" alt="✖︎"></a></span></td></tr>'+
			'<tr id="trsubject"><td><input placeholder="'+ LCY.subj[lng] +'" name="subject" size="30" maxlength="64" value="" type="text">'+
				'<label class="submit-button"><input type="submit" value="'+ LCY.post[lng] +'"></label>\n'+
				'<span class="wmark-buttons-panel">'+
					'<a class="wmark-button" id="convert-strike" title="'+ LCY.wmark['~'][lng] +'"><strong>{~}</strong>&nbsp;</a>'+
					'<a class="wmark-button" id="list-mark" title="'+ LCY.wmark['ul'][lng] +'"><span>◉</span></a>&nbsp;'+
					'<a class="wmark-button" id="strike-mark" title="'+ LCY.wmark['s'][lng] +'"><img src="/src/svg/1405/~S-mark.svg" alt="~$"></a>&nbsp;'+
					'<a class="wmark-button" id="ital-mark" title="'+ LCY.wmark['i'][lng] +'"><img src="/src/svg/1405/i-mark.svg" alt="i"></a>&nbsp;'+
					'<a class="wmark-button" id="bold-mark" title="'+ LCY.wmark['b'][lng] +'"><img src="/src/svg/1405/-b-mark.svg" alt="b"></a>&nbsp;'+
					'<a class="wmark-button" id="code-mark" title="'+ LCY.wmark['c'][lng] +'"><img src="/src/svg/1405/[c]-mark.svg" alt="[c]"></a>&nbsp;'+
					'<a class="wmark-button" id="spoiler-mark" title="'+ LCY.wmark['sp'][lng] +'"><span class="spoiler">&middot;<strong>%%</strong>&middot;</span></a>&nbsp;'+
					'<a class="wmark-button" id="quote-mark" title="'+ LCY.wmark['q'][lng] +'"><img src="/src/svg/1405/„q”-mark.svg" alt="&gt;"></a>'+
				'</span></td></tr>'+
			'<tr id="trmessage"><td>'+
				'<textarea placeholder="'+ LCY.txar[lng] +'" id="yuki-replyText" name="message" cols="80" rows="8" style="resize:both;height:180px;">'+
			'</textarea></td></tr><tr id="trcaptcha"><td><span>'+
					'<img alt="Капча" id="yuki-captcha-image" src="">&nbsp;'+
					'<span id="yuki-attach-captcha-button" class="txt-btn yuki_clickable" title="'+ LCY.acap[lng] +'">[+]</span></span><br>'+
					'<input id="yuki-captcha" autocomplete="off" name="captcha" type="text" hidden></td></tr>'+
			'<tr id="trrempass"><td><input id="yuki-pass" name="password" size="35" value="'+ pass +'" type="password" hidden></td></tr>'+
			'<tr id="trfile"><td id="files_parent"><div id="file_1_div"><label><input id="dumb_file_field" type="file" hidden multiple><input type="button" value="'+
			LC.add[lng] +' '+ LC.file[lng] + LC.few['u-c'][lng] +'" id="yuki-add-files"></label>\n<span class="yukiFileSets"><label><input id="yuki-removeExif" type="checkbox">\n'+
			LCY.rmv[lng] +' Exif</label>\n<label><input id="yuki-removeFilename" type="checkbox">\n'+ LCY.rmv[lng] +' '+ LCY.fnm[lng] +
		'</label></span></div></td></tr></tbody></table><div id="yuki-files-placeholder"></div><style>'+style+'</style>';
		this.$ = function(child) { return this['ReplyForm'].querySelector(child) }
		this.submitForm = yukiPleasePost;
		this.getForm = function(e, brd, tid, pid) {
			if (e.target.classList[0] == 'reply-button')
				makeReplyForm(e, brd, tid, pid)
			else
				makeGlobalForm(e)
		}
		this['ReplyForm'] = _z.setup('form', {
				'id': "yuki-replyForm",
				'class': 'line-sect',
				'method': "post",
				'enctype': "multipart/form-data",
				'html': replyform_tamplate
			}, {
				'submit': yukiPleasePost
			});
		this['TargetThread'] = this.$('#yuki-targetThread');
		this['ErrorMassage'] = this.$('#yuki-errorMsg');
		this['NewThreadCreate'] = _z.setup(this.$('#yuki-newThread-create'), {}, {
			'click': function(e) {
				var sel = this.classList[1] === 'selected';
				if (HM.URL.thread) {
					Yu['TargetThread'].value = sel ? HM.URL.thread : 0;
					this.classList.toggle('selected')
					this.classList.toggle('inactive')
				}
			}
		});
		this['CloseForm'] = _z.setup(this.$('#yuki-close-form'), {}, {
				'click': function(e) { Yu['ReplyForm'].remove() }
			});
		this['ReplyText'] = _z.setup(this.$('#yuki-replyText'), {
				'value': JSON.parse(_z.getlSVal('SafeText', JSON.stringify(this.$('#yuki-replyText').value), true))
			}, {
				'click': function(e) {
					this.classList.remove('ta-inact');
				},
				'keyup': function(e) {
					var height = _cid(this.style['height']);
					if (height + 26 < this.scrollHeight)
						this.style['height'] = this.scrollHeight +'px';
					_z.setlSVal('SafeText', JSON.stringify(this.value), true);
				}
			});
		this['FilesPlaceholder'] = this.$('#yuki-files-placeholder');
		this['Captcha'] = _z.setup(this.$('#yuki-captcha'), {}, {
				'focus': function(e) {
					Yu['CaptchaImage'].click()
				},
				'keypress': function(e) {
					CaptchaProcess(e, LC.lng[lng])
				}
			});
		this['CaptchaImage'] = _z.setup(this.$('#yuki-captcha-image'), {}, {
				'click': function(e) {
					this.src = '/captcha/'+ Target.board +'/'+ _t() +'.png'
				}
			});
		this['DumbFileField'] = _z.setup(this.$('#dumb_file_field'), {}, {
				'change': yukiAddFile
			});
			_z.setup(this.$('#yuki-removeExif'), {'checked': HM.RemoveExif}, {
				'change': function(e) {
					setupOptions(this, 'RemoveExif');
				}
			});
			_z.setup(this.$('#yuki-removeFilename'), {'checked': HM.RemoveFileName}, {
				'change': function(e) {
					setupOptions(this, 'RemoveFileName');
				}
			});
			_z.setup(this.$('#yuki-add-files'), {}, {
				'click': function(e) {
					this.previousElementSibling.click();
				}
			});
		this['Submit'] = _z.setup(this.$('input[type="submit"]'), {}, {
				'click': function(e) {
					StrikeConvert(Yu['ReplyText']) }
			});
		this['DropBox'] = _z.setup(this.$("#yuki-dropBox"), {}, {
				'dragover': _z.fall,
				'dragenter': function(e) {
					var items = e.dataTransfer.mozItemCount || '';
					if (this.classList[0] != 'thumb') {
						this.firstChild.textContent = LC.add[lng] +' '+ items +' '+ LC.file[lng] +
							(items == 1 ? '' : !items ? LC.few['u-c'][lng] : items < 5 ? LC.few['u-a'][lng] : LC.few['u-b'][lng]);
						this.classList.add('thumb');
					}
				},
				'dragout': function(e) {
					this.firstChild.textContent = '';
					this.classList.remove('thumb');
				},
				'drop': function(e) {
					yukiAddFile(e);
					this.firstChild.textContent = '';
					this.classList.remove('thumb');
					return _z.fall(e);
				}
			});
		this['Sage'] = _z.setup(this.$('#yuki-sage'), {
				'checked': HM.Sage
			}, {
				'change': function(e) {
					setupOptions(this, 'Sage', true);
					this.parentNode.classList.toggle('inactive');
				}
			});
		this['AttachCaptchaButton'] = _z.setup(this.$('#yuki-attach-captcha-button'), {}, {
				'click': yukiAttachCapcha
			});
		this['OpenBottomForm'] = _z.setup('div', {'id': 'open-bottom-form', 'class': 'hideinfo', 'html': '[\n<a>'+ LCY.ufrm[lng] +'</a>\n]'}, null);
		this['OpenBottomForm'].firstElementChild.addEventListener('click', makeGlobalForm, false);
		_z.each(this['ReplyForm'].querySelectorAll('.wmark-button'), function(btn) {
			var Fn = wmarkText, O, C;
			switch (btn.id) {
				case 'convert-strike': Fn = StrikeConvert
					break;
				case 'list-mark'   : O = '* ', C = '\n* '
					break;
				case 'strike-mark' : O = C = '~~'
					break;         
				case 'ital-mark'   : O = C = '_'
					break;
				case 'bold-mark'   : O = C = '**'
					break;
				case 'code-mark'   : O = C = '`'
					break;
				case 'spoiler-mark': O = C = '%%'
					break;
				case 'quote-mark'  : O = '> ', C = '\n> '
			}
			btn.addEventListener('click', function(e) {
				Fn(Yu['ReplyText'], O, C)
			}, false);
		});
		function yukiAttachCapcha(e) {
			var el = e.target, exist;
			if (checkfilesLimit())
				return;
			var img = el.previousElementSibling;
			if (img.nodeName.toLowerCase() === 'img') {
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				var dataURL = canvas.toDataURL("image/png");
				_z.each(fileList, function(obj) {
					if (obj.dataURL === dataURL)
						exist = true;
				});
				if (exist)
					return;
				f = {
					"name": 'talking_captcha.png',
					"size": dataURL.length * 6 / 8,
					"type": 'image/png'
				};
				fileList.push({
					file: f,
					renamed: false,
					f_name: 'talking_captcha.png',
					jpegStripped: true,
					el: _z.setup('div', {'class': "yukiFile", 'html': filepreview_tamplate.allReplace({
						'r{img}': dataURL, 'r{fname}': f.name, 'r{size}': bytesMagnitude(f.size)
					})}, null),
					dataURL: dataURL
				});
				attachthisFile();
			}
		}
		function checkfilesLimit() {
			var limit, mu = (Target.board === 'mu');
			if (fileList.length >= (mu ? 10 : 5)) {
				alert((mu ? 'Дес' : 'П') +'ять файлов это максимум на этой доске.');
				limit = true;
			}
			return limit;
		}
		function attachthisFile() {
			fileList[fileList.length - 1].el.querySelector('.yuki_clickable').onclick = (function(data) {
				return function(e) {
					var idx = fileList.indexOf(data);
					data.el.remove();
					delete fileList[idx];
					fileList.splice(idx, 1)
				}
			}(fileList[fileList.length - 1]))
			Yu['FilesPlaceholder'].appendChild(fileList[fileList.length - 1].el);
		}
		function yukiAddFile(e) { // FileList object
			var data = (e.dataTransfer || e.target),
				files = data.files;
			if (checkfilesLimit())
				return;
			// Loop through the FileList and render image files as thumbnails.
			for (var i = 0, f; f = files[i++];) {
				var exist, reader, renamed = false,
					f_name = f.name, f_ext = f_name.fext()
				_z.each(fileList, function(obj) {
					if (obj.file.size === f.size)
						exist = true;
				});
				if (exist || checkfilesLimit())
					return;
				if (HM.RemoveFileName) {
					f_name = (makeRandId(32) + (f.name.match(/\.[^\.]+$/) || [''])[0]).toLowerCase();
					renamed = true;
				}
				fileList.push({
					file: f,
					f_name: f_name,
					renamed: renamed,
					el: _z.setup('div', {'class': "yukiFile", 'html': filepreview_tamplate.allReplace({
						'r{img}': Files.arch.isThere(f_ext) ? '/thumb/generic/archive.png' :
								  Files.audio.isThere(f_ext) ? '/thumb/generic/sound.png' :
								  Files.video.isThere(f_ext) ? '/src/png/1501/video.png' : '/thumb/generic/text.png',
						'r{fname}': f_name, 'r{size}': bytesMagnitude(f.size)})
					}, null)
				});
				attachthisFile();
		
				// Closure to capture the file information.
				reader = new FileReader();
				reader.onload = (function(theFile) {
					return function(e) {
						// Render thumbnail.
						if (HM.RemoveExif && theFile.file.type.toLowerCase() === 'image/jpeg') {
							theFile.dataURL = jpegStripExtra(e.target.result);
							theFile['jpegStripped'] = true;
						} else {
							theFile.dataURL = e.target.result;
							theFile['jpegStripped'] = false;
						}
						if (theFile.file.type.match('image.*')) {
							theFile.el.querySelector('.preview_img').setAttribute('src', theFile.dataURL);
						}
					};
				})(fileList[fileList.length - 1]);
				// Read in the image file as a data URL.
				reader.readAsDataURL(f);
			}
		}
		function submitProcess(st) {
			_z.setup(Yu['Submit'], {
				'disabled': (st ? "disabled" : undefined),
				'value': (st ? LCY.inps[lng] : LCY.post[lng])
			}, null);
		}
		function yukiPleasePost(e) {
			var form = e.target, formData = serializeArray(e.target),
				ajaxPost = new XMLHttpRequest(), fd = new FormData(),
				action = form.action +'?X-Progress-ID='+ _t() * 10000;
			for (var i = 0; i < formData.length; i++) {
				fd.append(formData[i].name, formData[i].value);
			};
			switch (form.id) {
				case 'yuki-replyForm': Fn = function() {
						if (this.readyState !== 4)
							return;
						if (this.status === 304) {
							alert('Не получилось отправить пост.\nПопробуйте чуть попозже ещё разок или перезагрузить страницу.\n\n-----------------------------\n'+ this.statusText);
							submitProcess(false);
						} else {
							var rText = this.responseText, len = fileList.length,
								errPost = rText.match(/\/error\/post\/\d+/),
								newThread = rText.match(/\/\w*\/res\/\d+\.xhtml/);
							if (errPost) {
								getDataResponse(errPost, function(status, sText, err, xhr) {
									var msg = (/<td colspan='\d+' class='post-error'>(.+)<\/td>/).exec(err);
									Yu['ErrorMassage'].textContent = msg[1];
									if (LCY.cerr[LC.lng[lng]].isThere(msg[1].split(' ').pop()))
										Yu['Captcha'].removeAttribute('hidden');
									return submitProcess(false);
								});
							} else if (newThread && Yu['TargetThread'].value == 0) {
								document.location.href = newThread;
							} else {
								if (Yu['ReplyForm'].classList[1] === 'reply')
									Yu['ReplyForm'].remove();
								Yu['ReplyText'].value = '';
								Yu['ErrorMassage'].textContent = '';
								Yu['FilesPlaceholder'].innerHTML = '';
								Yu['Captcha'].setAttribute('hidden', '');
								submitProcess(false);
								_z.setlSVal('SafeText', JSON.stringify(Yu['ReplyText'].value), true);
								switch (len) {
									case 0: updateThread(null); break;
									default: setTimeout(updateThread, 1000);
								}
								fileList = [];
							}
						}
					}
					for (var i = 0; i < fileList.length; i++) {
						if (HM.RemoveExif && fileList[i].file.type.toLowerCase() == 'image/jpeg' && !fileList[i].jpegStripped) {
							fileList[i].dataURL = jpegStripExtra(fileList[i].dataURL);
						}
						if (HM.RemoveFileName && !fileList[i].renamed) {
							fileList[i].f_name = (makeRandId(32) + (fileList[i].f_name.match(/\.[^\.]+$/) || [''])[0]).toLowerCase();
						}
						fd.append("file_" + (i + 1), dataURLtoBlob(fileList[i].dataURL, fileList[i].file.type), fileList[i].f_name);
						fd.append("file_" + (i + 1) + "_rating", fileList[i].el.querySelector("select[name='file_1_rating']").value);
					};
					fd.append("post_files_count", fileList.length)
					submitProcess(true);
					break;
				case 'delete_form': Fn = function() {
					if (this.readyState !== 4)
						return;
					if (this.status === 304) {
						alert('304 ' + this.statusText);
					} else {
						if (this.responseURL === action) {
							var rText = this.responseText,
								msg = (/<center><h2>(.+)<\/h2><\/center>/).exec(rText);
							alert(msg[1]);
						} else {
							var chek = document.querySelectorAll('.post a.delete.icon.checked > .delete_checkbox');
							if (chek.length === 1) {
								_z.setup(document.getElementById('post_'+ chek[0].name), {'class': "deleted"}, null)
								.querySelector('.doubledash').setAttribute('style', 'display:inline-block;');
							} else {
								document.location.reload();
							}
						}
					}
				}
			}
			ajaxPost.open('POST', action, true);
			ajaxPost.onreadystatechange = Fn;
			ajaxPost.send(fd);
			return _z.fall(e);
		}
		function makeReplyForm(e, brd, tid, pid) {
			if (Target.thread(tid) && HM.URL.thread != tid)
				Target.tid = tid;
			if (Target.board != brd)
				Target.board = brd;
			Yu['TargetThread'].value = tid;
			Yu['CaptchaImage'].src = '/captcha/'+ brd +'/'+ _t() +'.png';
			_z.setup(Yu['ReplyForm'], {'class': 'line-sect' + (!e ? '' : ' reply'), 'action': '/'+ brd +'/post/new.xhtml'}, null);
			if (document.getElementById('captcha'))
				Yu['Captcha'].removeAttribute('hidden');
			var post = !e ? topForm : _z.route(e.target, function(el) {
					var nodes = el.className.split(' ');
					return nodes.isThere('post') || nodes.isThere('popup');
				}), classes = post.className.split(' ');
				if (classes.isThere('post') || !e) _z.after(post, Yu['ReplyForm']);
			else
				if (classes.isThere('popup')) post.firstChild.firstChild.firstChild.appendChild(Yu['ReplyForm']);
				if (pid && !Yu['ReplyText'].value.isThere('>>'+ pid)) wmarkText(Yu['ReplyText'], '>>'+ pid +'\r\n', '++');
				if (e) makeGlobalForm(null);
		}
		function makeGlobalForm(e) {
			switch (e) {
				case null:
					_z.each([hideinfo, Yu['OpenBottomForm']], _show);
					_hide(showinfo);
					break;
				default:
					switch (e.target.parentNode.id) {
						case 'hideinfotd':
							_z.each([hideinfo, Yu['OpenBottomForm']], _show);
							_hide(postForm);
							break;
						case 'open-bottom-form':
							_z.after(Yu['OpenBottomForm'], postForm)
							_hide(Yu['OpenBottomForm']);
							break;
					}
					switch (e.target.parentNode.id) {
						case 'hideinfodiv':
							pfplaceh.appendChild(postForm);
							_show(Yu['OpenBottomForm']);
							_hide(hideinfo);
						case 'open-bottom-form':
							_z.each([showinfo, postForm], _show);
							makeReplyForm(null, HM.URL.board, (HM.URL.thread || 0));
							Yu['NewThreadCreate'].className = (HM.URL.thread ? 'yuki_clickable ' : '') +
								(Yu['TargetThread'].value > 0 ? 'inactive' : 'selected');
							break;
					}
					return _z.fall(e);
			}
		}
		function _t(last) { 
			return (new Date).getTime() - (last ? parseInt(last) : 0);
		}
		function makeRandId(size) {
			var text = "", 
				possible = "0123456789abcdef",
				len = possible.length;
			if (!size)
				size = len;
			for (var i = 0; i < size; i++)
				text += possible.charAt(Math.floor(Math.random() * len));
			return text;
		}
		function arrayBufferDataUri(raw) {
			var base64 = ''
			var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
			var bytes = new Uint8Array(raw)
			var byteLength = bytes.byteLength
			var byteRemainder = byteLength % 3
			var mainLength = byteLength - byteRemainder
			var a, b, c, d, chunk
			// Main loop deals with bytes in chunks of 3
			for (var i = 0; i < mainLength; i = i + 3) {
				// Combine the three bytes into a single integer
				chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
				// Use bitmasks to extract 6-bit segments from the triplet
				a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
				b = (chunk & 258048) >> 12 // 258048 = (2^6 - 1) << 12
				c = (chunk & 4032) >> 6 // 4032 = (2^6 - 1) << 6
				d = chunk & 63 // 63 = 2^6 - 1
				// Convert the raw binary segments to the appropriate ASCII encoding
				base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
			} // Deal with the remaining bytes and padding
			if (byteRemainder == 1) {
				chunk = bytes[mainLength]
				a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
				// Set the 4 least significant bits to zero
				b = (chunk & 3) << 4 // 3 = 2^2 - 1
				base64 += encodings[a] + encodings[b] + '=='
			} else if (byteRemainder == 2) {
				chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
				a = (chunk & 64512) >> 10 // 16128 = (2^6 - 1) << 8
				b = (chunk & 1008) >> 4 // 1008 = (2^6 - 1) << 4
				// Set the 2 least significant bits to zero
				c = (chunk & 15) << 2 // 15 = 2^4 - 1
				base64 += encodings[a] + encodings[b] + encodings[c] + '='
			}
			return base64
		}
		function jpegStripExtra(input) { // result e.target.result;
			// Decode the dataURL
			var binary = atob(input.split(',')[1]);
			// Create 8-bit unsigned array
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			var orig = new Uint8Array(array);
			var outData = new ArrayBuffer(orig.byteLength)
			var output = new Uint8Array(outData);
			var posO = 2,
				posT = 2;
			output[0] = orig[0];
			output[1] = orig[1];
			while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
				if (orig[posO] === 0xFF && orig[posO + 1] === 0xFE) {
					posO += 2 + orig[posO + 2] * 256 + orig[posO + 3];
				} else if (orig[posO] === 0xFF && (orig[posO + 1] >> 4) === 0xE) {
					posO += 2 + orig[posO + 2] * 256 + orig[posO + 3];
				} else if (orig[posO] === 0xFF && orig[posO + 1] === 0xDA) {
					var l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
					for (var i = 0; i < l; i++) {
						output[posT++] = orig[posO++];
					}
					while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
						output[posT++] = orig[posO++];
					}
				} else {
					var l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
					for (var i = 0; i < l; i++) {
						output[posT++] = orig[posO++];
					}
				}
			}
			output[posT] = orig[posO];
			output[posT + 1] = orig[posO + 1];
			output = new Uint8Array(outData, 0, posT + 2);
			return "data:image/Jpeg;base64," + arrayBufferDataUri(output);
		}
		function bytesMagnitude(bytes) {
			return (bytes < 1024 ? bytes +' B' :
					bytes < 1024 * 1024 ? (bytes / 1024).toFixed(2) +' KB' :
					bytes < 1024 * 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(2) +' MB' :
												(bytes / 1024 / 1024 / 1024).toFixed(2) +' GB');
		}
		function dataURLtoBlob(dataURL, dataType) {
			// Decode the dataURL
			var binary = atob(dataURL.split(',')[1]);
			// Create 8-bit unsigned array
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			} // Return our Blob object
			return new Blob([new Uint8Array(array)], {
				type: dataType
			});
		}
	}
	
	/************************************************************************/
	
	function ButtonTamplate(h) {
		this['ErrorMsg'] = '<strong class="err-msg">r{Text}</strong>'
		this['default'] = def = '<a class="r{Fn} icon" r{Act}><img src="/images/blank.png" title="r{title}" alt="r{alt}"></a>\n'
		this['reflink'] = '<a r{N} href="/r{brd}/res/r{tid}.xhtml#ir{pid}" onclick="Highlight(event, \'r{pid}\')">&gt;&gt;r{L}r{pid}</a>'
		this['Derpibooru'] = def.allReplace({'r{Fn}': "search_derpibooru", 'r{Act}': 'onclick="$(\'#rs-url\').val(\'@img_src\').parent().submit()"', 'r{title}': 'Derpibooru reverse search', 'r{alt}': 'derp'}),
		this['Saucenao'] = def.allReplace({'r{Fn}': "search_saucenao", 'r{title}': LC.fnd_src_wth[lng] +' SauceNAO', 'r{alt}': 'sauce',
			'r{Act}': 'href="//saucenao.com/search.php?url=@img_src" onclick="window.open(this.href,\'_blank\');return false"'}),
		this['Google'] = def.allReplace({'r{Fn}': "search_google", 'r{title}': LC.fnd_src_wth[lng] +' Google', 'r{alt}': 'ggl',
			'r{Act}': 'href="//www.google.com/searchbyimage?image_url=@img_src" onclick="window.open(this.href,\'_blank\');return false"'}),
		this['Iqdb'] = def.allReplace({'r{Fn}': "search_iqdb", 'r{title}': LC.fnd_src_wth[lng] +' iqdb', 'r{alt}': 'iqdb',
			'r{Act}': 'href="//iqdb.org/?url=@img_src" onclick="window.open(this.href,\'_blank\');return false"'}),
		this['ReverseSearch'] = _z.setup('form', {'method': "post", 'action': "https://derpibooru.org/search/reverse", 'target': "_blank", 'enctype': "multipart/form-data",
			'hidden': '', 'html': '<input id="rs-url" name="url" type="text" value=""><input id="fuzziness" name="fuzziness" type="text" value="0.25">'}, null);
	}

	function SimpleSets(h) {
		var Ss = this;
		this.$ = function(child) { return this['SmallSetsPanel'].querySelector(child) }
		this['SpStyle'] = _z.setup('style', {'text': '.spoiler, .spoiler * {color:inherit!important;}'}, null);
		this['PostCountStat'] = _z.setup('label', {'class': 'post-count', 'text': HM.Elems.posts.length + LC.omit[lng]}, null);
		this['SmallSetsPanel'] = _z.setup('span', {'id': 'small-settings-panel', 'html': '<div id="update-stat"><a>'+ LC.loadnew[lng] +
			'</a></div><label id="set-notif"><input type="checkbox">\n'+ LC.snd_notify[lng] +'</label><br><label id="set-clip-popups"><input type="checkbox">\n'+
			LC.clipopup[lng] +'</label><br><label id="set-show-spoilers"><input type="checkbox">\n'+ LC.txtspoils[lng] +'</label>'}, null);
		this['UpdateStatBox'] = this.$('#update-stat');
		this['LoadButton'] = _z.setup(this['UpdateStatBox'].firstElementChild, {}, {
			'click': updateThread
		});
		this['SetNotify'] = this.$('#set-notif');
		_z.setup(Ss['SetNotify'].firstElementChild, {'checked': HM.SoundNotify}, {
			'change': function(e) {
				setupOptions(this, 'SoundNotify', true);
			}
		});
		this['SetClipPopups'] = this.$('#set-clip-popups');
		_z.setup(Ss['SetClipPopups'].firstElementChild, {'checked': HM.AttachPopups}, {
			'change': function(e) {
				setupOptions(this, 'AttachPopups');
			}
		});
		this['SetShowSpoilers'] = this.$('#set-show-spoilers');
		_z.setup(Ss['SetShowSpoilers'].firstElementChild, {'checked': HM.DiscloseTextSpoilers}, {
			'change': function(e) {
				setupOptions(this, 'DiscloseTextSpoilers');
				spDisclosing();
			}
		});
		function spDisclosing() {
			if (HM.DiscloseTextSpoilers)
				document.body.appendChild(Ss['SpStyle']);
			else
				Ss['SpStyle'].remove()
		}
		spDisclosing();
	}
	
	function insertListenerS(event) {
		var target = event.target;
		if (event.animationName == "onReady") {
			lng = Hanabira.LC_ru;
			if (target.className === 'postername') {
				target.textContent = HM.defaultName(target.textContent)
			} else {
				hideinfo = document.getElementById('hideinfodiv');
				showinfo = document.getElementById('hideinfotd');
				postForm = document.getElementById('postFormDiv');
				pfplaceh = document.getElementById('postform_placeholder');
				topForm = document.getElementById('postform');
				delForm = document.getElementById('delete_form'),
				deli = delForm.querySelector('input[name="password"]'),
				pass = deli.value, Btn = new ButtonTamplate(), HM.Elems = GetElements(), HM.Form = new Yuki(), HM.Settings = new SimpleSets();
				
				_z.each([showinfo.firstElementChild, hideinfo.firstElementChild], function(el) {
					_z.setup(el, {'onclick': undefined, 'href': undefined}, {'click': HM.Form.getForm});
				});
				hideinfo.removeAttribute('style');
				_hide(postForm);
				hooLinksElement(HM.Elems.links);
				genReplyMap(HM.Elems.posts);
				if (HM.URL.thread) {
					_z.append(delForm, [
						HM.Form['OpenBottomForm'],
						HM.Settings['SmallSetsPanel'],
						Btn['ReverseSearch']]);
					_z.after(Target.thread(), HM.Settings['PostCountStat']);
					updateTimer();
				} else {
					_z.before(delForm.querySelector('.pages'), [
						HM.Form['OpenBottomForm'],
						HM.Settings['SetClipPopups'],
						document.createElement('br'),
						HM.Settings['SetShowSpoilers'],
						Btn['ReverseSearch']]);
				}
				delForm.addEventListener('submit', HM.Form.submitForm, false);
			}
		}
	}
	
	_z.setup(window, {}, {
		'mousemove': BindDragRef,
		'mouseup': function(e) {
			HM.RefTab = null; },
		'keydown': function(e) {
			if (e.keyCode === 27)
				RemoveAllRefs(e);
			if (e.keyCode === 32 && !['TEXTAREA', 'INPUT'].isThere(e.target.tagName)) {
				_z.each('.reply.new', function(masRp) {
					masRp.classList.remove('new')
					masRp.removeEventListener('click', markAsRead, false)
				});
				Tinycon.setBubble(0);
				unread_count = 0;
			}
		},
		'keypress': function(e) {
			var TextArea = e.target;
			if (TextArea.className === 'ta-inact' && e.keyCode !== 8) {
				var end = TextArea.selectionEnd;
				TextArea.setSelectionRange(end, end);
				TextArea.removeAttribute('class');
			}
		}
	});
	
	// animation listener events
	PrefixedEvent("AnimationStart", insertListenerS);
	//PrefixedEvent("AnimationIteration", insertListenerI);
	//PrefixedEvent("AnimationEnd", insertListenerE);
	// apply prefixed event handlers
	function PrefixedEvent(type, callback) {
		var p, pfx = ["webkit", "moz", "MS", "o", ""];
		for (var p = 0; p < pfx.length; p++) {
			if (!pfx[p])
				type = type.toLowerCase();
			document.addEventListener(pfx[p]+type, callback, false);
		}
	}
})();
