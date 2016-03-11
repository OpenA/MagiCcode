// ==UserScript==
// @name        PV Calculator
// @description Подсчет голосов за кандидатов на оп-пик.
// @namespace   magicode
// @homepage    https://github.com/OpenA/MagiCcode/Tools
// @updateURL   https://github.com/OpenA/MagiCcode/raw/master/Tools/pvCalculator.user.js
// @downloadURL https://github.com/OpenA/MagiCcode/raw/master/Tools/pvCalculator.user.js
// @include     http://*/*/res/*
// @include     https://*/*/res/*
// @version     1.3
// @run-at      document-end
// @grant       none
// ==/UserScript==

var desk = location.host.match(/^dobrochan|^ponya\.?ch|^ponychan\.ru|^2ch/) || [null],
	Clss = {
		'prefix': 'reply',
		'path'  : 'x',
		'idx'   : '1'
	};
	switch (desk[0]) {
		case null:
			return;
		case 'dobrochan':
			Clss['path'] = '*[contains(@class, "replypost")]/descendant::*[@class="message"]';
			break;
		case 'ponychan.ru':
		case 'ponya.ch':
		case 'ponyach':
			Clss['path'] = '*[@class="pstnode"]/descendant::*[@class="post-body"]/blockquote';
			Clss['idx'] = '2';
			break;
		case '2ch':
			Clss['prefix'] = 'post-body-';
			Clss['path'] = '*[@class="post-wrapper"]/descendant::*[@class="post-message"]';
	}
	
var VC = {
	result: {},
	calcVotes: function(nid, vals) {
		if (!this.result[nid]) {
			this.result[nid] = _Zetup('tr', {'id': 'cvn-'+ nid, 'html': '<td style="padding-right: 2em;"><a id="tcallView_'+ nid +'" style="cursor: pointer;">\>\>'+ nid +'</a></td><td id="pv-1" style="padding-right: 9px;"></td><td id="pv-2" style="padding-right: 9px;"></td><td id="pv-3" style="padding-right: 9px;"></td><td id="pv-4" style="padding-right: 9px;"></td><td id="pv-5" style="padding-right: 9px;"></td>'});
			for (var pv, i = 1; pv = this.result[nid].querySelector('#pv-'+ i); i++) {
				Object.defineProperty(pv, 'value', {
					get: function()  { return this['__v'] },
					set: function(n) { this['__v'] = n; this.textContent = n; }
				});
				this.result[nid][pv.id] = _Zetup(pv, {'value': 0});
			}
			this.frontend.querySelector('tbody').appendChild(this.result[nid])
		}
		for (var i = 0; i < vals.length; i++) {
			if ('pv-'+ vals[i] in this.result[nid])
				this.result[nid]['pv-'+ vals[i]].value += 1;
		}
	},
	matchVotes: function(oArrN) {
		for (var i = 0; i < oArrN.length; i++) {
			if (!oArrN[i])
				continue;
			for (var j = 0, calls = document.evaluate('//'+ Clss['path'] +
				'/a[substring(@href, string-length(@href) - string-length("'+ oArrN[i] +'") +1) = "'+ oArrN[i] +'"]/following-sibling::text()['+ Clss['idx'] +']'
			, document.body, null, 7, null); j < calls.snapshotLength; j++) {
				var mths = calls.snapshotItem(j).textContent.split(/\,?[\s]*/);
				this.calcVotes(oArrN[i], mths);
			}
		}
	},
	voteProcess: function (btn, input) {
		try {
			var $id = btn.id.split('_');
				switch ($id[0]) {
					case 'tcallView':
						if (document.getElementById(Clss['prefix']+ $id[1]))
							document.getElementById(Clss['prefix']+ $id[1]).scrollIntoView({block: 'start', behavior: 'smooth'});
						break;
					case 'calculateStart':
						for (var nid in this.result) {
							this.result[nid].remove();
							delete this.result[nid];
						}
						if (!!input.value) {
							var ids = input.value.split(/[\s]+/);
							this.matchVotes(ids.sort());
							btn.value = 'Пересчитать'
						} else
							btn.value = 'Подсчитать'
				}
		} catch(err) {
			console.error(err);
		}
	},
	frontend: _Zetup('div', {'class': 'reply', 'style': 'position: fixed; left: 35%; bottom: 0; padding: 3px 9px ! important;',
		'html': '<input type="text">\n<input id="calculateStart_button" type="button" value="Подсчитать"><hr>\n<table style="font-family: monospace;"><tbody></tbody></table>'}, {
		'click': function(e) {
			VC.voteProcess(e.target, e.target.previousElementSibling);
		},
		'input': function (e) {
			var dsChars = e.target.value.match(/[\d\s]+/g) || [];
			e.target.value = '';
			for (var i = 0; i < dsChars.length; i++) {
				e.target.value += dsChars[i];
			}
		}
	})
}

function _Zetup(el, attr, events) {
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
				el.addEventListener(key, events[key], false);
			}
		}
	}
	return el;
}

document.body.appendChild(VC.frontend)
