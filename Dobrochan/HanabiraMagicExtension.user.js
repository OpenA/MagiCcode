// ==UserScript==
// @name    		MagicScript Extension for Dobrochan Imageboard
// @description 	Включает в себя: Ajax подгрузку и отправку постов, Превращение рейтингов в спойлеры, Умные кнопки разметки и автокомплит, Поддержку встраивания медиа со множества ресурсов, а так же HTML5 Audio/Video/Image файлов по прямым ссылкам и много чего еще.
// @namespace   	magicode
// @homepage		
// @updateURL   	
// @downloadURL 	
// @include 		*dobrochan.*
// @run-at  		document-start
// @require         https://github.com/tommoor/tinycon/blob/master/tinycon.min.js?raw=true
// @version 		2.0.0 (Dev)
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

(function initStore() {
	try { 
		var User = JSON.parse(localStorage.getItem('User'));
		if (localStorage.getItem('oEmbedAPI') == 'false') {
			sessionStorage.setItem('LinksCache', '{}');
		}
		if (localStorage.getItem('Keywords') && localStorage.getItem('Keywords').indexOf('Nametrip') >= 0)
			localStorage.removeItem('Keywords');
		if (!User || !User.tokens[0] || User.modified) {
			var apiReq = new XMLHttpRequest();
				apiReq.open('GET', '/api/user.json', true);
				apiReq.onreadystatechange = function() {
					if (this.readyState !== 4)
						return;
					if (this.status === 200) {
						localStorage.setItem('User', this.responseText);
						initScripts();
					}
				}
				apiReq.send(null);
		} else {
			initScripts();
		}
	} catch(e) {
		console.error(e)
	}
})();

function MagicExtension() {
	var HM = {
		zIndex: 1, UnreadCount: 0, DragableObj: null, Played: null, LastKey: null,
		ThreadListener: {}, LoadedPosts: {}, VActive: [], URL: ParseUrl(),
		APIKey: _z.localS.get('APIKey', '9cccaccb6ddc490a97bcd2ba6c282191'),
		LinksMap: JSON.parse(_z.sessionS.get('LinksCache', '{}')),
		UserStyle: JSON.parse(_z.localS.get('UserStyle', '""')),
		oEmbedAPI: _z.localS.get('oEmbedAPI', true),
		maXrating: _z.localS.get('maXrating', 'SFW'),
		FormStyle: _z.localS.get('FormStyle', 1),
		RemoveExif: _z.localS.get('RemoveExif', true),
		AutoUpdate: _z.sessionS.get('AutoUpdate', true),
		EmbedField: _z.localS.get('EmbedField', 1),
		AspectRatio: _z.localS.get('AspectRatio', 1),
		PictureView: _z.localS.get('PictureView', 1),
		SoundNotify: _z.sessionS.get('SoundNotify', false),
		AttachPopups: _z.localS.get('AttachPopups', true),
		RemoveFileName: _z.localS.get('RemoveFileName', false),
		DiscloseTextSpoilers: _z.localS.get('DiscloseTextSpoilers', false),
		Keywords: JSON.parse(_z.localS.get('Keywords', '{}')),
		User: JSON.parse(_z.localS.get('User', '{}')) },
	AspectSize = {
		W: [360, 480, 720, 854],
		H: [270, 360, 480, 576]},
	Files = {
		audio: ['wav', 'm4a', 'm4r', 'aac', 'ogg', 'mp3', 'opus', 'flac', 'alac', 'aiff', 'aif'],
		video: ['webm', 'ogv', 'ogm', 'mp4', 'm4v', 'flv', '3gp', 'swf', '3gpp'],
		image: ['jpeg', 'jpg', 'png', 'svg', 'gif', 'bmp', 'ico', 'webp'],
		arch: ['zip', 'rar', '7z'], pdf: ['pdf'],
		matchType: function(ext) {
			for (var key in this) {
				if ( key !== 'matchType' && this[key].indexOf(ext) >= 0 ) {
					return key;
				}
			}
		}},
	RepliesLinks = {
		ReplyNodes: new Array(0),
		generate: function() {
			for (var n = 0; n < this['ReplyNodes'].length; n++) {
				var cid = this['ReplyNodes'][n].id.split('_')[1];
				if (this[cid]) {
					for (var i = 0; i < this[cid].length; i++) {
						var relink, Id = this[cid][i];
						if (!this['ReplyNodes'][n].querySelector('.celrly[href$="#i'+ Id[2] +'"]')) {
							relink = _z.setup('a', {'id': 'cvl-'+ Id[0] +'-'+ (!Id[1] ? Id[2] : Id[1]) +'-'+ Id[2], 'class': 'reply-link celrly',
								'href': '/'+ Id[0] +'/res/'+ (!Id[1] ? Id[2] : Id[1]) +'.xhtml#i'+ Id[2], 'text':
								'\n>>'+ (Id[3] ? '❪'+ Id[0].toUpperCase() +'❫' : '') + Id[2] });
							relink.hidden = (document.getElementById('post_'+ Id[2]) || {hidden:false}).hidden;
							_z.before(this['ReplyNodes'][n].lastElementChild, relink);
						}
					}
				}
			}
		}},
	Disepath = {
		bank: {},
		naval: function(arg, val, $P) {
			for (var idx = 0, $O = this.bank[arg] || []; idx < $O.length; idx++) {
				 var word = escapeRegExp($O[idx].word), matp = new RegExp(
					$O[idx].type == '#' ? '('+ word +')' : $O[idx].type +'[\\s]*{[^}]*('+ word +'(?:::)?)[^}]*}').exec(val) || [];
				if (!matp[1] || matp[1] !== $O[idx].word) {
					switch ($O[idx].meth) {
						case 'rep':
							var $parent = $O[idx].stub.parentNode;
							_z.before($parent, $O[idx].stub);
							_z.remove([$parent.nextElementSibling, $parent]);
							break;
						case 'hid':
							var map$ = $O[idx].node.getAttribute('patch-id').split('_');
							$O[idx].stub.parentNode.classList.remove('autohidden');
							$O[idx].stub.remove();
							$O[idx].node.hidden = false;
							_z.each('.celrly[href="/'+ map$[0] +'/res/'+ map$[1] +'.xhtml#i'+ map$[2] +'"]', function(crly) { crly.hidden = false });
						if (arg === 0) 
							getDataResponse('/api/thread/'+ map$[0] +'/'+ map$[1] +'/unhide.json', function(status, sText, flag, xhr) {});
					}
					delete this.bank[arg][idx];
					this.bank[arg].splice(idx, 1);
				}
			}
			this.eval(arg, val, $P);
		},
		eval: function(arg, val, $P) {
			if (val === undefined)
				return;
			try {
				var rXkey = '(\\w*)[\\s]*{[\\s\\n]*([^}]+)[\\s\\n]*}|(#(?:\\w*)?\\/?\\d*)',
					rXval = /^(?:\*(.+)\*|\*(.+)|(.+)\*|(.+)\:\:(.+))$/,
					rXpts =	/^[\s\n]*|[\s\n]*\|[\s\n]*|[\s\n]*$/g,
					xlass = {
						other: ['replypost', 'oppost'][arg],
						title: 'replytitle',
						name : 'postername',
						trip : 'postertrip',
						text : 'message', '#': 'cyan-light' }, $this = this,
					ABС = 'ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
					tlc = 'translate(normalize-space(.), "'+ ABС +'", "'+ ABС.toLowerCase() +'")';
				for (var i = 0, mat$ = val.match(new RegExp(rXkey, 'g')) || []; i < mat$.length; i++) {
					 var m = new RegExp(rXkey).exec(mat$[i]) || [];
					if (m[1] && m[2]) {
						for (var j = 0, keys = m[2].split(rXpts); j < keys.length; j++) {
							if (!keys[j])
								continue;
							 var k$ = rXval.exec(keys[j]) || [];
							if (k$[4] && k$[5]) {
								_$VAST('rep', './/*[@class="'+ xlass[m[1]] +'"]//text()[contains('+ tlc +','+ cleanStringForXpath(k$[4].toLowerCase()) +
									') and not(parent::code or parent::*[@class="text-original" or @class="text-modifed" or @class="text-styled"])]', k$, m[1]);
							} else {
								var s = cleanStringForXpath((k$[1] || k$[2] || k$[3] || keys[j]).toLowerCase()),
									f = k$[1] ? 'contains('+ tlc +', '+ s +')' :
										k$[2] ? 'substring('+ tlc +', string-length(.) - string-length('+ s +') +1) = '+ s:
										k$[3] ? 'starts-with('+ tlc +', '+ s +')' : tlc +' = '+ s;
									_$VAST('hid', './/*[@class="'+ xlass[m[1]] +'" and '+ f +' and not(ancestor::*[contains(@class, "autohide-info") or contains(@class, "'+
										xlass.other +'")])]/ancestor::*[@class="'+ ['thread', 'reply" or @class="copyedpost" or @class="storedpost'][arg] +'"]', keys[j], m[1]);
							}
						}
					} else if (m[3] && !$P.classList.contains(xlass.other)) {
						var k$ = m[3].slice(1).split('/'),
							f = $P.getAttribute('patch-id').split('_');
						if ((k$[0] === f[0] || k$[0] === f[1]) && k$[1] === f[2] || k$[0] === f[2]) {
							_$VAST('hid', ['parent::*[@class="thread"]', 'descendant::*[@class="reply" or @class="copyedpost" or @class="storedpost"]'][arg], m[3], '#');
						}
					}
				}
			} catch(err) {
				console.error(err)
			}
			function _$VAST(meth, xpath, word, type) {
				for (var n = 0, result = getElementByXpath(xpath, 7, $P); n < result.snapshotLength; n++) {
					 var stub, target$ = result.snapshotItem(n);
					switch (meth) {
						case 'rep':
							var cin = escapeRegExp(word[4]), f,
								sm = word[5].match(/^(.*)@\[([^\]]+)\]$/),
								twod = sm ? sm[1] : word[5],
								md = twod.match(/^(.*)?(\$1)(.*)?$/);
								word = word[0];
							if (md) {
								var S = KeyCodes.balance(cin);
								cin = md[1] || md[3] ? S[0] +'([^'+ S[1] +']*)'+ S[1] : '('+ cin +')';
							}
							f = new RegExp(cin, 'gi')
							_z.after(target$, [
								_z.setup('span', {'class': 'text-original'}),
								_z.setup('span', {'class': 'text-modifed', 'html': target$.textContent.replace(f,
									(sm && sm[2] ? '<span class="text-styled" style="'+ sm[2] +'">'+ twod +'</span>' : twod))})
							]);
							target$.nextElementSibling.appendChild(target$);
							stub = target$;
							break;
						case 'hid':
							var map$ = $P.getAttribute('patch-id').split('_');
							if (HM.Keywords.conceal) {
								$P.hidden = true;
								_z.each('.celrly[href="/'+ map$[0] +'/res/'+ map$[1] +'.xhtml#i'+ map$[2] +'"]', function(crly) { crly.hidden = true });
								if ($P.classList.contains('new')) {
									markAsRead($P);
								}
							}
							stub = _z.setup('div', {'id': 'autohidden-'+ target$.id, 'class': 'autohide-info '+ ['thr-h', 'rp-h'][arg], 'html': '<label class="'+ xlass[type] +' t-sec">'+
								word +'</label>\n<i class="s-inf">('+ LC.hidden[2][lng] + LC.hidden[arg][lng] +')</i>\n<span class="s-inf">No.'+ map$[2] +'</span>'});
							_z.prepend(
								_z.setup(target$, {'class': target$.className +' autohidden'}), stub);
						if (arg === 0)
							getDataResponse('/api/thread/'+ map$[0] +'/'+ map$[1] +'/hide.json', function(status, sText, flag, xhr) {});
					}
					($this.bank[arg] || ($this.bank[arg] = new Array(0))).push({
						meth: meth,
						type: type,
						word: word,
						stub: stub,
						node: $P
					});
				}
			}
		}},
	AlbumArts = {
		makeCover: function(dataImage, artist, album) {
			var aId = getKeyByValue(this, dataImage) || ((artist || makeRandId(4)) +' — '+ (album || makeRandId(4))).hashCode();
			switch (true) {
				case (this[aId] && dataImage !== this[aId]):
					aId += '_'+ makeRandId(4);
				case (!this[aId]):
					this[aId] = dataImage;
			}
			if (!document.getElementById('cover_'+ aId)) {
				document.body.appendChild(_z.setup('style', { 'id': 'cover_'+ aId,
					'text': '#album_'+ aId +'{background-image:url("'+ dataImage +'");}'
				}))
			}
			return 'album_'+ aId;
		}},
	Megia = {
		'audio': new Harmony(),
		'image': new MagicPicture(),
		'video': new MagicEmbeds(),
		'scbc': new MagicEmbeds(),
		'docs': new MagicEmbeds(true),
		'pdf': new MagicEmbeds(true)
	},
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
	LC = {
		lng: ['en', 'ru'],
		file: ["File", "Файл"],
		repl: ["Reply", "Ответ"],
		hide: ["Hide", "Скрыть"],
		edit: ["Edit", "Изменить"],
		newp: [" new ", " новых "],
		allw: ["allowed", "раскрытых"],
		omit: [" omited ", " ответов "],
		delp: [" deleted ", " удаленных "],
		pmod: [' pre-moderated', ' на премодерации'],
		txtspoils: ["Disclose text spoilers", "Раскрывать текстовые спойлеры"],
		broken_link: ["Broken and useless URL Link", "Нерабочая и абсолютно бесполезная ссылка"],
		allw: ["allowed", "раскрытых"],
		line: [" line", " строк"],
		page: [" page", " страниц"],
		remv: ["Remove", "Убрать"],
		clos: ["Close", "Закрыть"],
		all: [" All", " все"],
		add: ["Add", "Добавить"],
		to: ['to', 'в'],
		hidden: [
			['Thread', 'тред'],
			['Post', 'пост'],
			['Hidden ', 'Cкрытый ']
		],
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
		},
		Month: [
			["January"  , "Январь"  ],
			["February" , "Февраль" ],
			["March"    , "Март"    ],
			["April"    , "Апрель"  ],
			["May"      , "Май"     ],
			["June"     , "Июнь"    ],
			["July"     , "Июль"    ],
			["August"   , "Август"  ],
			["September", "Сентябрь"],
			["October"  , "Октябрь" ],
			["November" , "Ноябрь"  ],
			["December" , "Декабрь" ]
		],
		Weekday: [
			["(Sun)", "(Вс)"],
			["(Mon)", "(Пн)"],
			["(Tue)", "(Вт)"],
			["(Wed)", "(Ср)"],
			["(Thu)", "(Чт)"],
			["(Fri)", "(Пт)"],
			["(Sat)", "(Cб)"]
		],
		get: function(key, n, l) {
			return this[key][l] + (n === 1 ? this.few['ru'][l] : n < 5 ? this.few['u-d'][l] : this.few['en'][l]);
		}
	},
	
	UrlCache = JSON.parse(_z.sessionS.get('LinksCache', '{}')), stopCloseReact = false,
	lng = (LC.lng.indexOf(HM.User.language) > -1 ? LC.lng.indexOf(HM.User.language) : 1),
	Chanabira = new CharmingHanabira(), mEl = new MagicElements(), Nagato = new Yuki(true);
	
	/***--[ Utilites ]--***/
	Array.prototype.isThere = matchIndex;
	String.prototype.isThere = matchIndex;
	Array.prototype.last = getLast;
	NodeList.prototype.last = getLast;
	HTMLCollection.prototype.last = getLast;
	HTMLCollection.prototype.indexOf = function(node) {
		for (var idx = this.length -1; this[idx]; idx--) {
			if (this[idx] === node)
				return idx;
		}
		return -1;
	};
	Array.prototype.move = function (old_index, new_index) {
		if (new_index >= this.length) {
			return;
		} else
			this.splice(new_index, 0, this.splice(old_index, 1)[0]);
	};
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
	String.prototype.hashCode = function() {
		var hash = i = 0, chr, len,
			str = this.replace(/https?:\/\//, '');
		if (str.length > 0) {
			for(len   = str.length; i < len; i++) {
				chr   = str.charCodeAt(i);
				hash  = ((hash << 5) - hash) + chr;
				hash |= 0; // Convert to 32bit integer
			}
		}
		return hash;
	}
	function getLast() {
		return this[this.length - 1]
	}
	function matchIndex(str) {
		return this.indexOf(str) >= 0;
	}
	function setupOptions(input, option, stor, val) {
		switch (input.type) {
			case 'checkbox':
				val = input.checked;
				break;
			default:
				val = (input.value || val || 0);
		}
		HM[option] = val;
		_z[stor +'S'].set(option, val);
	}
	function getCoords(elem) {
		var box = elem.getBoundingClientRect();
		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		}
	}
	function escapeUrl(url) {
		var eUrl = encodeURI(url).allReplace({'%2?5?E2%2?5?80%2?5?8B': '', '%2?5?3C/?\\w*%2?5?3E': '', '%2?5?22': ''});
		return decodeURI(eUrl);
	}
	function escapeRegExp(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}
	function getPageName(url) {
		var a = url.split('/'), p = a.pop(), out = !p ? a.pop() : p;
		return decodeURIComponent(out);
	}
	function ParseUrl(url) {
		var m = (url || document.location.href).match(/(?:https?:\/\/([^\/]+))?\/([^\/]+)\/(?:(\d+)|res\/(\d+)|(\w+))(?:\.x?html)?(#i?(\d+))?/);
		return m ? {host: m[1], board: m[2], page: m[3], thread: m[4], desk: m[5], pointer: m[6], pid: m[7]} : {};
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
	function _cid(id) {
		return id.split('_')[1] || id.split('reply')[1];
	}
	function _unc(str, n) {
		return (str || n || 'Unknown');
	}
	function _stub(tag, html) {
		var stb = _z.setup('div', {'html': html}, null);
		return stb.querySelector(tag);
	}
	function _blobURL(blob) {
		var URL = window.URL || window.webkitURL;
		return URL.createObjectURL(blob);
	}
	function extractStringNumbers(str) {
		var match_numbers = new Array(0), i,
			m = str.match(/0x(?:[\dA-Fa-f]+)|-?\d+(?:\.\d+)?/g) || ["NaN"];
		for (i = 0; i < m.length; i++) {
			match_numbers.push(Number(m[i]))
		}
		return match_numbers;
	}
	function _scrollIfOverPage(elem) {
		if (elem.offsetTop < pageYOffset || elem.offsetTop > (pageYOffset + window.innerHeight))
			elem.scrollIntoView();
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
	function capitaliseFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
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
	function getUrlData(TYPE, Source, Fn){
		if (typeof GM_xmlhttpRequest !== 'undefined') {
			GM_xmlhttpRequest({
				method: 'GET',
				responseType: TYPE.toLowerCase(),
				url: Source,
				onload: function(gm_xhr) {
					if (gm_xhr.readyState !== 4)
						return;
					if (gm_xhr.status === 304) {
						console.warn('304 '+ gm_xhr.statusText);
					} else {
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
					if (this.status === 304) {
						console.warn('304 '+ this.statusText);
					} else {
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
	
	function getKeyByValue(obj, value) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (Array.isArray(obj[prop])) {
					if (obj[prop].isThere(value))
						return prop;
				} else if (obj[prop] === value)
					return prop;
			}
		}
	}
	
	function getElementByXpath(path, value, node) {
		var TYPE = [
				'ANY_TYPE',
				'NUMBER_TYPE',
				'STRING_TYPE',
				'BOOLEAN_TYPE',
				'UNORDERED_NODE_ITERATOR_TYPE',
				'ORDERED_NODE_ITERATOR_TYPE',
				'UNORDERED_NODE_SNAPSHOT_TYPE',
				'ORDERED_NODE_SNAPSHOT_TYPE',
				'ANY_UNORDERED_NODE_TYPE',
				'FIRST_ORDERED_NODE_TYPE'],
			V = TYPE[value] || TYPE[TYPE.indexOf(value)] || TYPE[0];
		return document.evaluate(path, (node || document.body), null, XPathResult[V], null);
	}
	
	function cleanStringForXpath(str) {
		var parts = str.match(/[^'"]+|['"]/g);
		parts = parts.map(function(part, o) {
			switch (part) {
				case "'": o = '"\'"'; break;
				case '"': o = "'\"'"; break;
				default : o = '"'+ part +'"';
			}
			return o;
		});
		return parts.length > 1 ? 'concat(' + parts.join(',') + ')' : parts[0];
	}
	
	function difference(array1, array2) {
		var result = [];
		if (array2.length == 0) {
			return array1;
		}
		for (var i = 0; i < array1.length; i++) {
			if (!array2.isThere(array1[i])) {
				result.push(array1[i]);
			}
		}
		return result;
	}
	
	function timerCalc(secn, cc) {
		if (!secn)
			return '- -:- -';
		var x = Math.floor(secn),
			s = x % 60, h,
			m = Math.floor(x / 60);
		if (m > 59) {
			h = Math.floor(m / 60);
			m %= 60;
		}
		return (h ? h +':' : '') + (m > 9 || cc ? m : '0'+ m) +':'+ (s > 9 ? s : '0'+ s);
	}
	
	function bytesMagnitude(bytes) {
		return (bytes < 1024 ? bytes +' B' :
				bytes < 1024 * 1024 ? (bytes / 1024).toFixed(2) +' KB' :
				bytes < 1024 * 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(2) +' MB' :
											(bytes / 1024 / 1024 / 1024).toFixed(2) +' GB');
	}
	
	function getDateTime(jsonDT) {
		try {
			var date  = new RegExp(/(?:(\d*)\-(\d*)\-(\d*)|(\d*)\s(\w*)\s(\d*)\s\(\w*\))\s(\d*\:\d*)(\:\d*)?/gm).exec(jsonDT),
				year  = (date[1] || date[6]),
				month = (date[2] || date[5]),
				day   = (date[3] || date[4]),
				hmin  =  date[7],
				sec   = (date[8] || ''),
				uDate = new Date(month +" "+ day +", "+ year +" "+ hmin + " GMT+0300"),
				Year  = uDate.getFullYear(),
				Month = uDate.getMonth(),
				Weday = uDate.getDay(),
				Day   = uDate.getDate(),
				Time  = uDate.toTimeString().split(' ')[0],
				Outer = '\n<span id="'+ uDate.toJSON() +'" class="posterdate">'+ (Day < 10 ? "0" : '') + Day +" "+ LC.Month[Month][lng] +" "+
					Year +" "+ LC.Weekday[Weday][lng] +" "+(Time.length === 7 ? "0" + Time.slice(0, 4) : Time.slice(0, 5)) +'<span class="t-sec">'+ sec +'</span></span>';
		} catch(e) {
			console.error(e);
		} finally {
			return Outer;
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
		stopCloseReact = !e._scr;
		this.style['z-index'] = HM.zIndex;
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
						this[key] = values[key]
					}
				}},
			Notif = _z.setup('audio', {'html': '<source src="/src/mp3/1406/musbox.mp3" type="audio/mpeg"><source src="/src/ogg/1404/musbox.ogg" type="audio/ogg">'}, {
				'play' : function(e) { this.played = true },
				'ended': function(e) { this.played = false }}),
			MLLC = {
				snd_notify: ["Sound Notifications", "Звуковые уведомления"],
				loadnew: ["Load New Posts", "Подгрузить посты"],
				updprog: ["Updating...", "Обновление..."],
				updauto: ["Autoupdate Thread", "Автообновление треда"],
				unexpt: ["Truncate Thread", "Свернуть тред"],
				expant: ["Expand Thread", "Развернуть тред"],
				expdin: ["Expanding...", 'Разворачивается...'],
				unexin: ["Truncating...", 'Сворачивается...'],
				dsl: {
					'quet': ['Quet Mode', 'Тихий режим'],
					'autotimer': ['Аutotimer', 'Автотаймер'],
					'manual': ['Manual', 'Вручную']
				}}
		this.updateThread = updateThread; this.updateTimer = Timer.update; this.expandThread = expandThread; this.truncatThread = truncatThread; this.getThread = getHanabiraFullThread;
		this.getArchive = getHanabiraArchiveThread;
		function el$(child) { return MListen['NewPostLoader'].querySelector(child) }
		this['NewPostLoader'] = _z.setup('span', {'id': 'new-post-loader', 'html': '<div class="stat-line"><a id="load-new">'+ MLLC.loadnew[lng] +
				'</a></div><label><input id="SoundNotify-chbx" type="checkbox" hidden'+ (HM.SoundNotify ? ' checked' : '') +'><span class="checkarea"></span>\n'+ MLLC.snd_notify[lng] +
				'</label><br><label><input id="AutoUpdate-chbx" type="checkbox" hidden'+ (HM.AutoUpdate ? ' checked' : '') +'><span class="checkarea"></span>\n'+ MLLC.updauto[lng] +
				'</label><ul class="dropdown line-sect"><li class="dropdown-toggle"><label id="timer-update-sets" class="dropdown-label el-li t-sec">'+
				(MLLC.dsl[Timer.ql.value] || checkHTime(Timer.ql.value))[lng] +'</label><ul class="dropdown-menu"><li class="dropdown-item el-li" id="quet-mode-set">'+
				MLLC.dsl['quet'][lng] +'</li><li class="dropdown-item el-li" id="autotimer-set">'+ MLLC.dsl['autotimer'][lng] +'</li><li class="dropdown-item el-li" id="manual-int-set">'+
				MLLC.dsl['manual'][lng] +':\n<input id="int-val" class="dropdown-input" max="180" min="15" type="number"></li></ul></li></ul>'
			}, {'click': function(e) {
				var val, txt;
				switch (e.target.id) {
					case 'load-new':
						updateThread(e, true);
						break;
					case 'timer-update-sets':
						el$('.dropdown-toggle').classList.toggle('active');
						break;
					case 'manual-int-set':
						val = MListen['setInterval'].value;
						txt = checkHTime(val)[lng];
					case 'quet-mode-set':
					case 'autotimer-set':
						_z.sessionS.set('UpdateMode', (val || e.target.id.split('-')[0]));
						el$('.dropdown-label').textContent = (txt || e.target.textContent);
						Timer.update();
				}
			}, 'change': function(e) {
				switch (e.target.id) {
					case 'SoundNotify-chbx':
					case 'AutoUpdate-chbx':
						setupOptions(e.target, e.target.id.split('-')[0], 'session');
						Timer.update();
				}
			}
		});
		this['DummyLine'] = _z.setup('div', {'class': 'dummy-line', 'html': '<a id="dummy-load">'+ MLLC.loadnew[lng] +'</a>'}, {
			'click': function(e) {
				switch (e.target.id) {
					case 'dummy-load': updateThread(e, false);
				}
			}
		});
		this['PostsCount'] = _z.setup('label', {'id': 'post-count', 'class': 'etch-text break-lines', 'html': (Thread['BumpLimit'] ? SageIcon : '') + Thread['Posts'].length + LC.omit[lng]});
		this['SpeedCount'] = _z.setup('label', {'id': 'speed-count', 'class': 'etch-text', 'html': speedMether(Thread['Posts'])[0]});
		this['AllowedPosts'] = _z.setup('label', {'id': 'allowed-posts', 'class': 'etch-text', 'html': '<span class="rl-inf">'+ LC.allw[lng] +':&nbsp;\n</span>'});
		this['setInterval'] = _z.setup(el$('#int-val'), {'value': Timer.ql.int});
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
		function speedMether(posts) {
			try {
				var i = total_posts_board = total_posts = 0, tp_s, tp_bs, I,
					last_date = Math.round(new Date(posts.last().querySelector('.posterdate').id).getTime() / 1000) - (60 * 60),
					last_id = extractStringNumbers(posts.last().id)[0],
					nstr = function(num) {
						return num +' '+ LC.hidden[1][lng] + (num === 0 || num >= 5 ? LC.few['u-b'][lng] : num === 1 ? '' : LC.few['u-a'][lng]) +'/'+ LC.tm['h'][lng];
					}
				for (i = posts.length - 1; posts[i]; i--) {
					if (Math.round(new Date(posts[i].querySelector('.posterdate').id).getTime() / 1000) > last_date) {
						total_posts_board = last_id - extractStringNumbers(posts[i].id)[0] + 1;
						total_posts++;
					}
				}
				I = Math.round(100*total_posts/total_posts_board);
				tp_s = '<span class="break-lines">\n&nbsp;'+ nstr(total_posts) + (I === Infinity ? '∞' : '\n('+ I +'%)') +'&nbsp;\n</span>';
				tp_bs = '<span class="break-lines">\n&nbsp;'+['On board: ', 'доска: '][lng] + nstr(total_posts_board) +'&nbsp;\n</span>';
			} catch(e) { console.error(e) } finally {
				return [tp_s + tp_bs, tp_s, tp_bs]
			}
		}
		function timerSet() {
			if (Timer.ql.value === 'quet') {
				getDataResponse('/api/thread/'+ HM.URL.board +'/'+ Thread['CiD'] +'.json?new_format',
					function(status, sText, json, xhr) {
						if (json.result) {
							Thread['BumpLimit'] = json.result.autosage;
							Count.update(json.result.posts_count);
							Timer.offset += Count.new > 0 ? 0 : 15;
							var postStat = (Count.new > 0 ? '<span class="break-midot">\n+'+ Count.new + LC.newp[lng] +'</span>' : '') + (Count.del < 0 ? '<span class="break-midot">\n'+
								Count.del + LC.delp[lng] +'</span>' : '') + (Count.mod > 0 ? '<span class="break-midot">\n'+ Count.mod + LC.pmod[lng] +'</span>' : '');
							MListen['PostsCount'].innerHTML = (Thread['BumpLimit'] ? SageIcon : '') + Thread['Posts'].length + LC.omit[lng] + (postStat ? '<span class="parensis">'+ postStat +'</span>' : '');
						}
					});
				Timer.update();
			} else
				updateThread(15, true);
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
				s = (x % 60).toString()
				m = (x / 60).toString().split('.')[0]
				x = m + ':'+ (s.length < 2 ? '0'+ s : s)
				v = 'm'
			}
			return ['every '+ x +' '+ LC.tm[v][0] +'.', 'каждые '+ x +' '+ LC.tm[v][1] +'.'];
		}
		function expandThread(e) {
			if (ExpCache.length === 0) {
				var personalStyle =_z.setup('style', {'text': '#thread_'+ Thread['CiD'] +' > .post:not(.new) .reply{box-shadow:0 1px 50px -25px '+getRandomColor(Thread['CiD'])+' inset,0 2px 2px rgba(0,0,0,.2),2px 0 3px -1px rgba(0,0,0,.1);!important}'});
					ExpCache.push(personalStyle);
				statusButton(e.target, 0);
				getHanabiraFullThread({
					button: e.target,
					expand: true
				});
				_z.after(Thread['OP'], personalStyle);
			} else {
				_z.after(Thread['OP'], ExpCache);
				e.target.textContent = MLLC.unexpt[lng];
			}
		}
		function truncatThread(e) {
			_z.remove(ExpCache);
			e.target.textContent = MLLC.expant[lng];
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
		function updateThread(e, rexk) {
			var UpdBtn = typeof e === 'object' ? e.target : el$('#load-new')
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
								if (rexk)
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
								handlePost(temp_post);
								temp_post.classList.add('new');
								if (Thread.lastElementChild === MListen['DummyLine']) {
									_z.before(MListen['DummyLine'], temp_post);
								} else 
									Thread.appendChild(temp_post);
							}
							Tinycon.setBubble(HM.UnreadCount);
							MListen['SpeedCount'].innerHTML = speedMether(Thread['Posts'])[0];
						} else if (typeof e === 'number')
							Timer.offset += e;
						if (rexk) {
							if (Thread['Posts'].length != posts_count + Count.mod) {
								Count.update(posts_count);
								return getHanabiraFullThread({
									button: UpdBtn,
									expand: false
								});
							}
							Timer.update();
						}
						if (e) {
							MListen['PostsCount'].innerHTML = (Thread['BumpLimit'] ? SageIcon : '') + posts_count + LC.omit[lng] + (Count.mod > 0 ? '<span class="parensis">\n+'+ Count.mod + LC.pmod[lng] +'\n</span>' : '');
							RepliesLinks.generate();
						}
					}
				} catch(err) {
					console.error(err);
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
											_z.after(Thread, MListen['AllowedPosts'])
											_z.before(MListen['AllowedPosts'].lastElementChild, derefl);
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
						RepliesLinks.generate();
						Count.set({dif: 0, new: 0, del: 0, mod: (
							posts_count !== Thread['Posts'].length && jsonPosts.length === Thread['Replys'].length ? Thread['Posts'].length - posts_count : 0
						)});
					}
				} catch(e) {
					console.error(e);
				} finally {
					if (!options.expand)
						Timer.update();
					MListen['PostsCount'].innerHTML = (Thread['BumpLimit'] ? SageIcon : '') + posts_count + LC.omit[lng] + (Count.mod > 0 ? '<span class="parensis">\n+'+ Count.mod + LC.pmod[lng] +'\n</span>' : '');
					statusButton(options.button, 1);
				}
			});
		}
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
								stub = load.classList.contains('stub') || load.classList.contains('autohidden');
								_z.remove(load.querySelectorAll('form.edit, .magic-picture'));
							if (HM.AttachPopups && !stub) {
								BindCloseRef(reftab);
							} else {
								BindRemoveRef(_a, reftab);
							}
							_z.replace(loading, _z.setup(load, {'id': 'load-'+ id, 'class': post.stored}));
							if (post.stored && load_first) {
								RepliesLinks.generate();
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
						} else if (HM.URL.thread == tid) {
							binded(ChLC);
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
									handlePost(node);
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
			var rtb = _z.setup('tbody', {'html': '<tr><td><span title="'+ LC.clos[lng] +'" class="cpop txt-btn" id="rf-cb-ty"></span><span title="'+
				LC.clos[lng] + LC.all[lng] +'" class="cpop txt-btn" id="rf-cb-all"></span><span id="rf-da-ty" class="dpop txt-btn"></span></td></tr>'});
			_z.setup(reftab, {}, {
				'mousedown': function(e) {
					var idx = Popups.durab.indexOf(this);
						e._scr = this.querySelector('.magic-picture.gallery-qview') && e.target !== Megia.image['Picture'];
						stepZup.bind(this)(e);
						Popups.durab.move(idx, Popups.durab.length -1);
					switch (e.target.id) {
						case 'rf-da-ty':
							var coords = getCoords(this);
								HM.DragableObj = {
									el: this,
									shift: [e.pageX - coords.left, e.pageY - coords.top],
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
			case '\r' :
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
			TextArea.setSelectionRange(start + offsetS, start + (offsetE || markedText.length))
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
				CED = TextArea.id.isThere('code_'),
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
	//* @ by		DesuDesuTalk
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
	
	function MagicEmbeds(scr){
		var Mbed = this;
		this['Frame'] = {};
		this['Container'] = document.createElement('blockquote');
		this['makePlayer'] = makePlayer;
		this['matchPlayer'] = matchPlayer;
		this['RegEx'] = GenrX;
		this.object = {
			iframe: _z.setup('iframe', {'frameborder': '0', 'scrolling': (scr ? 'auto' : 'no'), 'allowfullscreen': 'true', 'mozallowfullscreen': 'true', 'webkitallowfullscreen': 'true'}),
			embed: _z.setup('embed', {'type': 'application/x-shockwave-flash'}),
			video: _z.setup('video', {'controls': 'true'})
		}
		function cVl(tg, extras) {
			return _z.setup(Mbed.object[tg], extras, null)
		}
		function makePlayer(uri, embc) {
			var P, ext = uri.fext(), element = Mbed['Container'].firstElementChild;
			switch (embc) {
				case 'Cb': P = cVl('iframe', {'src': uri.replace(GenrX('Coub'), "//coub.com/embed/$1?muted=false&autostart=false&originalSize=false&hideTopBar=true&noSiteButtons=true&startWithHD=false")}); break;
				case 'YT': P = cVl('iframe', {'src': uri.replace(GenrX('YouTube'), "//www.youtube.com/embed/$1$3$5?$2$4$6&autohide=1&wmode=opaque&enablejsapi=1&theme=light&html5=1&rel=0&start=$7")}); break;
				case 'RT': P = cVl('iframe', {'src': uri.replace(GenrX('RuTube'), "//rutube.ru/video/embed/$1?autoStart=false&isFullTab=true&skinColor=fefefe")}); break;
				case 'Vm': P = cVl('iframe', {'src': uri.replace(GenrX('Vimeo'), "//player.vimeo.com/video/$1?badge=0&color=ccc5a7#t=$2")}); break;
				case 'my': P = cVl('iframe', {'src': uri.replace(GenrX('M@il.ru'), "//videoapi.my.mail.ru/videos/embed/mail/$1/$2")}); break;
				case 'VK': P = cVl('iframe', {'src': uri.replace(GenrX('VK.com'), "//vk.com/video_ext.php?oid=$1&id=$2&$3$4$5")}); break;
				case 'Pbin': P = cVl('iframe', {'src': uri.replace(GenrX('Pastebin'), "//pastebin.com/embed_iframe.php?i=$1")}); break;
				case 'Pleer': P = cVl('embed', {'src': uri.replace(GenrX('Pleer.com'), "//embed.pleer.com/track?id=$1"), 'class': 'prosto-pleer', 'width': '440', 'height': '40'});
					Mbed['Container'].className = 'pleer-container';
					break;
				default:
					var tag = 'iframe';
					switch (embc) {
						case 'html5': tag = 'video'; break;
						case 'flash': tag = 'embed'; break;
						case 'iframe':tag = 'iframe';break;
						default: uri = embc;
					}
					P = cVl(tag, {'src': uri});
			}
			Mbed['Frame'] = P;
			if (!element)
				Mbed['Container'].appendChild(Mbed['Frame']);
			else if (element.tagName != Mbed['Frame'].tagName)
				Mbed['Container'].replaceChild(Mbed['Frame'], element);
			return Mbed['Container'];
		}
		function matchPlayer(uri, embc) {
			var m, reg, result;
			switch (embc) {
				case 'YT': m = GenrX('YouTube').exec(uri); result = m && (m[1] || m[2] || m[3] || m[4] || m[5] || m[6]); break;
				case 'VK': m = GenrX('VK.com').exec(uri);  result = m &&  m[1] && m[2] && m[3]; break;
				case 'my': m = GenrX('M@il.ru').exec(uri); result = m &&  m[1] && m[2]; break;
				default: 
					switch (embc) {
						case 'Cb'   : reg = GenrX('Coub');     break;
						case 'RT'   : reg = GenrX('RuTube');   break;
						case 'Vm'   : reg = GenrX('Vimeo');    break;
						case 'Pbin' : reg = GenrX('Pastebin'); break;
						case 'Pleer': reg = GenrX('Pleer.com');break;
						case 'flash':
						case 'html5':
						case 'iframe':reg = /(.+)/; break;
						default     : reg = GenrX('('+embc+')');
					}
					m = reg.exec(uri)
					result = m && m[1];
			}
			return result;
		}
		function GenrX($) {
			var rX;
			switch ($.toLowerCase()) {
				case 'youtube'  : rX = /(?:https?:)?\/\/(?:www\.)?youtu(?:be\.com\/(?:watch|playlist)\?.*?(?:v=([\w_-]*)|(list=[\w_-]*))(?:.*?v=([\w_-]*)|.*?(list=[\w_-]*)+)?|(?:\.be|be.com\/embed)\/([\w_-]*)(?:.*?(list=[\w_-]*))?)(?:.*?t=([\w_-]*))?/; break;
				case 'pleer.com': rX = /(?:https?:)?\/\/(?:www\.)?pleer\.com\/tracks\/([\w_-]*)/; break;
				case 'vimeo'    : rX = /(?:https?:)?\/\/(?:www\.)?vimeo\.com\/(?:.*?\/)?(\d+)(?:.*?t=(\d+))?/; break;
				case 'coub'     : rX = /(?:https?:)?\/\/(?:www\.)?coub\.com\/view\/([\w_-]*)/; break;
				case 'rutube'   : rX = /(?:https?:)?\/\/(?:www\.)?rutube\.ru\/video\/([\w_-]*)\/?/; break;
				case 'm@il.ru'  : rX = /(?:https?:)?\/\/(?:www\.)?(?:my\.)?mail\.ru\/mail\/([\w_-]*)\/video\/([\w_-]*\/\d+\.html)/; break;
				case 'vk.com'   : rX = /(?:https?:)?\/\/(?:www\.)?vk\.com\/video(?:_ext\.php\?oid=)?(-?\d+)(?:&id=|_)(\d+).?(hash=[\w_-]*)?(.*?hd=-?\d+)?(.*?t=[\w_-]*)?/; break;
				case 'pastebin' : rX = /(?:https?:)?\/\/(?:www\.)?pastebin\.com\/([\w_-]*)/; break;
				default: rX = new RegExp($, '')
			}
			return rX;
		}
	}
	function loadMediaContainer(media) {
		var embc, cont, last,
			href = escapeUrl(media['URL']),
			hash = href.hashCode(),
			th = HM.LinksMap[hash], Id = th.Type +'_'+ hash,
			wTYPES = ['pdf', 'docs'].isThere(th.Type) && th.Embed != 'Pbin',
			pcont = media['NODE'] ? _z.route(media['NODE'], jumpCont) : null;
		if (!pcont || wTYPES || HM.EmbedField == 0) {
			last = mEl['ContentWindow'].lastElementChild;
			if (last.id != 'content_'+ hash) {
				embc = th.Embed.allReplace({'(visual=)true': '1$false', 'notracklist%3Dtrue': 'notracklist%3Dfalse', 
					'twittercard%3Dtrue': 'artwork%3Dsmall%2Ftransparent%3Dtrue'})
				cont = _z.setup(Megia[th.Type].makePlayer(href, embc), {'class': 'content-frame '+ th.Type, 'id': 'content_'+ hash}, null);
				_z.setup(Megia[th.Type]['Frame'], {'width': '100%', 'height': '100%'}, null);
				if (last.classList[0] === 'content-frame') {
					mEl['ContentWindow'].replaceChild(cont, last);
					_hide(mEl['ContentMarker']);
				} else
					mEl['ContentWindow'].appendChild(cont)
			} else {
				cont = last;
				_hide(mEl['ContentMarker']);
			}
			_show(mEl['ContentWindow']);
		} else {
			if (th.Embed === 'Pbin') {
				if (!Megia[hash])
					Megia[hash] = new MagicEmbeds(true)
				if (media['NODE'].previousElementSibling.id === Id) {
					Megia[hash]['Container'].remove();
				} else {
					cont = _z.setup(Megia[hash].makePlayer(href, th.Embed), {'class': th.Type +'-container', 'id': Id}, null);
					_z.setup(Megia[hash]['Frame'], {'class': 'full-size'}, null);
					_z.before(media['NODE'], cont)
				}
			} else {
				if (pcont.querySelector('#'+ Id)) {
					Megia[th.Type]['Container'].remove();
				} else {
					cont = _z.setup(Megia[th.Type].makePlayer(href, th.Embed), {'class': th.Type +'-container', 'id': Id});
					_z.setup(Megia[th.Type]['Frame'], {'width': AspectSize[th.Type == 'scbc' ? 'H' : 'W'][HM.AspectRatio], 'height': AspectSize.H[HM.AspectRatio]});
					pcont.appendChild(cont);
				}
			}
		}
		if (pcont && th.Type === 'video')
			HM.VActive = [pcont, cont];
	}
	function jumpCont(el) {
		var pb = el.querySelector('.postbody');
		if (pb) {
			var prev = pb.previousElementSibling,
				node = prev.style['clear'] === 'both' ? prev : pb;
			if (node.previousElementSibling.className != 'postcontent')
				node.insertAdjacentHTML('beforebegin', '<span class="postcontent"></span>');
			return node.previousElementSibling;
		} else return false;
	}
	
	function handleLinks(node, map) {
		_z.each((node || document).querySelectorAll(
		'.message a[href^="http"]:not(#cm-link), .message a[href^="/"]:not(.reply-link), .abbrev a[href*="/deleted/"], .abbrev a[href^="/utils/"]'
		),  function(link, i) {
				switch (true) {
					case link.host.isThere("dobrochan"):
						if (link.href.isThere("/res/") && map) {
							var targ = ParseUrl(link.href);
							if (targ != null && targ.thread) {
								var pid = targ.pid || targ.thread,
									reply_id = targ.board +'-'+ pid,
									diffb = (targ.board !== map.board) || (map.board !== HM.URL.board),
									dataArr = [map.board, map.thread, map.pid, (diffb ? targ.board : '')];
								_z.replace(link, _z.setup('a', {'class': 'reply-link', 'href': '/'+ targ.board +'/res/'+ targ.thread +'.xhtml#i'+ pid,
									'id': 'rl-'+ targ.board +'-'+ targ.thread +'-'+ pid, 'text': '>>'+ (diffb ? targ.board +'/' : '') + pid}));
								if (!RepliesLinks[reply_id])
									RepliesLinks[reply_id] = new Array(0);
								if (!JSON.stringify(RepliesLinks[reply_id]).isThere(JSON.stringify(dataArr)))
									RepliesLinks[reply_id].push(dataArr);
							}
						} else if (link.href.isThere("/deleted/") || link.href.isThere("/utils/")) {
							HM.LinksMap[link.href.hashCode()] = {Embed: 'iframe', Type: 'pdf'};
							link.className = 'cm-button'
						}
						break;
					case (link.href === 'https://mega.nz/#'):
						_z.setup(link, {'href': 'https://mega.nz/#'+ link.nextSibling.textContent, 'text': 'Mega: '+ link.nextSibling.textContent});
						link.nextSibling.remove();
						break;
					case (HM.oEmbedAPI):
						var _Attrs = {'id': 'cm-link', 'rel': 'nofollow'},
							href = escapeUrl(link.href),
							hash = link.href.hashCode();
						if (HM.LinksMap[hash]) {
							_Attrs['text'] = HM.LinksMap[hash]['Name']; _Attrs['title'] = HM.LinksMap[hash]['Title'];
							if (HM.LinksMap[hash]['Embed'] || HM.LinksMap[hash]['Type']) {
								if (!isNaN(HM.LinksMap[hash]['Embed'])) {
									_Attrs = {'target': '_blank', 'title': LC.broken_link[lng] +'「'+ HM.LinksMap[hash]['Embed'] +'」'}
								} else {
									_Attrs['class'] = 'cm-button';
									if (!HM.LinksMap[hash]['Name']) {
										_Attrs['text'] = capitaliseFirstLetter(HM.LinksMap[hash]['Type']) +': '+ getPageName(href);
									}
									switch (HM.LinksMap[hash]['Type']) {
										case 'image':
											var inf = HM.LinksMap[hash]['Title'].split(', ');
												_Attrs['image-size'] = inf[1];
												_Attrs['class'] = 'iview btn-link';
											break;
										case 'audio':
											var inf = HM.LinksMap[hash]['Title'].split(', '),
												alt = inf[2].split(' — ');
												_Attrs['id'] = 'ma-play';
												_Attrs['class'] = 'ma-button btn-link';
											Megia.audio.addTrack({
												frontend: link.previousElementSibling,
												duration: inf[1],
												artist: alt[0],
												album: 'Unknown',
												title: alt[1],
												url: href,
												button: link
											});
									}
								}
							}
							_z.setup(link, _Attrs);
						} else {
							var type = 'video', endp = 'http://open.iframe.ly/api/oembed?url=', embc = '', prov = '',
								EXT = href.fext(), file_type = Files.matchType(EXT), Macont = new MagicEmbeds();
								function _attachFile(e) {
									var name = getPageName(href);
										_Attrs['text'] = capitaliseFirstLetter(file_type) +': '+ name;
										HM.LinksMap[hash] = UrlCache[hash] = {Type: file_type};
									switch (file_type) {
										case 'image':
											_Attrs['image-size'] = this.naturalWidth +'×'+ this.naturalHeight;
											_Attrs['title'] = HM.LinksMap[hash]['Title'] = UrlCache[hash]['Title'] = capitaliseFirstLetter(EXT)+', '+ _Attrs['image-size'];
											_Attrs['class'] = 'iview btn-link';
											break;
										case 'audio':
											name = name.replace('.'+EXT, '').replace(/\_/g, ' ').replace(/^\d*(?:\s-|\.)?\s/, '').split(' - ');
											var dur = timerCalc(this.duration, true),
												art = name[1] ? name[0] : 'Unknown',
												ttl = name[1] ? name[1] : name[0];
												_Attrs['id'] = 'ma-play';
												_Attrs['class'] = 'ma-button btn-link';
												_Attrs['title'] = HM.LinksMap[hash]['Title'] = UrlCache[hash]['Title'] = EXT.toUpperCase() +', '+ dur +', '+ art +' — '+ ttl;
											Megia.audio.addTrack({
												frontend: link.previousElementSibling,
												duration: dur,
												artist: art,
												album: 'Unknown',
												title: ttl,
												url: href,
												button: link
											});
											break;
										case 'video':
											HM.LinksMap[hash]['Embed'] = UrlCache[hash]['Embed'] = 'html5';
											_Attrs['class'] = 'cm-button';
									}
									_z.setup(link, _Attrs);
									_z.sessionS.set('LinksCache', JSON.stringify(UrlCache));
								}
								function _oEmbedMedia(e, embed) {
									getDataResponse((endp || 'http://api.embed.ly/1/oembed?key='+ HM.APIKey +'&url=') + encodeURIComponent(href) +'&format=json&origin=anonymous',
									function(status, sText, data, xhr) {
										if (status !== 200 || !data) {
											_Attrs = {'target': '_blank'}
											if (status > 399 && status < 500) {
												_Attrs['title'] = LC.broken_link[lng] +'「'+ status +'」';
												HM.LinksMap[hash] = UrlCache[hash] = {Embed: status};
											}
										} else {
											var harr = link.host.split('.'), dm = harr[harr.length - 1], host = harr[harr.length - 2], ws = harr[harr.length - 3],
												p_name = (prov || data.provider_name || (ws && ws !== 'www' ? capitaliseFirstLetter(ws) +' ' : '') + capitaliseFirstLetter(host)),
												rw = new RegExp('(?:\\s-\\s)?(?:'+ (data.provider_name || host) +'|Википедия)(\\.'+ dm +')?(?:\\:\\s|\\s-\\s)?', 'i'),
												name = (data.title || getPageName(href).replace(link.host, '')).replace(rw, '');
												HM.LinksMap[hash] = UrlCache[hash] = {};
												HM.LinksMap[hash]['Name'] = UrlCache[hash]['Name'] = _Attrs['text'] = p_name + (name ? ': '+ name : '');
											if (data.description || data.author)
												HM.LinksMap[hash]['Title'] = UrlCache[hash]['Title'] = _Attrs['title'] = (data.description || data.author);
											if (embed || data.html && data.type != 'link') {
												switch (p_name.toLowerCase()) {
													case 'bandcamp':
														type = 'scbc';
														break;
													case 'google docs':
														type = 'docs';
												}
												if (!embed && data.html)
													embed = _stub('iframe', data.html).src;
												_Attrs['class'] = 'cm-button'; 
												HM.LinksMap[hash]['Embed'] = UrlCache[hash]['Embed'] = embed;
												HM.LinksMap[hash]['Type'] = UrlCache[hash]['Type'] = type;
											}
										}
										_z.setup(link, _Attrs);
										_z.sessionS.set('LinksCache', JSON.stringify(UrlCache));
									});
								}
							switch (true) {
								case (!!file_type):
									_z.setup((file_type === 'image' ? 'img' : file_type), {'src': href}, {
										'load': _attachFile, 'loadedmetadata': _attachFile, 'error': _oEmbedMedia});
									return;
								case (link.host === 'pleer.com'):
									if (Macont.matchPlayer(href, 'Pleer')) {
										var pleer = Macont.makePlayer(href, 'Pleer')
										_z.after(link, pleer);
										pleer.appendChild(_z.setup(link, {'text': ''}))
										return;
									}
									break;
								case link.host.isThere("youtu"):
									prov = 'YouTube'; embc = 'YT'; endp = '';
									break;
								case link.host.isThere("soundcloud"):
									prov = 'SoundCloud'; type = 'scbc'; endp = 'https://soundcloud.com/oembed?url=';
									break;
								case link.host.isThere("vimeo"):
									prov = 'Vimeo'; embc = 'Vm'; endp = 'https://vimeo.com/api/oembed.json?url=';
									break;
								case link.host.isThere("coub"):
									prov = 'Coub'; embc = 'Cb';
									break;
								case link.host.isThere("rutube"):
									prov = 'RuTube'; embc = 'RT';
									break;
								case link.host.isThere("pastebin"):
									prov = 'Pastebin'; embc = 'Pbin'; type = 'docs';
									break;
								case (href.isThere("mail.ru/") &&  href.isThere("/video/")):
									prov = 'M@il.RU Видео'; embc = 'my';
									break;
								case link.host.isThere("video.yandex.ru"):
									prov = 'Яндекс.Видео'; endp = '//video.yandex.ru/oembed.json?url=';
									break;
								case link.host.isThere("vk.com"):
									if (href.isThere("hash"))
										embc = 'VK';
									if (href.isThere("video"))
										prov = 'VK Видео';
									if (href.isThere("ext.php"))
										href = href.replace(Macont.RegEx('VK.com'), 'https://vk.com/video$1_$2?$3$4$5');
									break;
								case (href.isThere("/iframe/") || href.isThere("/embed/")):
									embc = 'iframe'; endp = '';
				 					if (!href.isThere("/html/"))
				 						href = href.replace('embed/', '');
									break;
								default: endp = '';
							}
							_oEmbedMedia(null, (embc && Macont.matchPlayer(href, embc) ? embc : false));
						}
				}
		});
	}
	function handleElements(node, map) {
		_z.each((node || document).querySelectorAll(
			'.postername:not(.t-sec), .postertrip:not(.t-sec), .reply_, .file .thumb:not([alt="illegal"]), .abbrev'
		), function(el) {
			switch (el.classList[0]) {
				case 'postername':
					if (lng !== 1)
						el.textContent = Names.get('', el.textContent);
				case 'postertrip':
					var date = el.parentNode.lastChild;
					if (date.className !== 'posterdate') {
						date.previousElementSibling.insertAdjacentHTML('afterend', getDateTime(date.textContent));
						date.remove();
					}
					break;
				case 'abbrev':
					var trunc = el.querySelector('a[onclick^="Truncate"]'),
						repls = el.querySelector('.replylinks');
					if (trunc)
						trunc.parentNode.remove();
					if (!repls) {
						repls = _z.setup('div', {'id': 'rln_'+ map.board +'-'+ map.pid, 'class': 'replylinks', 'html': '<span class="rl-inf">'+  LC.repl[lng] + LC.few['u-c'][lng] +':&nbsp;\n</span>'})
						RepliesLinks['ReplyNodes'].push(repls);
						el.appendChild(repls);
					}
					_z.setup(el.querySelector('a[onclick^="ExpandThread"]'), {'class': 'excat-button', 'id': 'thread-expand', 'onclick': undefined});
					_z.setup(el.querySelector('a[onclick^="GetFullText"]'), {'class': 'Get-Full-Text', 'onclick': undefined});
					break;
				case 'reply_':
					_z.replace(el, _z.setup('span', {'class': 'reply-button line-sect txt-btn', 'title': LC.repl[lng]}))
					break;
				case 'thumb':
					var params = {'class': 'mview thumb', 'onclick': undefined},
						fileinfo = _z.route(el, '.fileinfo'),
						clickFn = el.getAttribute('onclick'),
						em = fileinfo.querySelector('em'),
						dl = fileinfo.querySelector('a'),
						name = getPageName(dl.href),
						hash = dl.href.hashCode(),
						fext = dl.href.fext(),
						a = el.parentNode.tagName !== 'A' ? (function(){
							var nA = _z.setup('a', {'href': dl.href, 'target': "_blank"});
							el.parentNode.appendChild(nA); nA.appendChild(el);
							return nA;
						})() : el.parentNode,
						file_id = a.parentNode.id.split('_');
					switch (Files.matchType(fext)) {
						case 'video':
							HM.LinksMap[hash] = {Embed: Files.video.indexOf(fext) > 4 ? 'flash' : 'html5', Type: 'video'};
							if (el.getAttribute('src') === '/thumb/generic/sound.png') {
								em.className = 'magic-info';
								makeMagicPlayer('movie', null, a, el)
							} else
								params['contextmenu'] = 'image-context';
							break;
						case 'image':
							params = {'id': 'thmb_'+ hash, 'class': 'iview thumb', 'image-size': em.textContent.match(/\d+×\d+/)[0],
								'lowsrc': el.getAttribute('src'), 'contextmenu': 'image-context', 'onclick': undefined};
							break;
						case 'audio':
							var time = em.textContent.match(/\d+\:\d+/),
								meta = (/kHz[\s\n]*((.*)[\s\n]*\s—[\s\n]*(.*))[\s\n]*\s\/[\s\n]*(.*)[\s\n]*\s\[/).exec(em.textContent);
								em.className = 'magic-info';
								fileinfo.lastChild.remove();
							Megia.audio.addTrack({
								frontend: makeMagicPlayer('artwork', 'album_'+ meta[1].hashCode(), a, el),
								duration: time[0],
								artist: meta[2],
								album: meta[3],
								title: (meta[4] === 'Unknown' ? name.replace('.'+fext, '').replace(/---/g, ' — ').replace(/-/g, ' ') : meta[4]),
								url: dl.href,
								id: file_id[2] +'@'+ hash,
								button: a
							});
							break;
						case 'pdf':
							HM.LinksMap[hash] = {Embed: 'iframe', Type: 'pdf'};
							break;
						case 'arch':
							el.src = '/src/png/1405/archive-icon.png';
						default:
							if (clickFn && clickFn.isThere('open_url')) {
								var emb = (/open_url\('([^']+)/).exec(clickFn)[1];
								HM.LinksMap[hash] = {Embed: emb, Type: emb.isThere('text') ? 'docs' : 'pdf'};
							} else {
								HM.LinksMap[hash] = {Embed: dl.href, Type: 'docs'};
							}
					}
					_z.setup(dl, {'class': 'download-link', 'download': name, 'title': name});
					_z.setup(el, params);
			}
			function makeMagicPlayer(clss, id, a, el) {
				var magicPlayer = _z.setup('div', {'id': id, 'class': 'magic-media thumb '+ clss, 'html': '<div class="ma-controls"></div>'});
				_z.after(a, magicPlayer); _z.append(magicPlayer.firstElementChild,
					_z.setup(a, {'id': 'ma-play', 'class': (clss === 'movie' ? 'cm' : 'ma') +'-button'})
				); el.remove();
				return magicPlayer;
			}
		});
	}
	function handlePost(post, last_n) {
		try {
			var reflink = _z.setup(post.querySelector('.reflink > a[href*="/res/"]'), {'onclick': undefined}),
				url = ParseUrl(reflink.href), userMenu, modMenu, op = url.pid === url.thread ? 0 : 1,
				patchId = url.board +'_'+ url.thread +'_'+ url.pid,
				delbox = post.getElementsByClassName('delete_checkbox')[0],
				userpan = post.querySelector('label[onmousedown^="get_userpan"]');
			
			HM.LoadedPosts[patchId]              = post.stored ? post : _z.setup(post,   {'patch-id': patchId}, {'click': PDownListener, 'mouseover': Chanabira.MagicPostView});
			HM.LoadedPosts[patchId].delete_input = _z.setup(delbox, {'checked': false   });
			HM.LoadedPosts[patchId].formBinding  = function(el) { _z.after(this, el) };
			HM.LoadedPosts[patchId].body         = post.querySelector('#reply'+ url.pid) || post;
			if (delbox) {
				userMenu = _z.setup('ul', {'class': 'dropdown line-sect', 'html':
					'<li class="dropdown-toggle">'+
						'<label class="dropdown-label el-li postermenu"></label>'+
						'<ul class="dropdown-menu">'+
							'<li class="dropdown-item el-li" id="usermenu_edit">Редактировать</li>'+
							'<li class="dropdown-item el-li" id="usermenu_report">Пожаловаться</li>'+
							'<li class="dropdown-item el-li" id="usermenu_hide">Скрыть</li>'+
							'<li class="dropdown-item el-li" id="usermenu_delete">Удалить<span class="dropdown-input li-in" id="chkx-del_selected"></span></li>'+
						'</ul>'+
					'</li>'});
				_z.replace(delbox.parentNode, userMenu);
				mEl['DeleteOverlay'].appendChild(delbox);
			}
			if (userpan) {
				var uids = (/(\d+),\s(\d+),\s\'([\d\w]+)\',\s(\w+),\s(\w+)/).exec(userpan.getAttribute('onmousedown')) || [];
				modMenu  = _z.setup('ul', {'class': 'dropdown line-sect', 'html':
					'<li class="dropdown-toggle">'+
						'<label class="dropdown-label el-li modermenu">M</label>'+
						'<ul class="dropdown-menu" id="modmenu-'+ uids[1] +'">'+
							'<li class="dropdown-item el-li" id="modmenu_open" admin_req="/admin/post/'+ uids[1] +'/edit.xhtml">Редактировать</li>'+
							'<li class="dropdown-item el-li" id="modmenu_xreq_upd" admin_req="/show.json">Раскрыть<span class="dropdown-input li-in cyan-light inactive" id="str-bump_inactive">+ бамп</span></li>'+
							'<li class="dropdown-item el-li" id="modmenu_xreq_upd" admin_req="/hide.json">Скрыть</li>'+
							'<div class="dropdown-br">Удалить</div>'+
							'<li class="dropdown-item el-li" id="modmenu_xreq_reset" admin_req="/delete-images">Изображения</li>'+
							'<li class="dropdown-item el-li" id="modmenu_xreq_reset" admin_req="/reset-name">Имя</li>'+
							'<div class="dropdown-br">Информация о</div>'+
							'<li class="dropdown-item el-li" id="modmenu_open" admin_req="/admin/session/'+ uids[3] +'">Cессии</li>'+
							'<li class="dropdown-item el-li" id="modmenu_open" admin_req="/admin/thread/'+ uids[2] +'.xhtml">Треде</li>'+
							'<li class="dropdown-item el-li" id="modmenu_open" admin_req="/admin/post/'+ uids[1] +'.xhtml">Посте</li>'+
						'</ul>'+
					'</li>'});
				_z[userMenu ? 'after' : 'prepend']((userMenu || userpan), modMenu);
				_z.setup(userpan, {'onmousedown': undefined});
			}
			handleLinks(post, url);
			handleElements(post, url);
			Disepath.eval(op, HM.Keywords[op], post);
			if (last_n)
				RepliesLinks.generate();
		} catch(e) {
			console.error(e)
		}
	}
	
	/*** Base64Binary ***/
	//* @ original code 	https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js
	//* @ copyright 		Daniel Guerrero
	Base64Binary = {
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		/* will return a Uint8Array type */
		decodeArrayBuffer: function(input) {
			var bytes = (input.length / 4) * 3;
			var ab = new ArrayBuffer(bytes);
			this.decode(input, ab);
			return ab;
		},
		decode: function(input, arrayBuffer) {
			//get last chars to see if are valid
			var lkey1 = this._keyStr.indexOf(input.charAt(input.length - 1));
			var lkey2 = this._keyStr.indexOf(input.charAt(input.length - 2));
			var bytes = (input.length / 4) * 3;
			if (lkey1 == 64) bytes--; //padding chars, so skip
			if (lkey2 == 64) bytes--; //padding chars, so skip
			var uarray;
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			var j = 0;
			if (arrayBuffer)
				uarray = new Uint8Array(arrayBuffer);
			else
				uarray = new Uint8Array(bytes);
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			for (i = 0; i < bytes; i += 3) {
				//get the 3 octects in 4 ascii chars
				enc1 = this._keyStr.indexOf(input.charAt(j++));
				enc2 = this._keyStr.indexOf(input.charAt(j++));
				enc3 = this._keyStr.indexOf(input.charAt(j++));
				enc4 = this._keyStr.indexOf(input.charAt(j++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				uarray[i] = chr1;
				if (enc3 != 64) uarray[i + 1] = chr2;
				if (enc4 != 64) uarray[i + 2] = chr3;
			}
			return uarray;
		}
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
		var Yu = this, fileList = [], stbFn = function(){},
			Yum = {brd: HM.URL.board, tid: (HM.URL.thread || 0), afterSubmitAction:stbFn, bound:stbFn},
			LCY = {
				acap: ["Attach Captcha Image", 'Прикрепить капчу'],
				subj: ["Subject", "Тема"],
				newt: ["New Thread in", "Новый тред в"],
				post: ["Post", "Отправить"],
				txar: ["Message Text", "Текст сообщения"],
				ufrm: ['Unhide form', 'Раскрыть форму'],
				hfrm: ['Hide form', 'Скрыть форму'],
				rmv: ["Remove", "Убирать"],
				fnm: ["File Name", "имя файла"],
				send: ['Sending', 'Отправка'],
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
				} },
			YuPlayer = {
				current: null,
				playlist: [],
				set: function(action, audioObj) {
					if (this.current)
						this.current['pause']();
					this.current = audioObj;
					this.current[action]();
				},
				playnext: function(audioObj) {
					var plix = this.playlist.indexOf(audioObj);
					if (this.playlist[plix +1]) {
						this.set('play', this.playlist[plix +1]);
					} else {
						this.current = null;
					}
				}
			},
		replyform_tamplate = '<input id="yuki-targetThread" name="thread_id" value="" type="hidden"><input name="task" value="post" type="hidden"><input name="goto" value="thread" type="hidden">'+
			'<div id="yuki-errorMsg"></div><div id="yuki-targetInfo" style="margin:1px 5px;" class="font-s">'+ LC.repl[lng] +' '+ LC.to[lng] +'\n<span class="replytitle"></span>\n№.<span></span></div>'+
			'<table><tbody id="yuki-dropBox" class="line-sect"><tr class="etch-text"></tr><tr class="droparrow inactive"></tr></tbody><tbody class="line-sect">'+
			'<tr id="trname"><td><input id="yuki-poster-name" placeholder="" name="name" size="30" value="" type="text">'+
				'<label class="sagearrow line-sect txt-btn inactive" style="right:24px;"><input id="yuki-sage" name="sage" type="checkbox" hidden></label>'+
				'<label id="yuki-newThread-create" class="yuki_clickable inactive">'+ LCY.newt[lng] +'<span class="t-sec">\n/'+ Yum.brd +
				'/</span></label><span class="txt-btn yuki_clickable" id="yuki-close-form" title="'+ LC.remv[lng] +'">✕</span></td></tr>'+
			'<tr id="trsubject"><td><input placeholder="'+ LCY.subj[lng] +'" name="subject" size="30" maxlength="64" value="" type="text">'+
				'<label class="submit-button">\n<span>'+ LCY.send[lng] +'</span>\n<input id="yuki-submit-button" type="submit" value="'+ LCY.post[lng] +'"></label>\n'+
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
			'<tr id="trfile"><td id="files_parent"><div id="file_1_div" class="line-sect"><span class="yukiFileAdds"><label class="button"><input id="dumb_file_field" type="file" hidden multiple>'+
			LC.add[lng] +' '+ (lng ? LC.file[lng].toLowerCase() : LC.file[lng]) + LC.few['u-c'][lng] +'</label><span id="yuki-add-files-by-url" class="button">'+
			LCY.via[lng] +' URL</span></label>\n<span class="yukiFileSets"><label><input id="yuki-RemoveExif" type="checkbox" '+ (HM.RemoveExif ? 'checked ' : '') +'hidden><span class="checkarea"></span>\n'+
			LCY.rmv[lng] +' Exif</label>\n<label><input id="yuki-RemoveFileName" type="checkbox" '+ (HM.RemoveFileName ? 'checked ' : '') +'hidden><span class="checkarea"></span>\n'+ LCY.rmv[lng] +' '+ LCY.fnm[lng] +
			'</label></span></div><div id="conn-push" class="dpop"></div></td></tr></tbody></table><div id="yuki-files-placeholder"></div>',
		WarningMsg = _z.setup('strong', {'id': 'warning-massage', 'class': 'blink'});
		WarningMsg.dozZe = function(e) {
			if (this.iterations >= 4) {
				this.remove();
				this.iterations = 0;
			}
		}
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
					case 'yuki-add-files-by-url':
						var input = prompt('http://exemple.com/image.jpg http://exemple.org/music.mp3 https://exemple.ru/archive.rar\n\n'+ LCY.paste_lnk[lng] +':');
						_z.each(input.split(' '), function(uri) {
							getUrlData('Blob', uri, yAdd);
						});
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
		}, 'mousedown': function(e) {
			var FP = ['popup', 'report'].isThere(this.classList[0])
			switch (true) {
				case (e.target.id === 'conn-push'):
					var startCX = e.clientX;
					var startCY = e.clientY;
					if (!FP) {
						this.className = 'popup line-sect';
						this.style['left'] = (this.offsetLeft - 5) +'px'
						this.style['top']  = (e.clientY - this.clientHeight + 20) +'px'
					} else if (!e.target.clks) {
						e.target.clks = 0;
					}
					e.target.onmouseup = function(e) {
						var Xf = e.clientX - startCX;
						var Yf = e.clientY - startCY;
						if (!FP && ((Xf < 0 ? Xf * -1 : Xf) >= 100 || (Yf < 0 ? Yf * -1 : Yf) >= 50)) {
							this.clks = 0;
							changeForms(Yu['ReplyForm'], 'report');
							setupOptions(this, 'FormStyle', 'local', 0);
						} else {
							switch(true) {
								case (this.clks >= 1 && Xf == 0 && Yf == 0):
									Yum.bound(Yu['ReplyForm']);
								case (!FP):
									_z.setup(Yu['ReplyForm'], {'class': 'reply line-sect', 'style': ''});
									setupOptions(this, 'FormStyle', 'local', 1);
									this.clks = 0;
									break;
								case (Xf == 0 && Yf == 0):
									this.clks++;
									break;
								default:
									this.clks = 0;
							}
						}
					}
				case (FP):
					stepZup.bind(this)(e);
					if (!['INPUT', 'SELECT', 'TEXTAREA', 'IMG'].isThere(e.target.tagName)) {
						var coords = getCoords(this);
						HM.DragableObj = {
							el: this,
							shift: [e.pageX - coords.left, e.pageY - coords.top],
							layout: 'client'
						}
						_z.fall(e);
					}
			}
		}, 'change': function(e) {
				switch (e.target.id) {
					case 'dumb_file_field':
						yukiAddFile(e.target);
						break;
					case 'yuki-RemoveExif':
					case 'yuki-RemoveFileName':
						setupOptions(e.target, e.target.id.split('-')[1], 'local');
						break;
					case 'yuki-sage':
						e.target.parentNode.classList.toggle('inactive');
						break;
				}
			}
		});
		this['TargetThread'] = el$('#yuki-targetThread');
		this['TargetInfo'] = el$('#yuki-targetInfo .replytitle');
		this['ErrorMassage'] = el$('#yuki-errorMsg');
		this['NewThreadCreate'] = el$('#yuki-newThread-create');
		this['CaptchaImage'] = el$('#yuki-captcha-image');
		this['Submit'] = el$('#yuki-submit-button');
		this['PosterName'] = el$('#yuki-poster-name');
		this['FilesPlaceholder'] = el$('#yuki-files-placeholder');
		this['ReplyText'] = _z.setup(el$('#yuki-replyText'), {
			'value': stored ? JSON.parse(_z.sessionS.get('SafeText', JSON.stringify(el$('#yuki-replyText').value))) : ''
		}, {'keyup': function(e) {
			var height = extractStringNumbers(this.style['height'])[0],
				flexh = Math.floor(window.innerHeight / 3 * 2);
			if (height + 26 < this.scrollHeight)
				this.style['height'] = (this.scrollHeight > flexh ? flexh : this.scrollHeight) +'px';
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
			'dragover': function(e) {
				var items = e.dataTransfer.mozItemCount || '';
				if (this.classList[0] != 'thumb') {
					this.firstElementChild.textContent = LC.add[lng] +' '+ items +' '+ LC.file[lng].toLowerCase() +
						(items == 1 ? '' : !items ? LC.few['u-c'][lng] : items < 5 ? LC.few['u-a'][lng] : LC.few['u-b'][lng]);
					this.classList.add('thumb');
				}
				_z.fall(e);
			}, 'dragleave': function(e) {
				this.firstElementChild.textContent = '';
				this.classList.remove('thumb');
			}, 'drop': function(e) {
				if (e.dataTransfer.mozSourceNode && e.dataTransfer.mozSourceNode.id === 'yuki-captcha-image') {
					yukiAttachCapcha(e.dataTransfer.mozSourceNode);
				} else {
					yukiAddFile(e.dataTransfer);
				}
				this.firstElementChild.textContent = '';
				this.classList.remove('thumb');
				_z.fall(e);
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
				var pixel = ctx.getImageData(iw - 1, 13, 1, 1),
					data = pixel.data;
					if (data[0] + data[1] + data[2] !== 765) {
						canvas.width = iw + 2;
						ctx.drawImage(captchaImg, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
						break;
					}
				iw--;
			}
			for (var i = 0, dataURL = canvas.toDataURL('image/png'); i < fileList.length; i++) {
				if (fileList[i].dataURL === dataURL)
					return;
			}
			new YukiFile('image', {
				blob: dataURLtoBlob(dataURL, 'image/png'),
				original_name: 'talking_captcha.png',
				dataURL: dataURL
			})
		}
		function checkfilesLimit() {
			var limit, mu = (Yum.brd === 'mu');
			if (fileList.length >= (mu ? 10 : 5)) {
				_z.prepend(Yu['FilesPlaceholder'],
					_z.setup(WarningMsg, {'text': LCY[(mu ? 'ten' : 'fiv')][lng] + LCY.f_limit[lng], 'style':'display:block;text-align:center;'}));
				limit = true;
			}
			return limit;
		}
		
		function YukiFile(Type, fileObj) {
			try {
				for (var key in fileObj) {
					this[key] = fileObj[key];
				}
				if (!fileObj['upload_name'])
					this['upload_name'] = fileObj['original_name'];
				
				var YF = this, Id = makeRandId(6), Class = (Type == 'audio' ? 'artwork' : Type == 'video' ? 'movie' : 'default'),
					f_size = bytesMagnitude(this.blob.size), f_ext = this.upload_name.fext(), Media = (Type == 'audio' || Type == 'video'),
					yf_remove = '[\n<a id="yf-remove" class="yuki_clickable">'+ LCY['rmv'][lng].toLowerCase() +'</a>\n]',
					rating_sel = '<span class="br-word line-sect"><label id="yf-rate" class="sfw"></label><ul class="rating-select"><li class="rating-option sfw" id="yfr_SFW"></li><li id="yfr_R-15" class="rating-option r15"></li><li class="rating-option r18" id="yfr_R-18"></li><li class="rating-option r18g" id="yfr_R-18G"></li></ul></span>';
					
				this['frontend'] = _z.setup('div', {'id': 'yuki-file-'+ Id, 'class': 'yukiFile '+ Class, 'html': (Media ? '<div class="magic-info"><div>'+
					yf_remove +'</div><span id="yf-ext" class="br-word virguled">'+ f_ext.toUpperCase() +'</span><span id="yf-size" class="br-word virguled">'+
					f_size +'</span><span id="yf-info" class="br-word"></span>'+ rating_sel +'\n<div id="yf-name" class="br-word">'+
					this.upload_name +'</div></div><div class="magic-media"><div class="ma-controls"><a id="yf-play"></a></div></div>' : '<div class="br-word">'+
					yf_remove +'</div><img id="yf-preview" class="yf_preview" src="'+ (this.dataURL || '#transparent') +'"><div id="yf-name" class="br-word">'+
					this.upload_name +'</div><span id="yf-size" class="br-word virguled">'+ f_size +'</span><span id="yf-info" class="br-word"></span>' + rating_sel)
				}, {'click': function(e) {
						switch (e.target.id) {
							case 'yf-pause':
							case 'yf-play':
								switch (Type) {
									case 'video':
										loadMediaContainer({
											'URL': e.target.href
										});
										break;
									case 'audio':
										var A = e.target.id.split('-')[1];
										YuPlayer.set(A, YF['Media']);
								}
								_z.fall(e);
								break;
							case 'yf-name':
								if (YF.upload_name !== YF.original_name) {
									YF['FileName'].textContent = YF.upload_name = YF.original_name;
								} else {
									YF['FileName'].textContent = YF.upload_name = (makeRandId(32) +'.'+ YF.upload_name.fext());
								}
								break;
							case 'yf-rate':
								e.target.parentNode.classList.toggle('active');
								break;
							case 'yf-remove':
								var idx = fileList.indexOf(YF);
								YF.frontend.remove();
								delete fileList[idx];
								fileList.splice(idx, 1);
								if (YF['Media']) {
									var adx = YuPlayer.playlist.indexOf(YF['Media']);
									delete YuPlayer.playlist[adx];
									YuPlayer.playlist.splice(adx, 1);
								}
								break;
							default:
								if (e.target.classList[0] === 'rating-option') {
									YF['rating'] = e.target.id.split('_')[1];
									YF['FileRate'].className = e.target.classList[1];
									YF['FileRate'].parentNode.classList.toggle('active');
								}
						}
					}
				});
				this['Preview'] = _z.setup((YF['frontend'].querySelector('#yf-preview') || 'img'), {}, {'load':
					function(e) {
						if (Type === 'image')
							_z.setup(YF['FileInfo'], {'class': 'br-word virguled', 'text': this.naturalWidth +'×'+ this.naturalHeight});
					}
				});
				this['FileName'] = YF['frontend'].querySelector('#yf-name');
				this['FileSize'] = YF['frontend'].querySelector('#yf-size');
				this['FileInfo'] = YF['frontend'].querySelector('#yf-info');
				this['FileRate'] = YF['frontend'].querySelector('#yf-rate');
				this['rating'] = 'SFW';
				fileList.push(this);
				Yu['FilesPlaceholder'].appendChild(this['frontend']);
			} catch(e) {
				console.error(e);
			}
		}
		function checkfileName(file_name) {
			var ext = file_name.fext()
			return (file_name.match(/videoplayback\?/) || file_name.match(/[?=&]/g) && ext.match(/[?=&]/g));
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
				
				theFile = new YukiFile(f_type[0], {
					blob: f,
					upload_name: HM.RemoveFileName ? makeRandId(32) + (f_ext ? '.'+ f_ext : '') : f_name,
					original_name: f_name
				});
				
			// Closure to capture the file information.
			switch (f_type[0]) {
				case 'image':
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
						var canvas = _z.setup('canvas', {'class': 'yf_preview _text', 'width': 150, 'height': 170}),
							context = canvas.getContext("2d"),
							lines = text.split("\n");
							context.font = "10px serif";
						for (var i = 0, x = 3, y = 11; i < lines.length; i++) {
							context.fillText(lines[i], x, y);
							y += 11;
						}
						_z.replace(theFile['Preview'], canvas);
						theFile['Preview'] = canvas;
						_z.setup(theFile['FileInfo'], {'class': 'br-word virguled', 'text': lines.length +' '+ LC.get('line', lines.length, lng)});
					});
					break;
				case 'audio':
				case 'video':
					var fileURL = _blobURL(f);
						theFile['MediaButton'] = _z.setup(theFile['frontend'].querySelector('#yf-play'), {'href': fileURL});
				default:
					switch (Files.matchType(f_ext)) {
						case 'audio':
							function nextAudio() {
								theFile['FileInfo'].textContent = theFile['duration'];
								YuPlayer.playnext(this) }
							function audioLoad() {
								theFile['duration'] = timerCalc(this.duration);
								_z.setup(theFile['FileInfo'], {'class': 'br-word virguled', 'text': theFile['duration'] });
								YuPlayer.playlist.push(this) }
							function updatTime() {
								theFile['FileInfo'].textContent = timerCalc(this.currentTime) +'/'+ theFile['duration'] }
							function btnChange(e) {
								theFile['MediaButton'].id = 'yf-'+ (e.type === 'play' ? 'pause' : 'play') }
							parse_audio_metadata(f, function(metadata) {
								if ("picture" in metadata) {
									getFileReaderData('dataurl', metadata.picture, function(dataImage) {
										theFile['frontend'].id = AlbumArts.makeCover(dataImage, metadata.artist, metadata.album);
									});
								}});
							theFile['Media'] = _z.setup(new Audio(fileURL), {}, {
								'loadedmetadata': audioLoad, 'play' : btnChange, 
								'timeupdate'    : updatTime, 'ended': nextAudio,
								'pause'         : btnChange, 'error': function(e) {
									theFile['Media'] = new AV.Player.fromFile(f);
									theFile['Media'].on('end'     , nextAudio);
									theFile['Media'].on('progress', updatTime);
									theFile['Media'].on('duration', audioLoad);
									theFile['Media'].onPlayerAction = btnChange;
									theFile['Media'].preload();
								}});
							break;
						case 'video':
							_z.setup('video', {'class': 'magic-media video', 'src': fileURL}, {'loadedmetadata': function(){
								_z.setup(theFile['FileInfo'], {'class': 'br-word virguled', 'text': this.videoWidth +'×'+ this.videoHeight +', '+ timerCalc(this.duration)})
								this.currentTime = 1;
								_z.replace(theFile['frontend'].lastElementChild, this);
								theFile['Preview'] = this;
							}, 'error': function() {
								HM.LinksMap[fileURL.hashCode()] = {Embed: (Files.video.indexOf(f_ext) > 4 ? 'flash' : 'html5'), Type: 'video'}
							}});
							break;
						case 'arch':
							theFile['Preview'].src = '/src/png/1405/archive-icon.png';
							break;
						case 'pdf':
							function thumbnailPDF() {
								PDFJS.getDocument(_blobURL(f)).then(function(pdf) {
									pdf.getPage(1).then(function(page) {  //1 is the page number we want to retrieve
										var viewport = page.getViewport(0.5);
										var canvas = _z.setup('canvas', {'class': 'yf_preview _text', 'width': viewport.width, 'height': viewport.height});
										var ctx = canvas.getContext('2d');
										page.render({
											canvasContext: ctx,
											viewport: viewport
										}).then(function(){
											//set to draw behind current content
											ctx.globalCompositeOperation = "destination-over";
											//draw background / rect on entire canvas
											ctx.fillRect(0,0,canvas.width,canvas.height);
										});
										_z.replace(theFile['Preview'], canvas);
										theFile['Preview'] = canvas;
										_z.setup(theFile['FileInfo'], {'class': 'br-word virguled', 'text': page.pageInfo.view[2].toFixed(0) +'×'+
											page.pageInfo.view[3].toFixed(0) +', '+ pdf.pdfInfo.numPages +' '+ LC.get('page', pdf.pdfInfo.numPages, lng)
										});
									});
								});
							}
							if (typeof PDFJS === 'undefined') {
								document.body.appendChild(
									_z.setup('script', {'type': 'application/javascript', 'src': '//mozilla.github.io/pdf.js/build/pdf.js'}, {'load': thumbnailPDF})
								);
							} else {
								thumbnailPDF();
							}
					}
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
			} catch(err) {
				console.error(err);
			}
		}
		function submitProcess(st) {
			_z.setup(Yu['Submit'], {'disabled': (st ? "disabled" : undefined)});
			Yu['Submit'].parentNode.classList.toggle('process');
		}
		function yukiPleasePost(e) {
			try {
				var form = e.target, formData = serializeArray(form),
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
								Yu['ErrorMassage'].textContent = 'Не получилось отправить пост.\n'+
									'Попробуйте чуть попозже ещё разок или перезагрузить страницу.'+
									'〔\n'+ this.statusText +'\n〕';
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
									submitProcess(false);
									Yum.afterSubmitAction();
									if (Yu['ReplyText'].safe_text)
										_z.sessionS.set('SafeText', JSON.stringify(Yu['ReplyText'].value));
									if (HM.ThreadListener[Yum.tid]) {
										if (fileList.length === 0) {
											HM.ThreadListener[Yum.tid].updateThread(true, false);
										} else {
											setTimeout(function(){
												HM.ThreadListener[Yum.tid].updateThread(true, false);
											}, 1500);
										}
									}
									fileList = [];
								}
							}
						}
						for (var i = 0; i < fileList.length; i++) {
							if (HM.RemoveExif && fileList[i].blob.type == 'image/jpeg' && fileList[i]['jpegStripped'] && fileList[i].dataURL) {
								fileList[i].blob = dataURLtoBlob(jpegStripExtra(fileList[i].dataURL), fileList[i].blob.type)
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
							console.warn('304 ' + this.statusText);
						} else {
							var del_checks = document.querySelectorAll('.delete_checkbox:checked');
							if (this.responseURL === action) {
								var msg = (/<center><h2>(.+)<\/h2><\/center>/).exec(this.responseText);
									mEl['WarningMsg'].textContent = msg[1];
									document.body.appendChild(mEl['WarningMsg']);
							} else {
								if (del_checks.length === 1) {
									document.getElementById('post_'+ del_checks[0].name).className = 'postdeleted';
									del_checks[0].remove();
								} else if (HM.URL.thread) {
									setTimeout(function() {
										HM.ThreadListener[HM.URL.thread].updateThread(false, true);
									}, 2000)
								}
							}
							_z.each(del_checks, function(chkbx){ chkbx.checked = false });
							_z.each('#chkx-del_selected.selected', function(ctd_sel){ ctd_sel.classList.remove('selected') });
						}
					}
				}
				ajaxPost.onreadystatechange = Fn;
				ajaxPost.open('POST', action, true);
				ajaxPost.send(fd);
			} catch(err) {
				console.error(err)
			} finally {
				_z.fall(e)
			}
		}
		function makeReplyForm(map, params) {
			Yu['TargetThread'].value = Yum.tid = map[1]; Yum.brd = map[0];
			Yu['CaptchaImage'].src = '/captcha/'+ Yum.brd +'/'+ _t() +'.png';
			Yu['PosterName'].placeholder = Names.get(Yum.brd);
			switch (params.type) {
				case 'popup':
				case 'reply':
					Yum.bound = params.bound;
					_z.each([Yu['OpenTopForm'], Yu['OpenBottomForm']], _show);
					_hide(Yu['HideGlobalForm']);
				case 'report':
					Yu['TargetInfo'].textContent = (document.querySelector('#post_'+Yum.tid+' .replytitle') || params).textContent;
					Yu['TargetInfo'].nextElementSibling.textContent = Yum.tid;
					if (map[2] && !Yu['ReplyText'].value.isThere('>>'+ map[2])) {
						wmarkText(Yu['ReplyText'], '>>'+ map[2], '\r\n')
					}
					break;
				case 'edit':
					Yu['ReplyText'].value = params.text;
					if (Names.get(Yum.brd) !== params.name)
						el$('[name="name"]').value = params.name;
					el$('[name="subject"]').value = params.subj;
					Yum.afterSubmitAction = params.afterSubmitAction;
					for (var i = 0, len = params.files.length - fileList.length; i < len; i++) {
						getUrlData('Blob', params.files[i].href, yAdd);
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
				_z.after(node, Yu['GlobalFormArea'])
				_hide(Yu[A]);
				Yu['GlobalFormSect'].appendChild(RPForm);
				Yu['NewThreadCreate'].className = (HM.URL.thread ? 'yuki_clickable ' : '') + (Yu['TargetThread'].value !== '0' ? 'inactive' : 'selected');
			}
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
			return "data:image/Jpeg;base64,"+ arrayBufferDataUri(output);
		}
		function _t(last) { 
			return (new Date).getTime() - (last ? parseInt(last) : 0);
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
	
	/****************** Harmony Audio Player *********************/
	function Harmony(h) {
		var HP = this, _Played = {}, _eST = 2, pModes = ['', 'RT', 'PL', 'RL'], ifront = {cover:{},button:{}},
			MA = {
				_pause: function() {
					if ('audio' in _Played) {
						_Played.audio.pause();
						_Played.track.button.id = HP['PlayButton'].id = 'ma-play';
					}
					_z.each('#ma-pause', function(a) { a.id = 'ma-play' });
				},
				_play: function(track) {
					this._pause();
					if (track !== _Played.track) {
						_infoUpdate(track.frontend.id, track.album, track.artist, !!track.previousElementSibling, !!track.nextElementSibling);
						_Played = {
							audio: _z.setup(_HTML5Audio, {'src': track.url}),
							track: _z.setup(track, {'id': 'now_playing'})
						}
						if (!track.dataLoad) {
							MAParser(track, ifront);
						}
					}
					HP['PlayButton'].id = track.button.id = ifront.button.id = 'ma-pause';
					_Played.audio.play();
				}
			},
		_HTML5Audio = _z.setup('audio', {}, {
			'loadedmetadata': _durationLoad, 'ended': _switchTrack, 
			'timeupdate'    : _timeUpdate  , 'error': function(e, _T_) {
				_T_ = !!_Played.track.file ? 'File' : 'URL';
				_Played.audio = new AV.Player['from'+ _T_](_Played.track[_T_.toLowerCase()]);
				_Played.audio.on('end'     , _switchTrack);
				_Played.audio.on('duration', _durationLoad);
				_Played.audio.on('progress', _timeUpdate);
				_Played.audio.on('error'   , MA._pause);
				_Played.audio.play();
			}
		});
		this.pause = MA._pause;
		this.play = function(button, cover) {
			var Id = button.getAttribute('track-id');
			_z.each('a.ma-button[track-id="'+ Id +'"]', function(el) {
				if (el !== MA[Id].button) {
					ifront = {
						button: el,
						cover: el.parentNode.parentNode
					}
				}
			});
			if (Id in MA) {
				MA._play(MA[Id]);
			}
		}
		this.addTrack = function(mdObj) {
			try {
				if (mdObj.id && mdObj.id in MA)
					return;
				var musicTrack = _z.setup('li', {'class': 'tracklist-item', 'html': '<a href="'+ mdObj.url +
					'" class="tracktitle hp-info" style="max-width: 255px;"></a><span class="tracktime">- -:- -</span>'}),
					mTid = mdObj.id || makeRandId(3) +'@'+ mdObj.url.hashCode();
				Object.defineProperty(musicTrack, 'duration', {
					get: function()    { return this.lastElementChild.textContent },
					set: function(txt) {        this.lastElementChild.textContent = txt }
				});
				Object.defineProperty(musicTrack, 'title', {
					get: function()    { return this.firstElementChild.textContent },
					set: function(txt) {
						this.firstElementChild.textContent = txt;
						if (txt.length > 37)
							this.firstElementChild.setAttribute('title', txt) }
				});
				Object.defineProperty(musicTrack, 'artist', {
					get: function()    { return this['__artist'] },
					set: function(txt) {
						this['__artist'] = txt;
						if (this === _Played.track)
							HP['TrackArtist'].textContent = txt }
				});
				Object.defineProperty(musicTrack, 'album', {
					get: function()    { return this['__album'] },
					set: function(txt) {
						this['__album'] = txt;
						if (this === _Played.track)
							HP['TrackAlbum'].textContent = txt }
				});
				mdObj.button.setAttribute('track-id', mTid);
				
				MA[mTid] = musicTrack;
				for (var key in mdObj) {
					musicTrack[key] = mdObj[key]
				}
				HP['TrackList'].appendChild(musicTrack);
			} catch(err) {
				console.error(err);
			}
		}
		this['Player'] = _z.setup('table', {'id': 'magic-audio-player', 'html': '<tbody class="magic-audio-min artwork line-sect"><tr class="hp-play-btn line-sect" id="ma-play"></tr></tbody><tbody class="hp-inf-ctrl line-sect"><tr style="height: 10px;"><th><div class="album hp-info">。。。</div></th></tr><tr style="height: 10px;"><td><div class="artist hp-info">. . .</div></td></tr><tr style="height: 8px;"><td style="font-size: 10px;"><div class="title hp-info"></div></td></tr><tr style="height: 24px;"><td><div class="hp-controls"></div><div style="transform: rotate(180deg); visibility: hidden;" class="forvardarrow hp-controls" id="hp-previous"></div><div style="visibility: hidden;" class="forvardarrow hp-controls" id="hp-next"></div><div class="hp-controls"></div><div class="playmode hp-controls">PL</div></td></tr><tr style="height: 10px;"><td style="line-height: 10px;"><label class="duration line-sect"><div class="thumb line-sect" style="left: 0%;" id="hp_progbar"></div></label><label id="timeoffset">- -:- -</label></td></tr></tbody><tbody><tr><td><div class="tracklist-scrollbox"><ol class="o-track-list"></ol></div><div id="hp_dropbox_layer" class="hidout"><div style="margin: 40px 30px;">Support media files:\n'+ Files.audio.join(' ').toUpperCase() +'</div></div></td></tr></tbody>'}, {'click': function(e){
			try {
				switch (e.target.classList[0]) {
					case 'tracklist-item': MA._play(e.target); break;
					case 'tracktitle': MA._play(e.target.parentNode); break;
					case 'hp-play-btn':
						MA['_'+ e.target.id.split('-')[1]](_Played.track || HP['TrackList'].firstElementChild);
						break;
					case 'forvardarrow':
						MA._play(_Played.track[e.target.id.split('-')[1] +'ElementSibling']);
						break;
					case 'playmode':
						_eST++;
						if (_eST > 3)
							_eST = 0;
						e.target.textContent = pModes[_eST]
						break;
					case 'duration':
						if (_Played.audio) {
							var stmp = e.target.getBoundingClientRect(),
								recm = e.pageX - Math.floor(stmp.left),
								tset = (_Played.audio.duration / 100) * (recm * 100 / stmp.width);
							_Played.audio.currentTime = tset;
							_timeUpdate.bind(_Played.audio)();
						}
				}
			} catch(err) {
				console.error(err)
			} finally {
				_z.fall(e)
			}
		}, 'dblclick': function(e) {
			var $target = e.target;
			switch ($target.classList[0]) {
				case 'magic-audio-min':
					break;
				case 'tracktitle':
					$target = e.target.parentNode;
				case 'tracklist-item':
					$target.frontend.scrollIntoView({block: 'start', behavior: 'smooth'});
			}
		}, 'dragover': function(e) {
			_show(HP['DropLayer']);
			_z.fall(e);
		}, 'dragleave': function(e) {
			_hide(HP['DropLayer']);
		}, 'drop': function(e) {
			try {
				_hide(HP['DropLayer']);
				for (var i = 0, files = e.dataTransfer.files; i < files.length; i++) {
					HP.addTrack({
						frontend: _z.setup('div'),
						button: _z.setup('a'),
						title: files[i].name,
						file: files[i],
						url: _blobURL(files[i])
					})
				}
			} catch(err) {
				console.error(err)
			} finally{
				_z.fall(e);
			}
		}});
		this['DropLayer'] = this['Player'].querySelector('#hp_dropbox_layer');
		this['TrackList'] = this['Player'].querySelector('.o-track-list');
		this['PrevButton'] = this['Player'].querySelector('#hp-previous');
		this['NextButton'] = this['Player'].querySelector('#hp-next');
		this['PlayButton'] = this['Player'].querySelector('.hp-play-btn');
		this['TrackAlbum'] = this['Player'].querySelector('.album');
		this['TrackArtist'] = this['Player'].querySelector('.artist');
		this['TimeOffset'] = this['Player'].querySelector('#timeoffset');
		this['Cover'] = this['Player'].querySelector('.magic-audio-min');
		this['Progbar'] = _z.setup(this['Player'].querySelector('#hp_progbar'), {}, {'mousedown': function(e) {
			if (_Played.audio) {
				HM.DragableObj = {
					el: this,
					layout: 'custom',
					callback: function(mv) {
						_Played.audio.pause();
						var p = extractStringNumbers(this.el.style['left'])[0] + PropertyEvent(mv, 'MovementX') / 2,
							n = p < 0 ? 0 : p > 90 ? 90 : p;
						_Played.audio.currentTime = _Played.audio.duration / 90 * n;
						this.el.style['left'] = n + '%';
						_z.fall(mv);
					}
				}
			}
		}, 'mouseup': function(e) {
			if (HP['PlayButton'].id === 'ma-pause')
				_Played.audio.play();
		}});
		function _timeUpdate() {
			var timer_string = timerCalc(this.currentTime);
			HP['TimeOffset'].textContent = timer_string;
			HP['Progbar'].style['left'] = (this.currentTime / this.duration * 90).toFixed(4) +'%';
		}
		function _durationLoad() {
			_Played.track.duration = timerCalc(this.duration, true);
		}
		function _infoUpdate(frontId, album, artist, prev, next) {
			_z.setup(HP['Cover'], {'id': frontId});
			HP['Progbar'].style['left'] = '0%';
			HP['TimeOffset'].textContent = '- -:- -';
			HP['TrackAlbum'].textContent = album || '。。。';
			HP['TrackArtist'].textContent = artist || '. . .';
			HP['PrevButton'].style['visibility'] = prev ? 'visible' : 'hidden';
			HP['NextButton'].style['visibility'] = next ? 'visible' : 'hidden';
			_z.setup(HP['TrackList'].querySelector('#now_playing'), {'id': undefined});
		}
		function _switchTrack() {
			MA._pause();
			switch (_eST) {
				case 1: MA._play(_Played.track); break;
				case 3: MA._play(_Played.track.nextElementSibling || HP['TrackList'].firstElementChild); break;
				case 2:
					if (_Played.track.nextElementSibling) {
						MA._play(_Played.track.nextElementSibling);
					} else {
						_Played = {};
						_infoUpdate();
					}
			}
		}
		function MAParser(Track) {
			function callback(metadata) {
				for (var key in metadata) {
					switch (key) {
						case 'picture':
							getFileReaderData('dataurl', metadata['picture'], function(dataImage) {
								var artId = AlbumArts.makeCover(dataImage,  metadata['artist'], metadata['album']);
								if (Track.frontend === _Played.track.frontend)
									HP['Cover'].id = artId;
								Track.frontend.id = ifront.cover.id = artId;
							});
							break;
						case 'artist':
						case 'title':
						case 'album':
							Track[key] = _unc(metadata[key]);
					}
				}
				Track.dataLoad = true;
			}
			switch (true) {
				case ('file' in Track):
					parse_audio_metadata(Track.file, callback);
					break;
				case ('url' in Track):
					getUrlData('Blob', Track.url, function(blob) {
						Track['file'] = blob;
						parse_audio_metadata(blob, callback);
					});
			}
		}
	}
	
	/************************************************************************/
	function MagicElements(h) {
		var MEt = this, tLC = {
			m_macro: ['Create Macro', 'Создать макро'],
			fnd_src_wth: ["find source with", "искать оригинал в"]
		}
		this['ContextMenu'] = _z.setup('div', {'class': 'magic-image-context', 'class': 'dropdown-toggle', 'style': 'position:absolute;top:0;left:0;', 'html': '<ul class="dropdown-menu"><li class="dropdown-item i-fav el-li" id="icm-create-macro">'+ tLC.m_macro[lng] +'</li><div class="dropdown-br">'+ tLC.fnd_src_wth[lng] +'</div><li id="icm-fsw-google" class="dropdown-item i-fav el-li">Google</li><li class="dropdown-item i-fav el-li" id="icm-fsw-iqdb">Iqdb</li><li class="dropdown-item i-fav el-li" id="icm-fsw-saucenao">SauceNAO</li><li class="dropdown-item i-fav el-li" id="icm-fsw-derpibooru">Derpibooru</li></ul><form enctype="multipart/form-data" target="_blank" action="https://derpibooru.org/search/reverse" method="post" hidden><input id="rs-url" name="url" value="" type="text"><input id="fuzziness" name="fuzziness" value="0.25" type="text"></form>'}, {'mousedown': nCR,
			'click': function(e) {
				switch (e.target.id) {
					case 'icm-create-macro': window.open(this.editTool, '_blank'); break;
					case 'icm-fsw-google': window.open('//www.google.com/searchbyimage?image_url='+ this.contentSource, '_blank'); break;
					case 'icm-fsw-saucenao': window.open('//saucenao.com/search.php?url='+ this.contentSource, '_blank'); break;
					case 'icm-fsw-iqdb': window.open('//iqdb.org/?url='+ this.contentSource, '_blank'); break;
					case 'icm-fsw-derpibooru':
						var input = document.getElementById('rs-url');
							input.value = this.contentSource;
							input.parentNode.submit();
				}
			}
		});
		this['ContentWindow'] = _z.setup('div', {'class': 'content-window hidout', 'html': '<div id="shadow-box"></div><label id="close-content-window"></label>'}, {
			'mousedown': nCR,
			'click': function(e) {
				switch (e.target.id) {
					case 'shadow-box': _hide(MEt['ContentWindow']);
						_show(MEt['ContentMarker'])
						break;
					case 'close-content-window': _hide(MEt['ContentWindow']);
						e.target.nextElementSibling.remove();
						HM.VActive = [];
						break;
				}
			}
		});
		this['Posts'] = document.getElementsByClassName('post');
		this['WarningMsg'] = _z.setup('strong', {'id': 'warning-massage', 'class': 'blink', 'style': 'width:100%;padding:5px;top:0;display:block;text-align:center;background-color:#fefefe;position:fixed;'});
		this['WarningMsg'].dozZe = function(e) {
			if (this.iterations >= 4) {
				this.remove();
				this.iterations = 0;
			}
		}
		this['DeleteOverlay'] = _z.setup('div', {'id': 'delete-overlay'});
		this['StatusPanel'] = _z.setup('div', {'id': 'status-panel', 'style': 'z-index:'+ HM.zIndex}, {'mousedown': stepZup});
		this['ContentMarker'] = _z.setup('label', {'id': 'show-content-window', 'class': 'hidout'}, {'mousedown': nCR, 'click': function(e) {
				_show(MEt['ContentWindow']);
				_hide(this)
			}
		});
		function nCR(e) {
			stopCloseReact = true;
		}
	}
	
	function MagicSettings(h) {
		var MSs = this, ActiveButton, lastScrollElem,
			SLC = {
				mcp: ["Post", "В посте"],
				pvc: ["Center", "По центру"],
				clp: ["Classic", "Классический"],
				mcw: ["Fixed Window", "В окне"],
				vsyz: ["Video Size", "Размер видеоплеера"],
				maxr: ["Max Allowing Rating", "Макс. разрешенный рейтинг"],
				cframe: ["Content Frame", "Положение видеоплеера"],
				picview: ["Picture View", "Просмотр картинок"],
				clipopup: ["Clipping Popup Posts", "Закреплять превью постов"],
				sacral: {
					'hr': ['Hiding and Words replacement', 'Скрытие и замены'],
					'ft': ['for Threads', 'для Тредов'],
					'fp': ['for Posts', 'для Постов']
				},
				emb: {
					'title': ['Enable oEmbed API support', 'Включает поддержку встраивания контента для ссылок при помощи oEmbed API'],
					'url': ['embedded_media_links', 'vstraivanije_dla_vneshnih_ssilok'],
					'txt': ['Embedded Media Links', 'Встраивание ссылок']
				}},
			StyleSet = {
				spoiler: _z.setup('style', {'text': '.spoiler, .spoiler * {color:inherit!important;}'}),
				hinfostub: _z.setup('style', {'text': '.autohidden, .autohidden + br + hr{display:none;}'}),
				true: function(style) { document.body.appendChild(this[style]) },
				false: function(style) { this[style].remove() },
				'code_css': function() {
					_z.setup(document.getElementById('user-css'), {'text': this.value});
					_z.localS.set('UserStyle', JSON.stringify(this.value));
				},
				'code_scl': function() {
					var $v = ['forThreads', 'forPosts'].indexOf(this.id.split('-')[1]);
					if (HM.Keywords[$v] !== this.value) {
						HM.Keywords[$v] = this.value;
						for (var map_id in HM.LoadedPosts) {
							Disepath.naval($v, this.value, HM.LoadedPosts[map_id]);
						}
						_z.localS.set('Keywords', JSON.stringify(HM.Keywords));
					}
				}
			}
			StyleSet[HM.DiscloseTextSpoilers ? true : false]('spoiler');
			StyleSet[HM.Keywords.conceal ? true : false]('hinfostub');
		function el$(child) { return MSs['GeneralSets'].querySelector(child) }
		this['GeneralSets'] = _z.setup('table', {'html': '<tbody><tr><td class="f-sect"><label><input '+
			(HM.EmbedField == 0 ? 'checked ' : '') +'id="gsx-EmbedField" value="0" name="emb_f" type="radio">\n'+ SLC.mcw[lng] +'\n<input '+
			(HM.EmbedField == 1 ? 'checked ' : '') +'id="gsx-EmbedField" value="1" name="emb_f" type="radio">\n'+ SLC.mcp[lng] +'\n</label></td><td class="s-sect">'+
			SLC.cframe[lng] +'</td></tr><tr id="vs-set" class="'+ (HM.EmbedField == 0 ? 'hidout' : '') +'"><td class="f-sect"><input id="gsx-AspectRatio" min="0" value="'+
			HM.AspectRatio +'" step="1" max="3" type="range" name="as_ratio"></td><td class="s-sect">'+ SLC.vsyz[lng] +'\n<span id="vsize-textbox" class="parensis">'+
			AspectSize.W[HM.AspectRatio] +'×'+ AspectSize.H[HM.AspectRatio] +'</span></td></tr><tr><td class="f-sect"><select id="gsx-PictureView"><option value="0">'+
			SLC.pvc[lng] +'</option><option value="1">'+ SLC.mcp[lng] +'</option><option value="2">'+ SLC.clp[lng] +'</option></select></td><td class="s-sect">'+
			SLC.picview[lng] +'</td></tr><tr><td class="f-sect"><select id="gsx-maXrating" class="rating_'+
			HM.maXrating.replace('-', '') +'"><option class="rating_SFW">SFW</option><option class="rating_R15">R-15</option><option class="rating_R18">R-18</option><option class="rating_R18G">R-18G</option></select></td><td class="s-sect">'+
			SLC.maxr[lng] +'</td></tr><tr><td class="f-sect"><label><input id="gsx-oEmbedAPI" type="checkbox" hidden'+
			(HM.oEmbedAPI ? ' checked' : '') +'><span class="checkarea super"></span></label></td><td class="s-sect"><a id="exemple-link" title="'+
			(HM.oEmbedAPI ? SLC.emb['title'][lng] +'">Hint: '+ SLC.emb['txt'][lng] : '"><u>http://www.magicpanel.div/'+
			SLC.emb['url'][lng] +'</u>') +'</a></td></tr><tr><td class="f-sect"><label><input id="gsx-DiscloseTextSpoilers" type="checkbox" hidden'+
			(HM.DiscloseTextSpoilers ? ' checked' : '') +'><span class="checkarea super"></span></label></td><td class="s-sect">'+
			LC.txtspoils[lng] +'</td></tr><tr><td class="f-sect"><label class="paperclip line-sect txt-btn'+
			(HM.AttachPopups ? '"><input checked' : ' inactive"><input') +' id="gsx-AttachPopups" type="checkbox" hidden></label></td><td class="s-sect">'+
			SLC.clipopup[lng] +'</td></tr></tbody>'}, {
				'click': function(e) {
					if (e.target.id === 'gsx-AspectRatio') {
						switch (lastScrollElem) {
							case 'video': _scrollTo('scbc'); break;
							case 'scbc': _scrollTo('video'); break;
							default:
								if (Megia['video']['Container'].parentNode)
									_scrollTo('video');
								else if (Megia['scbc']['Container'].parentNode)
									_scrollTo('scbc');
						}
					}
				}
			});
		this['HideBySets'] = _z.setup('table', {'html': '<tbody><tr><th class="o-sect"><label class="view-eye yuki_clickable i-block'+
			(HM.Keywords.conceal ? ' inactive' : '') +'"><input id="svx-stampsConcealing" type="checkbox" hidden'+
			(HM.Keywords.conceal ? ' checked' : '') +'></label></th><th class="s-sect">'+ SLC.sacral['hr'][lng] +
			'</th></tr><tr><td style="position: absolute; left: 0px;"><div id="svx-forThreads-'+ LC['lng'][lng] +'" class="svx-label chx-d">Т</div><div id="svx-forPosts-'+ LC['lng'][lng]+'" class="svx-label">'+ ['P', 'П'][lng] +'</div></td><td><textarea id="code_scl-forThreads" class="keywords-input font-s" placeholder="title { Оффициальный™* | *ожиданий от* | *тред. } text { *сап добрачь* } title { Rozen Maiden::$1@[color: Orchid; font-family: Georgia;] }">'+ (HM.Keywords[0] || '') +'</textarea><textarea id="code_scl-forPosts" class="keywords-input font-s" placeholder="name { Saeki-fag | Saeki* | *fag } trip { !Hyd5gFre } name { Saeki-fag::Anonymous } text { &quot;::“$1” }" hidden>'+ (HM.Keywords[1] || '') +'</textarea></td></tr></tbody>'}, {
				'mousedown': function(e) {
					if (e.target.classList[0] === 'svx-label') {
						var $Id = e.target.id.split('-')[1],
							riD = $Id === 'forThreads' ? 'forPosts' : 'forThreads';
							e.target.classList.add('chx-d');
						this.querySelector('#code_scl-'+ $Id).hidden = false;
						this.querySelector('#code_scl-'+ riD).hidden = true;
						this.querySelector('#svx-'+ riD + '-'+ LC['lng'][lng]).classList.remove('chx-d');
					}
				}
			});
		this['UserStyle'] = _z.setup('table', {'html': '<tbody><tr><td><textarea class="usercode-input" id="code_css-UserStyle" placeholder="/* User Style Code area */"></textarea></td></tr></tbody>'});
		this['Panel'] = _z.setup('div', {'id': 'magic-panel'}, {'change': function(e) {
			var $Item = e.target, $Id = $Item.id.split('-'), $V = $Item.value;
			switch($Id[0]) {
				case 'code_css':
				case 'code_scl':
					clearTimeout($Item.applyEffect);
					StyleSet[$Id[0]].bind($Item)();
					break;
				case 'svx':
					switch($Id[1]) {
						case 'stampsConcealing':
							HM.Keywords.conceal = $Item.checked;
							if ($Item.checked) {
								for (var arg in Disepath.bank) {
									_z.each(Disepath.bank[arg], function(bank) {
										if (bank.meth === 'hid') {
											var map$ = bank.node.getAttribute('patch-id').split('_');
											bank.node.hidden = true;
											_z.each('.celrly[href="/'+ map$[0] +'/res/'+ map$[1] +'.xhtml#i'+ map$[2] +'"]', function(vel) {
												vel.hidden = true;
											});
										}
									});
								}
							} else {
								_z.each('.post[hidden], .celrly[hidden]', function(hel) { hel.hidden = false; });
							}
							StyleSet[$Item.checked]('hinfostub');
							$Item.parentNode.classList.toggle('inactive');
					}
					_z.localS.set('Keywords', JSON.stringify(HM.Keywords));
					break;
				case 'gsx':
					switch ($Id[1]) {
						case 'AttachPopups':
							$Item.parentNode.classList.toggle('inactive');
							break;
						case 'DiscloseTextSpoilers':
							StyleSet[$Item.checked]('spoiler');
							break;
						case 'maXrating':
							$Item.className = $Item.querySelector('option:checked').className;
							break;
						case 'oEmbedAPI':
							if ($Item.checked) {
								HM.oEmbedAPI = true; handleLinks();
								_z.setup(document.getElementById('exemple-link'), {'title': SLC.emb['title'][lng], 'text': 'Hint: '+ SLC.emb['txt'][lng]});
							} else {
								_z.setup(document.getElementById('exemple-link'), {'title': undefined, 'html': '<u>http://www.magicpanel.div/'+ SLC.emb['url'][lng] +'</u>'});
								_z.each('#cm-link', function(link) {
									_z.setup(link, {'id': undefined, 'class': undefined, 'title': undefined, 'text': link.href});
								});
							}
							break;
						case 'AspectRatio':
							_z.setup(document.getElementById('vsize-textbox'), {'text': AspectSize.W[$V] +'×'+ AspectSize.H[$V]});
							Megia['video']['Frame'].height = Megia['scbc']['Frame'].width = Megia['scbc']['Frame'].height = AspectSize.H[$V];
							Megia['video']['Frame'].width = AspectSize.W[$V];
							lastScrollElem = null;
							break;
						case 'EmbedField':
							var cont = HM.VActive[1],
								vsset = document.getElementById('vs-set');
							switch ($V) {
								case '0': _hide(vsset);
									if (cont) {
										mEl['ContentWindow'].appendChild(_z.setup(cont, {'class': 'content-frame video', 'id': 'content_'+ _cid(cont.id)}));
										_z.setup(Megia['video']['Frame'], {'width': '100%', 'height': '100%'});
										_show(mEl['ContentMarker']);
									}; break;
								case '1': _show(vsset);
									if (cont) {
										_z.prepend(HM.VActive[0], _z.setup(cont, {'class': 'video-container', 'id': 'video_'+ _cid(cont.id)}));
										_z.setup(Megia['video']['Frame'], {'class': '', 'width': AspectSize.W[HM.AspectRatio], 'height': AspectSize.H[HM.AspectRatio]});
										_hide(mEl['ContentMarker']);
										_hide(mEl['ContentWindow']);
									}
							}
					}
					setupOptions($Item, $Id[1], 'local');
			}
		}, 'input': function(e) {
			var $Item = e.target,
				$Id = $Item.id.split('-');
			if ($Id[0] in StyleSet) {
				clearTimeout($Item.applyEffect);
				$Item.applyEffect = setTimeout(StyleSet[$Id[0]].bind($Item), 3000);
			}
		}, 'mousedown': function(e) {
			stepZup.bind(this)(e);
			MSs['ButtonsPanel'].style['z-index'] = HM.zIndex;
		}});
		MSs['UserStyle'].querySelector('#code_css-UserStyle').value = HM.UserStyle;
		el$('#gsx-maXrating').value = HM.maXrating;
		el$('#gsx-PictureView').value = HM.PictureView;
		this['MusicPlayer'] = Megia.audio['Player'];
		this['ButtonsPanel'] = _z.setup('a', {
				'id': 'magic-buttons-panel',
				'html': '<span id="pb-MusicPlayer" class="mpanel-btn txt-btn"></span><span id="pb-UserStyle" class="mpanel-btn txt-btn"></span><span id="pb-HideBySets" class="mpanel-btn txt-btn"></span><span id="pb-GeneralSets" class="mpanel-btn txt-btn"></span>'
			}, {'mousedown': stepZup, 
				'click': function(e) {
					var TABLE = MSs[e.target.id.split('-')[1]],
						INNER = MSs['Panel'].firstElementChild;
					if (e.target.classList.contains('active')) {
						MSs['Panel'].remove()
					} else {
						if (!INNER) {
							MSs['Panel'].appendChild(TABLE);
						} else if (INNER !== TABLE) {
							MSs['Panel'].replaceChild(TABLE, INNER);
							if (ActiveButton)
								ActiveButton.classList.remove('active');
						}
						if (this.previousElementSibling.id !== 'magic-panel') {
							_z.before(this, MSs['Panel']);
						}
						MSs['Panel'].style['z-index'] = HM.zIndex;
					}
					ActiveButton = e.target;
					e.target.classList.toggle('active');
				}
			});
		function _scrollTo(key) {
			lastScrollElem = key;
			Megia[key]['Container'].scrollIntoView({block: "start", behavior: "smooth"});
		}
	}
	
	function insertListenerS(event) {
		switch (event.animationName) {
			case 'onReady':
				switch (event.target.className) {
					case 'footer': try {
						_z.append(document.head, [
							_z.setup('style', {'id': 'user-css', 'text': HM.UserStyle})
						]);
						var locationThread = document.getElementById('thread_'+ HM.URL.thread),
							hideinfodiv = document.getElementById('hideinfodiv'),
							delForm = document.getElementById('delete_form'),
							rules = document.getElementsByClassName('rules')[0];
							Megia.settings = new MagicSettings();
						
						_z.each(mEl['Posts'], handlePost);
						if (hideinfodiv) {
							_z.after(hideinfodiv, Nagato['OpenTopForm']);
							Nagato['BoardRulesSect'].appendChild(rules)
						}
						if (locationThread) {
							HM.ThreadListener[HM.URL.thread] = new MagicThreadListener(locationThread);
							_z.append(delForm, [Nagato['OpenBottomForm'], HM.ThreadListener[HM.URL.thread]['NewPostLoader']]);
							_z.append(mEl['StatusPanel'], [HM.ThreadListener[HM.URL.thread]['PostsCount'], HM.ThreadListener[HM.URL.thread]['SpeedCount']])
							HM.ThreadListener[HM.URL.thread].updateTimer();
						} else if (!locationThread && HM.URL.thread) {
							HM.ThreadListener[HM.URL.thread] = new MagicThreadListener(_z.setup('div', {'id': 'thread_'+ HM.URL.thread, 'class': 'thread'}))
							HM.ThreadListener[HM.URL.thread].getArchive(document.getElementsByTagName('center')[0]);
						} else {
							if (hideinfodiv)
								_z.before(delForm.querySelector('.pages'), Nagato['OpenBottomForm']);
							_z.each('.thread:not(.autohide-info)', function(thread) {
								if (!thread.querySelector('img[src="/images/sticky.png"]')) {
									var CiD = _cid(thread.id);
									HM.ThreadListener[CiD] = new MagicThreadListener(thread)
									thread.appendChild(HM.ThreadListener[CiD]['DummyLine']);
								}
							});
						}
						if (delForm) {
							_z.setup(delForm, {}, {'submit': Nagato.submitForm}).appendChild(mEl['DeleteOverlay']);
						}
						_z.append(document.body, [
							mEl['ContentWindow'], mEl['ContentMarker'], mEl['ContextMenu'], mEl['StatusPanel'],
							Megia.settings['ButtonsPanel']
						]);
					} catch(e) {
						console.error(e)
					}
				}
		}
	}
	
	function PDownListener(e) {
		try {
			var $Params, $Post = this, patchId = this.getAttribute('patch-id'), $Map = patchId.split('_');
			if (this.classList.contains('new'))
				markAsRead(this);
			switch (e.target.classList[0]) {
				case 'reply-link': Chanabira.MagicHighlight(e); break;
				case 'ma-button':
					Megia.audio[e.target.id.split('-')[1]](e.target, e.target.parentNode.parentNode);
					break;
				case 'cm-button':
				case 'mview':
					loadMediaContainer({
						'URL': e.target.classList[0] === 'mview' ? e.target.parentNode.href : e.target.href,
						'NODE': e.target.classList[0] === 'mview' ? e.target.parentNode : e.target
					});
					break;
				case 'dropdown-label':
					e.target.parentNode.classList.toggle('active');
					e.target.nextElementSibling.style['z-index'] = document.querySelectorAll('.active > .dropdown-label').length;
					break;
				case 'dropdown-item':
					var $Id = e.target.id.split('_');
					switch ($Id[0]) {
						case 'usermenu':
							switch ($Id[1]) {
								case 'delete': delPost(this); break;
								case 'hide':
									var $v = $Map[1] === $Map[2] ? 0 : 1, p_m = '#'+ $Map[0] +'/'+ $Map[2],
										tA = Megia.settings['HideBySets'].querySelectorAll('textarea');
									HM.Keywords[$v] = tA[$v].value = tA[$v].value + (tA[$v].value.length > 0 ? ' ' : '' ) + p_m;
									Disepath.eval($v, p_m, HM.LoadedPosts[patchId]);
									_z.localS.set('Keywords', JSON.stringify(HM.Keywords));
									break;
								case 'report':
									if (!HM.ReportForm) {
										HM.ReportForm = new Yuki(false);
										findModThread(0)
									}
									var $Form = HM.ReportForm.getForm(['d', HM.ReportForm['TargetThread'].value, ($Map[0] === 'd' ? '' : $Map[0] +'/') + $Map[2]], {
										type: 'report',
										textContent: ['Mod Thread', 'Модераторам тред'][lng] });
									changeForms($Form, 'popup');
									break;
								case 'edit':
									if (!HM.LoadedPosts[patchId].edit_form)
										HM.LoadedPosts[patchId].edit_form = new Yuki(false);
									var $params = {
											type: 'edit',
											name: (this.querySelector('.postertrip:not(.t-sec)') || this.querySelector('.postername:not(.t-sec)')).textContent,
											subj: (this.querySelector('.replytitle:not(.t-sec)') || {textContent:''}).textContent,
											text: textSource(this.querySelector('.message')),
											files: this.getElementsByClassName('download-link'),
											afterSubmitAction: delPost},
										$form = HM.LoadedPosts[patchId].edit_form.getForm($Map, $params)
									_z.after(this.querySelector('.cpanel + br'), $form);
							}
							break;
						case 'modmenu':
							var $meth = e.target.getAttribute('admin_req');
							switch ($Id[1]) {
								case 'xreq':
									var post_id = e.target.parentNode.id.split('-')[1];
									getDataResponse('/api/admin/post/'+ post_id + $meth, function(status, sText, json, xhr) {
										if (status !== 200 || json.error) {
											document.body.appendChild(
												_z.setup(mEl['WarningMsg'], {'text': json.error ? json.error.message +' '+ json.error.code : status +' '+ sText})
											)
										} else if (json.result) {
											setTimeout(function(){
												switch ($Id[2]) {
													case 'upd':
														if ($meth.isThere('?bump=1')) {
															HM.LoadedPosts[patchId]['delete_input'].remove();
															HM.LoadedPosts[patchId].className = 'postdeleted';
														}
														HM.ThreadListener[$Map[1]].updateThread(true, false);
													case 'reset':
														updatePost(post_id);
												}
											}, 1500)
										}
									});
									break;
								case 'open':
									window.open($meth);
							}
					}
					break;
				case 'dropdown-input':
					var $Id = e.target.id.split('_'),
						$Val = e.target.classList.contains($Id[1]);
					switch ($Id[0]) {
						case 'chkx-del': HM.LoadedPosts[patchId]['delete_input'].checked = !$Val; break;
						case 'str-bump': e.target.parentNode.setAttribute('admin_req', '/show.json'+ ($Val ? '?bump=1' : '')); break;
					}
					e.target.classList.toggle($Id[1]);
					break;
				case 'iview':
					Megia.image.makePicture(e.target, HM.PictureView);
					break;
				case 'reply-button':
					var $form = Nagato.getForm($Map, {
						type: ['popup', 'reply'][HM.FormStyle],
						textContent: LC.hidden[1][lng],
						bound: this.formBinding.bind(this) })
					if (HM.FormStyle == '0') {
						changeForms($form, 'report');
					} else {
						this.formBinding($form);
					}
					_scrollIfOverPage(this)
					break;
				case 'Get-Full-Text':
					$Params = {'class': 'Get-Short-Text', 'text': ['Short Text', 'Укороченная версия'][lng]};
				case 'Get-Short-Text':
					_z.each(this.getElementsByClassName('postbody'), function(pbody) {
						pbody.classList.toggle('alternate');
					});
					_z.setup(e.target, ($Params || {'class': 'Get-Full-Text', 'text': ['Full Text', 'Полная версия'][lng]}));
					break;
				case 'excat-button':
					var eXcaT = e.target.id.split('-')[1];
					HM.ThreadListener[$Map[1]][eXcaT +'Thread'](e);
					e.target.id = 'thread-'+ (eXcaT === 'expand' ? 'truncat' : 'expand');
					break;
				default:
					return;
			}
			_z.fall(e);
		} catch(err) {
			console.error(err);
		}
		function updatePost(post_id){
			getDataResponse('/api/post/'+ post_id +'.xhtml', function(status, sText, xhtml, xhr) {
				if (status === 200) {
					var post = HM.LoadedPosts[patchId];
						post.body.innerHTML = xhtml;
						if ('delete_input' in post) {
							post['delete_input'].remove();
						}
						handlePost(post, true);
				}
			})
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
		function findModThread(n) {
			getDataResponse('/d/'+n+'.json', function(status, sText, json, xhr) {
				if (status === 200) {
					var threads = json.boards.d.threads;
					for (var i = 0; i < threads.length; i++) {
						if (threads[i].title.isThere('Модераторам тред')) {
							HM.ReportForm['TargetThread'].value = threads[i].display_id;
							HM.ReportForm['TargetInfo'].nextElementSibling.textContent = threads[i].display_id;
							return;
						}
					}
					n++;
					findModThread(n);
				}
			});
		}
		function delPost(current) {
			var delbox = HM.LoadedPosts[patchId].delete_input;
			var form = _z.setup('form', {'id': 'delete_form', 'action': '/'+ $Map[0] +'/delete', 'method': 'post', 'html':
				'<input name="task" value="delete"><input name="password" value="'+ HM.User.password +'"><input name="'+ delbox.name +'" value="'+ delbox.value +'">'})
			Nagato.submitForm({target: form})
		}
	}
	function changeForms(form, type) {
		var prevForm = document.querySelector('#'+ form.id +'.'+ type),
			sLeft = form.style['left'],
			sTop = form.style['top'];
		if (!prevForm) {
			document.body.appendChild(form);
		} else {
			_z.replace(prevForm, form)
			sLeft = prevForm.style['left'];
			sTop = prevForm.style['top'];
		}
		HM.zIndex++;
		form.style['top'] = (sTop || '35%');
		form.style['left'] = (sLeft || '35%');
		form.style['z-index'] = HM.zIndex;
	}
	function animate(draw, duration) {
		var start = performance.now();
			requestAnimationFrame(function animate(time) {
				// определить, сколько прошло времени с начала анимации
				var timePassed = time - start;
				// возможно небольшое превышение времени, в этом случае зафиксировать конец
				if (timePassed > duration) timePassed = duration;
				// нарисовать состояние анимации в момент timePassed
				draw(timePassed);
				// если время анимации не закончилось - запланировать ещё кадр
				if (timePassed < duration) {
					requestAnimationFrame(animate);
				}
			});
	}
	
	/************************ MagicPicture *********************************/
	function MagicPicture(h) {
		var MP = this, Idx = 0, Size = {
			original: [],
			scaled: [],
			get: function(image, scaleMax, scaleMin) {
				this.scaled = scaleSize(this.original, (scaleMax || document.body.clientWidth - image.parentNode.parentNode.parentNode.getBoundingClientRect().left - 25), scaleMin, !scaleMax);
				this.ratio = this.scaled[2];
				image.style['width'] = this.scaled[0].toFixed(4) +'px';
				image.style['height'] = this.scaled[1].toFixed(4) +'px';
			}
		};
		this['Gallery'] = document.getElementsByClassName('iview');
		var jHolder = _z.setup('div', {'class': 'full-size', 'style': 'background-color: rgba(0, 0, 0, 0.7);', 'html': '<div style="position: absolute; z-index: 300; width: 321px; height: 241px; top: 0px; left: 0px;"><div style="width: 100%; height: 100%; z-index: 310; position: absolute; overflow: hidden;"><img style="position: absolute; width: 650px; height: 241px; top: 0px; left: 0px;" src="/src/jpg/1511/60978ffaa9e581c7b73ef227423231b6.jpg"><div class="jcrop-hline" style="position: absolute; opacity: 0.4; top: 0px;"></div><div class="jcrop-hline" style="position: absolute; opacity: 0.4; top: 240px;"></div><div class="jcrop-vline" style="position: absolute; opacity: 0.4;"></div><div class="jcrop-vline" style="position: absolute; opacity: 0.4; left: 320px;"></div><div style="cursor: move; position: absolute; z-index: 360;" class="jcrop-tracker"></div><canvas id="text-layer" class="full-size"><input id="ml-bottom-text" class="macro-text" type="text"><input id="ml-top-text" class="macro-text" type="text"></canvas></div><div style="width: 100%; height: 100%; z-index: 320; display: block;"><div style="cursor: n-resize; position: absolute; z-index: 370; width: 100%; height: 9px; top: -4px; left: -4px;"></div><div style="cursor: s-resize; position: absolute; z-index: 371; width: 100%; height: 9px; top: 236px; left: -4px;"></div><div style="cursor: e-resize; position: absolute; z-index: 372; width: 9px; height: 100%; top: -4px; left: 316px;"></div><div style="cursor: w-resize; position: absolute; z-index: 373; width: 9px; height: 100%; top: -4px; left: -4px;"></div><div class="jcrop-handle" style="cursor: n-resize; position: absolute; z-index: 374; top: -4px; left: 156px; opacity: 0.5;"></div><div class="jcrop-handle" style="cursor: s-resize; position: absolute; z-index: 375; top: 236px; left: 156px; opacity: 0.5;"></div><div class="jcrop-handle" style="cursor: e-resize; position: absolute; z-index: 376; top: 116px; left: 316px; opacity: 0.5;"></div><div class="jcrop-handle" style="cursor: w-resize; position: absolute; z-index: 377; top: 116px; left: -4px; opacity: 0.5;"></div><div class="jcrop-handle" style="cursor: sw-resize; position: absolute; z-index: 378; top: 236px; left: -4px; opacity: 0.5;"></div><div class="jcrop-handle" style="cursor: nw-resize; position: absolute; z-index: 379; top: -4px; left: -4px; opacity: 0.5;"></div><div class="jcrop-handle" style="cursor: ne-resize; position: absolute; z-index: 380; top: -4px; left: 316px; opacity: 0.5;"></div><div class="jcrop-handle" style="cursor: se-resize; position: absolute; z-index: 381; top: 236px; left: 316px; opacity: 0.5;"></div></div></div><div style="width: 666px; height: 257px; position: absolute; top: -8px; left: -8px; z-index: 290; cursor: crosshair;" class="jcrop-tracker"></div><div style="position: absolute; overflow: hidden;"><input style="position: absolute; left: -30px; display: none;" type="radio"></div>'})
		this['MacroLayer'] = _z.setup(jHolder.querySelector('#text-layer'), {}, {
			'mousedown': function(e) {
				
			},
			'click': function(e){
				var Tx = e.offsetY > this.height / 2 ? 'Bottom' : 'Top';
				this['Text'+ Tx].focus();
			}
		});
		this['MacroLayer']['TextBottom'] = _z.setup(jHolder.querySelector('#ml-bottom-text'), {}, {'input': drawProgress});
		this['MacroLayer']['TextTop'] = _z.setup(jHolder.querySelector('#ml-top-text'), {}, {'input': drawProgress});
		this['Picture'] = _z.setup('picture', {'class': 'magic-picture', 'contextmenu': 'image-context'}, {
				'wheel': function(e) {
					if (this.classList[1] === 'gallery-qview') {
						var D = e.deltaY || e.deltaX,
							Y = extractStringNumbers(this.style['top'] + this.style['left']),
							R = Size.scaled[Size.ratio];
							Size.get(this, parseInt(D < 0 ? R * 1.25 : R / 1.25, 10));
							this.style['left'] = parseInt(e.clientX - (D < 0 ? (e.clientX - Y[1]) * 1.25 : (e.clientX - Y[1]) / 1.25), 10) +'px';
							this.style['top'] = parseInt(e.clientY - (D < 0 ? (e.clientY - Y[0]) * 1.25 : (e.clientY - Y[0]) / 1.25), 10) +'px';
						_z.fall(e);
					}
				},
				'dblclick': function(e) {
					if (this.classList[1] === 'gallery-qview') {
						MP['Picture'].appendChild(jHolder)
						_z.fall(e);
					}
				},
				'mousedown': function(e) {
					switch (this.classList[1]) {
						case 'gallery-qview':
							var coords = getCoords(this);
								stepZup.bind(this)(e);
							HM.DragableObj = {
								el: this,
								shift: [e.pageX - coords.left, e.pageY - coords.top],
								layout: 'client'
							}
							break;
						case 'onpost-qview':
							var scrH = this.scrollHeight,
								scrW = this.scrollWidth;
								Size.changed = false;
							if (scrH - e.offsetY < (scrH > 30 ? scrH / 10 : scrH) && scrW - e.offsetX < (scrW > 30 ? scrW / 10 : scrW)) {
								var oRS = Size.original[Size.ratio],
									sMx = Size.scaled[Size.ratio];
								Size.get(this, (sMx > 500 ? 500 : -0), (sMx < 500 ? sMx * 2 : oRS));
								Size.changed = true;
							}
					}
				},
				'click': function(e) {
					switch (this.classList[1]) {
						case 'onpost-qview':
							if (!Size.changed) {
								this.remove();
							}
					}
					_z.fall(e)
				}
			});
		this.makePicture = function(thumb) {
			var Id = thumb.id.split('_')[1],
				Md = thumb.tagName === 'A' && HM.PictureView == 2 ? 3 : HM.PictureView,
				Pv = ['gallery', 'onpost', 'classic', 'embed'][Md];
				Idx = MP['Gallery'].indexOf(thumb);
				Size.original = extractStringNumbers(thumb.getAttribute('image-size'));
				switch(Pv) {
					case 'classic':
						if (thumb.classList.contains('expanded')) {
							thumb.src = thumb.lowsrc;
							thumb.style = '';
						} else {
							thumb.src = thumb.parentNode.href || thumb.href;
							Size.get(thumb, -0, 200);
						}
						thumb.classList.toggle('expanded')
						break;
					default:
						MP['Picture'].src = thumb.parentNode.href || thumb.href;
						_z.setup(MP['Picture'], {'id': 'mpic_'+ Id, 'class': 'magic-picture '+ Pv +'-qview'})
						switch (Pv) {
							case 'embed':
							case 'onpost':
								Size.get(MP['Picture'], 500, 200);
								MP['Picture'].style['background-image'] = 'url(\''+ MP['Picture'].src +'\')';
								break;
							case 'gallery':
								HM.zIndex++;
								Size.get(MP['Picture'], window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth, 200);
								MP['Picture'].style['left'] = (Size.scaled[0] >= window.innerWidth ? 0 : (window.innerWidth - Size.scaled[0]) / 2) +'px';
								MP['Picture'].style['top'] = (Size.scaled[1] >= window.innerHeight ? 0 : (window.innerHeight - Size.scaled[1]) / 2) +'px';
								MP['Picture'].style['background-image'] = 'url(\''+ MP['Picture'].src +'\'), url(/src/svg/1511/alpha-cells.svg)';
								MP['Picture'].style['z-index'] = HM.zIndex;
						}
						if (thumb.parentNode.href) {
							_z.before(thumb.parentNode, MP['Picture']);
						} else
							_z.route(thumb, jumpCont).appendChild(MP['Picture'])
				}
		}
		this.openPicture = function(n) {
			if (Idx >= 0 && HM.PictureView != 2) {
				MP.makePicture(MP['Gallery'][Idx + n])
				if (HM.PictureView == 1) {
					_scrollIfOverPage(_z.route(MP['Picture'], function(node) {
						return ['reply', 'oppost'].isThere(node.classList[0]);
					}));
				}
			}
		}
		function scaleSize(origS, sMax, sMin, md) {
			var whOut,
				ratio = origS[1] / origS[0];
			if (sMin && sMin > origS[0] && sMin > origS[1]) {
				whOut = (ratio <= 1 ?
					[sMin, sMin * ratio] : [sMin / ratio, sMin])
			} else if (sMin && sMax > origS[0] && sMax > origS[1]) {
				whOut = origS;
			} else {
				whOut = (ratio <= 1 || md ?
					[sMax, sMax * ratio] : [sMax / ratio, sMax])
			}
				whOut.push(Math.floor(ratio))
			return whOut;
		}
		function drawProgress(e) { try {
			if (tt.value.length * fSz > c.width || bt.value.length * fSz > c.width){
				fSz -= 5;
			} else if (tt.value.length * fSz < c.width || bt.value.length * fSz < c.width)
				fSz += 5
			ctx.font = 'normal bold '+fSz+'px verdana';
			x = c.width /2
			y = c.height - fSz / 2
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.fillText(tt.value,x,fSz);
			ctx.strokeText(tt.value,x,fSz);
			ctx.fillText(bt.value,x,y);
			ctx.strokeText(bt.value,x,y);
		} catch(e){console.error(e)}
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
	function insertListenerE(event) {
		switch (event.animationName) {
			case 'onReady':
				break;
		}
	}
	_z.setup(window, {}, {
		'keypress': keyMarks,
		'contextmenu': function(e) {
			switch (e.target.getAttribute('contextmenu')) {
				case 'image-context':
					if (!['r-18g', 'r-18', 'r-15', 'unrated', 'illegal'].isThere(e.target.alt)) {
						mEl['ContextMenu'].contentSource = e.target.src;
						mEl['ContextMenu'].editTool = e.target.getAttribute('edit-tool');
						mEl['ContextMenu'].classList.add('active');
						mEl['ContextMenu'].style['left'] = (e.pageX + 5) +'px';
						mEl['ContextMenu'].style['top'] = (e.pageY + 5) +'px';
						mEl['ContextMenu'].style['z-index'] = HM.zIndex + 1;
						_z.fall(e);
					}
			}
		},
		'mouseup': function(e) {
			HM.DragableObj = null;
			switch (e.button) {
				case 0:
					if (!stopCloseReact)
						_z.remove('.magic-picture.gallery-qview');
					if (!e.target.classList.contains('dropdown-label') && !e.target.classList.contains('dropdown-input'))
						_z.each('.dropdown-toggle.active', function(dt_a){ dt_a.classList.remove('active')} );
			}
			stopCloseReact = false;
		},
		'dblclick': function(e) {
			if (!['TEXTAREA', 'INPUT'].isThere(e.target.tagName))
				markAsRead();
		},
		'keydown': function(e) {
			switch (e.keyCode) {
				case 37:
				case 39:
					if (!['TEXTAREA', 'INPUT'].isThere(e.target.tagName))
						Megia.image.openPicture(e.keyCode + 1 - 39, HM.PictureView);
					break;
				case 27:
					Chanabira.closeLastPopup(e);
					break;
				case 82:
					if (!['TEXTAREA', 'INPUT'].isThere(e.target.tagName))
						markAsRead();
					break;
				case 9:
					if (e.target.id.isThere('code_')) {
						wmarkText(e.target, '\t', '\n\t');
						_z.fall(e);
					}
			}
		},
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
		}
	});
	var pinf = document.title.split(' — ')
	if (pinf.length > 1)
		document.title = (HM.URL.board !== document.location.host ? '/'+ HM.URL.board +'/ · ' : '') + pinf.pop();
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
		for (var i = 0, p, pfx = ['', 'moz', 'webkit', 'o', 'MS']; i < pfx.length; i++) {
			p = !pfx[i] ? type.toLowerCase() : pfx[i] + type;
			document.addEventListener(p, callback, false);
		}
	}
	function PropertyEvent(event, prop) {
		for (var i = 0, p, pfx = ['', 'moz', 'webkit', 'o', 'MS']; i < pfx.length; i++) {
			p = !pfx[i] ? prop.slice(0, 1).toLowerCase() + prop.slice(1) : pfx[i] + prop;
			if (event[p] !== undefined)
				return event[p];
		}
	}
}

function initScripts() {
var mesShadows = /* hr shadow */ 'hr{border-style:none none solid!important;border-color:rgba(0,0,0,.3)!important;box-shadow:0 1px 0 #fff!important;}'+
/* text spoiler, banner image & captcha image sadows */ '#yuki-captcha-image,.banner,.spoiler,.spoiler a,.message code{transition:all .1s ease;box-shadow:0 1px 2px -1px rgba(0,0,0,.7)!important;}.spoiler a:hover,.spoiler:hover,.transparent{box-shadow:none!important;}'+
/* popup/error posts, settings panel sadows & dropdown menu */ '.reply,.popup{border:0 none transparent!important;}.active > .dropdown-label,.dropdown-menu,.popup,#magic-panel,.report{box-shadow:5px 5px 10px rgba(0,0,0,.4),inset 0 0 30px rgba(0,0,0,.1);}'+
/* reply post sadows */ '.oppost.highlighted,.reply,.highlight{padding:2px 1em 2px 2px!important;box-shadow:inset 0 1px 30px -9px #fff,0 2px 2px rgba(0,0,0,.2),2px 0 3px -1px rgba(0,0,0,.1);}.line-sect.reply{padding:2px 4px!important;}'+
/* new reply post sadows */ '.new .reply{box-shadow:inset 0 1px 30px -9px rgba(255, 85, 0, 0.8),0 2px 2px rgba(0,0,0,.2),2px 0 3px -1px rgba(0,0,0,.1);}'+
/* post images/files & audio players shadows */ '.thumb,.rating-select,.magic-picture.onpost-qview,.yukiFile,.scbc-container,.prosto-pleer,.audio-container video,#status-panel{box-shadow:1px 2px 2px -1px rgba(0,0,0,.4),-1px 0 4px -1px rgba(0,0,0,.2),inset 0 0 30px rgba(0,0,0,.1)!important;}'+
/* error massage, theader & text input shadows */ '#yuki-errorMsg,.theader,.passvalid,input[type="text"],input[type="password"],input[type="number"],textarea,.docs-container,.message code pre{box-shadow:inset 0 1px 2px rgba(0,0,0,.3)!important;-webkit-border-radius:5px;border-style:none!important;}input[type="text"],input[type="number"],input[type="password"],textarea{-webkit-border-radius:3px!important;padding:4px!important;}'+
/* input buttons style */ 'input[type="button"],input[type="submit"],.button{transition:all .3s ease;box-shadow:0 1px 3px -1px rgba(0,0,0,.5),0 0 2px rgba(0,0,0,.2) inset;padding:3px 6px;color:#999;border:0 none;background-color:#fff;}input[type="button"]:hover,input[type="submit"]:hover,.button:hover{background-color:rgba(255,255,255,.5);}input[type="button"]:active,input[type="submit"]:active,.button:active{box-shadow:0 0 2px rgba(255,255,255,.3),0 0 2px rgba(0,0,0,.2) inset;background-color:rgba(255,255,255,.2);}'+
/* input checkbox style */ '.checkarea{box-shadow:inset 1px 1px 2px rgba(0,0,0,.3),0 0 2px #fff;border-radius:3px;padding:0 4px;background-color:#fff;font-size:14px;}.checkarea:before{content:"✗";color:transparent;}input[type="checkbox"]:checked + .checkarea:before{color:grey;}'+
/* text shadows */ '.etch-text,.mapped,.mapped:hover,.active > .modermenu{font-variant:small-caps;font-weight:bold;color:transparent!important;text-shadow:0 1px 1px rgba(255,255,255,.8),-1px 0 0 #666;}'+
/* video-container shadows */ '.video-container,.content-frame{box-shadow:0 0 2px rgba(0,0,0,.2),0 0 4px rgba(0,0,0,.4),0 9px 9px -8px rgba(0,0,0,.8);}'+
/* yuki-form previews shadows */ '.yf_preview{box-shadow:0 4px 8px 0 rgba(0,0,0,.2);}';
var mesAnimations = '.new .reply,form.reply{animation:pview .3s ease-out;-webkit-animation:pview .3s ease-out;}table.popup{animation:pview .2s linear;-webkit-animation:pview .2s linear;}\
.content-frame{animation:slide .2s linear;-webkit-animation:slide .2s linear;}#shadow-box{animation:thaw 1s ease;-webkit-animation:thaw 1s ease;}\
.magic-picture{animation:imageQView .3s ease-out;-webkit-animation:imageQView .3s ease-out;}.turn-on{animation:kinescope-on .4s ease;-webkit-animation:kinescope-on .4s ease;}.turn-off{animation:kinescope-off .2s ease-out;-webkit-animation:kinescope-off .2s ease-out;}\
@keyframes kinescope-on {from {transform: scale(1, 0);} to {transform: scale(1, 1);}}@-webkit-keyframes kinescope-on {from {-webkit-transform: scale(.5, 0);} to {-webkit-transform: scale(1, 1);}}@keyframes kinescope-off {from {transform: scale(1, 2);} to {transform: scale(1, 1);}}@-webkit-keyframes kinescope-on {from {-webkit-transform: scale(1, 2);} to {-webkit-transform: scale(1, 1);}}\
@keyframes imageQView {from {transform: scale(0.7, 0.7);} to {transform: scale(1, 1);}} @-webkit-keyframes imageQView {from {-webkit-transform: scale(0.7, 0.7);} to {-webkit-transform: scale(1, 1);}}\
@keyframes slide{from{top:-90%;bottom:90%;}to{top:10%;bottom:20%;}}@-webkit-keyframes slide{from{top:-90%;bottom:90%;}to{top:10%;bottom:20%;}}\
@keyframes thaw{from{opacity:0;}to{opacity:1;}}@-webkit-keyframes thaw{from{opacity:0;}to{opacity:1;}}\
@keyframes pview{from {scale(0,0);opacity:0;}25%{transform:scale(.3,.3);opacity:.1;}50%{transform:scale(.9,.9);opacity:.3;}75%{transform:scale(1.02,1.02);opacity:.7;}100%{transform:scale(1,1);opacity:1;}}\
@-webkit-keyframes pview{0%{-webkit-transform:scale(0,0);opacity:0;}25%{-webkit-transform:scale(.3,.3);opacity:.1;}50%{-webkit-transform:scale(.9,.9);opacity:.3;}75%{-webkit-transform:scale(1.02,1.02);opacity:.7;}100%{-webkit-transform:scale(1,1);opacity:1;}}';

var MagicStyle = '.hidout,.hide.icon,.view_,.edit_,.search_iqdb,.search_google,#open-top-form + #postform_placeholder,#open-top-form + * + #postform_placeholder,#yuki-newThread-create,#yuki-targetInfo,#conn-push,.submit-button.process input,.pleer-container + br,.autohide-info ~ *,.autohidden + br,.text-original,.rl-inf,.magic-picture.onpost-qview + a,.submit-button span,form.edit ~ *:not(.abbrev),#delete-overlay,.magic-info ~ *:not(.magic-media),.popup #chkx-del_selected{display:none!important;}\
.unexpanded,.rated{max-width:200px!important;max-height:200px!important;}.expanded{width:100%;height:auto;}.hideinfo{margin:5px;}.sp-r.rate{color:darkred;}#yuki-dropBox tr,.f-sect,.hideinfo{text-align:center!important;}\
.dpop,#wmark-buttons-panel,#yuki-close-form,#yuki-newThread-create{float:right;text-align:right;}.artwork{background:url(/src/svg/1505/ma-artwork.svg)no-repeat scroll center center / 100% auto;}.movie{background:url(/src/svg/1505/cm-movie.svg)no-repeat scroll center center / 100% auto;}\
.content-frame,.scbc-container,.mhs-title,#magic-panel,.active > .dropdown-label:not(.postermenu),.yukiFile,.dropdown-menu,.rating-select,.message code,#status-panel{background-color:#fefefe;}.global #yuki-newThread-create,form.popup #yuki-targetInfo,.report #yuki-targetInfo,form.reply #conn-push,form.popup #conn-push{display:inline!important;}\
.yuki_clickable,.txt-btn,.wmark-button,.button,.el-li,.icon{cursor:pointer;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}\
.replylinks,.button{line-height:2em;font-size:75%;clear:both;}#post-count,.txt-btn{color:#999;}.mapped,.mapped:hover{cursor:default;color:#666!important;}.hidup{top:-9999px!important;}\
.footer:after{content:"";-webkit-animation:onReady 1s linear 2;animation:onReady 1s linear 2;}.cm-button,.btn-link{text-decoration:none;}.s-sect{text-align:left;padding-left:2em;color:#777;}\
#yuki-captcha,#yuki-pass{width:295px;}#yuki-captcha-image{vertical-align:middle;margin:2px;}#yuki-dropBox{width:7em;height:18em;border:3px dashed rgba(99,99,99,.3);padding:2px;}\
#convert-strike,.doubledash,.global #yuki-close-form,.dropdown-menu,.rating-select,.magic-picture.gallery-qview + a{visibility:hidden;}.sagearrow{background:url(/src/svg/1409/Sage.svg)no-repeat center bottom;position:relative;}.paperclip{background:url(/src/png/1411/attachpopup.png)no-repeat center;}\
#yuki-errorMsg{text-align:center;color:#FFF;background-color:#E04000;}.wmark-button{color:#fefefe;text-shadow:0 1px 0 rgba(0,0,0,.4);}a:hover > .wmark-button{color:inherit;}.spoiler > .wmark-button{vertical-align:inherit;color:inherit;text-shadow:none;}\
.rating_SFW{background:green;}.rating_R15{background:yellow;}.rating_R18{background:orange;}.rating_R18G{background:red;}.line-sect,.yukiFile,.cpop,.mpanel-btn,.postdeleted .doubledash,.li-in{display:inline-block;}#warning-massage{color:#ff3428;}\
.yukiFile,.yukiFileSets{font-size:66%;}.yukiFile{text-align:center;margin:5px;}.yukiFile.default{padding:2px;width:210px;-webkit-border-radius:5px;}.movie select{position:relative;top:118px;}\
#yuki-files-placeholder > *{vertical-align:top;}.yf_preview{max-width:150px;margin:5px 0;}.br-word{word-wrap:break-word;margin-top:3px;}.virguled:after{content:",";padding-right:2px;}\
#yuki-replyForm{text-align:left;padding:4px 8px;}.selected:before{content:"✓ ";color:green;}#chkx-del_selected.selected:before{margin:5px;position:relative;bottom:2px;}.cpop{margin-left:.4em;}.checkarea.super{font-size:20px!important;}\
#yuki-dropBox tr{display:block;}.droparrow{background:url(/src/svg/1409/DropArrow.svg)no-repeat center;display:block;padding:9em 3em;}\
#rf-cb-ty{background-image:url(/src/svg/1411/closepopup.svg);}#rf-cb-all{background-image:url(/src/svg/1411/closeallpopups.svg);}.dpop{float:right;background-image:url(/src/svg/1505/cmove.svg);cursor:move;}.sagearrow{cursor:default;}\
.new .reply{background-color:rgba(212,115,94,.1);}\
.cpop{width:14px;height:14px;}.dpop,.sagearrow,.paperclip,.view-eye,#chkx-del_selected{width:20px;height:20px;}.reply-button{margin-left:3px;width:23px;height:14px;background:url(/src/svg/1505/reply-arrow.svg)no-repeat center top;}\
#magic-buttons-panel,#magic-panel,#status-panel,#yuki-replyForm.popup,#yuki-replyForm.report,.gallery-qview{position:fixed;}#magic-buttons-panel{right:1em;bottom:1em;}\
.ta-inact::-moz-selection{background:rgba(99,99,99,.3);}.ta-inact::selection{background:rgba(99,99,99,.3);}#int-upd{bottom:2px;position:relative;}#allowed-posts a{text-decoration:none;text-shadow:none;font-weight:normal;font-size:14px;}\
.mpanel-btn:hover,.mpanel-btn.active{opacity:1;filter:none;-webkit-filter:grayscale(0%);}#magic-panel tr{height:3em;}#vsize-textbox{color:#bbb;font-family:Trebuchet;}\
#magic-panel{right:5px;bottom:5px;max-width:450px;height:350px;border-radius:8px;padding:9px;padding-bottom:3em;}.sp-r{text-align:right;font-size:18px;}\
.postdeleted,.t-sec{opacity:.6;}.inactive{opacity:.4;}img[src="#transparent"]{opacity:0;}.wmark-button,.reply-button,.sagearrow,.duration{vertical-align:middle;}.content-window{position:fixed;left:0;top:0;z-index:2999}\
.submit-button.process{font-size:13px;font-style:italic;color:#777;}@keyframes process{0%{width:0;}100%{width:1em;}}@-webkit-keyframes process{0%{width:0;}100%{width:1em;}}\
.submit-button.process span{display:inline!important;}.process:after{content:"....";display:inline-block;overflow:hidden;animation:process 3s linear .1s infinite;-webkit-animation:process 3s linear .1s infinite;}\
.magic-info,.sp-r{width:190px;background-color:rgba(255,255,255,.8);padding:5px;opacity:.6}.magic-info:hover,.sp-r:hover,.popup,.dropdown-menu,.rating-select{z-index:1;opacity:1;}.magic-info,.magic-info + br,.sp-r,.content-frame{position:absolute;}\
.video-container,.content-frame.video{background-color:#000;}.video-container,.scbc-container{margin:0 9px;display:inline-block!important;}\
.magic-picture.gallery-qview{box-shadow:5px 5px 10px rgba(0,0,0,.4);}.content-frame{top:10%;left:12%;right:18%;bottom:20%;z-index:3000;}#shadow-box{position:absolute;background-color:rgba(33,33,33,.8);z-index:2999;}\
.docs-container > iframe,.content-frame.docs > iframe,.full-size,#shadow-box,.content-window,.preview_img{width:100%;height:100%;}.content-frame.img{background-color:transparent;}\
#close-content-window,#show-content-window{transition:.5s ease;opacity:.6;width:31px;height:31px;background-image:url(/src/svg/1505/close-circle.svg);cursor:pointer;position:absolute;top:20px;right:20px;z-index:3000;}\
.docs-container,.content-frame.docs,.docs-container > iframe,.message code pre{padding:6px 8px;overflow:auto;resize:both;background-color:#fefefe;}.message code{border-radius:3px;padding:0 3px;}code,#chkx-del_selected{border:1px #CCC dashed;}.li-in{cursor:default;margin-left:5px;}.content-frame.pdf{top:1%;left:17%;right:20%;bottom:1%;}\
#show-content-window{right:52%;position:fixed;background-image:url(/src/svg/1505/show-circle.svg);border-radius:100%;}#close-content-window:hover,#show-content-window:hover{opacity:1;}\
#ma-play,#yf-play{background:url(/src/svg/1505/ma-play.svg)no-repeat scroll center;}#ma-pause,#yf-pause{background:url(/src/svg/1505/ma-pause.svg)no-repeat scroll center;}input:focus,select:focus,textarea:focus,button:focus{outline:none;}\
.ma-controls,.ma-controls a{display:block;width:50px;height:50px;}.ma-controls{position:relative;top:37%;left:37%;border:2px solid #ddd;border-radius:100%;background-color:#333;opacity:.8;}\
.font-s{font-size:12px;}.keywords-input{width:300px;height:280px;resize:none;}.o-sect{padding:0 1em;}.cyan-light{color:rgba(90,152,155,.8);}\
.dummy-line{position:absolute;text-align:center;width:100%;}.svx-label{line-height:200%;width:68px;text-align:center;cursor:default;}.svx-label:after{color:grey;font-size:12px;}#svx-forPosts-en:after{content:"osts"}#svx-forPosts-ru:after{content:"осты"}#svx-forThreads-en:after{content:"hreads"}#svx-forThreads-ru:after{content:"реды"}\
.dropdown,.dropdown-menu,.rating-select{padding-left:0;list-style:outside none none;}.active > * {visibility:visible;}.active > .dropdown-label{border-radius:4px 4px 0 0;}.dropdown-label{padding:2px 4px;font-variant:small-caps;font-size:14px;}.dropdown-label + .dropdown-menu{border-top-left-radius:0;border-top-right-radius:0;}.dropdown-menu{border-radius:4px;position:absolute;color:#777;min-width:150px;font-size:14px;line-height:1.8;}.rating-select{text-align:left;font-size:12px;position:absolute;}\
.dropdown-item,.rating-option,.dropdown-br{padding:0 10px;}.dropdown-item:hover,.tracklist-item:hover,.svx-label.chx-d{background-color:rgba(0,0,0,.1);}.dropdown-br{font-size:11px;line-height:16px;background-color:#f2f2f2;color:#b1a4a4;text-align:center;font-style:italic;}#timer-update-sets:before{content:"⟨ ";}#timer-update-sets:after{content:" ⟩";}#int-val{width:50px;margin:0 4px;}.red-light{color:red;text-shadow:0 0 4px red;}.cpanel > .reply-button{top:-1px;position:relative;}\
.blink{-webkit-animation-name:blinker;-webkit-animation-duration:1s;-webkit-animation-timing-function:linear;-webkit-animation-iteration-count:infinite;animation-name:blinker;animation-duration:1s;animation-timing-function:linear;animation-iteration-count:infinite;}\
.oppost.highlighted,.highlighted .reply{border-style:dashed!important;border-width:2px!important;border-color:#F50!important;}.postcontent,.postcontent > picture,.rl-inf,.f-left{float:left;}br + .postbody{clear:both;}.rp-h > *{font-size:.8em;}.rp-h > .s-inf{color:#666;}.onpost-qview:hover:before{content:"";display:inline-block;width:100%;height:100%;background:url(/src/svg/1511/fedge.svg) no-repeat bottom right / 10%;}.gallery-qview{background-color:rgba(255,255,255,.6);}.magic-picture{cursor:pointer;background-repeat:no-repeat,repeat;background-position:center,top left;background-size:contain,auto;display:inline-block;}.celrly:not([hidden]) ~ .celrly:not([hidden]):before{content:",\t";color:#666!important;cursor:default;}.celrly:not([hidden]) ~ .rl-inf{display:inline!important;}.report{background-color:#FFE2D4;}\
.view-eye{background:url(/src/png/1506/p-stub-hide.png)no-repeat scroll center;}.i-block{display:inline-block;}.postermenu{display:block;background:url(/src/svg/1508/new-dropdown-arrow.svg)no-repeat scroll bottom center / 18px;padding:9px;}.active > .postermenu{transform:rotate(180deg);-webkit-transform:rotate(180deg);box-shadow:none!important;background-position:top center;}\
.turn-on{position:absolute;bottom:50px;}.i-fav:before{content:"";margin-right:5px;padding:8px;background:transparent no-repeat scroll center center / 16px;}#icm-fsw-google:before{background-image:url(/src/svg/1508/google_ico_monochrome.svg);}#icm-create-macro:before{background-image:url(/src/svg/1508/macroeditor_ico_monochrome.svg);}#icm-fsw-iqdb:before{background-image:url(/src/svg/1508/new-cube-icon-monochrome.svg);}#icm-fsw-saucenao:before{background-image:url(/src/svg/1508/soucenao_ico_monochrome.svg);}#icm-fsw-derpibooru:before{background-image:url(/src/svg/1508/trixie_cutie_mark_by_rildraw-d3khewr.svg);}\
#status-panel{bottom:0;border-radius:0 5px;padding:3px 6px;}.break-lines + *:before{content:"||";font-size:12px;padding:0 2px;}.parensis:before{content:"("}.parensis:after{content:")"}.break-midot + *:before{content:"・";}\
.usercode-input{width:350px;height:335px;resize:none;white-space:nowrap;}\
.mpanel-btn{padding:0 9px;width:28px;height:28px;opacity:.2;filter:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'.3 .3 .3 0 0 .3 .3 .3 0 0 .3 .3 .3 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");-webkit-filter:grayscale(100%);background-size:contain;background-repeat:no-repeat;background-position:center;}\
#pb-HideBySets{background-image:url(/src/svg/1505/hide-menu-btn.svg);}#pb-GeneralSets{background-image:url(/src/png/1409/list4.png);}\
#pb-UserStyle{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyIgd2lkdGg9IjEwMnB4IiBoZWlnaHQ9IjUycHgiIHZpZXdCb3g9IjAgMCAxMDIgNTIiIHZlcnNpb249IjEuMSI+PGRlZnM+PGZpbHRlciB4PSItNTAlIiB5PSItNTAlIiB3aWR0aD0iMjAwJSIgaGVpZ2h0PSIyMDAlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItMSI+PGZlT2Zmc2V0IGR4PSIwIiBkeT0iMSIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd09mZnNldElubmVyMSIvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEiIGluPSJzaGFkb3dPZmZzZXRJbm5lcjEiIHJlc3VsdD0ic2hhZG93Qmx1cklubmVyMSIvPjxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93Qmx1cklubmVyMSIgaW4yPSJTb3VyY2VBbHBoYSIgb3BlcmF0b3I9ImFyaXRobWV0aWMiIGsyPSItMSIgazM9IjEiIHJlc3VsdD0ic2hhZG93SW5uZXJJbm5lcjEiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgMCAwIDAgMSAwIiBpbj0ic2hhZG93SW5uZXJJbm5lcjEiIHR5cGU9Im1hdHJpeCIgcmVzdWx0PSJzaGFkb3dNYXRyaXhJbm5lcjEiLz48ZmVNZXJnZT48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz48ZmVNZXJnZU5vZGUgaW49InNoYWRvd01hdHJpeElubmVyMSIvPjwvZmVNZXJnZT48L2ZpbHRlcj48L2RlZnM+PGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+PHBhdGggZD0iTTMxLDQ5LjQzNzUgQzI3LjM3NDk4MTksNTAuNzkxNjczNCAyNC4xMjUwMTQ0LDUxLjQ2ODc1IDIxLjI1LDUxLjQ2ODc1IEMxNy40NTgzMTQ0LDUxLjQ2ODc1IDEzLjk2ODc2NTksNTAuNDUzMTM1MiAxMC43ODEyNSw0OC40MjE4NzUgQzcuNTkzNzM0MDYsNDYuMzkwNjE0OCA1LjExNDU5MjE5LDQzLjM2OTgxMTcgMy4zNDM3NSwzOS4zNTkzNzUgQzEuNTcyOTA3ODEsMzUuMzQ4OTM4MyAwLjY4NzUsMzAuODEyNTI1MyAwLjY4NzUsMjUuNzUgQzAuNjg3NSwyMC43MjkxNDE2IDEuNTYyNDkxMjUsMTYuMjE4NzcgMy4zMTI1LDEyLjIxODc1IEM1LjA2MjUwODc1LDguMjE4NzMgNy41MzEyMzQwNiw1LjE4NzUxMDMxIDEwLjcxODc1LDMuMTI1IEMxMy45MDYyNjU5LDEuMDYyNDg5NjkgMTcuNDE2NjQ3NSwwLjAzMTI1IDIxLjI1LDAuMDMxMjUgQzI0LjEyNTAxNDQsMC4wMzEyNSAyNy4zNzQ5ODE5LDAuNzA4MzI2NTYyIDMxLDIuMDYyNSBMMzEsOC44MTI1IEMyNy42NDU4MTY2LDYuODc0OTkwMzEgMjQuMzEyNTE2Niw1LjkwNjI1IDIxLDUuOTA2MjUgQzE4LjQ5OTk4NzUsNS45MDYyNSAxNi4yMTM1NTIsNi43NjA0MDgxMiAxNC4xNDA2MjUsOC40Njg3NSBDMTIuMDY3Njk4LDEwLjE3NzA5MTkgMTAuMzk1ODM5NywxMi42ODIyNzUyIDkuMTI1LDE1Ljk4NDM3NSBDNy44NTQxNjAzMSwxOS4yODY0NzQ4IDcuMjE4NzUsMjEuODc0OTgwNiA3LjIxODc1LDI1Ljc1IEM3LjIxODc1LDI5LjY4NzUxOTcgNy44NzQ5OTM0NCwzMi4zMjI5IDkuMTg3NSwzNS42NTYyNSBDMTAuNTAwMDA2NiwzOC45ODk2IDEyLjE3NzA3MzEsNDEuNDg0MzY2NyAxNC4yMTg3NSw0My4xNDA2MjUgQzE2LjI2MDQyNjksNDQuNzk2ODgzMyAxOC41MjA4MjA5LDQ1LjYyNSAyMSw0NS42MjUgQzI0LjI5MTY4MzEsNDUuNjI1IDI3LjYyNDk4MzEsNDQuNjU2MjU5NyAzMSw0Mi43MTg3NSBMMzEsNDkuNDM3NSBaIE0zNy4zMTI1LDQ3Ljk2ODc1IEwzNy4zMTI1LDQyLjAzMTI1IEM0Mi4zMTI1MjUsNDQuNDA2MjYxOSA0Ni44NTQxNDYyLDQ1LjU5Mzc1IDUwLjkzNzUsNDUuNTkzNzUgQzUyLjY0NTg0MTksNDUuNTkzNzUgNTQuMjgxMjQyMiw0NS4yNjU2MjgzIDU1Ljg0Mzc1LDQ0LjYwOTM3NSBDNTcuNDA2MjU3OCw0My45NTMxMjE3IDU4LjkyNjMwMDgsNDIuNzI3MDA4MyA1OS41OTM3NSw0MC40NDgyNDIyIEM2MC4yNjExOTkyLDM4LjE2OTQ3NjEgNjAuMDQxNjcyMiwzNS41MTU2MzIzIDU4LjkzNzUsMzQuMDQ2ODc1IEM1Ny44MzMzMjc4LDMyLjU3ODExNzcgNTUuNzYwNDMxOSwzMC45NTgzNDIyIDUyLjcxODc1LDI5LjE4NzUgTDQ5LjUzMTI1LDI3LjM0Mzc1IEw0Ni4zMTI1LDI1LjUgQzQwLjY0NTgwNSwyMi4xNDU4MTY2IDM3LjgxMjUsMTcuOTc5MTkxNiAzNy44MTI1LDEzIEMzNy44MTI1LDkuMzU0MTQ4NDQgMzkuMDc4MTEyMyw2LjI4NjQ3MDc4IDQxLjYwOTM3NSwzLjc5Njg3NSBDNDQuMTQwNjM3NywxLjMwNzI3OTIyIDQ4LjA5MzcyMzEsMC4wNjI1IDUzLjQ2ODc1LDAuMDYyNSBDNTYuOTI3MTAwNiwwLjA2MjUgNjAuMjcwODE3MiwwLjU2MjQ5NSA2My41LDEuNTYyNSBMNjMuNSw3Ljk2ODc1IEM1OS45Mzc0ODIyLDYuNTkzNzQzMTMgNTYuNDY4NzY2OSw1LjkwNjI1IDUzLjA5Mzc1LDUuOTA2MjUgQzUwLjQwNjIzNjYsNS45MDYyNSA0OC42MDA4MzAxLDYuMzUxNTYyNSA0Ni45NTExNzE5LDcuNDY3Mjg1MTYgQzQ1LjMwMTUxMzcsOC41ODMwMDc4MSA0NC4wOTM3NSwxMC4xNTYyNCA0NC4wOTM3NSwxMi4xNTYyNSBDNDQuMDkzNzUsMTQuMTM1NDI2NiA0NC43MjkxNjAzLDE1Ljc4MTI0MzQgNDYsMTcuMDkzNzUgQzQ3LjI3MDgzOTcsMTguNDA2MjU2NiA0OC44OTU4MjM0LDE5LjYxNDU3NzggNTAuODc1LDIwLjcxODc1IEw1My4zMTI1LDIyLjE4NzUgTDU2LjM0Mzc1LDI0LjAzMTI1IEw1OC45MDYyNSwyNS41MzEyNSBDNjQuMjE4Nzc2NiwyOC43ODEyNjYyIDY2Ljg3NSwzMi44NjQ1NTg4IDY2Ljg3NSwzNy43ODEyNSBDNjYuODc1LDQxLjUzMTI2ODcgNjUuNTEwNDMwMyw0NC43NDk5ODY2IDYyLjc4MTI1LDQ3LjQzNzUgQzYwLjA1MjA2OTcsNTAuMTI1MDEzNCA1NS42NzcxMTM0LDUxLjQ2ODc1IDQ5LjY1NjI1LDUxLjQ2ODc1IEM0Ny43Mzk1NzM4LDUxLjQ2ODc1IDQ1LjkxMTQ2Nyw1MS4zMDcyOTMzIDQ0LjE3MTg3NSw1MC45ODQzNzUgQzQyLjQzMjI4Myw1MC42NjE0NTY3IDQwLjE0NTg0NzUsNDkuOTg5NTg4NCAzNy4zMTI1LDQ4Ljk2ODc1IEwzNy4zMTI1LDQ3Ljk2ODc1IFogTTcyLjMxMjUsNDcuOTY4NzUgTDcyLjMxMjUsNDIuMDMxMjUgQzc3LjMxMjUyNSw0NC40MDYyNjE5IDgxLjg1NDE0NjIsNDUuNTkzNzUgODUuOTM3NSw0NS41OTM3NSBDODcuNjQ1ODQxOSw0NS41OTM3NSA4OS4yODEyNDIyLDQ1LjI2NTYyODMgOTAuODQzNzUsNDQuNjA5Mzc1IEM5Mi40MDYyNTc4LDQzLjk1MzEyMTcgOTMuOTI2MzAwOCw0Mi43MjcwMDgzIDk0LjU5Mzc1LDQwLjQ0ODI0MjIgQzk1LjI2MTE5OTIsMzguMTY5NDc2MSA5NS4wNDE2NzIyLDM1LjUxNTYzMjMgOTMuOTM3NSwzNC4wNDY4NzUgQzkyLjgzMzMyNzgsMzIuNTc4MTE3NyA5MC43NjA0MzE5LDMwLjk1ODM0MjIgODcuNzE4NzUsMjkuMTg3NSBMODQuNTMxMjUsMjcuMzQzNzUgTDgxLjMxMjUsMjUuNSBDNzUuNjQ1ODA1LDIyLjE0NTgxNjYgNzIuODEyNSwxNy45NzkxOTE2IDcyLjgxMjUsMTMgQzcyLjgxMjUsOS4zNTQxNDg0NCA3NC4wNzgxMTIzLDYuMjg2NDcwNzggNzYuNjA5Mzc1LDMuNzk2ODc1IEM3OS4xNDA2Mzc3LDEuMzA3Mjc5MjIgODMuMDkzNzIzMSwwLjA2MjUgODguNDY4NzUsMC4wNjI1IEM5MS45MjcxMDA2LDAuMDYyNSA5NS4yNzA4MTcyLDAuNTYyNDk1IDk4LjUsMS41NjI1IEw5OC41LDcuOTY4NzUgQzk0LjkzNzQ4MjIsNi41OTM3NDMxMyA5MS40Njg3NjY5LDUuOTA2MjUgODguMDkzNzUsNS45MDYyNSBDODUuNDA2MjM2Niw1LjkwNjI1IDgzLjYwMDgzMDEsNi4zNTE1NjI1IDgxLjk1MTE3MTksNy40NjcyODUxNiBDODAuMzAxNTEzNyw4LjU4MzAwNzgxIDc5LjA5Mzc1LDEwLjE1NjI0IDc5LjA5Mzc1LDEyLjE1NjI1IEM3OS4wOTM3NSwxNC4xMzU0MjY2IDc5LjcyOTE2MDMsMTUuNzgxMjQzNCA4MSwxNy4wOTM3NSBDODIuMjcwODM5NywxOC40MDYyNTY2IDgzLjg5NTgyMzQsMTkuNjE0NTc3OCA4NS44NzUsMjAuNzE4NzUgTDg4LjMxMjUsMjIuMTg3NSBMOTEuMzQzNzUsMjQuMDMxMjUgTDkzLjkwNjI1LDI1LjUzMTI1IEM5OS4yMTg3NzY2LDI4Ljc4MTI2NjIgMTAxLjg3NSwzMi44NjQ1NTg4IDEwMS44NzUsMzcuNzgxMjUgQzEwMS44NzUsNDEuNTMxMjY4NyAxMDAuNTEwNDMsNDQuNzQ5OTg2NiA5Ny43ODEyNSw0Ny40Mzc1IEM5NS4wNTIwNjk3LDUwLjEyNTAxMzQgOTAuNjc3MTEzNCw1MS40Njg3NSA4NC42NTYyNSw1MS40Njg3NSBDODIuNzM5NTczOCw1MS40Njg3NSA4MC45MTE0NjcsNTEuMzA3MjkzMyA3OS4xNzE4NzUsNTAuOTg0Mzc1IEM3Ny40MzIyODMsNTAuNjYxNDU2NyA3NS4xNDU4NDc1LDQ5Ljk4OTU4ODQgNzIuMzEyNSw0OC45Njg3NSBMNzIuMzEyNSw0Ny45Njg3NSBaIiBpZD0iQ1NTIiBmaWxsPSIjN0VEMzIxIiBmaWx0ZXI9InVybCgjZmlsdGVyLTEpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+PC9nPjwvc3ZnPg==);}\
#pb-MusicPlayer{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyIgd2lkdGg9IjYzcHgiIGhlaWdodD0iNjlweCIgdmlld0JveD0iMCAwIDYzIDY5IiB2ZXJzaW9uPSIxLjEiPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxwYXRoIGQ9Ik01MC4wNTk5MDk4LDQ5LjYzMTU2MTMgTDQzLjA1MzI3NzgsNDkuNjMxNTYwMSBDNDMuMDUzMjc3OCw0OS42MzE1NjAxIDQzLjA1NzI5ODIsMjkuNDA3NTYyNCA0My4wNTE5Mzc5LDE2LjI5NTIyNDggQzMxLjMxMzk1NjMsMTkuMDMzNzkxOCA5LjI2NTY2MTgyLDI1LjA3MTEwMjcgNy45ODc4NzE1MiwyNS4zOTAxMzk0IEM3Ljk5MTg5MTgzLDM2LjMyMTM3NzIgNy45OTA1NTE5NSw1OS4yNDg3MTgzIDcuOTkwNTUxOTUsNTkuMjQ4NzE4MyBDNy45OTA1NTE5NSw1OS4yNDg3MTgzIDEuMDIwMTAxNTgsNTkuNTAyNzI5MyAxLjAwMTM0MDExLDU5LjI0ODcxOTQgQzEuMDAxMzQwMTEsNDIuMjk3MTA0NSAxLjAwMzM1MDI2LDI4LjM0NTQ4OTcgMSwxMS4zOTM4NzQ5IEMxNi4zMTMzODIsNy44Mzc3MzQxNiA0OS4wMTU5Njg5LDAuMjIyMTc0MTI1IDUwLjA1OTkxMDcsMCBDNTAuMDYzMjYxMiwxNS4yMDE5OTM2IDUwLjA1OTkwOTgsNDkuNjMxNTYxMyA1MC4wNTk5MDk4LDQ5LjYzMTU2MTMgWiIgaWQ9IlNoYXBlIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMC4wOTM3NSIgZmlsbC1vcGFjaXR5PSIwLjc3IiBmaWxsPSIjMDAwIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+PHBhdGggZD0iTTUyLjk4OTk2NzksNTguNjI3OTI5NyBDNTguNTA3Mjc0OCw1OC42Mjc5Mjk3IDYyLjk3OTkzNTcsNTQuOTI4MTY2NiA2Mi45Nzk5MzU3LDUwLjEwMDUyMyBDNjIuOTc5OTM1Nyw0NS4yNzI4Nzk1IDU4LjUwNzI3NDgsNDAuNzk5MTUzNiA1Mi45ODk5Njc5LDQwLjc5OTE1MzYgQzQ3LjQ3MjY2MSw0MC43OTkxNTM2IDQzLDQ1LjI3Mjg3OTUgNDMsNTAuMTAwNTIzIEM0Myw1NC45MjgxNjY2IDQ3LjQ3MjY2MSw1OC42Mjc5Mjk3IDUyLjk4OTk2NzksNTguNjI3OTI5NyBaIiBpZD0iT3ZhbC0yIiBmaWxsPSIjM0IzQjNCIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+PHBhdGggZD0iTTExLDY4LjcxMzU0MTcgQzE2LjUyMjg0NzUsNjguNzEzNTQxNyAyMSw2NC40MDM5ODAxIDIxLDU5LjUzMzA4MjMgQzIxLDU0LjY2MjE4NDUgMTYuNTIyODQ3NSw1MC43MTM1NDE3IDExLDUwLjcxMzU0MTcgQzUuNDc3MTUyNSw1MC43MTM1NDE3IDEsNTQuNjYyMTg0NSAxLDU5LjUzMzA4MjMgQzEsNjQuNDAzOTgwMSA1LjQ3NzE1MjUsNjguNzEzNTQxNyAxMSw2OC43MTM1NDE3IFoiIGlkPSJPdmFsLTEiIGZpbGw9IiMzQjNCM0IiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiLz48L2c+PC9zdmc+)}\
.magic-media{width:200px;height:200px;}.magic-media.video{background-color:black;}.magic-audio-min,.magic-audio-min:after {width:100px;height:100px;text-align:left;}.magic-audio-min:after{content:"";background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNSkiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9InJnYmEoMjU1LCAyNTUsIDI1NSwgMCkiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgc3R5bGU9ImZpbGw6dXJsKCNncmFkKTsiIC8+PC9zdmc+);background-size:contain;position:absolute;box-shadow:0 1px 2px rgba(0,0,0,.4),1px 1px 1px rgba(255,255,255,.5) inset;}\
.tracklist-scrollbox{width:350px;height:245px;overflow:auto;}.o-track-list{padding:0 2px;}.tracktime,#chkx-del_selected{float:right;}#magic-audio-player{font-family:"Helvetica Neue",Arial,sans-serif;font-size:12px;}.o-track-list,.tracktime{color:rgba(0,0,0,.5);}.o-track-list a{color:#333;text-decoration:none;}\
.o-track-list li{cursor:pointer;border-bottom:1px solid #f0f0f0;line-height:24px;padding:0 3px;}\
#now_playing{background-color: rgba(0,0,0,.5);border:none;color:#ddd;box-shadow:0 0 2px #000;}#now_playing > *{color:#fefefe;}#hp_progbar{background-color:white;width:22px;height:12px;position:relative;cursor:pointer;}\
.forvardarrow{background:url(/src/svg/1601/forvard-button.svg)no-repeat scroll center / 40%;}.hp-controls{height:18px;width:20%;cursor:pointer;}\
.hp-info,.hp-controls{display:inline-block;vertical-align:bottom;}.duration{width:205px;border:1px solid #ccc;}\
.hp-info{text-overflow:ellipsis;max-width:210px;overflow:hidden;white-space:nowrap;margin:0 1%;}\
.hp-play-btn{position:absolute;width:40px;height:40px;cursor:pointer;right:10px;filter:invert(30%);}.hp-inf-ctrl{height:100px;text-align:left;color:#777;}\
#hp_dropbox_layer{position:absolute;width:100%;height:100%;color:#d2d2d2;font:small-caps 1.5em Arial;text-align:center;bottom:0;right:0;background:rgba(0,0,0,.8) url(/src/svg/1409/DropArrow.svg)no-repeat scroll center;filter:invert(80%);}\
.rating-option{cursor:default;}.sfw:before{content:"SFW";color:green;}.r15:before{content:"R-15";color:#808000;}.r18:before{content:"R-18";color:#a25c18;}.r18g:before{content:"R-18G";color:darkred;}\
.rating-option:hover:before{color:#fff!important;}.rating-option.sfw:hover{background-color:#3fa53f;}.rating-option.r15:hover{background-color:#a3ae36;}.rating-option.r18:hover{background-color:#d5802d;}.rating-option.r18g:hover{background-color:#cf2323;}\
.modermenu{padding:2px 0;color:#5a989b;}.modermenu:before{content:"[ ";}.modermenu:after{content:" ]";}.active > .modermenu:before,.active > .modermenu:after{color:transparent;text-shadow:none;}\
@-webkit-keyframes blinker{0%{opacity:1.0;}50%{opacity:0.0;}100%{opacity:1.0;}}@keyframes blinker{0%{opacity:1.0;}50%{opacity:0.0;}100%{opacity:1.0;}}\
@keyframes onReady{50% {opacity:0;}} @-webkit-keyframes onReady{50% {opacity:0;}}'+ mesShadows + mesAnimations;
	
	MagicExtension();
	
	_z.append(document.head, [
		_z.setup('script', {'type': 'application/javascript', 'src': '/src/js/1601/AVAudioFramework.min.js'}),
		_z.setup('style', {'text': MagicStyle})
	]);
}

function parse_audio_metadata(e,n,t){function a(e){var t={}
t[v]=e.getASCIIText(3,30)||g[v],t[T]=e.getASCIIText(33,30),t[I]=e.getASCIIText(63,30),t[f]=e.getASCIIText(93,4),t[m]=e.getASCIIText(97,30)||g[m]
for(var a in t){var r=t[a].indexOf("\x00")
g[a]=-1!==r?t[a].substring(0,r):t[a]}g[h]=0===e.getUint8(125)?e.getUint8(126):g[h]||0,g[p]=R[e.getUint8(127)]||"",n(g)}function r(t){function a(e){for(c&&e.advance(e.readUnsignedInt());e.index<e.byteLength;){var t,a,s
if(0===e.getUint8(e.index))break
switch(o){case 2:t=e.readASCIIText(3),a=e.readUint24(),s=0
break
case 3:t=e.readASCIIText(4),a=e.readUnsignedInt(),s=e.readUnsignedShort()
break
case 4:t=e.readASCIIText(4),a=e.readID3Uint28BE(),s=e.readUnsignedShort()}var d=e.index+a,l=P[t]
if(l)if(0===(255&s)){try{var u=null
switch(t){case"TIT2":case"TT2":case"TPE1":case"TP1":case"TALB":case"TAL":case"TORY":case"TDOR":case"TYER":case"TYE":case"TDRC":u=i(e,a)
break
case"TRCK":case"TRK":case"PCNT":case"CNT":u=parseInt(i(e,a))
break
case"APIC":case"PIC":u=r(e,a,t)
break
case"TCON":case"TCO":u=i(e,a)||"",u=new String(u).replace(/^\(?([0-9]+)\)?$/,function(e,n){return R[parseInt(n)]})
break
case"POPM":case"POP":u=i(e,a,0),isNaN(parseInt(u))&&(u=e.readUnsignedByte()),u=0==u?0:64>u?1:128>u?2:192>u?3:255>u?4:5}u&&(g[l]=u)}catch(f){console.warn("Error parsing mp3 metadata tag",t,":",f)}e.index=d}else console.warn("Skipping",t,"tag with flags",s),e.index=d
else e.index=d}n(g)}function r(n,t,a){var r,o=n.index,s=n.readUnsignedByte()
if("PIC"===a)switch(n.readASCIIText(3)){case"JPG":r="image/jpeg"
break
case"PNG":r="image/png"}else r=n.readNullTerminatedLatin1Text(t-1)
var c=(n.readUnsignedByte(),i(n,t-(n.index-o),s),n.sliceOffset+n.viewOffset+n.index),d=t-(n.index-o)
return e.slice(c,c+d,r)}function i(e,n,t){switch(void 0===t&&(t=e.readUnsignedByte(),n-=1),t){case 0:return e.readNullTerminatedLatin1Text(n)
case 1:return e.readNullTerminatedUTF16Text(n,void 0)
case 2:return e.readNullTerminatedUTF16Text(n,!1)
case 3:return e.readNullTerminatedUTF8Text(n)
default:throw Error("unknown text encoding")}}t.index=3
var o=t.readUnsignedByte()
if(o>4)return console.warn("mp3 file with unknown metadata version"),void n(g)
var s=(t.readUnsignedByte(),t.readUnsignedByte()),c=0!==(64&s),d=t.readID3Uint28BE()
t.getMore(t.index,d,a)}function i(a){function r(e,n){var t=e.getUint8(26+n),a=e.getUnsignedByteArray(27+n,t),r=Array.reduce(a,i,0)
return{numberSegments:t,segmentLengths:a,sectionLength:27+n+t+r,offsetLength:27+n+t,length:r}}function i(e,n){return e+n}switch(a.getASCIIText(28,4)){case"Opus":case"FLA":case"vor":break
default:return t("malformed ogg comment packet")}BlobView.get(e,0,e.size,function(e,i){if(i)return void t(i)
for(var o={string:"",length:0,total:0},s={0:r(a,0)},c=0;s[c];){c++
try{s[c]=r(e,s[c-1].sectionLength)
var d=s[c].offsetLength
if(1===c){var f=e.getInt8(d)
switch(d+=4,f){case 79:d+=1
case 3:d+=3}var v=e.getUint32(d,!0)
d+=4+v,o.total=e.getInt8(d),d+=4}for(;o.total>0;o.total--){0===o.length&&(o.length=e.getUint32(d,!0),d+=4)
var T=s[c].sectionLength-d
if(o.length>T){o.string+=e.getUTF8Text(d,T),o.length-=T
break}o.string+=e.getUTF8Text(d,o.length)
var I=o.string.split("="),h=B[I[0].toUpperCase()]
h&&I[1]&&(g[h]=I[1]),d+=o.length,o.length=0,o.string=""}if(!o.total)break}catch(m){console.warn(m)
break}}if(g[k]){var p=l(g[k]),x=new Blob([p])
u(x)}else n(g)})}function o(e){function t(e){switch(e.block_type){case 4:i(e.view),s=!0
break
case 6:g.picture=new Blob([e.view.buffer]),c=!0}return!s||!c}function a(e){return r(e).then(function(e){t(e)&&!e.last?(e.view.advance(e.length-e.view.index),a(e.view)):g[k]?u(g[k]):n(g)})}function r(e){return new Promise(function(n,t){var a=e.readUnsignedByte(),r=128===(128&a),i=127&a,o=e.readUint24(!1)
e.getMore(e.viewOffset+e.index,o+4,function(e,a){return a?void t(a):void n({last:r,block_type:i,length:o,view:e})})})}function i(e){var n=e.readUnsignedInt(!0)
e.advance(n)
for(var t=e.readUnsignedInt(!0),a=0;t>a;a++)try{var r=o(e)
r&&(g[r.field]=r.value)}catch(i){console.warn("Error parsing vorbis comment",i)}}function o(e){var n=e.readUnsignedInt(!0),t=e.readUTF8Text(n),a=t.indexOf("=")
if(-1===a)throw new Error("missing delimiter in comment")
var r=t.substring(0,a).toUpperCase().replace(" ",""),i=B[r]
if(i){var o=t.substring(a+1)
return{field:i,value:o}}return null}e.seek(4)
var s=!1,c=!1
a(e)}function s(e,n){var t=e.getASCIIText(8,4)
if(t in n)return!0
for(var a=16,r=e.getUint32(0);r>a;){var i=e.getASCIIText(a,4)
if(a+=4,i in n)return!0}return!1}function c(a){function r(e){try{var a=e.sliceOffset+e.viewOffset,o=e.readUnsignedInt(),s=e.readASCIIText(4)
0===o?o=e.blob.size-a:1===o&&(o=4294967296*e.readUnsignedInt()+e.readUnsignedInt()),"moov"===s?e.getMore(a,o,function(e){try{i(e,o),n(g)}catch(a){t(a)}}):a+o+16<=e.blob.size?e.getMore(a+o,16,r):n(g)}catch(c){t(c)}}function i(e,n){for(e.advance(8);e.index<n;){var t=e.readUnsignedInt(),a=e.readASCIIText(4),r=e.index+t-8
if("udta"===a)c(e,n),e.index=r
else if("trak"===a){e.advance(-8)
var i=o(e,"mdia")
if(i){var d=o(i,"minf")
if(d){var l=(s(d,"vmhd"),s(d,"smhd"))
if(l){var u=o(d,"stbl")
if(u){var g=o(u,"stsd")
if(g){g.advance(20)
var f=g.readASCIIText(4)
if(!(f in E))throw"Unsupported format in MP4 container: "+f}}}}}e.index=r}else e.advance(t-8)}}function o(e,n){var t=e.index,a=e.readUnsignedInt()
for(e.advance(4);e.index<t+a;){var r=e.readUnsignedInt(),i=e.readASCIIText(4)
if(i===n)return e.advance(-8),e
e.advance(r-8)}return null}function s(e,n){var t=e.index,a=o(e,n)
return e.index=t,a}function c(e,n){for(;e.index<n;){var t=e.readUnsignedInt(),a=e.readASCIIText(4)
if("meta"===a)return d(e,e.index+t-8),void(e.index=n)
e.advance(t-8)}}function d(e,n){for(e.advance(4);e.index<n;){var t=e.readUnsignedInt(),a=e.readASCIIText(4)
if("ilst"===a)return l(e,e.index+t-8),void(e.index=n)
e.advance(t-8)}}function l(e,n){for(;e.index<n;){var t=e.readUnsignedInt(),a=e.readASCIIText(4),r=e.index+t-8,i=y[a]
if(i)try{var o=u(e,r,a)
g[i]=o}catch(s){console.warn("skipping",a,":",s)}e.index=r}}function u(n,t,a){for(;n.index<t;){var r=n.readUnsignedInt(),i=n.readASCIIText(4)
if("data"===i){var o=16777215&n.readUnsignedInt()
n.advance(4)
var s=r-16
if("trkn"===a)return n.advance(2),n.readUnsignedShort()
switch(o){case 1:return n.readUTF8Text(s)
case 13:return e.slice(n.sliceOffset+n.viewOffset+n.index,n.sliceOffset+n.viewOffset+n.index+s,"image/jpeg")
case 14:return e.slice(n.sliceOffset+n.viewOffset+n.index,n.sliceOffset+n.viewOffset+n.index+s,"image/png")
default:throw Error("unexpected type in data atom")}}else n.advance(r-8)}throw Error("no data atom found")}r(a)}function d(e){ForwardLock.getKey(function(a){function r(e,a){parseAudioMetadata(e,function(e){e.locked=!0,a.vendor&&(e.vendor=a.vendor),e[v]||(e[v]=a.name),n(e)},t)}ForwardLock.unlockBlob(a,e,r,t)})}function l(e,n){function t(e){return e>64&&91>e?e-65:e>96&&123>e?e-71:e>47&&58>e?e+4:43===e?62:47===e?63:0}for(var a,r,i=e.replace(/[^A-Za-z0-9\+\/]/g,""),o=i.length,s=n?Math.ceil((3*o+1>>2)/n)*n:3*o+1>>2,c=new Uint8Array(s),d=0,l=0,u=0;o>u;u++)if(r=3&u,d|=t(i.charCodeAt(u))<<18-6*r,3===r||o-u===1){for(a=0;3>a&&s>l;a++,l++)c[l]=d>>>(16>>>a&24)&255
d=0}return c}function u(e){BlobView.get(e,0,e.size,function(e,a){if(a)return void t(a)
var r,i,o,s,c,d={}
d.APIC=e.readUnsignedInt(),r=e.readUnsignedInt(),i=e.readASCIIText(r),o=e.readUnsignedInt(),d.name=e.readASCIIText(o),d.width=e.readUnsignedInt(),d.height=e.readUnsignedInt(),d.depth=e.readUnsignedInt(),d.index=e.readUnsignedInt(),s=e.readUnsignedInt(),c=e.readUnsignedByteArray(s),g[k]=new Blob([c],{type:i})
for(var l in d)g[k][l]=d[l]
n(g)})}var g={},f="year",v="title",T="artist",I="album",h="tracknum",m="comment",p="genre",k="picture",x="rated",C="played"
if(g[x]=g[C]=0,t=t||function(e){console.warn(e)},e.size<128)return void t("file is empty or too small")
if(e.name){var A=(e.name.match(/[^\.]+$/)||["*"])[0],U=e.name.lastIndexOf("/"),b=e.name.lastIndexOf("."+A)||e.name.length,w=e.name.substring(0,U),S=e.name.substring(U+1,b)
switch(g[v]=S.replace(/\_/g," ").replace(/^\d*(?:\s-|\.)?\s/,"").replace(/\s(?:\[|\(|\{).+(?:\)|\]|\})/,""),g[m]=(S.match(/(?:\[|\(|\{).+(?:\)|\]|\})/)||[""])[0],g[h]=Number((S.match(/^\d*/)||[0])[0]),A){case"3gp":if("DCIM/"!==w)break
case"m4v":return void t("skipping "+A+" video file")}}var R=["Blues","Classic Rock","Country","Dance","Disco","Funk","Grunge","Hip-Hop","Jazz","Metal","New Age","Oldies","Other","Pop","R&B","Rap","Reggae","Rock","Techno","Industrial","Alternative","Ska","Death Metal","Pranks","Soundtrack","Euro-Techno","Ambient","Trip-Hop","Vocal","Jazz+Funk","Fusion","Trance","Classical","Instrumental","Acid","House","Game","Sound Clip","Gospel","Noise","AlternRock","Bass","Soul","Punk","Space","Meditative","Instrumental Pop","Instrumental Rock","Ethnic","Gothic","Darkwave","Techno-Industrial","Electronic","Pop-Folk","Eurodance","Dream","Southern Rock","Comedy","Cult","Gangsta Rap","Top 40","Christian Rap","Pop / Funk","Jungle","Native American","Cabaret","New Wave","Psychedelic","Rave","Showtunes","Trailer","Lo-Fi","Tribal","Acid Punk","Acid Jazz","Polka","Retro","Musical","Rock & Roll","Hard Rock","Folk","Folk-Rock","National Folk","Swing","Fast Fusion","Bebob","Latin","Revival","Celtic","Bluegrass","Avantgarde","Gothic Rock","Progressive Rock","Psychedelic Rock","Symphonic Rock","Slow Rock","Big Band","Chorus","Easy Listening","Acoustic","Humour","Speech","Chanson","Opera","Chamber Music","Sonata","Symphony","Booty Bass","Primus","Porn Groove","Satire","Slow Jam","Club","Tango","Samba","Folklore","Ballad","Power Ballad","Rhythmic Soul","Freestyle","Duet","Punk Rock","Drum Solo","A Cappella","Euro-House","Dance Hall","Goa","Drum & Bass","Club-House","Hardcore","Terror","Indie","BritPop","Negerpunk","Polsk Punk","Beat","Christian Gangsta Rap","Heavy Metal","Black Metal","Crossover","Contemporary Christian","Christian Rock","Merengue","Salsa","Thrash Metal","Anime","JPop","Synthpop","Abstract","Art Rock","Baroque","Bhangra","Big Beat","Breakbeat","Chillout","Downtempo","Dub","EBM","Eclectic","Electro","Electroclash","Emo","Experimental","Garage","Global","IDM","Illbient","Industro-Goth","Jam Band","Krautrock","Leftfield","Lounge","Math Rock","New Romantic","Nu-Breakz","Post-Punk","Post-Rock","Psytrance","Shoegaze","Space Rock","Trop Rock","World Music","Neoclassical","Audiobook","Audio Theatre","Neue Deutsche Welle","Podcast","Indie Rock","G-Funk","Dubstep","Garage Rock","Psybient"],P={TIT2:v,TT2:v,TPE1:T,TP1:T,TALB:I,TAL:I,TRCK:h,TRK:h,APIC:k,PIC:k,POPM:x,POP:x,PCNT:C,CNT:C,TORY:f,TDOR:f,TYER:f,TYE:f,TDRC:f,TCON:p,TCO:p},y={"©alb":I,"©art":T,"©ART":T,aART:T,"©nam":v,trkn:h,covr:k,Year:f},B={DATE:f,TITLE:v,ARTIST:T,ALBUM:I,TRACKNUMBER:h,COMMENTS:m,COMMENT:m,GENRE:p,METADATA_BLOCK_PICTURE:k},O={"M4A ":!0,"M4B ":!0,mp41:!0,mp42:!0,isom:!0,iso2:!0},E={mp4a:!0,samr:!0,sawb:!0,sawp:!0,alac:!0},M=Math.min(65536,e.size)
BlobView.get(e,0,M,function(l,u){if(u)return void t(u)
try{var f=l.getASCIIText(0,12)
if("LOCKED 1 "===f.substring(0,9))return void d(e)
if("ID3"===f.substring(0,3))r(l)
else if("OggS"===f.substring(0,4))i(l)
else if("fLaC"===f.substring(0,4))o(l)
else if("ftyp"===f.substring(4,8)){if(s(l,O))return void c(l)
t("Unknown MP4 file type")}else 65530===(65534&l.getUint16(0,!1))?BlobView.get(e,e.size-128,128,function(e,r){if(r)return void t(r)
try{var i=e.getASCIIText(0,3)
"TAG"===i?a(e):n(g)}catch(o){t(o)}}):t("Unplayable music file")}catch(v){console.error("parseAudioMetadata:",v,v.stack),t(v)}})}
var BlobView=function(){function e(e){throw Error(e)}function t(e,t,n,i,r,a,s){this.blob=e,this.sliceOffset=t,this.sliceLength=n,this.slice=i,this.viewOffset=r,this.viewLength=a,this.littleEndian=s,this.view=new DataView(i,r,a),this.buffer=i,this.byteLength=a,this.byteOffset=r,this.index=0}return t.get=function(n,i,r,a,s){0>i&&e("negative offset"),0>r&&e("negative length"),i>n.size&&e("offset larger than blob size"),i+r>n.size&&(r=n.size-i)
var o=n.slice(i,i+r),d=new FileReader
d.readAsArrayBuffer(o),d.onloadend=function(){var e=null
d.result&&(e=new t(n,i,r,d.result,0,r,s||!1)),a(e,d.error)}},t.prototype={constructor:t,getMore:function(e,n,i){e>=this.sliceOffset&&e+n<=this.sliceOffset+this.sliceLength?i(new t(this.blob,this.sliceOffset,this.sliceLength,this.slice,e-this.sliceOffset,n,this.littleEndian)):t.get(this.blob,e,n,i,this.littleEndian)},littleEndian:function(){this.littleEndian=!0},bigEndian:function(){this.littleEndian=!1},getUint8:function(e){return this.view.getUint8(e)},getInt8:function(e){return this.view.getInt8(e)},getUint16:function(e,t){return this.view.getUint16(e,void 0!==t?t:this.littleEndian)},getInt16:function(e,t){return this.view.getInt16(e,void 0!==t?t:this.littleEndian)},getUint32:function(e,t){return this.view.getUint32(e,void 0!==t?t:this.littleEndian)},getInt32:function(e,t){return this.view.getInt32(e,void 0!==t?t:this.littleEndian)},getFloat32:function(e,t){return this.view.getFloat32(e,void 0!==t?t:this.littleEndian)},getFloat64:function(e,t){return this.view.getFloat64(e,void 0!==t?t:this.littleEndian)},readByte:function(){return this.view.getInt8(this.index++)},readUnsignedByte:function(){return this.view.getUint8(this.index++)},readShort:function(e){var t=this.view.getInt16(this.index,void 0!==e?e:this.littleEndian)
return this.index+=2,t},readUnsignedShort:function(e){var t=this.view.getUint16(this.index,void 0!==e?e:this.littleEndian)
return this.index+=2,t},readInt:function(e){var t=this.view.getInt32(this.index,void 0!==e?e:this.littleEndian)
return this.index+=4,t},readUnsignedInt:function(e){var t=this.view.getUint32(this.index,void 0!==e?e:this.littleEndian)
return this.index+=4,t},readFloat:function(e){var t=this.view.getFloat32(this.index,void 0!==e?e:this.littleEndian)
return this.index+=4,t},readDouble:function(e){var t=this.view.getFloat64(this.index,void 0!==e?e:this.littleEndian)
return this.index+=8,t},tell:function(){return this.index},remaining:function(){return this.byteLength-this.index},seek:function(t){0>t&&e("negative index"),t>this.byteLength&&e("index greater than buffer size"),this.index=t},advance:function(t){var n=this.index+t
0>n&&e("advance past beginning of buffer"),n>this.byteLength&&e("advance past end of buffer"),this.index=n},getUnsignedByteArray:function(e,t){return new Uint8Array(this.buffer,e+this.viewOffset,t)},readUnsignedByteArray:function(e){var t=new Uint8Array(this.buffer,this.index+this.viewOffset,e)
return this.index+=e,t},getBit:function(e,t){var n=this.view.getUint8(e)
return 0!==(n&1<<t)},getUint24:function(e,t){var n,i,r
return(void 0!==t?t:this.littleEndian)?(n=this.view.getUint8(e),i=this.view.getUint8(e+1),r=this.view.getUint8(e+2)):(r=this.view.getUint8(e),i=this.view.getUint8(e+1),n=this.view.getUint8(e+2)),(r<<16)+(i<<8)+n},readUint24:function(e){var t=this.getUint24(this.index,e)
return this.index+=3,t},getASCIIText:function(e,t){var n=new Uint8Array(this.buffer,e+this.viewOffset,t)
return String.fromCharCode.apply(String,n)},readASCIIText:function(e){var t=new Uint8Array(this.buffer,this.index+this.viewOffset,e)
return this.index+=e,String.fromCharCode.apply(String,t)},getUTF8Text:function(e,t){function n(){throw new Error("Illegal UTF-8")}for(var i,r,a,s,o,d=e,u=e+t,c="";u>d;){var r=this.view.getUint8(d)
128>r?(c+=String.fromCharCode(r),d+=1):194>r?n():224>r?(d+1>=u&&n(),a=this.view.getUint8(d+1),(128>a||a>191)&&n(),i=((31&r)<<6)+(63&a),c+=String.fromCharCode(i),d+=2):240>r?(d+2>=u&&n(),a=this.view.getUint8(d+1),(128>a||a>191)&&n(),s=this.view.getUint8(d+2),(128>s||s>191)&&n(),i=((15&r)<<12)+((63&a)<<6)+(63&s),c+=String.fromCharCode(i),d+=3):245>r?(d+3>=u&&n(),a=this.view.getUint8(d+1),(128>a||a>191)&&n(),s=this.view.getUint8(d+2),(128>s||s>191)&&n(),o=this.view.getUint8(d+3),(128>o||o>191)&&n(),i=((7&r)<<18)+((63&a)<<12)+((63&s)<<6)+(63&o),i-=65536,c+=String.fromCharCode(55296+((1047552&i)>>>10)),c+=String.fromCharCode(56320+(1023&i)),d+=4):n()}return c},readUTF8Text:function(e){try{return this.getUTF8Text(this.index,e)}finally{this.index+=e}},getID3Uint28BE:function(e){var t=127&this.view.getUint8(e),n=127&this.view.getUint8(e+1),i=127&this.view.getUint8(e+2),r=127&this.view.getUint8(e+3)
return t<<21|n<<14|i<<7|r},readID3Uint28BE:function(){var e=this.getID3Uint28BE(this.index)
return this.index+=4,e},readNullTerminatedLatin1Text:function(e){for(var t="",n=unescape("%u0402%u0403%u201A%u0453%u201E%u2026%u2020%u2021%u20AC%u2030%u0409%u2039%u040A%u040C%u040B%u040F%u0452%u2018%u2019%u201C%u201D%u2022%u2013%u2014%u0000%u2122%u0459%u203A%u045A%u045C%u045B%u045F%u00A0%u040E%u045E%u0408%u00A4%u0490%u00A6%u00A7%u0401%u00A9%u0404%u00AB%u00AC%u00AD%u00AE%u0407%u00B0%u00B1%u0406%u0456%u0491%u00B5%u00B6%u00B7%u0451%u2116%u0454%u00BB%u0458%u0405%u0455%u0457"),i=function(e){return e>=192&&255>=e?String.fromCharCode(e-192+1040):e>=128&&191>=e?n.charAt(e-128):String.fromCharCode(e)},r=0;e>r;r++){var a=this.view.getUint8(this.index+r)
if(0===a){r++
break}t+=i(a)}return this.index+=r,t},readNullTerminatedUTF8Text:function(e){for(var t=0;e>t&&0!==this.view.getUint8(this.index+t);t++);var n=this.readUTF8Text(t)
return e>t&&this.advance(1),n},readNullTerminatedUTF16Text:function(e,t){if(null==t){var n=this.readUnsignedShort()
e-=2,t=65279===n?!1:!0}for(var i="",r=0;e>r;r+=2){var a=this.getUint16(this.index+r,t)
if(0===a){r+=2
break}i+=String.fromCharCode(a)}return this.index+=r,i}},{get:t.get}}()
