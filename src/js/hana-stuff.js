
/* post reply chains */
class ReplySetTo extends Set {

	constructor(from_uid = '', to_uids) {
		super(to_uids);
		this.from = from_uid;
	}
}
class ReplyMap extends Map {

	constructor(set_to_list = [/* ReplySetTo, ... */], map_ext_list = []) {
		
		let arr_set = [], arr_map = [].concat(map_ext_list || []);

		for (const set_to of set_to_list)
		{
			if (!set_to)
				continue;

			const from_uid = set_to.from;

			for (const to_uid of set_to) {
				let idx = arr_set.indexOf(to_uid) + 1;
				if (idx > 0) {
					arr_set[idx].add(from_uid)
				} else {
					arr_set.push(to_uid, new Set([from_uid]));
				}
			}
		}
		for (let i = 0; i < arr_set.length; i += 2) {
			arr_map.push([arr_set[i], arr_set[i + 1]]);
		}
		super(arr_map);
	}

	setFromTo(from_uid = '', to_uid = '') {
		if (super.has(to_uid)) {
			super.get(to_uid).add(from_uid);
		} else
			super.set(to_uid, new Set([from_uid]));
	}

	extract(to_uid = '', funct = s => s) {

		const list = [];

		for (let from_uid of super.get(to_uid)) {
			list.push( funct(from_uid) );
		}
		super.delete(to_uid);
		return list;
	}

	toArray() {
		const arr = [];

		for (let o of super.entries()) {
			arr.push(o);
		}
		return arr;
	}
}

const parseAibAnchor = ({ pathname, hash }) => {
	const out = Object.create(null);
	let m = pathname.match(/^\/([a-zA-Z]+)(?:.*\/res\/(\d+)|\/(\d+))?/);
	if (m) {
		out.board = m[1];
		out.thrid = m[2];
		out.page  = Number(m[3]) || 0;
	}
	if (hash)
		out.pid = String(hash.match(/\d+/) || '');
	return out;
}

const parseAibUrl = (url = '') => {
	const out = Object.create(null);
	var m = url.match(/^(?:https?:\/\/[^\/]+)?(\/([a-zA-Z]+)(?:.*\/res\/(\d+)|\/(\d+))?[^#?\n]*)(?:#[^\d\n]*(\d+))?/);
	if (m) {
		out.path  = m[1];
		out.board = m[2];
		out.thrid = m[3];
		out.page  = Number(m[4]) || 0;
		out.pid   = m[5];
	}
	return out;
}

const aibDataRequest = (url, params = {}, json = false) => (
	fetch(url, params).then(
		json ? res => res.ok ? res.json() : { error: res.status, msg: res.statusText, url: res.url }
		     : res => res.ok ? res.text().then(
		       str => (new DOMParser().parseFromString(str, 'text/html'))
		) : Promise.reject(
			res.url +' ['+ res.status +' '+ res.statusText +']'
		)
	)
);

const Delay = {
	tim: Object.create(null),
	del: (name = '') => {
		const ids = Delay.tim;
		if (name in ids) {
			window.clearTimeout(ids[name]);
			delete ids[name];
		}
	},
	add: (name = '', ms = 100) => new Promise(_end => {
		const ids = Delay.tim;
		if (name in ids) window.clearTimeout(ids[name]);
		ids[name] =      window.setTimeout(_end, ms);
	})
}

const DragableObj = {

	zIndex: 1,

	drag(el, {
		X: pointX = 0,
		Y: pointY = 0,
		    fixed = false,
		onMoveEnd = null
	}) {
		const { style } = el;
		const { x, y  } = el.getBoundingClientRect();

		const offsetX = fixed ? 0 : window.pageXOffset;
		const offsetY = fixed ? 0 : window.pageYOffset;

		pointX -= x;
		pointY -= y;

		style.position = fixed ? 'fixed' : 'absolute';
		style.zIndex   = (++this.zIndex);
		style.left     = (x + offsetX) +'px';
		style.top      = (y + offsetY) +'px';

		const onMove = e => {
			style.left = (e.clientX - pointX + offsetX) +'px';
			style.top  = (e.clientY - pointY + offsetY) +'px';
			e.preventDefault();
		}
		const onEnd = e => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onEnd);
			if (onMoveEnd instanceof Function)
				onMoveEnd();
		}
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onEnd);
	},

	resize: (el, {
		X: clientX = 0, minW = 0,
		Y: clientY = 0, minH = 0,
		//onMoveEnd: function
	}) => {
		const { style } = el;
		const { x, y  } = el.getBoundingClientRect();
		const onMove = ({ clientX, clientY }) => {
			style.width  = `${Math.max(minW, clientX - x)}px`;
			style.height = `${Math.max(minH, clientY - y)}px`;
		}
		const onEnd = () => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onEnd);
		}
		onMove({ clientX, clientY });
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onEnd);
	},
}

const PROP_FROM_TO     = 'popfromto';
const CNAME_LNK_REPLY  = 'ha-reply-lnk';
const CNAME_LNK_REFMAP = 'ha-refmap-lnk';

class PopupControl {

	constructor({
		getReplyElement = () => void 0,
		reqHttpReply    = async () => void 0,
		exclass = '',
		useHighlightOnScreen = false,
		usePopupCtrl = true
	}) {
		this._last_skip = 0;
		this.getReplyElement = getReplyElement;
		this.reqHttpReply    = reqHttpReply;
		this.useHighlightOnScreen = useHighlightOnScreen;
		this.usePopupCtrl = usePopupCtrl;
		this.exclass = exclass;

		Object.defineProperties(this, {
			NODE_POP_STACK: { value: _setup('div', { class: 'ha-popStack' }) }
		});
	}

	popShow(pop_el, {
		x: pointX = 0, marginX = 0, revertX = false,
		y: pointY = 0, marginY = 0, revertY = false,
		fixed = false, animName = ''
	}) {
		const { style }   = pop_el;
		const spaceRight  = window.innerWidth  * 0.5;
		const spaceBottom = window.innerHeight * 0.75;
		const offsetX     = fixed ? 0 : window.pageXOffset;
		const offsetY     = fixed ? 0 : window.pageYOffset;

		revertX ||= (pointX + marginX) > spaceRight;
		revertY &&= (pointY + marginY) < spaceBottom;

		style.animationName = null;
		style.visibility = 'hidden';
		style.position = fixed ? 'fixed' : 'absolute';
		style.zIndex = DragableObj.zIndex;
		style.left = (revertX ? offsetX : pointX + offsetX + marginX) +'px';
		style.top = (revertY ? pointY + offsetY + marginY : offsetY) +'px';

		this.NODE_POP_STACK.append(pop_el);

		if (revertX) {
			let { width } = pop_el.getBoundingClientRect();
			let left = pointX - width - Math.abs(marginX);
			if (left < 0) {
				left = 0;
				style.maxWidth = (pointX - Math.abs(marginX)) +'px';
			}
			style.left = (left + offsetX) +'px';
		}
		if (!revertY) {
			let { height } = pop_el.getBoundingClientRect();
			let top = pointY - height - Math.abs(marginY);
			if (top < -10)
				top = pointY + marginY ;
			style.top = (top + offsetY) +'px';
		}
		style.animationName = animName;
		style.visibility = 'visible';
	}

	popCloseDelay(p_vid = '') {
		const list = this.NODE_POP_STACK.getElementsByClassName('na-kk'),
		     pview = list[p_vid];
		Delay.del(p_vid);
		Delay.add('Pop View Hide', 700).then(() => {
			let c = list.length - this._last_skip - 1;
			while (list[c] !== pview)
				list[c--].remove();
		});
	}

	popClear() {
		const list = this.NODE_POP_STACK.children;
		for (let c = list.length - 1; c >= 0; c--)
			list[c].remove();
	}

	popOpenDelay(lnk, [ from_brd, from_pid, to_brd, to_pid ]) {

		const { usePopupCtrl, useHighlightOnScreen, exclass } = this;

		const stack = this.NODE_POP_STACK.children;
		const reply = this.getReplyElement(to_brd, to_pid);
		const p_vid = 'popView_'+ to_brd +'_'+ to_pid;

		let onMouseOut = null;

		Delay.del(p_vid);

		if (reply && useHighlightOnScreen) {

			const { height, y } = reply.getBoundingClientRect();
			/*const isNotOutScrn = !(
				(x + width) < 0 || (y - height * 0.75) < 0 ||
				(x > window.innerWidth || (y + height * 0.75) > window.innerHeight)
			);*/
			if (y + height > 60 && y < window.innerHeight - 60) {
				reply.classList.add('ha-backLight');
				onMouseOut = ({ target }) => {
					reply.classList.remove('ha-backLight');
					target.removeEventListener('mouseout', onMouseOut);
				};
			}
		}
		if (!onMouseOut) {
			let pop_view = stack[p_vid],
			    waiting  = Delay.add('Pop View Show', 500),
			    doRemove = () => pop_view.remove();

			onMouseOut = ({ target }) => {
				this._last_skip = 0;
				Delay.del('Pop View Show');
				if (!usePopupCtrl && pop_view) {
					Delay.add(p_vid, 700).then(doRemove);
				}
				target.removeEventListener('mouseout', onMouseOut);
			};

			let { x, y, width, height } = lnk.getBoundingClientRect();
			let { href } = lnk, revertY = lnk.classList.contains('ha-popUnd')

			x += width  / 2;
			y += height / 2;

			waiting.then(() => {
				this._last_skip = 1;

				let animName = 'popUp',
				    ctrl_add = usePopupCtrl;

				if(!pop_view) {
					let events = { mouseover: this },
					    cnames = `ha-popView ${exclass} na-${ctrl_add ? 's' : 'k' }k`;
					if (ctrl_add) {
						events.mouseleave = events.mouseenter = this;
					}
					const pop_cont = (
						pop_view = _setup('div', { id: p_vid, class: cnames }, events)
					).appendChild(
						_setup('div', { class: 'ha-pop-cont' })
					);
					if (reply) {
						for (let node of reply.children)
							pop_cont.append(node.cloneNode(true));
					} else {
						const promise = this.reqHttpReply(href, to_brd, to_pid);
						                pop_cont.classList.add('na-ldd');

						promise.then(reply => {
							pop_view.style.visibility = 'hidden';
							pop_cont.classList.remove('na-ldd');

							for (let node of reply.children)
								pop_cont.append(node.cloneNode(true));

							this.popShow(pop_view, {
								x, y, marginY: height, revertY, animName
							});
						});
						promise.catch(err => {
							pop_cont.classList.replace('na-ldd', 'na-err');
							pop_cont.textContent = err.substring(err.indexOf('[') + 1, err.indexOf(']'));
						});
					}
				} else {
					if ((ctrl_add &&= pop_view.classList.contains('na-kk'))) {
						pop_view.removeEventListener('mouseleave', this);
						pop_view.removeEventListener('mouseenter', this);
						pop_view.classList.replace('na-kk', 'na-sk');
					}
					for (let { classList } of pop_view.querySelectorAll('.na-mlock'))
						classList.remove('na-mlock');
				}
				for (let { classList } of pop_view.querySelectorAll(`[${PROP_FROM_TO}$="${from_brd +'-'+ from_pid}"]`))
					classList.add('na-mlock');
				if (ctrl_add) {
					pop_view.appendChild(
						_setup('div' , { class: 'ha-pop-ctrl' })
					).append(
						_setup('span', { class: 'ha-popClose' }, { click: doRemove }),
						_setup('span', { class: 'ha-popClear' }, { click: () => this.popClear() }),
						_setup('span', { class: 'ha-popMove'  }, { mousedown: e  => {
							if (e.button === 0) {
								e.preventDefault();
								DragableObj.drag(pop_view,{ X: e.clientX, Y: e.clientY, fixed: false });
							}
						}})
					);
				}
				this.popShow(pop_view, {
					x, y, marginY: height, revertY, animName
				});
			});
		}
		lnk.addEventListener('mouseout', onMouseOut);
	}

	touchOpen([ from_brd, from_pid, to_brd, to_pid ]) {

	}

	handleEvent(e) {
		let arg, el = e.target;
		switch (e.type) {
		case 'touchstart':
			if (el.hasAttribute(PROP_FROM_TO)) {
				this.touchOpen(el.getAttribute(PROP_FROM_TO).split(/\s|\-/));
				e.preventDefault();
			}
			break;
		case 'mouseover':
			if (el.hasAttribute(PROP_FROM_TO) && !el.classList.contains('na-mlock')) {
				this.popOpenDelay(el, el.getAttribute(PROP_FROM_TO).split(/\s|\-/));
				e.preventDefault();
			}
			break;
		case 'mouseenter': this.popCloseDelay(el.id); break;
		case 'mouseleave': this.popCloseDelay(); break;
		}
	}
}
