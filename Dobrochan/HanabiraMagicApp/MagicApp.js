// ==UserScript==
// @name    		Hanabira MagicApp
// @namespace   	magicode
// @description 	--
// @homepage		
// @updateURL   	
// @downloadURL 	
// @include 		*dobrochan.*
// @exclude 		*dobrochan.*/src/*
// @exclude 		*dobrochan.*/utils/*
// @version 		1.0-pre
// @run-at  		document-start
// @grant   		none
// ==/UserScript==
window.stop();

(function initStore() {
	try { 
		var User = JSON.parse(localStorage.getItem('User'));
		if (localStorage.getItem('oEmbedAPI') == 'false') {
			sessionStorage.setItem('LinksCache', '{}');
		}
		if (!User || !User.tokens[0] || User.modified) {
			var apiReq = new XMLHttpRequest();
				apiReq.open('GET', '/api/user.json', true);
				apiReq.onreadystatechange = function() {
					if (this.readyState !== 4)
						return;
					if (this.status === 200) {
						localStorage.setItem('User', this.responseText);
						MagicApp();
					}
				}
				apiReq.send(null);
		} else {
			MagicApp();
		}
	} catch(e) {
		console.error(e);
	}
})();

//function ThreadListener(data) {
//	
//	this['Node']  = _z.setup('div', {'id': 'thread_'+ data.map.join('-'), 'class': 'thread'});
//	this['Posts'] = this['Node'].getElementsByClassName('post');
//}

function MagicApp(){
	var HM = {
		ThreadListener: {},
		zIndex: 0, DragableObj: null, Played: null, LastKey: null,
		LoadedPosts: {}, VActive: [], RepliesMap: {}, AlbumArts: {}, URL: ParseUrl(),
		LinksMap: JSON.parse(_z.sessionS.get('LinksCache', '{}')),
		UserStyle: JSON.parse(_z.localS.get('UserStyle', '""')),
		oEmbedAPI: _z.localS.get('oEmbedAPI', true),
		maXrating: _z.localS.get('maXrating', 'SFW'),
		AutoUpdate: _z.sessionS.get('AutoUpdate', true),
		SoundNotify: _z.sessionS.get('SoundNotify', false),
		AttachPopups: _z.localS.get('AttachPopups', true),
		User: JSON.parse(_z.localS.get('User', '{}'))
	},
	//Megia = {
	//	'video': new MagicContent(),
	//	'scbc': new MagicContent(),
	//	'docs': new MagicContent(true),
	//	'pdf': new MagicContent(true)
	//},
	Files = {
		audio: ['wav', 'm4a', 'm4r', 'aac', 'ogg', 'mp3', 'opus', 'flac', 'alac'],
		video: ['webm', 'ogv', 'ogm', 'mp4', 'm4v', 'flv', '3gp', 'swf'],
		image: ['jpeg', 'jpg', 'png', 'svg', 'gif'],
		arch: ['zip', 'rar', '7z']},
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
		wsec: ['Wait a Second...', 'Секунду...'],
		subscrb: ["Subscribe", "Отслеживать"],
		postdel: ["Post is deleted.", "Пост удалён."],
		txtspoils: ["Disclose text spoilers", "Раскрывать текстовые спойлеры"],
		clck_img_to: [" - Click the image", " - Нажмите на картинку"],
		cens: ['Your censorship settings forbid this file.', 'Ваши настройки цензуры запрещают этот файл.'],
		expd: [" to expand", " для увеличения"],
		vitf: [" to view this file", " для просмотра"],
		pvid: [" to play video", " для воспроизведения"],
		allw: ["allowed", "раскрытых"],
		remv: ["Remove", "Убрать"],
		clos: ["Close", "Закрыть"],
		page: [" page", " страниц"],
		line: [" line", " строк"],
		all: [" All", " все"],
		add: ["Add", "Добавить"],
		hidden: [
			['Hidden ', 'Cкрытый '],
			['Thread', 'тред'],
			['Post', 'пост']
		],
		names: {
			'en': ['Anonymous', 'Developer', 'Lawrense', 'Anonymous Expert', 'Slowpoke', 'Experimenter'],
			'ru': ['Анонимус', 'Доброкодер', 'Лоуренс', 'Анонимный эксперт', 'Добропок', 'Экспериментатор']
		},
		tm: {
			's': ['sec', 'cек'],
			'm': ['min', 'мин'],
			'h': ['h', 'ч']
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
		]
	}
	
	var locationThread, UrlCache = HM.LinksMap, unread_count = 0,
		lng = (LC.lng.indexOf(HM.User.language) > -1 ? LC.lng.indexOf(HM.User.language) : 1),
		Chanabira = new CharmingHanabira()/*, mEl = new MagicElements(), Nagato = new Yuki();*/
	
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
	String.prototype.hashCode = function() {
		var hash = 0, i, chr, len;
		if (this.length == 0) return hash;
		for (i = 0, len = this.length; i < len; i++) {
			chr   = this.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
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
	
	function escapeUrl(url) {
		var eUrl = encodeURI(url).allReplace({'%2?5?E2%2?5?80%2?5?8B': '', '%2?5?3C/?\\w*%2?5?3E': '', '%2?5?22': ''});
		return decodeURI(eUrl);
	}
	function escapeRegExp(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}
	function getPageName(url, r) {
		var a = url.split('/'), p = a.pop(), out = !p ? a.pop() : p;
		return r ? out : decodeURIComponent(out);
	}
	function ParseUrl(url) {
		var m = (url || document.location.href).match(/(?:https?:\/\/([^\/]+))?\/([^\/]+)\/(?:(\d+)|res\/(\d+)|(\w+))(?:\.x?html)?(#i?(\d+))?/);
		return m ? {host: m[1], board: m[2], page: m[3], thread: m[4], desk: m[5], pointer: m[6], pid: m[7]} : {};
	}
	function GetElements(el) { 
		var node = el || document;
		return { posts: node.getElementsByClassName('post'),
			images: node.querySelectorAll('.file > a > img.thumb[onclick^="expand_image"], .file > a[href$=".svg"] > img'),
			hoos: node.querySelectorAll('.reply-button, .reply-link, .cm-button, .spr-image, .ma-button, .sp-r'),
			links: node.querySelectorAll('.postbody a:not(#cm-link):not(.reply-link)'),
			elements: node.querySelectorAll('.reply_, .file > a[href$=".swf"] > img, img[alt^="r-1"]:not(.spr-image), img[alt="unrated"]:not(.spr-image), img[alt="illegal"]:not(.spr-image), .file > a > img[src="/thumb/generic/sound.png"], .file > a[href$=".webm"] > img, .file > a[href$=".pdf"] > img, .file > a > img[onclick^="open_url"]')
		}
	}
	function _show (el) { el.classList.remove('hidout') }
	function _shide(el) { el.classList.toggle('hidout') }
	function _hide (el) { el.classList.add('hidout') }
	function _cid(pid) {
		var n = new RegExp(/(\d+)/).exec(pid);
		return Number((n[1] || 0));
	}
	function _unc(str, n) {
		return str ? str : (n || 'Unknown');
	}
	function _stub(tag, html) {
		var stb = _z.setup('div', {'html': html}, null);
		return stb.querySelector(tag);
	}
	function _bitonum(arr, hex) {
		var hexNum = "";
		for (var i = 0; i < arr.length; i++) {
			hexNum += arr[i].toString(16);
		}
		return hex ? '0x'+ hexNum : parseInt(hexNum, 16);
	}
	function _b64Str(arr) {
		var base64String = "";
		for (var i = 0; i < arr.length; i++) {
			base64String += String.fromCharCode(arr[i]);
		}
		return btoa(base64String)
	}
	function _urlHash(url) {
		return url.replace(/https?:\/\//, '').hashCode().toString();
	}
	
	/************************************************************************/
	function getDataResponse(uri, Fn) {
		var apiReq = new XMLHttpRequest();
		apiReq.open('GET', uri, true);
		apiReq.onreadystatechange = function() {
			if (this.readyState !== 4)
				return;
			if (this.status === 304) {
				console.warn('304 ' + this.statusText);
			} else {
				try {
					var json = JSON.parse(this.responseText);
				} catch(e){
					console.log(e.toString())
				} finally {
					Fn(this.status, this.statusText, (json || this.responseText), this);
					Fn = null;
				}
			}
		}
		apiReq.send(null);
	}
	function getFileReaderData(readAs, file, Fn) {
		var reader = new FileReader();
		reader.onload = function() {
			if (this.readyState < 1) {
				console.warn('No data has been loaded yet.');
				return;
			}
			if (this.error) {
				console.warn(this.error);
			} else {
				try {
					var data = this.result;
				} catch(e) {
					console.log(e.toString());
				} finally {
					Fn(data, this);
					Fn = null;
				}
			}
		}
		switch (readAs.toLowerCase()) {
			case 'text': reader.readAsText(file, 'UTF-8');
				break;
			case 'string': reader.readAsBinaryString(file);
				break;
			case 'dataurl': reader.readAsDataURL(file);
				break;
			case 'arraybuffer': reader.readAsArrayBuffer(file);
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
	
	function getElementByXpath(path, value) {
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
		return document.evaluate(path, document.body, null, XPathResult[V], null);
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
	
	function bytesMagnitude(bytes) {
		return (bytes < 1024 ? bytes +' B' :
				bytes < 1024 * 1024 ? (bytes / 1024).toFixed(2) +' KB' :
				bytes < 1024 * 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(2) +' MB' :
											(bytes / 1024 / 1024 / 1024).toFixed(2) +' GB');
	}
	
	function getDateTime(jsonDT) {
		var date = new RegExp(/(?:(\d*)\-(\d*)\-(\d*)|(\d*)\s(\w*)\s(\d*)\s\(\w*\))\s(\d*\:\d*)(\:\d*)?/gm).exec(jsonDT),
			year = (date[1] || date[6]), month = (date[2] || date[5]), day = (date[3] || date[4]), hmin = date[7], sec = (date[8] || ''),
			uDate = new Date(month +" "+ day +", "+ year +" "+ hmin + " GMT+0300"),
			Time = uDate.toLocaleTimeString(),
			Month = LC.Month[uDate.getMonth()][lng],
			Weekday = LC.Weekday[uDate.getDay()][lng],
			Day = uDate.getDate(), Year = uDate.getFullYear();
		return '\n<span class="posterdate">'+ (Day < 10 ? "0" : '') + Day +" "+ Month +" "+ Year +" "+ Weekday +" "+
			(Time.length === 7 ? "0" + Time.slice(0, 4) : Time.slice(0, 5)) +'<span class="t-sec">'+ sec +'</span></span>';
	}
	
	function parseMessageText(txt) {
		var nreg = /\>\>(?:\/(\w*)\/)?(\d+)/gmi;
		var quot = /^(>[>\s]*)(.+)$/gmi;
		var ureg = /h?\wtps?:?\/\/([\d\w.(A-я)/?\-=&#@%][^\s`<">']+)/gmi;
		return txt
			.replace(ureg, function(url, uri) {
				return '<a href="//'+ uri.replace(/_/g, '%5F') +
				'" rel="nofollow">'+ url.replace(/_/g, '&#95;') +'</a>';
			})
			.replace(/%%(.+?)%%/g, '<span class="spoiler">$1</span>')
			.replace(/\*\*([^\s].+?[^\s])\*\*/g, '<b>$1</b>')
			.replace(/(?:\*|_)([^\s].+?[^\s])(?:_|\*)/g, '<i>$1</i>')
			.replace(/%%\r\n([\s\S]+?)\r\n%%/g, '<div class="spoiler">$1</div>')
			.replace(nreg, function(nav, desk, pid) {
				var link_tamplate = '<a href="/r{desk}/res/r{tid}.xhtml#ir{pid}">&gt;&gt;r{pid}</a>';
				return link_tamplate.allReplace({'r{desk}': (!desk ? HM.URL.board : desk), 'r{tid}': HM.URL.thread, 'r{pid}': pid});
			})
			.replace(quot, function(str, qts, text) {
				var len = qts.match(/>/g).length;
				return '<span class="quote qt-'+ (len > 3 ? 3 : len) +'">'+ text +'</span>';
			})
			.replace(/\n/gm, '<br>')
	}
	
	function getDefaultName(name) {
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
	}
	
	function markAsRead(e) {
		unread_count--;
		_z.each([this, this.previousElementSibling, this.nextElementSibling], function(rp) {
			if (rp) {
				rp.removeEventListener('click', markAsRead, false);
				rp.classList.remove('new');
			}
		});
		Tinycon.setBubble(unread_count);
	}
	
	/*** Magic Thread Listener ***/
	function MagicThreadListener(Thread) {
		var MListen = this, CiD, Inner, thread_updating, play_notify,
			Timer = { id: 0, offset: 0, ql: UpdateInterval(0) },
			Count = { dif: 0, new: 0, del: 0, mod: 0 },
			WarningMsg = _z.setup('strong', {'id': 'warning-massage', 'class': 'blink'}, null),
			ExpCache = new Array(0),
			Notif = _z.setup(new Audio('/src/mp3/1406/musbox.mp3'), {}, {
				'play': function(e) { play_notify = true },
				'ended': function(e) { play_notify = false }
			}),
			MLLC = {
				snd_notify: ["Sound Notifications", "Звуковые уведомления"],
				mrk_to_del: ["Mark to delete", "Отметить для удаления"],
				loadnew: ["Load New Posts", "Подгрузить посты"],
				updprog: ["Updating...", "Обновление..."],
				updauto: ["Autoupdate Thread", "Автообновление треда"],
				unexpt: ["Unexpand Thread", "Свернуть тред"],
				expant: ["Expand Thread", "Развернуть тред"],
				expdin: ["Expanding...", 'Разворачивается...'],
				unexin: ["Unexpanding...", 'Сворачивается...'],
				dsl: {
					'quet': ['Quet Mode', 'Тихий режим'],
					'autotimer': ['Аutotimer', 'Автотаймер'],
					'manual': ['Manual', 'Вручную']
				}
			}
		if (Thread) {
			CiD = _cid(Thread.id)
			Inner = collectPNodes(Thread)
			this.updateThread = updateThread; this.updateTimer = updateTimer;
			function el$(child) { return MListen['NewPostLoader'].querySelector(child) }
			this['NewPostLoader'] = _z.setup('span', {'id': 'new-post-loader', 'html': '<div id="update-stat"><a class="load-new">'+ MLLC.loadnew[lng] +
					'</a></div><label><input id="notif-chbx" type="checkbox" hidden><span class="checkarea"></span>\n'+ MLLC.snd_notify[lng] +
					'</label><br><label><input id="upd-chbx" type="checkbox" hidden><span class="checkarea"></span>\n'+ MLLC.updauto[lng] +
					'</label><ul class="dropdown line-sect" id="timer-update-sets"><li class="dropdown-toggle"><label class="dropdown-label el-li t-sec">'+
					(MLLC.dsl[Timer.ql.value] || checkHTime(Timer.ql.value))[lng] +'</label><ul class="dropdown-menu"><li class="dropdown-item el-li" id="quet-mode-set">'+
					MLLC.dsl['quet'][lng] +'</li><li class="dropdown-item el-li" id="autotimer-set">'+ MLLC.dsl['autotimer'][lng] +'</li><li class="dropdown-item el-li" id="manual-int-set">'+
					MLLC.dsl['manual'][lng] +':\n<input id="int-val" max="180" min="15" type="number"></li></ul></li></ul>'
				}, null);
			this['UpdateStat'] = el$('#update-stat');
			this['DummyLine'] = _z.setup('div', {'class': 'dummy-line', 'html': '<a class="dummy-load">'+ MLLC.loadnew[lng] +'</a>'}, null);
			this['PostsCount'] = _z.setup('label', {'id': 'post-count', 'class': 'etch-text f-left', 'text': Inner.posts.length + LC.omit[lng]}, null);
			this['AllowedPosts'] = _z.setup('label', {'id': 'allowed-posts', 'class': 'etch-text', 'html': '<span class="rl-inf">\n&nbsp;|&nbsp;'+ LC.allw[lng] +':&nbsp;\n</span>'}, null);
			this['LoadButton'] = _z.setup(this['UpdateStat'].firstChild, {}, {
					'click': function(e) { updateThread(e, true) }
				});
			this['DummyButton'] = _z.setup(this['DummyLine'].firstChild, {}, {
					'click': function(e) { updateThread(e, false) }
				});
			this['SoundNotify'] = _z.setup(el$('#notif-chbx'), {'checked': HM.SoundNotify}, {
					'change': function(e) {
						setupOptions(this, 'SoundNotify', true);
					}
				});
			this['AutoUpdate'] = _z.setup(el$('#upd-chbx'), {'checked': HM.AutoUpdate}, {
					'change': function(e) {
						setupOptions(this, 'AutoUpdate', true);
						updateTimer();
					}
				});
			this['setInterval'] = _z.setup(el$('#int-val'), {'value': Timer.ql.int}, null);
			this['UpdateModeMenu'] = _z.setup(el$('#timer-update-sets'), {}, {
					'click': function(e) {
						var val, tbox = this.firstElementChild.firstElementChild;
						if (e.target.tagName === 'INPUT')
							return;
						if (e.target.classList[0] === 'dropdown-item') {
							switch (e.target.id) {
								case 'manual-int-set':
									val = MListen['setInterval'].value;
									tbox.textContent = checkHTime(val)[lng];
									break;
								default:
									val = e.target.id.split('-')[0];
									tbox.textContent = e.target.textContent;
							}
							_z.setlSVal('UpdateMode', val, true);
						}	
						this.firstElementChild.classList.toggle('active');
					}
				});
			this.expandThread = function(e) {
				if (ExpCache.length === 0) {
					statusButton(e.target, 0);
					getHanabiraFullThread(e.target, ExpCache);
				} else {
					_z.after(Thread.firstElementChild, ExpCache);
					e.target.textContent = MLLC.unexpt[lng];
				}
			}
			this.concatThread = function(e) {
				_z.remove(ExpCache);
				e.target.textContent = MLLC.expant[lng];
			}
			this.getFullThread = function() { getHanabiraFullThread('first_time') };
		} else {
			return {
				getPost: getHanabiraPost,
				getFile: getHanabiraFile
			}
		}
		function collectPNodes(thr) {
			return { posts: thr.getElementsByClassName('post'),
				last: function() {
					var last = thr.lastElementChild;
					return last.nodeName === 'FORM' ? last.previousElementSibling : last }
			}
		}
		function UpdateInterval(offset) {
			var t, val = _z.sessionS.get('UpdateMode', 'autotimer');
			if (isNaN(val))
				t = 45 + (offset > 135 ? 135 : offset);
			else
				t = val < 15 ? 45 : val;
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
		function updateCount(jPC) {
			var i = (jPC + Count.mod) - Inner.posts.length - Count.dif,
				n = i > 0 ? i : 0, d = i < 0 ? i : 0;
				Count.dif += i; Count.new += n; Count.del += d;
		}
		function updateTimer() {
			clearTimeout(Timer.id);
			Timer.ql = UpdateInterval(Timer.offset);
			Timer.id = setTimeout(function() {
				if (HM.AutoUpdate) {
					if (Timer.ql.value === 'quet') {
						getDataResponse('/api/thread/'+ HM.URL.board +'/'+ CiD +'.json?new_format',
							function(status, sText, json, xhr) {
								if (json.result) {
									updateCount(json.result.posts_count)
									var postStat = '( '+ (Count.new > 0 ? '+'+ Count.new + LC.newp[lng] : '') +
										' • '+ (Count.del < 0 ? Count.del + LC.delp[lng] : '') +' • '+ (Count.mod > 0 ? Count.mod + LC.pmod[lng] : '') +')';
									MListen['PostsCount'].textContent = Inner.posts.length + LC.omit[lng] + postStat;
								}
							});
						updateTimer();
					} else
						updateThread(15, true);
				}
			}, Timer.ql.int * 1000);
		}
		function statusButton(btn, v) {
			switch (btn.classList[0]) {
				case 'load-new': btn.textContent = [MLLC.updprog[lng], MLLC.loadnew[lng]][v];
					break;
				case 'dummy-load': btn.textContent = [MLLC.updprog[lng], MLLC.loadnew[lng]][v];
					break;
				case 'thread-expand': btn.textContent = [MLLC.expdin[lng], MLLC.expant[lng]][v];
					break;
				case 'thread-concat': btn.textContent = [MLLC.unexin[lng], MLLC.unexpt[lng]][v];
			}
		}
		function updateThread(e, rexk) {
			var UpdBtn = typeof e === 'object' ? e.target : MListen['LoadButton']
			if (thread_updating)
				return;
			thread_updating = true;
			statusButton(UpdBtn, 0)
			getDataResponse('/api/thread/'+ HM.URL.board +'/'+ CiD +'/new.json?new_format&message_html&last_post='+ _cid(Inner.last().id),
			function(status, sText, json, xhr) {
				var i, temp, el, pCount, len, error;
				if (status !== 200 || json.error) {
					error = _z.setup(WarningMsg, {'text': (!json.error ? status +' '+ sText : json.error.message +' '+ json.error.code)}, null);
					error.dozZe = function(e) {
						if (this.iterations >= 8) {
							_z.replace(this, UpdBtn);
							if (rexk)
								updateTimer();
							this.iterations = 0;
						}
					}
					_z.replace(UpdBtn, error);
				} else {
					pCount = json.result.posts_count;
					el = json.result.posts;
					len = el ? el.length : 0;
					Count.dif = Count.new = 0;
					if (len > 0) {
						Timer.offset = 0;
						for (i = 0; i < len; i++) {
							temp = getHanabiraPost(el[i]);
							Thread.appendChild(temp[0]);
						}
						Tinycon.setBubble(unread_count);
					} else if (typeof e === 'number')
						Timer.offset += e;
				}
				if (rexk && !error) {
					if (Inner.posts.length != pCount + Count.mod) {
						updateCount(pCount)
						return getHanabiraFullThread(UpdBtn);
					}
					updateTimer();
				}
				if (e && !error) {
					MListen['PostsCount'].textContent = pCount + LC.omit[lng] + (Count.mod > 0 ? ' ( +'+ Count.mod + LC.pmod[lng] +' )' : '');
					genReplyMap(Inner.posts);
				}
				statusButton(UpdBtn, 1)
				thread_updating = false;
			});
		}
		function getHanabiraFullThread(UpdBtn, ExpandMap) {
			getDataResponse('/api/thread/'+ HM.URL.board +'/'+ CiD +'/all.json?new_format',
			function(status, sText, json, xhr) {
				var i, temp, derefl, jsonPosts = json.result.posts, pCount = json.result.posts_count;
				function pnid(n) { return !Inner.posts[n] ? 99999999 : _cid(Inner.posts[n].id) }
				function jpid(n) { return !jsonPosts[n] ? 99999999 : jsonPosts[n].display_id }
				if (UpdBtn === 'first_time') {
					for (i = 0; jsonPosts[i]; i++) {
						temp = getHanabiraPost(jsonPosts[i], [json.result.archived, json.result.autosage], [HM.URL.board, json.result.display_id]);
						Thread.appendChild(temp[0]);
					}
					return genReplyMap(Inner.posts);
				} else if (jsonPosts.length == Inner.posts.length) {
					Count.dif = Count.del = 0;
					Count.mod = Inner.posts.length - pCount;
				} else {
					for (i = 0; i < (Inner.posts.length + Count.new); i++) {
						if (pnid(i) < jpid(i)) {
							_z.setup(Inner.posts[i], {'class': "deleted"}, null);
						}
						if (pnid(i) > jpid(i)) {
							temp = getHanabiraPost(jsonPosts[i], [json.result.archived, json.result.autosage]);
							if (!Inner.posts[i])
								Thread.appendChild(temp[0]);
							else
								_z.before(Inner.posts[i], temp[0]);
							if (ExpandMap) {
								ExpandMap.push(temp[0])
							} else {
								derefl = _z.setup('a', {'class': 'reply-link nview celrly', 'href': '/'+ HM.URL.board +'/res/'+ CiD +'.xhtml#i'+ jpid(i), 'text': '>>'+ jpid(i)}, {
									'click': Chanabira.MagicHighlight, 'mouseover': Chanabira.MagicPostView
								});
								_z.after(MListen['PostsCount'], MListen['AllowedPosts'])
								_z.before(MListen['AllowedPosts'].lastElementChild, derefl);
							}
						}
						if (pnid(i) < jpid(i)) {
							_z.setup(Inner.posts[i], {'class': "deleted"}, null);
						}
					}
					Tinycon.setBubble(unread_count);
					genReplyMap(Inner.posts);
					Count = { dif: 0, new: 0, del: 0, mod: 0 }
					if (pCount !== Inner.posts.length && jsonPosts.length === Inner.posts.length) {
						Count.mod = Inner.posts.length - pCount;
					}
				}
				statusButton(UpdBtn, 1);
				thread_updating = false;
				if (!ExpandMap)
					updateTimer();
				MListen['PostsCount'].textContent = pCount + LC.omit[lng] + (Count.mod > 0 ? ' ( +'+ Count.mod + LC.pmod[lng] +' )' : '');
			});
		}
		function getHanabiraPost(postJson, margArr, mapArr) {
			var threadId = mapArr ? mapArr[1] : CiD,
				postId = postJson.display_id,
				board = mapArr ? mapArr[0] : HM.URL.board,
				files = postJson.files,
				len = files.length,
				op = postJson.op,
				wrap = _z.setup('div', {'id': 'post_'+ postId, 'class': (op ? 'oppost' : 'replypost') +' post', 'html':
					'<a name="i'+ postId +'"></a><div class="posthead"><span class="postername pure-u-1-4">'+ getDefaultName(postJson.name) +'</span><span class="replytitle pure-u-5-8">'+
					postJson.subject +'</span><span class="reflink pure-u-1-8"><a class="reply-button" href="/'+ board +'/res/'+ threadId +'.xhtml#i'+ postId +'">No.'+ postId +'</a></span></div>'+
					(function() {
						var i, files_html = '';
						for (i = 0; i < len; i++) {
							files_html += getHanabiraFile(files[i], postJson.post_id, board, threadId, postId, (len === 1));
						}
						return files_html;
					})() +
					'<div class="postbody pure-u-'+ (len == 1 ? '16-24 pure-u-lg-18-24' : '1') +'">'+ parseMessageText(postJson.message) +
					'</div><div class="abbrev"><span class="replylinks pure-u-1 pure-u-sm-4-5"><span class="rl-inf">'+  LC.repl[lng] + LC.few['u-c'][lng] +':&nbsp;\n</span></span><span class="replydate pure-u-1 pure-u-sm-1-5">'+
					getDateTime(postJson.date) +'</span></div>'
				}, null);
			wrap.repliesNode = wrap.querySelector('.replylinks');
			if (!mapArr) {
				unread_count++;
				if (HM.SoundNotify && !play_notify)
					Notif.play();
			}
			attachEvents(wrap);
			hooLinks(GetElements(wrap).links);
			return [wrap, wrap.firstChild];
		}
		function getHanabiraFile(file, pid, brd, tId, pId, ONE) {
			var name, meta, frontend, ieClass = cmClass = action = '',
				src = file.src, fid = file.file_id, m = 0.01572,
				fmd = file.metadata, imgW = fmd.width, metatype = fmd.type,
				imgH = fmd.height, rating = file.rating,
				size = bytesMagnitude(file.size), filename = getPageName(src),
				maXr = HM.maXrating.toLowerCase(), ext = filename.fext(),
				lines = fmd.lines, pages = fmd.pages, files = fmd.files_count,
				type = file.type === 'code' ? 'text' : !file.type ? fmd.type : file.type,
				R = maXr === rating || maXr.match(/\d+/) >= rating.match(/\d+g?/) || 
					rating === 'sfw' ? false : true,
				thumb = R ? 'images/'+ rating +'.png' : file.thumb,
				thumbW = 'width="'+ (thumb !== file.thumb ? 200 : file.thumb_width) +'"',
				thumbH = 'height="'+ (thumb !== file.thumb ? 200 : file.thumb_height) +'"',
				isImage = ['image', 'vector'].isThere(type);
			if (brd === 'b' || brd === 'rf') {
				name = isImage ? getPageName(thumb).split('s')[0] +'.'+ ext :
						type == 'video' ? fmd["File Name"] : fid.toString() + pid.toString() +'.'+ ext;
			} else {
				name = !ONE && filename.length > 17 ? filename.substring(0, 17) + '...' : filename;
			}
			if (type == 'music') {
				var brate = (fmd.bitrate / 1000).toFixed(0) + ' kbps',
					srate = (fmd.sample_rate / 1000).toFixed(1) + ' kHz',
					trlen = (fmd.length * m).toFixed(2).replace('.', ':'),
					trnam = _unc(fmd.artist) +' — '+ _unc(fmd.album),
					trnum = _unc(fmd.tracknumber, '0') +'/'+ _unc(fmd.totaltracks, '0'),
					avid = Files.video.isThere(ext);
				meta = trlen +' @ '+ brate +' / '+ srate +'<br>'+ (!ONE && trnam.length > 40 ? trnam.substring(0, 40) +'<br>'+ trnam.slice(40) : trnam) +' / '+ _unc(fmd.title) +' ['+ trnum +']';
				frontend = '<div class="magic-audio thumb '+ (avid ? 'movie' : 'artwork') +'"><div class="ma-controls"><a href="/'+src+'" class="'+ (avid ? 'cm' : 'ma') +'-button" id="ma-play"></a></div></div>';
			} else {
				if (isImage) {
					var edit = '/utils/'+ type +'/edit/'+ fid +'/'+ pid;
						metatype = ext.slice(0, 1).toUpperCase() + ext.slice(1);
						meta = imgW +'×'+ imgH;
					if (R) {
						ieClass = 'spr-image expanded rated ';
						thumbH = thumbW = '';
					} else {
						action = 'contextmenu="image-context" oncontextmenu="$(\'#image-context\').attr({src:this.parentNode.href, edit:\''+ edit +'\'})"';
						if (type === 'vector')
							ieClass = 'spr-image unexpanded ';
						else
							action += ' onclick="expand_image(event, '+ imgW +', '+ imgH +')"';
					}
				} else {
					var Type = type, Embed = '/utils/'+ type +'/'+ fid +'/'+ pid,
						hash = _urlHash(encodeURI(HM.URL.host +'/'+ src));
						cmClass = 'class="cm-button"';
					switch (type) {
						case 'text': Type = 'docs';
							meta = lines + LC.line[lng] + (lines === 1 ? LC.few['ru'][lng] : lines < 5 ? LC.few['u-d'][lng] : LC.few['en'][lng] );
							break;
						case 'archive': Type = 'pdf'; thumb = 'src/png/1405/archive-icon.png';
							meta = files +' '+ LC.file[lng].toLowerCase() + (files === 1 ? '' : files < 5 ? LC.few['u-a'][lng] : LC.few['u-b'][lng] );
							break;
						case 'pdf': Embed = 'iframe';
							meta = imgW +'×'+ imgH +', '+ pages + LC.page[lng] + (pages === 1 ? LC.few['ru'][lng] : pages < 5 ? LC.few['u-c'][lng] : LC.few['en'][lng] );
							break;
						case 'flash': Embed = 'flash'; metatype = 'Flash Application'; Type = 'video';
							break;
						case 'video': Embed = 'html5'; size = fmd["File Size"];
							metatype = fmd["File Type"] == 'WEBM' ? 'WebM' : fmd["File Type"];
							meta = fmd["Image Size"] +' @ '+ fmd["Duration"];
							break;
						default: cmClass = '';
					}
					if (cmClass)
						HM.LinksMap[hash] = {Embed: Embed, Type: Type}
				}
				frontend = '<a href="/'+ src +'" '+ cmClass +' target="_blank"><img class="'+ ieClass +'thumb" '+ thumbW +' '+ thumbH +' src="/'+ thumb +'" '+ action +' alt="'+ (R ? rating : filename) +'"></a>'
			}
			var filebtns = (type != 'music' && !R && ONE ? LC.clck_img_to[lng] + (type == 'video' ? LC.pvid[lng] : isImage ? LC.expd[lng] : LC.vitf[lng]) : '') +'<br>'+ (R ? LC.cens[lng] : '') +'</div>',
				fileinfo = '<div class="fileinfo'+ (!ONE ? ' limited' : '') +'">'+ LC.file[lng] +': <a href="/'+ src +'" target="_blank" title="'+ filename +'">'+ name +'</a><br><em'+
					(type == 'music' ? ' class="magic-info"' : '') +'>'+ metatype +', '+ size + (!meta ? '' : ', '+ meta) +'</em>',
				filediv = '<div id="file_'+ pId +'_'+ fid +'" class="file">';
			return (ONE ? fileinfo + filebtns + filediv : filediv + fileinfo + filebtns) + frontend +'\n</div>';
		}
	}
	
	/*** Charming Hanabira ***/
	//* @ original code 	http://dobrochan.com/js/hanabira-0.5.1311-.js
	//* @ copyright 		Dobrochan
	function CharmingHanabira(h) {
		var Chana = this, gTimt = 0,
			post_stub = _z.setup('td', {'class': 'die stub', 'text': LC.postdel[lng]}, null);
		this.closeLastPopup = RemoveAllRefs;
		this.MagicPostView = MagicPostView;
		this.MagicHighlight = MagicHighlight;
		function MagicHighlight(e) {
			clearTimeout(gTimt); gTimt = 0;
			var uri = ParseUrl(e.target.href),
				post = document.getElementById('post_'+ uri.pid);
			if (post) {
				var phl = post.className.split(' ').isThere('highlighted');
				if (!phl) {
					var prevhlight = document.getElementsByClassName('highlighted')[0],
						hanalight = document.getElementsByClassName('highlight')[0];
					if (prevhlight)
						prevhlight.classList.remove('highlighted');
					if (hanalight)
						hanalight.className = 'reply';
					post.classList.add('highlighted');
				}
				post.scrollIntoView({block: (e.target.classList[1] === 'cview' ? 'end' : 'start'), behavior: 'smooth'});
			} else if (HM.URL.thread !== uri.thread)
				return;
			return _z.fall(e);
		}
		function MagicPostView(e) {
			var a = e.target, attach = HM.AttachPopups;
			clearTimeout(gTimt); gTimt = setTimeout(function() {
				var L = ParseUrl(a.href), brd = L.board, tid = L.thread, pid = L.pid, op = tid === pid,
					postid = 'post_'+ pid, id = brd +'-'+ pid, refl = _z.route(a, '.reflink a'),
					active = document.getElementById('ref-'+ id), href = refl.getAttribute('href');
				if (active) {
					var loc = active.querySelector('.locked');
					if (loc && loc.hash !== refl.hash) {
						loc.className = 'reply-link cview celrly';
						attachEvents(active);
					}
					add_mapping(active.querySelector('a[href="'+ href +'"]'));
					set_style(active);
					active.click();
				} else {
					var reftab = _z.setup('blockquote', {'class': (op ? 'oppost popup' : 'popup'), 'id': 'ref-'+ id,
						'html': '<div class="loading"><span class="waiting'+ Math.floor(Math.random() * 3) +
						' icon"><img src="/images/blank.png"></span>\n'+ LC.wsec[lng] +'</div>'}, null),
						loading = reftab.querySelector('.loading'), post = document.getElementById(postid) || HM.LoadedPosts[id],
						binded = function (el) {
							var load = el.cloneNode(true);
							attachEvents(load);
							if (attach && !load.classList.contains('stub')) {
								BindCloseRef(reftab);
							} else {
								BindRemoveRef(a, reftab);
							}
							_z.replace(loading, _z.setup(load, {'id': 'load-' + id, 'class': el.cast}, null));
							add_mapping(reftab.querySelector('a[href="'+ href +'"]'));
						}
					if (post) {
						binded(post);
					} else if (HM.URL.thread == tid) {
						binded(post_stub);
					} else {
						getDataResponse('/api/post/'+ brd +'/'+ tid +'/'+ pid +'.json?message_html&new_format'+ (op ? '&thread' : ''),
						function(status, sText, json, xhr) {
							var temp, node, tstat, jpost, ErrorMSG;
							if (status !== 200) {
								ErrorMSG = _z.setup('strong', {'id': 'warning-massage', 'class': 'blink', 'text': status +' '+ sText}, null);
								ErrorMSG.dozZe = function(e) {
									if (this.iterations >= 7)
										reftab.remove();
								}
								return _z.replace(loading, ErrorMSG);
							} else if (json.error) {
								node = post_stub;
							} else {
								tstat = op ? [json.result.threads[0].archived, json.result.threads[0].autosage] : true;
								jpost = op ? json.result.threads[0].posts[0] : json.result;
								temp = MagicThreadListener().getPost(jpost, tstat, [brd, tid, pid]);
								node = temp[0];
								node.cast = 'stored';
							}
							HM.LoadedPosts[id] = node;
							binded(node);
							hooLinks(GetElements(reftab).links);
							set_style(reftab);
						});
					}
					document.body.appendChild(reftab);
					set_style(reftab);
				}
			}, attach ? 300 : 200);
			a.onmouseout = function(e) {
				clearTimeout(gTimt); gTimt = 0;
				if (!attach)
					mapp.classList.remove('mapped');
			}
			function add_mapping(mapp) {
				if (!mapp)
					return;
				mapp.classList.add('mapped');
				if (attach) {
					mapp.classList.add('locked');
					mapp.removeEventListener('mouseover', Chana.MagicPostView, false);
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
		}
		function BindCloseRef(reftab) {
			var div = document.createElement('div'),
				drag = _z.setup('span', {'class': 'dpop txt-btn'}, {
					'mousedown': function(e) {
						reftab.style['z-index'] = HM.zIndex + 1
						HM.DragableObj = { el: reftab, offsetY: 9, offsetX: 9 }
						return _z.fall(e) }}),
				close = _z.setup('span', {
					'class': 'cpop ty txt-btn',
					'title': LC.clos[lng]}, {
					'click': function(e) { reftab.remove() }}),
				closeAll = _z.setup('span', {
					'class': 'cpop all txt-btn',
					'title': LC.clos[lng] + LC.all[lng]}, {
					'click': RemoveAllRefs });
				_z.setup(reftab, {}, {
					'click': function(e) {
						HM.zIndex++
						this.style['z-index'] = HM.zIndex }
					}).appendChild(div).click();
			_z.append(div, [close, closeAll, drag]);
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
	}
	
	function hooLinks(links) {
		_z.each(links, function(link, i) {
			if (!link.href || link.href.slice(0, 4) !== 'http')
				return;
			var href = escapeUrl(link.href), hash = _urlHash(link.href), extras, events;
			console.log(href)
			if (link.host.isThere("dobrochan")) {
				if (href.isThere("/res/")) {
					var targ = ParseUrl(href), refl = _z.route(link, '.reflink a'),
						from = ParseUrl(refl.href);
					if (targ != null && targ.thread) {
						var reply_id = (targ.pid || targ.thread),
							diffb = (targ.board !== from.board) || (from.board !== HM.URL.board),
							dataArr = [from.board, from.thread, from.pid, (diffb ? targ.board : '')];
						extras = {'class': 'reply-link', 'href': href.replace(/https?:\/\/dobrochan\.\w+/, ''), 'text': '>>'+ (diffb ? targ.board +'/' : '') + reply_id};
						events = {'click': Chanabira.MagicHighlight, 'mouseover': Chanabira.MagicPostView};
						_z.setup(link, extras, events);
						if (!HM.RepliesMap[reply_id])
							HM.RepliesMap[reply_id] = new Array(0);
						if (!JSON.stringify(HM.RepliesMap[reply_id]).isThere(JSON.stringify(dataArr)))
							HM.RepliesMap[reply_id].push(dataArr);
					}
				}
			}
		});
	}

	function genReplyMap(posts) {
		_z.each(posts, function(post) {
			var cid = _cid(post.id);
			if (HM.RepliesMap[cid]) {
				for (var i = 0; i < HM.RepliesMap[cid].length; i++) {
					var relink, Id = HM.RepliesMap[cid][i];
					if (!post.repliesNode.querySelector('.celrly[href$="#i'+ Id[2] +'"]')) {
						relink = _z.setup('a', {'class': 'reply-link cview celrly', 'href': '/'+ Id[0] +'/res/'+ (!Id[1] ? Id[2] : Id[1]) +'.xhtml#i'+ Id[2], 'text':
							'\n>>'+ (Id[3] ? '❪'+ Id[0].toUpperCase() +'❫' : '') + Id[2] }, {'click': Chanabira.MagicHighlight, 'mouseover': Chanabira.MagicPostView});
						relink.hidden = (document.getElementById('post_'+ Id[2]) || {hidden:false}).hidden;
						_z.before(post.repliesNode.lastElementChild, relink);
					}
				}
			}
		});
	}
	
	function attachEvents(node) {
		if (node.classList.contains('new'))
			node.addEventListener('click', markAsRead, false);
		_z.each(GetElements(node).hoos,
		function(a) {
			switch (a.classList[0]) {
				case 'reply-link':
					if (a.classList[2] !== 'locked')
						a.addEventListener('mouseover', Chanabira.MagicPostView, false);
					a.addEventListener('click', Chanabira.MagicHighlight, false);
					break;
				case 'sp-r':
					a.addEventListener('click', function(e) {
						hRate(this, this.parentNode.parentNode.querySelector('img.spr-image'))
					}, false)
					break;
				case 'spr-image':
					//a.addEventListener('click', MagicSpoirate, false)
					break;
				case 'cm-button':
					//a.addEventListener('click', loadMediaContainer, false)
					break;
				case 'ma-button':
					//a.addEventListener('click', initMagicAudio, false)
					break;
				//case 'reply-button':
				//	a.addEventListener('click', Nagato.getForm, false)
			}
		});
	}
	
	var body = document.createElement('body');
	var formDelete = _z.setup('form', {'id': 'delete_form', 'action': '/b/delete', 'method': 'post'}, null);
	_z.append(document.documentElement, [
		document.createElement('head'),
		document.createElement('body')
	]);
	console.log(document)
	document.body.appendChild(formDelete);
	if (HM.URL.thread) {
		var thread = _z.setup('div', {'id': 'thread_'+ HM.URL.thread, 'class': 'thread'}, null);
		HM.ThreadListener[HM.URL.thread] = new MagicThreadListener(thread);
		HM.ThreadListener[HM.URL.thread].getFullThread();
		HM.ThreadListener[HM.URL.thread].updateTimer();
		formDelete.appendChild(thread);
	} else if (HM.URL.board) {
		getDataResponse('/'+ HM.URL.board +'/'+ (HM.URL.page || '0') +'.json',
		function(status, sText, json, xhr) {
			_z.each(json.boards[HM.URL.board].threads, function(tData) {
				var i, temp, tid = tData.display_id,
					thread = _z.setup('div', {'id': 'thread_'+ tid, 'class': 'thread'}, null);
					HM.ThreadListener[tid] = new MagicThreadListener(thread);
				for (i = 0; pData = tData.posts[i++];) {
					temp = MagicThreadListener().getPost(pData, [HM.URL.board, tid]);
					thread.appendChild(temp[0]);
				}
				formDelete.appendChild(thread);
			});
		});
	}
}
