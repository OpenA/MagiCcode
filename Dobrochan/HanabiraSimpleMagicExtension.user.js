// ==UserScript==
// @name    		Simple Magic Extension for Dobrochan Imageboard
// @description 	Включает в себя: Ajax подгрузку постов, Ajax постинг и удаление, Превращение рейтингов в спойлеры, Умные кнопки разметки, а так же опции раскрытия текстовых спойлеров, звуковых уведомлений и перетаскиваемых превью.
// @namespace   	magicode
// @homepage		
// @updateURL   	
// @downloadURL 	
// @include 		*dobrochan.*
// @run-at  		document-start
// @require         https://github.com/tommoor/tinycon/blob/master/tinycon.min.js?raw=true
// @version 		1.4.1 (Dev)
// @grant			none
// ==/UserScript==

/* SpelzZ - a lightweight Node Work Tool */
(function(){
	var _z = {
		each: $each, setup: $setup, route: $route, fall: fallback,
		sessionS: $storeItem('session'), localS: $storeItem('local'),
		append: function(el, nodes) { $nodeUtil('append', el, nodes) },
		prepend: function(el, nodes) { $nodeUtil('prepend', el, nodes) },
		after: function(el, nodes) { $nodeUtil('after', el, nodes) },
		before: function(el, nodes) { $nodeUtil('before', el, nodes) },
		replace: function(el, nodes) { $nodeUtil('replace', el, nodes) },
		remove: function(el, nodes) { $nodeUtil('remove', el, nodes) }
	}
	function $each(arr, Fn) {
		arr = typeof arr === 'string' ? document.querySelectorAll(arr) : arr;
		Array.prototype.slice.call(arr, 0).forEach(function(el, i) {
			Fn(el, (i + 1 === arr.length))
		})
	}
	function $setup(el, attr, events) {
		if (el) {
			el = typeof el === 'string' ? document.createElement(el) : el;
			if (attr) {
				for (var key in attr) {
					attr[key] === undefined ? el.removeAttribute(key) :
					key === 'html'    ? el.innerHTML   = attr[key] :
					key === 'text'    ? el.textContent = attr[key] :
					key in el         ? el[key]        = attr[key] :
					el.setAttribute(key, attr[key]);
				}
			}
			if (events) {
				for (var key in events) {
					if (key === 'remove') {
						for (var evr in events[key]) {
							var rfs = !Array.isArray(events[key][evr]) ? [events[key][evr]] : events[key][evr];
							for (var i = 0; i < rfs.length; i++) {
								el.removeEventListener(evr, rfs[i], false);
							}
						}
					} else {
						el.addEventListener(key, events[key], false);
					}
				}
			}
		}
		return el;
	}
	function $nodeUtil(p, el, nodes) {
		if (el) {
			var i, node, meth = p.toLowerCase(), Child, Parent;
			switch (meth) {
				case 'remove':
					$each(el, function(child) {
						child.parentNode.removeChild(child);
					});
					break;
				default:
					el = typeof el === 'string' ? document.querySelector(el) : el;
					nodes = nodes && !Array.isArray(nodes) ? [nodes] : nodes;
					Parent = el.parentNode;
					switch (meth) {
						case 'append':
							for (i = 0; node = nodes[i++];) {
								el.appendChild(node);
							}
							break;
						case 'replace':
							Parent.replaceChild(nodes[0], el);
							break;
						default:
							switch (meth) {
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
	function $storeItem(locate) {
		var Store = locate === 'session' ? sessionStorage : localStorage,
			probeStore = function(name, val) {
				try {
					Store.setItem(name, val);
				} catch(e) {
					Store.removeItem(name);
					Store.setItem(name, val);
				}
			}
		return {
			rm: function(names) {
					if (typeof names === 'string')
						names = [names];
					for (var name, i = 0; name = names[i++];) {
						Store.removeItem(name); 
					}
				},
			set: function(name, value) {
					if (typeof name === 'object') {
						for (var key in name) {
							probeStore(key, (name[key] === null ? value : name[key]));
						}
					} else {
						probeStore(name, value);
					}
				},
			get: function(name, def) {
					if (name in Store) {
						def = Store.getItem(name);
					} else {
						probeStore(name, def);
					}
					return (def == 'false' ? false : def == 'true' ? true : def);
				}
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

var GlobalStyle = _z.setup('style', {'text': '.hidout,.reply #yuki-newThread-create,.edit #yuki-newThread-create,#open-top-form + #postform_placeholder,#open-top-form + * + #postform_placeholder,form.edit ~ *:not(.abbrev),.dummy-line > .not-for-dummies{display:none!important;}\
.cpop,.callpop{margin-left:8px;}.wmark-button,.sagearrow{vertical-align:middle;}.hideinfo{margin:5px;}.ta-inact::-moz-selection{background:rgba(99,99,99,.3);}.ta-inact::selection{background:rgba(99,99,99,.3);}\
.unexpanded,.rated{max-width:200px!important;max-height:200px!important;}.expanded{width:100%;height:auto;}#hideinfodiv{margin:5px;}.sp-r.rate{color:darkred;}#music_player{right:5px;position:fixed;bottom:5px;}\
.search_google{background-image:url(/src/png/1407/google_14_icon.png)!important;}.search_derpibooru{background-image:url(/src/png/1407/derpibooru_reverse_search_14_icon.png);}.search_saucenao{background-image:url(/src/png/1502/saucenao_favicon1.png);}\
.yuki_clickable,.txt-btn,.wmark-button,.options-menu-sect{cursor:pointer;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}\
.replylinks{line-height:2em;font-size:75%;clear:both;}.hideinfo{text-align:center!important;}.etch-text,.txt-btn{color:#999;}.mapped,.mapped:hover,.sagearrow,.celrly:before{cursor:default;color:#666!important;}.dpop{cursor:move;}\
.footer:after{content:"";-webkit-animation:onReady 1s linear 2;animation:onReady 1s linear 2;}.dpop,.sp-r,.wmark-buttons-panel,#yuki-close-form,#yuki-newThread-create{float:right;text-align:right;}.postdeleted,.opaque{opacity:.6;}.new .reply{background:#d7fff0;}\
.font-s-a{font-size:12px;font-size-adjust:.8;}.oppost.highlighted,.highlighted .reply{border-style:dashed!important;border-width:2px!important;border-color:#F50!important;}\
.dummy-line{position:absolute;text-align:center;width:100%;}.stat-line{margin-left:.2em;}\
#yuki-captcha,#yuki-pass{width:295px;}#yuki-captcha-image,.reply-button{vertical-align:middle;margin:2px;}#yuki-dropBox{width:7em;height:18em;border:3px dashed rgba(99,99,99,.3);padding:2px;}\
#convert-strike,.global #yuki-close-form{visibility:hidden;}.sagearrow{width:20px;height:20px;background:url(/src/svg/1409/Sage.svg)no-repeat center center;}\
a:hover > .wmark-button{color:inherit;}.spoiler > .wmark-button{vertical-align:inherit;color:inherit;text-shadow:none;}\
#yuki-errorMsg{text-align:center;color:#FFF;background-color:#E04000;}.wmark-button{color:#fefefe;text-shadow:0 1px 0 rgba(0,0,0,.4);}.inactive{opacity:.4;}\
.rating_SFW{background:green;}.rating_R15{background:yellow;}.rating_R18{background:orange;}.rating_R18G{background:red;}.line-sect,.yukiFile,.postdeleted .doubledash,.options-menu-sect{display:inline-block;}\
.yukiFile,.yukiFileSets{font-size:66%;}.yukiFile{text-align:center;width:210px;background:#fefefe;-webkit-border-radius:5px;margin:5px;padding:2px;}img[src="#transparent"]{width:150px;opacity:0;}\
#yuki-files-placeholder > *{vertical-align:top;}.yf_preview{max-width:150px;margin:5px 0;}.yf_info{padding:0 2px;word-wrap:break-word;}.yf_preview._text{border:1px inset #aaa;}\
#yuki-replyForm{text-align:left;padding:4px 8px;}.selected:before{content:"✓ ";color:green;}\
#yuki-dropBox tr{display:block;text-align:center!important;}.droparrow{background:url(/src/svg/1409/DropArrow.svg)no-repeat center;display:block;padding:9em 3em;}\
.celrly + .celrly:before{content:", ";padding-right:2px;}.celrly{text-decoration:none;}.parensis:before{content:"("}.parensis:after{content:")"}.break-midot + *:before{content:"・";}\
#allowed-posts a{font-size:14px;}#allowed-posts:before{content:" | ";}#warning-massage{color:#ff3428;}#timer-update-sets{color:#569856;}\
.blink{-webkit-animation-name:blinker;-webkit-animation-duration:1s;-webkit-animation-timing-function:linear;-webkit-animation-iteration-count:infinite;animation-name:blinker;animation-duration:1s;animation-timing-function:linear;animation-iteration-count:infinite;}\
.options-menu{padding-left:0;list-style:outside none none;text-align:left;min-width:140px;line-height:1.8;position:absolute;z-index:1;visibility:hidden;}\
.option-select:hover{background-color:rgba(0,0,0,.1);}#int-val{width:50px;margin:0 4px;}.options-menu-sect{font-size:80%;}.options-label{padding:2px 4px;font-variant:small-caps;}\
.active > * {visibility:visible!important;}.option-select{padding:0 10px;cursot:default;}.active > .options-label,.options-menu{background-color:#fefefe;box-shadow:0 1px 1px black;}\
@-webkit-keyframes blinker{0%{opacity:1.0;}50%{opacity:0.0;}100%{opacity:1.0;}}@keyframes blinker{0%{opacity:1.0;}50%{opacity:0.0;}100%{opacity:1.0;}}\
@keyframes onReady{50% {opacity:0;}} @-webkit-keyframes onReady{50% {opacity:0;}}'});

(function initStore() {
	try { 
		var User = JSON.parse(localStorage.getItem('User'));
		if (!User || !User.tokens[0] || User.modified) {
			var apiReq = new XMLHttpRequest();
				apiReq.open('GET', '/api/user.json', true);
				apiReq.onreadystatechange = function() {
					if (this.readyState !== 4)
						return;
					if (this.status === 200) {
						localStorage.setItem('User', this.responseText);
						SimpleMagicExtension();
					}
				}
				apiReq.send(null);
		} else {
			SimpleMagicExtension();
		}
	} catch(e) {
		console.error(e);
	}
})();

function SimpleMagicExtension() {
	var HM = {
		UnreadCount: 0, zIndex: 1, DragableObj: null,
		RepliesMap: {}, LoadedPosts: {}, ThreadListener: {}, 
		RemoveExif: _z.localS.get('RemoveExif', true),
		SoundNotify: _z.sessionS.get('SoundNotify', false),
		AutoUpdate: _z.sessionS.get('AutoUpdate', true),
		AttachPopups: _z.localS.get('AttachPopups', true),
		RemoveFileName: _z.localS.get('RemoveFileName', false),
		DiscloseTextSpoilers: _z.localS.get('DiscloseTextSpoilers', false),
		User: JSON.parse(_z.localS.get('User', '{}')),
		URL: ParseUrl()},
	Files = {
		audio: ["m4a", "m4r", "aac", "opus", "alac", "flac", "ogg", "mp3", "wav"],
		video: ['ogv', 'ogm', 'm4v', "3gp", 'mp4', 'webm', 'flv', 'swf'],
		image: ["jpeg", "jpg", "png", "svg", "gif", 'bmp', 'ico', 'webp'],
		arch: ['zip', 'rar', '7z']},
	Names = {
		'en': ['Anonymous', 'Developer', 'Lawrense', 'Anonymous Expert', 'Slowpoke', 'Experimenter'],
		'ru': ['Анонимус', 'Доброкодер', 'Лоуренс', 'Анонимный эксперт', 'Добропок', 'Экспериментатор'],
		 get: function(brd, name) {
			var i, l = LC.lng[lng];
			if (name) {
				i = this['ru'].indexOf(name);
				return (i >= 0 ? this[l][i] : name);
			}
			switch ((brd || HM.URL.board)) {
				case 's'   : i = 1; break;
				case 'sw'  : i = 2; break;
				case 'wn'  : i = 3; break;
				case 'slow': i = 4; break;
				case 'mad' : i = 5; break;
				default    : i = 0;
			}
			return this[l][i];
		}},
	KeyCodes = {
		symbs: ['"', '*', '(', '`', '%', '~'],
		codew: ['{', '[', '(', '\'', '"'],
		quots: ['^', '>'],
		balance: function(k) {
			var O = ['"', '(', '[', '{'],
				C = ['"', ')', ']', '}'],
				idx = O.indexOf(k) || C.indexOf(k);
			return [(O[idx] || k), (C[idx] || k)]
		}},
	Btn = {
		tamplate: '\n<a class="r{Fn} icon" r{Act}><img src="/images/blank.png" title="r{title}" alt="r{alt}"></a>\n',
		get: function(ein) {
			var click, title;
			switch (ein.toLowerCase()) {
				case 'derpibooru':
					click = '$(\'#rs-url\').val(\'@img_src\').parent().submit()';
					title = 'Derpibooru reverse search';
			}
			return this['tamplate'].allReplace({'r{Fn}': 'search_'+ ein.toLowerCase(), 'r{Act}': 'onclick="'+ (click || 'window.open(this.href,\'_blank\');return false') +'"', 'r{title}': (title || LC.fnd_src_wth[lng] +' '+ ein), 'r{alt}': ein});
		}},
	LC = {
		lng: ['en', 'ru'],
		file: ["File", "файл"],
		repl: ["Reply", "Ответ"],
		edit: ["Edit", "Изменить"],
		newp: [" new ", " новых "],
		allw: ["allowed", "раскрытых"],
		omit: [" omited ", " ответов "],
		delp: [" deleted ", " удаленных "],
		pmod: [' pre-moderated', ' на премодерации'],
		edit_post: ['Edit this post', 'Отредактировать'],
		fnd_src_wth: ["Find source with", "Искать оригинал в"],
		mrk_to_del: ["Mark to delete", "Отметить для удаления"],
		remv: ["Close", "Убрать"],
		clos: ["Remove", "Закрыть"],
		all: [" All", " все"],
		add: ["Add", "Добавить"],
		tm: {
			's': ['sec', 'cек'],
			'm': ['min', 'мин'],
			'h': ['hour', 'час']
		},
		few: {
			'u-a': ["\'s", "а"],
			'u-b': ["s", "ов"],
			'u-c': ["s", "ы"],
			'u-d': ["\'s", "и"],
			'en': ["s", ""],
			'ru': ["", "а"]
		}
	},
	
	lng = (LC.lng.indexOf(HM.User.language) > -1 ? LC.lng.indexOf(HM.User.language) : 1),
	Nagato = new Yuki(true),
	Chanabira = new CharmingHanabira(),
	SettingsPanel = new SimpleSets();
	document.head.appendChild(GlobalStyle);
	
	/***--[ Utilites ]--***/
	Array.prototype.isThere = matchIndex;
	String.prototype.isThere = matchIndex;
	Array.prototype.last = getLast;
	NodeList.prototype.last = getLast;
	HTMLCollection.prototype.last = getLast;
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
		return (this.match(/[^\.]+$/) || [''])[0].toLowerCase();
	}
	Array.prototype.move = function (old_index, new_index) {
		if (new_index >= this.length) {
			return;
		} else
			this.splice(new_index, 0, this.splice(old_index, 1)[0]);
	};
	function matchIndex(str) {
		return this.indexOf(str) >= 0;
	}
	function getLast() {
		return this[this.length - 1];
	}
	function setupOptions(input, option, stor, val) {
		switch (input.type) {
			case 'checkbox':
				val = input.checked;
				break;
			case 'select-one':
			case 'number':
				val = (input.value || 0);
		}
		HM[option] = val;
		_z[stor +'S'].set(option, val);
	}
	function ParseUrl(url) {
		var m = (url || document.location.href).match(/(?:https?:\/\/([^\/]+))?\/([^\/]+)\/(?:(\d+)|res\/(\d+)|(\w+))(?:\.x?html)?(#i?(\d+))?/);
		return m ? {host: m[1], board: m[2], page: m[3], thread: m[4], desk: m[5], pointer: m[6], pid: m[7]} : {};
	}
	function getPageName(url) {
		var a = url.split('/'), p = a.pop(), out = !p ? a.pop() : p;
		return decodeURIComponent(out);
	}
	function SwapL(str, lang) {
		if (lang === 'ru') {
			str = str.replace(/[\-=0-9]/,'').replace(/`/, "ё").replace(/q/i, "й").replace(/w/i, "ц").replace(/e/i, "у").replace(/r/i, "к").replace(/t/i, "е").replace(/y/i, "н").replace(/u/i, "г").replace(/i/i, "ш").replace(/o/i, "щ").replace(/p/i, "з").replace(/\[/, "х").replace(/[\]\\]/, "ъ").replace(/a/i, "ф").replace(/s/i, "ы").replace(/d/i, "в").replace(/f/i, "а").replace(/g/i, "п").replace(/h/i, "р").replace(/j/i, "о").replace(/k/i, "л").replace(/l/i, "д").replace(/;/, "ж").replace(/'/, "э").replace(/z/i, "я").replace(/x/i, "ч").replace(/c/i, "с").replace(/v/i, "м").replace(/b/i, "и").replace(/n/i, "т").replace(/m/i, "ь").replace(/,/, "б").replace(/[\.\/]/, "ю");
		} else if (lang === 'en') {
			str = str.replace(/[;\[\]',\.\/`\-=0-9ъЪЭэ]/,'').replace(/[фФ]/, "a").replace(/[иИ]/, "b").replace(/[сС]/, "c").replace(/[вВ]/, "d").replace(/[уУ]/, "e").replace(/[аА]/, "f").replace(/[пП]/, "g").replace(/[рР]/, "h").replace(/[шШ]/, "i").replace(/[оО]/, "j").replace(/[лЛ]/, "k").replace(/[дДжЖ]/, "l").replace(/[ьЬбБ]/, "m").replace(/[тТ]/, "n").replace(/[щЩ]/, "o").replace(/[зЗхХ]/, "p").replace(/[йЙ]/, "q").replace(/[кК]/, "r").replace(/[ыЫ]/, "s").replace(/[еЕ]/, "t").replace(/[гГ]/, "u").replace(/[мМ]/, "v").replace(/[цЦ]/, "w").replace(/[чЧ]/, "x").replace(/[нН]/, "y").replace(/[яЯ]/, "z");
		}
		return str;
	}
	function _show (el) { el.classList.remove('hidout') }
	function _shide(el) { el.classList.toggle('hidout') }
	function _hide (el) { el.classList.add('hidout') }
	function _cid(pid) {
		var n = /(\d+)/.exec(pid);
		return Number((n[1] || 0));
	}
	function extractStringNumbers(str) {
		var match_numbers = new Array(0), i,
			m = str.match(/0x(?:[\dA-Fa-f]+)|-?\d+(?:\.\d+)?/g) || ["NaN"];
		for (i = 0; i < m.length; i++) {
			match_numbers.push(Number(m[i]))
		}
		return match_numbers;
	}
	
	function getCoords(e, el) {
		var box = el.getBoundingClientRect();
		return [e.pageX - (box.left + pageXOffset), e.pageY - (box.top + pageYOffset)]
	}
	
	/************************************************************************/
	function getDataResponse(URI, Fn) {
		var xhrReq = new XMLHttpRequest();
			xhrReq.onreadystatechange = oRsTc;
			xhrReq.open('GET', URI, true);
			xhrReq.send(null);
		function oRsTc() {
			if (this.readyState !== 4)
				return;
			if (this.status === 304) {
				console.warn('304 '+ this.statusText);
			} else {
				try {
					var json = JSON.parse(this.responseText);
				} finally {
					Fn(this.status, this.statusText, (json || this.responseText), this);
					Fn = null;
				}
			}
		}
	}
	function getUrlData(TYPE, Source, Fn) {
		if (typeof GM_xmlhttpRequest !== 'undefined') {
			GM_xmlhttpRequest({
				method: 'GET',
				responseType: TYPE.toLowerCase(),
				url: Source,
				onload: function(gm_xhr) {
					if (gm_xhr.readyState !== 4)
						return;
					if (gm_xhr.status === 200) {
						Fn(gm_xhr.response, gm_xhr.finalUrl, gm_xhr);
						Fn = null;
					}
				}
			});
		} else {
			var dtReq = new XMLHttpRequest();
				dtReq.responseType = TYPE.toLowerCase();
				dtReq.onload = function() {
					if (this.readyState !== 4)
						return;
					if (this.status === 200) {
						Fn(this.response, this.responseURL, this);
						Fn = null;
					}
				};
				dtReq.open('GET', Source, true);
				dtReq.send(null);
		}
	}
	
	function getFileReaderData(readAs, file, Fn) {
		var reader = new FileReader();
			reader.onload = function() {
				if (this.readyState < 1 || this.error) {
					console.warn(this.error || 'No data has been loaded yet.');
					return;
				} else {
					Fn(this.result, this);
					Fn = null;
				}
			}
		switch (readAs.toLowerCase()) {
			case 'string': reader.readAsBinaryString(file);
				break;
			case 'dataurl': reader.readAsDataURL(file);
				break;
			case 'arraybuffer': reader.readAsArrayBuffer(file);
				break;
			case 'text':
				default: reader.readAsText(file, 'UTF-8');
		}
	}
	
	function getRandomColor(str) {
		var a = 0x4872d1e6 % 0x1f4b, color = ['#'];
		function g() {
			for (var j = 0, b; j < str.length; j++){
				b = 0.02519603282416938 * (a += str.charCodeAt(j));
				a =  b >>> 0;
				b = (b - a) * a;
				a =  b >>> 0;
				a+= (b - a) * 0x100000000;
			}
			return (a >>> 0) * 2.3283064365386963e-10;
		}
		for (var i = 0; i < 6; i ++) {
			color.push('0123456789abcdef'[g() * 16 | 0]);
		}
		return color.join('');
	}
	
	/*** Magic Thread Listener ***/
	function MagicThreadListener(Thread, _OPTS) {
		
		Thread['CiD']       = _cid(Thread.id);
		Thread['Posts']     = Thread.getElementsByClassName('post');
		Thread['Replys']    = Thread.getElementsByClassName('replypost');
		Thread['BumpLimit'] = !!Thread.querySelector('img[src="/images/autosage.gif"]');
		Thread['OP']        = Thread['Posts'][0];
		
		var MListen = this,
			ExpCache = new Array(0),
			SageIcon = '<span class="sagearrow line-sect" style="right:6px;"></span>',
			WarningMsg = _z.setup('strong', {'id': 'warning-massage', 'class': 'blink'}),
			Timer = { id: 0, offset: 0, ql: UpdateInterval(0), update: function() {
					clearTimeout(this.id);
					if (HM.AutoUpdate) {
						this.ql = UpdateInterval(this.offset);
						this.id = setTimeout(timerSet, this.ql.int * 1000);
					}
				}},
			Count = { dif: 0, new: 0, del: 0, mod: 0, update: function(new_count) {
					var i = (new_count + this.mod) - Thread['Posts'].length - this.dif,
						n = i > 0 ? i : 0, d = i < 0 ? i : 0;
						this.dif += i; this.new += n; this.del += d;
				}, set: function(values) {
					for (var key in values) {
						this[key] = values[key];
					}
				}},
			Notif = _z.setup('audio', {'html': '<source src="/src/mp3/1406/musbox.mp3" type="audio/mpeg"><source src="/src/ogg/1404/musbox.ogg" type="audio/ogg">'}, {
				'play' : function(e) { this.played = true },
				'ended': function(e) { this.played = false }}),
			MLLC = {
				snd_notify: ["Sound Notifications", "Звуковые уведомления"],
				updauto: ["Autoupdate Thread", "Автообновление треда"],
				loadnew: ["Load New Posts", "Подгрузить посты"],
				updprog: ["Updating...", "Обновление..."],
				unexpt: ["Truncate Thread", "Свернуть тред"],
				expant: ["Expand Thread", "Развернуть тред"],
				expdin: ["Expanding...", 'Разворачивается...'],
				unexin: ["Truncating...", 'Сворачивается...'],
				dsl: {
					'quet': ['Quet Mode', 'Тихий режим'],
					'autotimer': ['Аutotimer', 'Автотаймер'],
					'manual': ['Manual', 'Вручную']
				}}
		function el$(child) { return MListen['NewPostLoader'].querySelector(child) }
		this['NewPostLoader'] = _z.setup('div', {'id': 'new-post-loader', 'class': (_OPTS ? 'dummy-line' : 'stat-line'),
			'html': '<a id="'+ (_OPTS ? 'dummy-load' : 'load-new') +'">'+ MLLC.loadnew[lng] +'</a><div class="not-for-dummies"><input id="AutoUpdate-session-chbx" type="checkbox"'+ (HM.AutoUpdate ? ' checked' : '') +'>\n'+ MLLC.updauto[lng] +'\n<div class="options-menu-sect"><label class="options-label parensis" id="timer-update-sets">'+
				(MLLC.dsl[Timer.ql.value] || checkHTime(Timer.ql.value))[lng] +'</label><ul class="options-menu"><li class="option-select" id="quet-mode-set">'+
				MLLC.dsl['quet'][lng] +'</li><li class="option-select" id="autotimer-set">'+ MLLC.dsl['autotimer'][lng] +'</li><li class="option-select" id="manual-int-set">'+
				MLLC.dsl['manual'][lng] +':\n<input class="option-input" id="int-val" max="180" min="15" type="number"></li></ul></div></div>'}, {
			'click': function(e) {
				var val, txt;
				switch (e.target.id) {
					case 'dummy-load':
					case 'load-new':
						MListen.updateThread({
							button: e.target,
							reload_timer: (e.target.id === 'load-new')
						});
						break;
					case 'timer-update-sets':
						e.target.parentNode.classList.toggle('active');
						break;
					case 'manual-int-set':
						val = this['setInterval'].value;
						txt = checkHTime(val)[lng];
					case 'quet-mode-set':
					case 'autotimer-set':
						_z.sessionS.set('UpdateMode', (val || e.target.id.split('-')[0]));
						this['setMode'].textContent = (txt || e.target.textContent);
						Timer.update();
				}
			}, 'change': function(e) {
				switch (e.target.id) {
					case 'AutoUpdate-session-chbx':
						Timer.update();
				}
			}
		});
		this['NewPostLoader'].setMode = el$('#timer-update-sets');
		this['NewPostLoader'].setInterval = _z.setup(el$('#int-val'), {'value': Timer.ql.int});
		this['PostsCount'] = _z.setup('label', {'id': 'post-count', 'class': 'etch-text break-lines', 'html': (Thread['BumpLimit'] ? SageIcon : '') + Thread['Posts'].length + LC.omit[lng]});
		this['AllowedPosts'] = _z.setup('label', {'id': 'allowed-posts', 'class': 'etch-text', 'html': '<span class="rl-inf">'+ LC.allw[lng] +':&nbsp;\n</span>'});
		this.getArchive = getHanabiraArchiveThread;
		this.updateTimer = function() {
			timerSet(true);
		}
		this.expandThread = function(e) {
			if (ExpCache.length === 0) {
				var color = getRandomColor(Thread.id),
					personalStyle =_z.setup('style', {'text': '#thread_'+Thread['CiD']+' > .post .reply{box-shadow:0 0 3px '+color+' inset!important;border-color:'+color+'!important;}'});
					ExpCache.push(personalStyle);
					statusButton(e.target, 0);
					_z.after(Thread['OP'], personalStyle);
				getHanabiraFullThread({
					button: e.target,
					expand: true
				});
			} else {
				_z.after(Thread['OP'], ExpCache);
				e.target.textContent = MLLC.unexpt[lng];
			}
		}
		this.truncatThread = function(e) {
			_z.remove(ExpCache);
			e.target.textContent = MLLC.expant[lng];
		}
		
		var default_update_options = {
			button: MListen['NewPostLoader'].firstElementChild,
			reload_timer: true,
			int: 15
		}
		
		this.updateThread = function(update_options) {
			var UpdBtn = update_options.button || default_update_options.button;
			if (Thread.updating)
				return;
			statusButton(UpdBtn, 0)
			getDataResponse('/api/thread/'+ HM.URL.board +'/'+ Thread['CiD'] +'/new.json?new_format&post_html&last_post='+ _cid(Thread['Posts'].last().id),
			function(status, sText, json, xhr) {
				try {
					var i, temp_post, el, posts_count, len, error;
					if (status !== 200 || json.error) {
						error = _z.setup(WarningMsg, {'text': (json.error ? json.error.message +' '+ json.error.code : status +' '+ sText)});
						error.dozZe = function(e) {
							if (this.iterations >= 8) {
								_z.replace(this, UpdBtn);
								if (update_options.reload_timer)
									Timer.update();
								this.iterations = 0;
							}
						}
						_z.replace(UpdBtn, error);
					} else {
						Thread['BumpLimit'] = json.result.autosage;
						posts_count = json.result.posts_count;
						el = json.result.posts;
						len = el ? el.length : 0;
						Count.set({dif: 0, new: 0})
						if (len > 0) {
							Timer.offset = 0;
							HM.UnreadCount += len;
							if (HM.SoundNotify && !Notif.played)
								Notif.play();
							for (i = 0; i < len; i++) {
								temp_post = _z.setup('div', {'html': el[i]}).firstElementChild
								handlePost(temp_post, (i + 1 === len));
								temp_post.classList.add('new');
								if (Thread.lastElementChild === MListen['NewPostLoader']) {
									_z.before(MListen['NewPostLoader'], temp_post);
								} else 
									Thread.appendChild(temp_post);
							}
							Tinycon.setBubble(HM.UnreadCount);
						} else if (typeof update_options.int === 'number')
							Timer.offset += update_options.int;
						if (update_options.reload_timer) {
							if (Thread['Posts'].length != posts_count + Count.mod) {
								Count.update(posts_count);
								return getHanabiraFullThread({
									button: UpdBtn,
									expand: false
								});
							}
							MListen['PostsCount'].innerHTML = (Thread['BumpLimit'] ? SageIcon : '') + posts_count + LC.omit[lng] +
								(Count.mod > 0 ? '<span class="parensis">\n+'+ Count.mod + LC.pmod[lng] +'\n</span>' : '');
							Timer.update();
						}
					}
				} catch(e) {
					console.error(e);
				} finally {
					statusButton(UpdBtn, 1);
				}
			});
		}
		function getHanabiraFullThread(options) {
			getDataResponse('/api/thread/'+ HM.URL.board +'/'+ Thread['CiD'] +'/new.json?new_format&post_html&last_post='+ Thread['CiD'],
			function(status, sText, json, xhr) {
				try {
					var jsonPosts = json.result.posts,
						posts_count = json.result.posts_count,
						pnid = function (n) {
							return !Thread['Replys'][n] ? Infinity : extractStringNumbers(Thread['Replys'][n].id)[0]},
						jpid = function (n) {
							return !jsonPosts[n] ? Infinity : extractStringNumbers(jsonPosts[n].slice(3, 50))[0]}
					if (jsonPosts.length === Thread['Replys'].length) {
						Count.set({dif: 0, del: 0, mod: Thread['Posts'].length - posts_count});
					} else {
						for (var i = 0; i < (Thread['Replys'].length + Count.new); i++) {
							switch (true) {
								case (pnid(i) < jpid(i)):
									while (pnid(i) < jpid(i)) {
										Thread['Replys'][i].delete_input.remove();
										Thread['Replys'][i].className = 'postdeleted';
									}
									break;
								case (pnid(i) > jpid(i)):
									while (pnid(i) > jpid(i)) {
										var derefl, temp_post = _z.setup('div', {'html': jsonPosts[i]}).firstElementChild;
											handlePost(temp_post);
										if (options.expand) {
											ExpCache.push(temp_post);
										} else {
											HM.UnreadCount++;
											if (HM.SoundNotify && !Notif.played)
												Notif.play();
											temp_post.classList.add('new');
											
											derefl = _z.setup('a', {'class': 'reply-link celrly', 'id': 'nrl-'+ HM.URL.board +'-'+ Thread['CiD'] +'-'+ jpid(i),
												'href': '/'+ HM.URL.board +'/res/'+ Thread['CiD'] +'.xhtml#i'+ jpid(i), 'text': '>>'+ jpid(i)}, {
													'click': Chanabira.MagicHighlight, 'mouseover': Chanabira.MagicPostView });
											_z.after(MListen['PostsCount'], MListen['AllowedPosts']);
											MListen['AllowedPosts'].appendChild(derefl);
										}
										if (!Thread['Replys'][i]) {
											Thread.appendChild(temp_post);
										} else
											_z.before(Thread['Replys'][i], temp_post);
									}
								default: continue;
							}
						}
						Tinycon.setBubble(HM.UnreadCount);
						genReplyMap(Thread['Posts']);
						Count.set({dif: 0, new: 0, del: 0, mod: (
							posts_count !== Thread['Posts'].length && jsonPosts.length === Thread['Replys'].length ? Thread['Posts'].length - posts_count : 0
						)});
					}
				} catch(e) {
					console.error(e);
				} finally {
					if (!options.expand) {
						MListen['PostsCount'].innerHTML = (Thread['BumpLimit'] ? SageIcon : '') + posts_count + LC.omit[lng] +
							(Count.mod > 0 ? '<span class="parensis">\n+'+ Count.mod + LC.pmod[lng] +'\n</span>' : '');
						Timer.update();
					}
					statusButton(options.button, 1);
				}
			});
		}
		function getHanabiraArchiveThread(center) {
			_z.replace(center, _z.setup(WarningMsg, {
				'text': ['Loading from Archive', 'Загружается из архива'][lng] +' ...',
				'style': 'display:block;text-align:center;font-size:1.4em;'}));
			getDataResponse('/api/thread/expand/'+ HM.URL.board +'/'+ Thread['CiD'], function(status, sText, xhtml, xhr) {
				Thread.innerHTML = xhtml;
				if (Thread['Posts'].length === 0) {
					_z.setup(WarningMsg, {'class': undefined, 'text': xhtml});
				} else {
					_z.each(Thread['Posts'], handlePost);
					_z.replace(WarningMsg, Thread);
				}
			});
		}
		function timerSet(first_time) {
			if (first_time || Timer.ql.value === 'quet') {
				getDataResponse('/api/thread/'+ HM.URL.board +'/'+ Thread['CiD'] +'.json?new_format',
					function(status, sText, json, xhr) {
						if (json.result) {
							Thread['BumpLimit'] = json.result.autosage;
							
							var posts_stat, s_tab,
								posts_count = json.result.posts_count;
							if (first_time && Thread['Posts'].length > posts_count) {
								Count.mod = Thread['Posts'].length - posts_count;
							} else {
								Count.update(posts_count);
								Timer.offset += Count.new > 0 ? 0 : 15;
							}
							if (Timer.ql.value === 'quet') {
								s_tab = (Count.new > 0 ? '<span class="break-midot">\n+'+ Count.new + LC.newp[lng] +'</span>' : '') + (Count.del < 0 ? '<span class="break-midot">\n'+
										Count.del + LC.delp[lng] +'</span>' : '') + (Count.mod > 0 ? '<span class="break-midot">\n'+ Count.mod + LC.pmod[lng] +'</span>' : '');
								posts_stat = Thread['Posts'].length + LC.omit[lng] + (s_tab ? '<span class="parensis">'+ s_tab +'</span>' : '');
							} else {
								posts_stat = posts_count + LC.omit[lng] + (Count.mod > 0 ? '<span class="parensis">\n+'+ Count.mod + LC.pmod[lng] +'\n</span>' : '');
							}
							MListen['PostsCount'].innerHTML = (Thread['BumpLimit'] ? SageIcon : '') + posts_stat;
						}
						Timer.update();
					});
			} else
				MListen.updateThread(default_update_options);
		}
		function UpdateInterval(offset) {
			var t, val = _z.sessionS.get('UpdateMode', 'autotimer');
			if (isNaN(val))
				t = 45 + (offset > 135 ? 135 : offset);
			else
				t = !val || val < 15 ? 45 : val;
			return { value: val, int: t }
		}
		function checkHTime(x) {
			var s, m, v = 's';
			if (x > 59) {
				s = (x % 60).toString();
				m = (x / 60).toString().split('.')[0];
				x = m + ':'+ (s.length < 2 ? '0'+ s : s);
				v = 'm';
			}
			return ['every '+ x +' '+ LC.tm[v][0] +'.', 'каждые '+ x +' '+ LC.tm[v][1] +'.'];
		}
		function statusButton(btn, v) {
			Thread.updating = !v;
			switch (btn.id) {
				case 'load-new': 
				case 'dummy-load': btn.textContent = [MLLC.updprog[lng], MLLC.loadnew[lng]][v];
					break;
				case 'thread-expand': btn.textContent = [MLLC.expdin[lng], MLLC.expant[lng]][v];
					break;
				case 'thread-truncat': btn.textContent = [MLLC.unexin[lng], MLLC.unexpt[lng]][v];
			}
		}
	}
	
	function markAsRead(new_post) {
		if (new_post) {
			HM.UnreadCount--;
			new_post.classList.remove('new');
			Tinycon.setBubble(HM.UnreadCount);
		} else {
			_z.each('.replypost.new', function(replypost_new) {
				replypost_new.classList.remove('new');
			});
			Tinycon.setBubble(0);
			HM.UnreadCount = 0;
		}
	}
	
	function stepZup(e) {
		HM.zIndex++;
		this.style['z-index'] = HM.zIndex;
	}
	
	/*** Wakabamark Buttons Engine ***/
	function wmarkText(TextArea, openTag, closeTag) {
		var	val = TextArea.value,
			end = TextArea.selectionEnd,
			start = TextArea.selectionStart,
			selected = val.substring(start, end),
			ws = window.getSelection().toString(),
			getext = start === end ? ws : selected,
			typex = function (gmi) {return new RegExp('^(\\s*)(.*?)(\\s*)$', (gmi || ''))},
			cont = (typex()).exec(selected), offsetS = 0, offsetE, markedText, CASM = closeTag.slice(0, 1);
		switch (CASM) {
			case '\x20':
			case '\r'  :
				markedText = openTag + (val.substring(start, start -1) !== '\n' ? CASM : closeTag);
				break;
			case '\n':
				if (ws && ws != getext) {
					start = end = TextArea.value.length;
					getext = ws;
					openTag = closeTag;
				}
				markedText = openTag + getext.replace(/\n/gm, closeTag);
				break;
			case '~' :
				if (selected.slice(0, 1) === '~' || val.substring(end, end + 1) === '~')
					closeTag = openTag = openTag.slice(0, 1);
			default:
				var c = sp = '';
				switch (CASM) {
					case '%' : sp  = '%'; break;
					case '`' : c   = '`'; break;
				}
				markedText = cont === null ? (sp || c ? openTag + c + '\n' + getext + '\n' + c + closeTag :
					selected.replace(typex('gm'), '$1'+ openTag +'$2'+ closeTag +'$3')) :
					cont[1] + openTag + cont[2] + closeTag + cont[3];
				if (cont != null && !cont[2]) {
					offsetS = openTag.length;
					offsetE = offsetS + selected.length;
				}
		}
		TextArea.value = val.substring(0, start) + markedText + val.substring(end);
		if (CASM == '\r' || CASM == '\x20') {
			TextArea.selectionStart = TextArea.selectionEnd = TextArea.value.length;
		} else {
			TextArea.setSelectionRange(start + offsetS, start + (offsetE || markedText.length));
			TextArea.classList.add('ta-inact');
		}
		if (TextArea.safe_text)
			_z.sessionS.set('SafeText', JSON.stringify(TextArea.value));
	}
	
	function keyMarks(e) {
		try {
			var TextArea, TA, K;
			if (e.target.tagName === 'TEXTAREA') {
				TextArea = e.target;
				TA = true;
			} else {
				TextArea = Nagato['ReplyText'];
				TA = false;
			}
			var YRT = TextArea.id === 'yuki-replyText',
				CED = TextArea.id === 'code_edit_ta',
				key = String.fromCharCode(e.charCode),
				val = TextArea.value,
				end = TextArea.selectionEnd,
				start = TextArea.selectionStart,
				selected = val.substring(start, end),
				active = selected.length > 0;
				function autoselect() {
					if (!active) {
						var fw = val.substring(start, val.length).match(/^(.*?)(?:\s|$)/);
						return (fw[1] ? false : true);
					} else return true;
				}
			if (YRT && TA && KeyCodes.symbs.isThere(key)) {
				if (active) {
					K = KeyCodes.symbs.indexOf(key) >= 4 ? [key + key, key + key] : KeyCodes.balance(key);
					wmarkText(TextArea, K[0], K[1]);
					return _z.fall(e);
				}
			}
			if (CED && TA && KeyCodes.codew.isThere(key)) {
				if (autoselect()) {
					K = KeyCodes.balance(key);
					wmarkText(TextArea, K[0], K[1]);
					return _z.fall(e);
				}
			}
			if (YRT && KeyCodes.quots.isThere(key)) {
				var sSp = val.substring(start - 1, start);
				if (['\n', ''].isThere(sSp) || selected.isThere('\n')) {
					key = key === '^' ? '*' : key;
					wmarkText(TextArea, key +' ', '\n'+ key +' ');
					return _z.fall(e);
				}
			}
			if (TA && e.keyCode != 8) { HM.LastKey = key;
				if (TextArea.classList.contains('ta-inact')) {
					TextArea.setSelectionRange(end, end);
					TextArea.classList.remove('ta-inact');
				}
			}
		} catch(e) {
			console.error(e);
		}
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
	
	/*** Charming Hanabira ***/
	//* @ original code 	http://dobrochan.com/js/hanabira-0.5.1311-.js
	//* @ copyright 		Dobrochan
	function CharmingHanabira(h) {
		var Chana = this,
			Popups = {
				alive: document.getElementsByClassName('d--kk'),
				durab: new Array(0)},
			ChLC = {
				wsec: ['Wait a Second...', 'Секунду...'],
				body: _z.setup('td', {'class': 'p-del stub', 'text': ["Post is deleted.", "Пост удалён."][lng]})},
			Timrs = {
				clear: function(name) {
					clearTimeout(this[name])},
				set: function(name, Fn) {
					this.clear(name);
					this[name] = setTimeout(Fn, 300)}
			};
		this.closeLastPopup = RemoveAllRefs;
		this.MagicPostView  = MagicPostView;
		this.MagicHighlight = MagicHighlight;
		function MagicHighlight(e) {
			Timrs.clear('PopupOpen');
			var L = e.target.id.split('-'),
				post = document.getElementById('post_'+ L[3]);
			if (post) {
				if (!post.classList.contains('highlighted')) {
					_z.each('.post.highlighted', function(prevhlight){
						prevhlight.classList.remove('highlighted');
					});
					post.classList.add('highlighted');
				}
				post.scrollIntoView({block: (L[0] === 'cvl' ? 'end' : 'start'), behavior: 'smooth'});
			} else if (HM.URL.thread !== tid)
				return;
			_z.fall(e);
		}
		function MagicPostView(e) {
			var _a = e.target, _p = this;
			if (_a.classList[0] !== 'reply-link' || _a.classList.contains('locked'))
				return;
			Timrs.set('PopupOpen', function() {
				try {
					var L = _a.id.split('-'), brd = L[1], tid = L[2], pid = L[3], op = tid === pid, patch_id = brd +'_'+ tid +'_'+ pid,
						id = brd +'-'+ pid, map = (_p.getAttribute('patch-id')||'').split('_'),
						lpth = '[href="/'+ map[0] +'/res/'+ map[1] +'.xhtml#i'+ map[2] +'"]', loading,
						reftab = document.getElementById('ref-'+ id), binded = function (post, load_first) {
							var load = post.stored ? post.body : post.body.cloneNode(true),
								stub = load.classList.contains('stub');
								_z.remove(load.querySelectorAll('form.edit'));
							if (HM.AttachPopups && !stub) {
								BindCloseRef(reftab);
							} else {
								BindRemoveRef(_a, reftab);
							}
							_z.replace(loading, _z.setup(load, {'id': 'load-'+ id, 'class': post.stored}));
							if (post.stored && load_first) {
								//RepliesLinks.generate();
								set_style(_a, reftab);
								document.body.appendChild(reftab);
							}
							_z.each(load.querySelectorAll('.locked:not('+lpth+'), a'+lpth+':not(.locked)'), add_mapping);
						}
					if (reftab) {
						if (reftab.attached) {
							simulateMouseEvent(reftab, "mousedown");
						} else {
							document.body.appendChild(reftab);
						}
						_z.each(reftab.querySelectorAll('.locked:not('+lpth+'), a'+lpth+':not(.locked)'), add_mapping);
					} else {
						reftab = _z.setup('table', {'class': (op ? 'oppost popup' : 'popup'), 'id': 'ref-'+ id, 'patch-id': patch_id,
							'html': '<tbody><tr><td class="loading"><span class="waiting'+ Math.floor(Math.random() * 3) +
							' icon"><img src="/images/blank.png"></span>\n'+ ChLC.wsec[lng] +'</td></tr></tbody>'}, {
							'click': PDownListener, 'mouseover': MagicPostView});
						reftab.formBinding = function(el) {this.firstElementChild.firstElementChild.firstElementChild.appendChild(el)}
						loading = reftab.querySelector('.loading');
						if (HM.LoadedPosts[patch_id]) {
							binded(HM.LoadedPosts[patch_id]);
						//} else if (HM.URL.thread !== tid) {
						//	binded(ChLC);
						} else {
							getDataResponse('/api/post/'+ brd +'/'+ tid +'/'+ pid +'.xhtml',
							function(status, sText, xhtml, xhr) {
								var temp_post, node, tstat, jpost, ErrorMSG;
								if (status !== 200) {
									ErrorMSG = _z.setup('strong', {'id': 'warning-massage', 'class': 'blink', 'text': status +' '+ sText});
									ErrorMSG.dozZe = function(e) {
										if (this.iterations >= 7)
											reftab.remove();
									}
									return _z.replace(loading, ErrorMSG);
								} else if (['Specified element does not exist.', 'Post is deleted.'].isThere(xhtml)) {
									node = HM.LoadedPosts[patch_id] = ChLC;
								} else {
									node = _z.setup('td', {'patch-id': brd +'_'+ tid +'_'+ pid, 'html': xhtml});
									node.stored = 'storedpost';
									handlePost(node, true);
								}
								binded(node, true);
							});
						}
						document.body.appendChild(reftab);
					}
					set_style(_a, reftab);
				} catch(err) {
					console.error(err)
				}
			});
			_a.onmouseleave = function(e) {
				Timrs.clear('PopupOpen');
			}
		}
		function add_mapping(mapp) {
			var fn = mapp.classList.contains('locked') ? 'remove' : 'add';
				mapp.classList[fn]('mapped');
				mapp.classList[fn]('locked');
		}
		function set_style(_lnk, _rtab) {
			var clientR = _lnk.getBoundingClientRect(),
				offsetX = clientR.left + pageXOffset + _lnk.offsetWidth / 2,
				offsetY = clientR.top  + pageYOffset,
				clientX = document.documentElement.clientWidth,
				clientY = document.documentElement.clientHeight,
				isLeft = offsetX < clientX / 3, Yd = _rtab.offsetHeight / 3,
				isTop = Yd + clientR.top + _lnk.offsetHeight < clientY && _lnk.id.split('-')[0] === 'cvl' ||
						Yd * -1 > clientR.top - _rtab.offsetHeight || pageYOffset === 0 && _rtab.offsetHeight > clientR.top,
				left = isLeft ? offsetX : offsetX - Math.min(parseInt(_rtab.offsetWidth, 10), offsetX - 10),
				top = isTop ? offsetY + _lnk.offsetHeight : offsetY - _rtab.offsetHeight,
				mw = clientX - left - 10;
			_rtab.style['top'] = top +'px';
			_rtab.style['left'] = left +'px';
			_rtab.style['z-index'] = HM.zIndex;
			_rtab.style['max-width'] = mw +'px';
		}
		function BindCloseRef(reftab) {
			Popups.durab.push(reftab);
			reftab.attached = true;
			var rtb = _z.setup('tbody', {'html': '<tr><td><span title="'+ LC.clos[lng] +'" class="cpop txt-btn font-s-a" id="rf-cb-ty">\n✕</span><span title="'+
				LC.clos[lng] + LC.all[lng] +'" class="cpop txt-btn" id="rf-cb-all">\n☒</span><span id="rf-da-ty" class="dpop txt-btn">⣾⣿</span></td></tr>'});
			_z.setup(reftab, {}, {
				'mousedown': function(e) {
					var idx = Popups.durab.indexOf(this);
						stepZup.bind(this)(e);
						Popups.durab.move(idx, Popups.durab.length -1);
					switch (e.target.id) {
						case 'rf-da-ty':
							var coords = getCoords(e, this);
								HM.DragableObj = {
									el: this,
									shift: coords,
									layout: 'page'
								}
					}
				}, 'click': function(e) {
					switch (e.target.id) {
						case 'rf-cb-all':
							RemoveAllRefs(e);
							break;
						case 'rf-cb-ty':
							var idx = Popups.durab.indexOf(this);
							this.remove();
							delete Popups.durab[idx];
							Popups.durab.splice(idx, 1);
					}
				}
			}).appendChild(rtb);
		}
		function BindRemoveRef(a, reftab) {
			reftab.classList.add('d--kk');
			reftab.onmouseleave = function(e) {
				Timrs.set('PopupsClose', function() {
					_z.remove(Popups.alive);
				});
			};
			reftab.onmouseenter = function(e) {
				var _this = this;
				Timrs.set('PopupsClose', function() {
					var i = Popups.alive.length - 1;
					while (Popups.alive[i] !== _this) {
						Popups.alive[i].remove();
						i--;
					}
				});
				Timrs.clear(a.href);
			}
			a.onmouseout = function(e) {
				Timrs.set(this.href, function() {
					reftab.remove();
				});
			}
		}
		function RemoveAllRefs(e) {
			if (Popups.durab.length > 0) {
				switch (e.type) {
					case 'click':
						_z.remove(Popups.durab);
						Popups.durab = [];
						break;
					case 'keydown':
						var i = Popups.durab.length - 1;
						Popups.durab[i].remove();
						delete Popups.durab[i];
						Popups.durab.splice(i, 1);
				}
			}
		}
	}
	
	function genReplyMap(posts) {
		_z.each(posts, function(post) {
			var cid = _cid(post.id), replies_links = new Array(0),
				replylink_tamplate = '<a class="reply-link" href="/r{brd}/res/r{tid}.xhtml#ir{pid}" id="cvl-r{brd}-r{tid}-r{pid}">&gt;&gt;r{L}r{pid}</a>';
			if (HM.RepliesMap[cid]) {
				_z.each(HM.RepliesMap[cid], function(Id) {
					replies_links.push(replylink_tamplate.allReplace({'r{brd}': Id[0], 'r{tid}':
					(!Id[1] ? Id[2] : Id[1]), 'r{pid}': Id[2], 'r{L}': (Id[3] ? Id[0] +'/' : '')}));
				});
				if (!post.repliesNode) {
					post.repliesNode = _z.setup('div', {'class': 'replylinks'});
					post.getElementsByClassName('abbrev')[0].appendChild(post.repliesNode);
				}
				post.repliesNode.innerHTML = LC.repl[lng] + LC.few['u-c'][lng] +': '+ replies_links.join(', ');
			}
		})
	}
	function hRate(el, img) {
		if (el.classList[2]) {
			el.classList.remove('rate');
			img.src = img.parentNode.href;
		} else {
			el.classList.add('rate');
			img.src = '/images/'+ img.alt +'.png';
		}
	}
	function MagicSpoirate(el) {
		if (el.classList.contains('rated')) {
			var finf = _z.route(el, '.fileinfo'),
				href = el.parentNode.href,
				fid = el.parentNode.parentNode.id.split('_'),
				btnRate = _z.setup('a', {'class': 'sp-r txt-btn', 'text': el.alt}),
				buttons = Btn['tamplate'].allReplace({'r{Fn}': "edit_", 'r{title}': LC.edit[lng], 'r{alt}': 'edit', 'r{Act}':
					'href="/utils/image/edit/'+ fid[2] +'/'+ fid[1] +'"'}) + Btn.get('Google') + Btn.get('Iqdb') + Btn.get('Derpibooru') + Btn.get('Saucenao');
			finf.replaceChild(btnRate, finf.lastChild);
			finf.insertAdjacentHTML('beforeend', buttons.replace(/@img_src/g, href));
			el.classList.remove('rated');
			el.src = href;
		} else if (el.alt.fext() == 'svg') {
			el.alt = el.src;
			el.src = el.parentNode.href;
		}
		el.classList.toggle('unexpanded');
		el.classList.toggle('expanded');
	}
	
	function handlePost(post, last_n) {
		var reflink = post.querySelector('.reflink > a[href*="/res/"]'),
			url = ParseUrl(reflink.href),
			patchId = url.board +'_'+ url.thread +'_'+ url.pid;
		HM.LoadedPosts[patchId] = _z.setup(post, {'patch-id': patchId}, {'click': PDownListener, 'mouseover': Chanabira.MagicPostView});
		HM.LoadedPosts[patchId].body = post.querySelector('#reply'+ url.pid) || post;
		_z.setup(post.querySelector('.abbrev a[onclick^="GetFullText"]'), {'class': 'Get-Full-Text', 'onclick': undefined});
		handleElements(post);
		handleLinks(post, url);
		if (last_n)
			genReplyMap(document.getElementsByClassName('post'));
	}
	
	function handleLinks(node, map) {
		_z.each((node || document).querySelectorAll(
		'.message a[href*="/res/"]'
		), function(link) {
			if (link.href.isThere("dobrochan")) {
				var targ = ParseUrl(link.href);
				if (targ != null && targ.thread) {
					var reply_id = (targ.pid || targ.thread),
						diffb = (targ.board !== map.board) || (map.board !== HM.URL.board),
						dataArr = [map.board, map.thread, map.pid, (diffb ? targ.board : '')];
					_z.replace(link, _z.setup('a', {'class': 'reply-link', 'href': '/'+ targ.board +'/res/'+ targ.thread +'.xhtml#i'+ reply_id,
						'id': 'rl-'+targ.board+'-'+ targ.thread +'-'+ reply_id, 'text': '>>'+ (diffb ? targ.board +'/' : '') + reply_id}));
					if (!HM.RepliesMap[reply_id])
						HM.RepliesMap[reply_id] = new Array(0);
					if (!JSON.stringify(HM.RepliesMap[reply_id]).isThere(JSON.stringify(dataArr)))
						HM.RepliesMap[reply_id].push(dataArr);
				}
			}
		});
	}
	
	function handleElements(node) {
		_z.each((node || document).querySelectorAll(
		'img.thumb[alt="unrated"], img.thumb[alt^="r-1"], img.thumb[alt="illegal"], .file > a[href$=".svg"] > img, a.search_iqdb.icon, .fileinfo, .reply_, .postername'
		), function(el) {
			switch (el.classList[0]) {
				case 'reply_':
					var ref = _z.route(el, '.reflink a')
					_z.replace(el, _z.setup('span', {'class': 'reply-button txt-btn font-s-a', 'title': LC.repl[lng], 'text': '➤➤'}));
					_z.before(
						_z.setup(ref, {'class': 'inj-refl', 'onclick': undefined}),
						_z.setup('a', {'class': 'edit-post txt-btn', 'title': LC.edit_post[lng], 'text': '✎'})
					);
					break;
				case 'fileinfo':
					var a = el.firstElementChild, name = getPageName(a.href);
					_z.setup(a, {'class': 'download-link', 'download': name, 'title': name});
					break;
				case 'postername':
					if (lng === 0)
						el.textContent = Names.get('', el.textContent);
					break;
				case 'search_iqdb':
					var img_src = el.href.split('=').pop(),
						buttons = Btn.get('Derpibooru') + Btn.get('Saucenao');
					el.insertAdjacentHTML('afterend', buttons.replace(/@img_src/g, img_src));
					break;
				case 'thumb':
					var a = el.parentNode;
					if (!a.href) {
						var fa = _z.route(el, '.fileinfo > a');
							a = _z.setup('a', {'href': fa.href, 'target': "_blank"});
						if (Files.image.isThere(a.href.fext())) {
							el.parentNode.appendChild(a);
							a.appendChild(_z.setup(el, {'class': 'spr-image thumb expanded rated'}));
						}
					} else if (a.href.fext() == 'svg')
						_z.setup(el, {'class': 'spr-image thumb unexpanded', 'onclick': undefined});
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
	function Yuki(stored) {
		var Yu = this, fileList = [], 
			Yum = {brd: HM.URL.board, tid: (HM.URL.thread || 0), funct: function(){}},
			LCY = {
				acap: ["Attach Captcha Image", 'Прикрепить капчу'],
				subj: ["Subject", "Тема"],
				newt: ["New Thread in", "Новый тред в"],
				post: ["Post", "Отправить"],
				txar: ["Message Text", "Текст сообщения"],
				ufrm: ['Unhide form', 'Раскрыть форму'],
				hfrm: ['Hide form', 'Скрыть форму'],
				rmv: ["Remove", "Убирать"],
				fnm: ["file name", "имя файла"],
				send: ['Sending...', 'Отправка...'],
				ten: ['Ten', 'Десять'],
				fiv: ['Five', 'Пять'],
				via: ['via', 'по'],
				f_limit: [' files limit on this board.', ' файлов это максимум на этой доске.'],
				paste_lnk: ['Paste links here', 'Вставьте ссылки сюда'],
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
		ratingselect_tamplate = '<select name="file_1_rating" class="rating_SFW" id="file_rating_sel"><option class="rating_SFW">SFW</option><option class="rating_R15">R-15</option><option class="rating_R18">R-18</option><option class="rating_R18G">R-18G</option></select>',
		filepreview_tamplate = '<div class="yf_remove">[\n<a class="yuki_clickable">'+LCY['rmv'][lng].toLowerCase()+'</a>\n]</div><img class="yf_preview" src="#transparent"><div class="yf_info">r{fname}</div><span class="yf_info">r{size}</span>'+ ratingselect_tamplate,
		replyform_tamplate = '<input id="yuki-targetThread" name="thread_id" value="" type="hidden"><input name="task" value="post" type="hidden"><input name="goto" value="thread" type="hidden">'+
			'<div id="yuki-errorMsg"></div>'+
			'<table><tbody id="yuki-dropBox" class="line-sect"><tr class="etch-text"></tr><tr class="droparrow inactive"></tr></tbody><tbody class="line-sect">'+
			'<tr id="trname"><td><input id="yuki-poster-name" placeholder="" name="name" size="30" value="" type="text">'+
				'<label class="sagearrow line-sect txt-btn inactive" style="right:24px;"><input id="yuki-sage" name="sage" type="checkbox" hidden></label>'+
				'<label id="yuki-newThread-create" class="yuki_clickable inactive">'+ LCY.newt[lng] +'<span class="t-sec">\n/'+ Yum.brd +
				'/</span></label><span class="txt-btn yuki_clickable" id="yuki-close-form" title="'+ LC.remv[lng] +'">✕</span></td></tr>'+
			'<tr id="trsubject"><td><input placeholder="'+ LCY.subj[lng] +'" name="subject" size="30" maxlength="64" value="" type="text">'+
				'<label class="submit-button">\n<input id="yuki-submit-button" type="submit" value="'+ LCY.post[lng] +'"></label>\n'+
				'<span id="wmark-buttons-panel">'+
					'<a title="'+ LCY.wmark['~'][lng] +'"><strong class="wmark-button" id="convert-strike">{~}</strong>&nbsp;</a>'+
					'<a title="'+ LCY.wmark['ul'][lng] +'"><strong class="wmark-button" id="list-mark">◉</strong></a>&nbsp;'+
					'<a title="'+ LCY.wmark['s'][lng] +'"><img class="wmark-button" id="strike-mark" src="/src/svg/1405/~S-mark.svg" alt="~$"></a>&nbsp;'+
					'<a title="'+ LCY.wmark['i'][lng] +'"><img class="wmark-button" id="ital-mark" src="/src/svg/1405/i-mark.svg" alt="i"></a>&nbsp;'+
					'<a title="'+ LCY.wmark['b'][lng] +'"><img class="wmark-button" id="bold-mark" src="/src/svg/1405/-b-mark.svg" alt="b"></a>&nbsp;'+
					'<a title="'+ LCY.wmark['c'][lng] +'"><img class="wmark-button" id="code-mark" src="/src/svg/1405/[c]-mark.svg" alt="[c]"></a>&nbsp;'+
					'<a title="'+ LCY.wmark['sp'][lng] +'"><span class="spoiler">&middot;<strong class="wmark-button" id="spoiler-mark" >%%</strong>&middot;</span></a>&nbsp;'+
					'<a title="'+ LCY.wmark['q'][lng] +'"><img class="wmark-button" id="quote-mark"src="/src/svg/1405/„q”-mark.svg" alt="&gt;"></a>'+
				'</span></td></tr>'+
			'<tr id="trmessage"><td>'+
				'<textarea placeholder="'+ LCY.txar[lng] +'" id="yuki-replyText" name="message" style="resize:both;width:538px;height:208px;">'+
			'</textarea></td></tr><tr id="trcaptcha"><td><span>'+
				'<img alt="Капча" id="yuki-captcha-image" src="">&nbsp;'+
				'<span id="yuki-attach-captcha-button" class="txt-btn yuki_clickable" title="'+ LCY.acap[lng] +'">[+]</span></span><br>'+
				'<input id="yuki-captcha" autocomplete="off" name="captcha" type="text" '+ (HM.User.tokens[0] && HM.User.tokens[0].token === 'no_user_captcha' ? 'hidden' : '') +
			'></td></tr><tr id="trrempass"><td><input id="yuki-pass" name="password" size="35" value="'+ HM.User.password +'" type="password" hidden></td></tr>'+
			'<tr id="trfile"><td id="files_parent"><div id="file_1_div"><span class="yukiFileAdds"><input type="button" value="'+ LC.add[lng] +' '+ LC.file[lng] + LC.few['u-c'][lng] +
			'" id="yuki-add-files"><input id="dumb_file_field" type="file" hidden multiple><input id="yuki-add-files-by-url" type="button" value="'+ LCY.via[lng] +' URL"></span>\n<span class="yukiFileSets"><label><input id="yuki-RemoveExif" type="checkbox" '+
			(HM.RemoveExif ? 'checked ' : '') +'>\n'+ LCY.rmv[lng] +' Exif</label>\n<label><input id="yuki-RemoveFileName" type="checkbox" '+ (HM.RemoveFileName ? 'checked ' : '') +
			'>\n'+ LCY.rmv[lng] +' '+ LCY.fnm[lng] +'</label></span></div></td></tr></tbody></table><div id="yuki-files-placeholder"></div>';
		this.submitForm = yukiPleasePost;
		this.getForm = makeReplyForm;
		this['ReplyForm'] = _z.setup('form', {
			'id': "yuki-replyForm",
			'class': 'line-sect',
			'method': "post",
			'enctype': "multipart/form-data",
			'html': replyform_tamplate
		}, {'submit': yukiPleasePost,
			'click': function(e) {
				switch (e.target.id) {
					case 'yuki-replyText':
						e.target.classList.remove('ta-inact');
						break;
					case 'yuki-add-files':
						Yu['FileInput'].click();
						break;
					case 'yuki-add-files-by-url':
						var input = prompt('http://exemple.com/image.jpg http://exemple.org/music.mp3 https://exemple.ru/archive.rar\n\n'+ LCY.paste_lnk[lng] +':');
						_z.each(input.split(' '), function(uri) {
							getUrlData('Blob', uri, yAdd);
						});
						break;
					case 'yuki-captcha-image':
						e.target.src = '/captcha/'+ Yum.brd +'/'+ _t() +'.png';
						break;
					case 'yuki-close-form':
						Yu['ReplyForm'].remove();
						break;
					case 'yuki-submit-button':
						StrikeConvert(Yu['ReplyText']);
						break;
					case 'yuki-attach-captcha-button':
						yukiAttachCapcha(Yu['CaptchaImage']);
						break;
					case 'yuki-newThread-create':
						if (HM.URL.thread) {
							Yu['TargetThread'].value = e.target.classList.contains('selected') ? HM.URL.thread : 0;
							e.target.classList.toggle('selected')
							e.target.classList.toggle('inactive')
						}
				}
		}, 'change': function(e) {
			switch (e.target.id) {
				case 'dumb_file_field':
					yukiAddFile(e.target);
					break;
				case 'file_rating_sel':
					e.target.className = e.target.querySelector('option:checked').className;
					break;
				case 'yuki-RemoveExif':
				case 'yuki-RemoveFileName':
					setupOptions(e.target, e.target.id.split('-')[1], 'local');
					break;
				case 'yuki-sage':
					e.target.parentNode.classList.toggle('inactive');
					break;
			}
		}});
		this['TargetThread'] = el$('#yuki-targetThread');
		this['ErrorMassage'] = el$('#yuki-errorMsg');
		this['NewThreadCreate'] = el$('#yuki-newThread-create');
		this['CaptchaImage'] = el$('#yuki-captcha-image');
		this['Submit'] = el$('#yuki-submit-button');
		this['FileInput'] = el$('#dumb_file_field');
		this['PosterName'] = el$('#yuki-poster-name');
		this['FilesPlaceholder'] = el$('#yuki-files-placeholder');
		this['ReplyText'] = _z.setup(el$('#yuki-replyText'), {
			'value': stored ? JSON.parse(_z.sessionS.get('SafeText', JSON.stringify(el$('#yuki-replyText').value))) : ''
		}, {'keyup': function(e) {
			var height = _cid(this.style['height']);
			if (height + 26 < this.scrollHeight)
				this.style['height'] = this.scrollHeight +'px';
			if (this.safe_text)
				_z.sessionS.set('SafeText', JSON.stringify(this.value));
		}});
		this['ReplyText'].safe_text = stored;
		this['Captcha'] = _z.setup(el$('#yuki-captcha'), {}, 
			{'focus': function(e) {
				Yu['CaptchaImage'].src = '/captcha/'+ Yum.brd +'/'+ _t() +'.png';
			},'keypress': function(e) {
				var key = e.charCode;
				if (key > 38 && !e.ctrlKey) {
					var keychar = SwapL(String.fromCharCode(key), LC.lng[lng]);
					wmarkText(this, keychar, '\r')
					_z.fall(e);
				}
			}
		});
		this['DropBox'] = _z.setup(el$("#yuki-dropBox"), {}, {
			'dragover': _z.fall,
			'dragenter': function(e) {
				var items = e.dataTransfer.mozItemCount || '';
				if (this.classList[0] != 'thumb') {
					this.firstChild.textContent = LC.add[lng] +' '+ items +' '+ LC.file[lng].toLowerCase() +
						(items == 1 ? '' : !items ? LC.few['u-c'][lng] : items < 5 ? LC.few['u-a'][lng] : LC.few['u-b'][lng]);
					this.classList.add('thumb');
				}
			},'dragout': function(e) {
				this.firstChild.textContent = '';
				this.classList.remove('thumb');
			}, 'drop': function(e) {
				if (e.dataTransfer.mozSourceNode && e.dataTransfer.mozSourceNode.id === 'yuki-captcha-image') {
					yukiAttachCapcha(e.dataTransfer.mozSourceNode);
				} else {
					yukiAddFile(e.dataTransfer);
				}
				this.firstChild.textContent = '';
				this.classList.remove('thumb');
				return _z.fall(e);
			}
		});
		this['GlobalFormArea'] = _z.setup('div', {'id': 'global-form-area', 'class': 'postarea hidout', 'html': '<table><tbody><tr><td id="hide-global-form" class="hideinfo">[\n<a id="hgf-btn">'+
			LCY.hfrm[lng] +'</a>\n]</a></td></tr><tr><td id="global-form-sect"></td></tr><tr><td id="board-rules-sect"></td></tr></tbody></table>'});
		this['OpenTopForm'] = _z.setup('div', {'id': 'open-top-form', 'class': 'hideinfo', 'html': '[\n<a id="otf-btn">'+ LCY.ufrm[lng] +'</a>\n]'}, {'click': makeGlobalForm});
		this['OpenBottomForm'] = _z.setup('div', {'id': 'open-bottom-form', 'class': 'hideinfo', 'html': '[\n<a id="obf-btn">'+ LCY.ufrm[lng] +'</a>\n]'}, {'click': makeGlobalForm});
		this['HideGlobalForm'] = _z.setup(gfa$('#hide-global-form'), {}, {'click': makeGlobalForm});
		this['GlobalFormSect'] = gfa$('#global-form-sect');
		this['BoardRulesSect'] = gfa$('#board-rules-sect');
		el$('#wmark-buttons-panel').addEventListener('click', function(e) {
			var btn = e.target, Fn = wmarkText, O, C;
			if (btn.classList[0] === 'wmark-button') {
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
				Fn(Yu['ReplyText'], O, C);
			}
		}, false);
		function el$(child) { return Yu['ReplyForm'].querySelector(child) }
		function gfa$(child) { return Yu['GlobalFormArea'].querySelector(child) }
		
		function yukiAttachCapcha(captchaImg) {
			if (checkfilesLimit())
				return;
			var canvas = _z.setup('canvas', {'width': captchaImg.width, 'height': captchaImg.height}),
				ctx = canvas.getContext("2d"),
				iw = captchaImg.width;
				ctx.drawImage(captchaImg, 0, 0);
			while (iw) {
				var pixel = ctx.getImageData(iw - 1, 4, 1, 1),
					data = pixel.data;
					if (data[0] + data[1] + data[2] !== 765) {
						canvas.width = iw + 2;
						canvas.height = 15;
						ctx.drawImage(captchaImg, 0, 0, iw + 2, 15, 0, 0, iw + 2, 15);
						break;
					}
				iw--;
			}
			for (var i = 0, dataURL = canvas.toDataURL('image/png'); i < fileList.length; i++) {
				if (fileList[i].dataURL === dataURL)
					return;
			}
			new YukiFile({
				blob: dataURLtoBlob(dataURL, 'image/png'),
				original_name: 'talking_captcha.png',
				dataURL: dataURL
			})
		}
		function checkfilesLimit() {
			var limit, mu = (Yum.brd === 'mu');
			if (fileList.length >= (mu ? 10 : 5)) {
				alert(LCY[(mu ? 'ten' : 'fiv')][lng] + LCY.f_limit[lng]);
				limit = true;
			}
			return limit;
		}
		function checkfileName(file_name) {
			var ext = file_name.fext()
			return (file_name.match(/videoplayback\?/) || file_name.match(/[?=&]/g) && ext.match(/[?=&]/g));
		}
		function YukiFile(fileObj) {
			try {
				for (var key in fileObj) {
					this[key] = fileObj[key];
				}
				if (!fileObj['upload_name'])
					this['upload_name'] = fileObj['original_name'];
				
				var YF = this , Id = makeRandId(6);
				this['frontend'] = _z.setup('div', {'id': 'yuki-file-'+ Id, 'class': "yukiFile", 'html': '<div class="yf_remove">[\n<a id="yf-remove" class="yuki_clickable">'+
					LCY['rmv'][lng].toLowerCase() +'</a>\n]</div><img id="yf-preview" class="yf_preview" src="'+ (this.dataURL || '#transparent') +'"><div id="yf-name" class="yf_info">'+
					this.upload_name +'</div><span id="yf-size" class="yf_info">'+ bytesMagnitude(this.blob.size) +'</span><select class="rating_SFW" id="file_rating_sel"><option class="rating_SFW">SFW</option><option class="rating_R15">R-15</option><option class="rating_R18">R-18</option><option class="rating_R18G">R-18G</option></select>'},
					{'change': function(e) {
						if (e.target.type === 'select-one') {
							YF.rating = e.target.value;
						}
					},'click': function(e) {
						switch (e.target.id) {
							case 'yf-name':
								if (YF.upload_name !== YF.original_name) {
									YF['FileName'].textContent = YF.upload_name = YF.original_name;
								} else {
									YF['FileName'].textContent = YF.upload_name = (makeRandId(32) +'.'+ YF.upload_name.fext());
								}
								break;
							case 'yf-remove':
								var idx = fileList.indexOf(YF);
								YF.frontend.remove();
								delete fileList[idx];
								fileList.splice(idx, 1);
						}
					}
				});
				this['Preview'] = _z.setup(YF['frontend'].querySelector('#yf-preview'), {}, {'load':
					function(e) {
						YF['FileSize'].textContent = bytesMagnitude(YF.blob.size) +', '+ this.naturalWidth +'×'+ this.naturalHeight;
					}
				});
				this['FileName'] = YF['frontend'].querySelector('#yf-name');
				this['FileSize'] = YF['frontend'].querySelector('#yf-size');
				this['rating'] = 'SFW';
				fileList.push(this);
				Yu['FilesPlaceholder'].appendChild(this['frontend']);
			} catch(e) {
				_z.fall(e)
			}
		}
		// Loop through the FileList and render image files as thumbnails.
		function makeYukiFile(f) {
			if (checkfilesLimit())
				return;
			for (var i = 0; i < fileList.length; i++) {
				if (fileList[i].blob.size === f.size && fileList[i].blob.type === f.type)
					return;
			}
			var ext = f.name.fext(), f_type = (
				    f.type == "application/x-shockwave-flash"               ? ['video', 'swf'] :
				    f.type == "audio/mpeg"                                  ? ['audio', 'mp3'] :
				    f.type == "video/ogg"                  && ext == 'ogg'  ? ['audio', 'ogg'] :
				    f.type == 'binary/octet-stream'        ? (ext == 'flac' ? ['audio', 'flac'] : ['', 'bin']) :
				   !f.type                                 ? (ext == 'flac' ? ['audio', 'flac'] : ['', ''])    :
				    f.type.split('/')),
				
				f_ext = ext.match(/[?=&]/g) ? f.type[1].replace('+xml', '').replace('x-', '') : ext,
				
				f_name = checkfileName(f.name) ? makeRandId(32) +
				  (!f_ext                      ? ''    : '.'+ (
				    f_type[0] == 'text'        ? 'txt' :
				    f_type[1].replace('+xml', '').replace('x-', ''))
				  ) : f.name,
				  
				theFile = new YukiFile({
					blob: f,
					upload_name: HM.RemoveFileName ? makeRandId(32) + (f_ext ? '.'+ f_ext : '') : f_name,
					original_name: f_name
				});
				
			// Closure to capture the file information.
			switch (f_type[0]) {
				case 'image':
					if (checkfileName(f.name))
						theFile.overlay['FileName'].textContent = theFile.upload_name = theFile.original_name = (makeRandId(32) +'.'+ f_type[1].replace('+xml', ''));
					// Read in the image file as a data URL.
					getFileReaderData('DataURL', f, function(base64) {
						// Render thumbnail.
						if (HM.RemoveExif && theFile.blob.type === 'image/jpeg') {
							theFile['jpegStripped'] = true;
						}
						theFile['Preview'].src = theFile.dataURL = base64;
					});
					break;
				case 'text':
					// Read in the text file as a UTF-8 encoding text.
					getFileReaderData('Text', f, function(text) {
						var canvas = _z.setup('canvas', {'class': 'yf_preview _text', 'width': 150, 'height': 150}),
							context = canvas.getContext("2d");
							context.font = "10px serif";
						for (var i = 0, x = 3, y = 11, cars = text.split("\n"); i < cars.length; i++) {
							context.fillText(cars[i], x, y);
							y += 11;
						}
						_z.replace(theFile['Preview'], canvas);
						theFile['Preview'] = canvas;
					});
					break;
				default:
					theFile['Preview'].src = Files.arch.isThere(f_ext)      ? '/thumb/generic/archive.png' :
											 Files.audio.isThere(f_ext)     ? '/thumb/generic/sound.png'   :
											 Files.video.isThere(f_ext)     ? (
											 Files.video.indexOf(f_ext) > 5 ? '/thumb/generic/flash.png'   : '/src/png/1501/video.png') : '#transparent';
			}
		}
		function yukiAddFile(data) { // FileList object
			var files = data.files,
				dataURL = data.getData ? data.getData(data.effectAllowed === 'copyLink' ? 'Text' : 'URL') : null;
			if (checkfilesLimit())
				return;
			if (files.length === 0 && dataURL) {
				getUrlData('Blob', dataURL, yAdd);
			} else 
				_z.each(files, makeYukiFile);
		}
		function yAdd(blob, f_url) {
			try {
				if (blob.type !== 'text/html') {
					blob.name = getPageName(f_url);
					makeYukiFile(blob);
				}
			} catch(e) {
				console.error(e);
			}
		}
		function submitProcess(st) {
			_z.setup(Yu['Submit'], {
				'disabled': (st ? "disabled" : undefined),
				'value': (st ? LCY.send[lng] : LCY.post[lng])
			});
		}
		function yukiPleasePost(e) {
			try {
				var form = e.target, formData = serializeArray(form),
					ajaxPost = new XMLHttpRequest(), fd = new FormData(),
					action = form.action +'?X-Progress-ID='+ _t() * 10000;
				for (var i = 0; i < formData.length; i++) {
					fd.append(formData[i].name, formData[i].value);
				}
				switch (form.id) {
					case 'yuki-replyForm': Fn = function() {
							if (this.readyState !== 4)
								return;
							if (this.status === 304) {
								Yu['ErrorMassage'].textContent = 'Не получилось отправить пост.\n'+
									'Попробуйте чуть попозже ещё разок или перезагрузить страницу.'+
									'〔\n'+ this.statusText+ '\n〕';
								submitProcess(false);
							} else {
								var rText = this.responseText,
									errPost = rText.match(/\/error\/post\/\d+/),
									newThread = rText.match(/\/\w*\/(?:res\/)?\w+\.xhtml/);
								if (errPost) {
									getDataResponse(errPost, function(status, sText, err, xhr) {
										var msg = (/<td colspan='\d+' class='post-error'>(.+)<\/td>/).exec(err);
										Yu['ErrorMassage'].textContent = msg[1];
										if (LCY.cerr[LC.lng[lng]].isThere(msg[1].split(' ').pop()))
											Yu['Captcha'].hidden = false;
										return submitProcess(false);
									});
								} else if (newThread && Yu['TargetThread'].value == 0) {
									document.location.href = newThread;
								} else {
									if (Yu['ReplyForm'].classList[0] !== 'global')
										Yu['ReplyForm'].remove();
									Yu['ReplyText'].value = '';
									Yu['ErrorMassage'].textContent = '';
									Yu['FilesPlaceholder'].innerHTML = '';
									Yu['Captcha'].hidden = true;
									submitProcess(false); Yum.funct(this);
									if (Yu['ReplyText'].safe_text)
										_z.sessionS.set('SafeText', JSON.stringify(Yu['ReplyText'].value));
									if (HM.ThreadListener[Yum.tid]) {
										if (fileList.length === 0) {
											HM.ThreadListener[Yum.tid].updateThread({reload_timer: !!HM.URL.thread});
										} else {
											setTimeout(function(){
												HM.ThreadListener[Yum.tid].updateThread({reload_timer: !!HM.URL.thread});
											}, 1500);
										}
									}
									fileList = [];
								}
							}
						}
						for (var i = 0; i < fileList.length; i++) {
							if (HM.RemoveExif && fileList[i].blob.type == 'image/jpeg' && fileList[i]['jpegStripped'] && fileList[i].dataURL) {
								fileList[i].blob = dataURLtoBlob(jpegStripExtra(fileList[i].dataURL), fileList[i].blob.type);
							}
							fd.append('file_'+ (i + 1), fileList[i].blob, fileList[i].upload_name);
							fd.append('file_'+ (i + 1) +'_rating', fileList[i].rating);
						};
						fd.append('post_files_count', fileList.length)
						submitProcess(true);
						break;
					case 'delete_form': Fn = function() {
						if (this.readyState !== 4)
							return;
						if (this.status === 304) {
							console.warn('304 '+ this.statusText);
						} else {
							if (this.responseURL === action) {
								var rText = this.responseText,
									msg = (/<center><h2>(.+)<\/h2><\/center>/).exec(rText);
								alert(msg[1]);
							} else {
								var del_checks = document.querySelectorAll('.delete_checkbox:checked');
								if (del_checks.length === 1) {
									document.getElementById('post_'+ del_checks[0].name).className = 'postdeleted';
									del_checks[0].remove();
								} else {
									document.location.reload();
								}
							}
						}
					}
				}
				ajaxPost.onreadystatechange = Fn;
				ajaxPost.open('POST', action, true);
				ajaxPost.send(fd);
			} catch(e) {
				console.error(e);
			} finally {
				return _z.fall(e);
			}
		}
		function makeReplyForm(map, params) {
			Yu['TargetThread'].value = Yum.tid = map[1]; Yum.brd = map[0];
			Yu['CaptchaImage'].src = '/captcha/'+ Yum.brd +'/'+ _t() +'.png';
			Yu['PosterName'].placeholder = Names.get(Yum.brd);
			switch (params.type) {
				case 'reply':
					_z.each([Yu['OpenTopForm'], Yu['OpenBottomForm']], _show);
					_hide(Yu['HideGlobalForm']);
				case 'report':
					if (map[2] && !Yu['ReplyText'].value.isThere('>>'+ map[2])) {
						wmarkText(Yu['ReplyText'], '>>'+ map[2], '\r\n');
					}
					break;
				case 'edit':
					Yu['ReplyText'].value = params.text;
					el$('[name="name"]').value = params.name;
					el$('[name="subject"]').value = params.subj;
					Yum.funct = params.funct;
					for (var i = 0, len = params.files.length - fileList.length; i < len; i++) {
						getUrlData('Blob', params.files[i].href, yAdd)
					}
			}
			return _z.setup(Yu['ReplyForm'], {'class': params.type +' line-sect', 'action': '/'+ Yum.brd +'/post/new.xhtml'});
		}
		function makeGlobalForm(e) {
			switch (e.target.id) {
				case 'otf-btn':
					_DWG(document.getElementById('postform_placeholder'), 'OpenTopForm', 'OpenBottomForm');
					break;
				case 'obf-btn':
					_DWG(Yu['OpenBottomForm'], 'OpenBottomForm', 'OpenTopForm');
					break;
				case 'hgf-btn':
					_z.each([Yu['OpenBottomForm'], Yu['OpenTopForm']], _show);
					_hide(Yu['GlobalFormArea']);
					break;
			}
			function _DWG(node, A, B) {
				var RPForm = makeReplyForm([HM.URL.board, (HM.URL.thread && Yu['TargetThread'].value !== '0' ? HM.URL.thread : 0)], {type: 'global'});
				_z.each([Yu['HideGlobalForm'], Yu[B], Yu['GlobalFormArea']], _show);
				_z.after(node, Yu['GlobalFormArea']);
				_hide(Yu[A]);
				Yu['GlobalFormSect'].appendChild(RPForm);
				Yu['NewThreadCreate'].className = (HM.URL.thread ? 'yuki_clickable ' : '') + (Yu['TargetThread'].value !== '0' ? 'inactive' : 'selected');
			}
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
			var base64 = '';
			var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
			var bytes = new Uint8Array(raw);
			var byteLength = bytes.byteLength;
			var byteRemainder = byteLength % 3;
			var mainLength = byteLength - byteRemainder;
			var a, b, c, d, chunk;
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
				base64 += encodings[a] + encodings[b] + encodings[c] + '=';
			}
			return base64;
		}
		function jpegStripExtra(input) {
			// Decode the dataURL
			var binary = atob(input.split(',')[1]);
			// Create 8-bit unsigned array
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			var orig = new Uint8Array(array);
			var outData = new ArrayBuffer(orig.byteLength);
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
		function _t(last) {
			return (new Date).getTime() - (last ? parseInt(last) : 0);
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
	function SimpleSets(h) {
		var Ss = this, SsLC = {
				snd_notify: ["Sound Notifications", "Звуковые уведомления"],
				txtspoils: ["Disclose text spoilers", "Раскрывать текстовые спойлеры"],
				clipopup: ["Clipping Popup Posts", "Закреплять превью постов"]
			};
		this['StyleSet'] = {
				spoiler: _z.setup('style', {'text': '.spoiler, .spoiler * {color:inherit!important;}'}),
				true: function(style) { document.body.appendChild(this[style]) },
				false: function(style) { this[style].remove() }
			}
		this['SmallSetsPanel'] = _z.setup('span', {'id': 'small-settings-panel', 'html':
				'<div class="stat-line"><input id="SoundNotify-session-chbx" type="checkbox"'+ (HM.SoundNotify ? ' checked' : '') +'>\n'+ SsLC.snd_notify[lng] +
				'</div><div class="stat-line"><input id="AttachPopups-local-chbx" type="checkbox"'+ (HM.AttachPopups ? ' checked' : '') +'>\n'+ SsLC.clipopup[lng] +
				'</div><div class="stat-line"><input id="DiscloseTextSpoilers-local-chbx" type="checkbox"'+ (HM.DiscloseTextSpoilers ? ' checked' : '') +'>\n'+ SsLC.txtspoils[lng] +
				'</div><form method="post" action="//derpibooru.org/search/reverse" target="_blank" enctype="multipart/form-data" hidden><input id="rs-url" name="url" type="text" value=""><input id="fuzziness" name="fuzziness" type="text" value="0.25"></form>'
			}, {'change': function(e) {
					switch (e.target.id) {
						case 'int-val':
							break;
						case 'DiscloseTextSpoilers-local-chbx':
							Ss['StyleSet'][e.target.checked]('spoiler');
						default:
							var param = e.target.id.split('-');
							setupOptions(e.target, param[0], param[1]);
					}
				}
			});
	}
	
	function PDownListener(e) {
		try {
			var Phis = this, patchId = this.getAttribute('patch-id'), Map = patchId.split('_'), RPForm, _Params;
			if (this.classList.contains('new'))
				markAsRead(this);
			switch (e.target.classList[0]) {
				case 'delete_checkbox':
					if (this.classList.contains('popup')) {
						confirm(['Want to delete this post ?', 'Удалить этот пост ?'][lng]) ? delPost(e.target) : null;
					} else
						e.target.parentNode.classList[(e.target.checked ? 'add' : 'remove')]('checked');
					break;
				case 'reply-button':
					RPForm = Nagato.getForm(Map, {type: 'reply'})
					if (this.classList.contains('post')) {
						_z.after(this, RPForm);
					} else if (this.classList.contains('popup')) {
						this.firstElementChild.firstElementChild.firstElementChild.appendChild(RPForm);
					}
					if (this.offsetTop < pageYOffset || this.offsetTop > (pageYOffset + window.innerHeight))
						this.scrollIntoView();
					break;
				case 'edit-post':
					var name = (this.querySelector('.postertrip')
							|| this.querySelector('.postername')),
						title = this.querySelector('.replytitle'),
						dlinks = this.getElementsByClassName('download-link'),
						message = this.querySelector('.message'),
						params = {type: 'edit', name: name.textContent, subj: (title ? title.textContent : ''), text: textSource(message), funct: function(){
							delPost(_z.setup(Phis.querySelector('#delbox_'+ Map[2]), {'checked': true}));
						}, files: dlinks};
					if (!HM.LoadedPosts[patchId].edit_form)
						HM.LoadedPosts[patchId].edit_form = new Yuki(false);
					RPForm = HM.LoadedPosts[patchId].edit_form.getForm(Map, params)
					_z.after(this.querySelector('.cpanel + br'), RPForm);
					break;
				case 'Get-Full-Text':
					_Params = {'class': 'Get-Short-Text', 'text': ['Short version', 'Укороченная версия'][lng]};
				case 'Get-Short-Text':
					_z.each(this.getElementsByClassName('postbody'), function(pbody) {
						pbody.classList.toggle('alternate');
					});
					_z.setup(e.target, (_Params || {'class': 'Get-Full-Text', 'text': ['Full version', 'Полная версия'][lng]}));
					break;
				case 'excat-button':
					var eXcaT = e.target.id.split('-')[1];
					HM.ThreadListener[Map[1]][eXcaT +'Thread'](e);
					e.target.id = 'thread-'+ (eXcaT === 'expand' ? 'truncat' : 'expand');
					break;
				case 'sp-r':
					hRate(e.target, e.target.parentNode.parentNode.querySelector('img.spr-image'));
					break;
				case 'spr-image':
					MagicSpoirate(e.target);
					break;
				case 'inj-refl':
					wmarkText(Nagato['ReplyText'], '>>'+ (Map[0] !== HM.URL.board ? Map[0] +'/' : '') + Map[2], '\x20');
					break;
				case 'reply-link': 
					Chanabira.MagicHighlight(e);
				default:
					return;
			}
			_z.fall(e);
		} catch(err) {
			console.error(err);
		}
		function textSource(mNode) {
			var	soucHTML = mNode.innerHTML, soucText, links = mNode.querySelectorAll('a:not(.reply-link)'),
				patcHTML = soucHTML.allReplace({'<del>': '~~', '</del>': '~~', '<div class="spoiler">': '%%\n', '</div>': '\n%%', '<pre>': '`\n', '</pre>': '\n`',
					'<code>': '`', '</code>': '`', '<span class="spoiler">': '%%', '</span>': '%%', '<em>': '_', '</em>': '_', '<strong>': '**', '</strong>': '**',
					'<li>  ': '\n* * ', '<li>\n  ': '* * ', '<li>\n ': '\n* ', '>&gt; ': '>\n&gt; ', '&gt; \n': '&gt;'});
				for (var i = 0; i < links.length; i++) {
					patcHTML = patcHTML.replace(links[i].outerHTML, links[i].href)
				}
				soucText = _z.setup('div', {'html': patcHTML}).textContent
			return soucText.replace(/^[\n]+/, '');
		}
		function delPost(delbox) {
			var form = _z.setup('form', {'id': 'delete_form', 'action': '/'+ Map[0] +'/delete', 'method': 'post', 'html':
				'<input name="task" value="delete"><input name="password" value="'+ HM.User.password +'"><input name="'+ delbox.name +'" value="'+ delbox.value +'">'})
			Nagato.submitForm({target: form})
		}
	}
	
	function insertListenerS(event) {
		try {
			switch (event.animationName) {
				case 'onReady':
					switch (event.target.className) {
						case 'footer':
							var locationThread = document.getElementById('thread_'+ HM.URL.thread);
								hideinfodiv = document.getElementById('hideinfodiv')
								delForm = document.getElementById('delete_form'),
								rules = document.getElementsByClassName('rules')[0],
								posts = document.getElementsByClassName('post');
								
								_z.each(posts, handlePost);
							if (hideinfodiv) {
								_z.after(hideinfodiv, Nagato['OpenTopForm']);
								Nagato['BoardRulesSect'].appendChild(rules);
							}
							if (locationThread) {
								HM.ThreadListener[HM.URL.thread] = new MagicThreadListener(locationThread);
								_z.append(delForm, [Nagato['OpenBottomForm'], SettingsPanel['SmallSetsPanel']]);
								_z.prepend(SettingsPanel['SmallSetsPanel'], HM.ThreadListener[HM.URL.thread]['NewPostLoader']);
								_z.after(locationThread, HM.ThreadListener[HM.URL.thread]['PostsCount']);
								HM.ThreadListener[HM.URL.thread].updateTimer();
							} else if (!locationThread && HM.URL.thread) {
								HM.ThreadListener[HM.URL.thread] = new MagicThreadListener(_z.setup('div', {'id': 'thread_'+ HM.URL.thread, 'class': 'thread'}))
								HM.ThreadListener[HM.URL.thread].getArchive(document.getElementsByTagName('center')[0]);
							} else {
								if (hideinfodiv)
									_z.before(delForm.querySelector('.pages'), [Nagato['OpenBottomForm'], SettingsPanel['SmallSetsPanel']]);
								_z.each('.thread', function(thread) {
									if (!thread.querySelector('img[src="/images/sticky.png"]')) {
										var CiD = _cid(thread.id)
										HM.ThreadListener[CiD] = new MagicThreadListener(thread, true);
										thread.appendChild(HM.ThreadListener[CiD]['NewPostLoader']);
										_z.setup(thread.querySelector('.abbrev a[onclick^="ExpandThread"]'), {'class': 'excat-button', 'id': 'thread-expand', 'onclick': undefined});
									}
								});
							}
							if (delForm)
								delForm.addEventListener('submit', Nagato.submitForm, false);
							SettingsPanel['StyleSet'][HM.DiscloseTextSpoilers ? true : false]('spoiler');
					}
			}
		} catch(e) {
			console.error(e);
		}
	}
	
	function insertListenerI(event) {
		switch (event.animationName) {
			case 'blinker':
				if (!event.target.iterations)
					event.target.iterations = 0;
				event.target.iterations++;
				if (event.target.dozZe)
					event.target.dozZe();
		}
	}
	
	_z.setup(window, {}, {
		'keypress': keyMarks,
		'mousemove': function(e, pc) {
			if (HM.DragableObj) {
				switch (HM.DragableObj.layout) {
					case 'custom':
						HM.DragableObj.callback(e);
						break;
					default:
						HM.DragableObj.el.style['left'] = e[HM.DragableObj.layout +'X'] - HM.DragableObj.shift[0] +'px';
						HM.DragableObj.el.style['top']  = e[HM.DragableObj.layout +'Y'] - HM.DragableObj.shift[1] +'px';
				}
				_z.fall(e);
			}
		},
		'dblclick': function(e) {
			if (!['TEXTAREA', 'INPUT'].isThere(e.target.tagName))
				markAsRead();
		},
		'mouseup': function(e) {
			HM.DragableObj = null;
			switch (e.button) {
				case 0:
					if (!e.target.classList.contains('options-label') && !e.target.classList.contains('option-input'))
						_z.each('.options-menu-sect.active', function(dt_a){ dt_a.classList.remove('active')} );
			}
		},
		'keydown': function(e) {
			switch (e.keyCode) {
				case 27:
					Chanabira.closeLastPopup(e);
					break;
				case 82:
					if (!['TEXTAREA', 'INPUT'].isThere(e.target.tagName))
						markAsRead();
					break;
				case 9:
					if (e.target.id === 'code_edit_ta') {
						wmarkText(e.target, '\t', '\n\t');
						return _z.fall(e);
					}
			}
		}
	});
	
	// simulate mouse button events
	function simulateMouseEvent(node, eventType) {
		var clickEvent = document.createEvent('MouseEvents');
		clickEvent.initEvent(eventType, true, true);
		node.dispatchEvent(clickEvent);
	}
	
	// animation listener events
	PrefixedEvent("AnimationStart", insertListenerS);
	PrefixedEvent("AnimationIteration", insertListenerI);
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
}
