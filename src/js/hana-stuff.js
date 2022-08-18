
/* post reply chains */
class ReplySetTo extends Set {

	constructor(from_uid = '', to_uids) {
		super(to_uids);
		this.from = from_uid;
	}
}
class ReplyMap extends Map {

	constructor(set_to_list = [/* ReplySetTo, ... */]) {
		
		let arr_set = [], arr_map = [];

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

	extract(to_uid = '') {

		let links_list = [];

		if (super.has(to_uid)) {
			for (let from_uid of super.get(to_uid)) {
				links_list.push( from_uid );
			}
			super.delete(to_uid);
		}
		return links_list;
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

const Delay = {
	tim: Object.create(null),
	del: (name = '') => {
		const ids = Delay.tim;
		if (name in ids) {
			window.clearTimeout(ids[name]);
			delete ids[name];
		}
	},
	new: (name = '', ms = 100) => new Promise(_end => {
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

	popup(el, {
		X: pointX = 0, marginX = 0, revertX = false,
		Y: pointY = 0, marginY = 0, revertY = false,
		fixed = false,
		animName = ''
	}) {
		const { style }   = el;
		const spaceRight  = window.innerWidth  * 0.5;
		const spaceBottom = window.innerHeight * 0.75;
		const offsetX     = fixed ? 0 : window.pageXOffset;
		const offsetY     = fixed ? 0 : window.pageYOffset;

		revertX ||= (pointX + marginX) > spaceRight;
		revertY &&= (pointY + marginY) < spaceBottom;

		style.animationName = null;
		style.visibility = 'hidden';
		style.position = fixed ? 'fixed' : 'absolute';
		style.zIndex = this.zIndex;
		style.left = (revertX ? offsetX : pointX + offsetX + marginX) +'px';
		style.top = (revertY ? pointY + offsetY + marginY : offsetY) +'px';

		document.body.append(el);

		if (revertX) {
			let { width } = el.getBoundingClientRect();
			let left = pointX - width - Math.abs(marginX);
			if (left < 0) {
				left = 0;
				style.maxWidth = (pointX - Math.abs(marginX)) +'px';
			}
			style.left = (left + offsetX) +'px';
		}
		if (!revertY) {
			let { height } = el.getBoundingClientRect();
			let top = pointY - height - Math.abs(marginY);
			if (top < -10)
				top = pointY + marginY ;
			style.top = (top + offsetY) +'px';
		}
		style.animationName = animName;
		style.visibility = 'visible';
	}
}

const PROP_NAV_TO = 'ha-nav-to';

class PopupControl {

	constructor(post_d = 'post_%d', class_list = []) {
		this._last_skip = 0;
		this._post_d = post_d;
		this.onScreenHighlight = false;
		this.popControls = true;

		Object.defineProperties(this, {
			_exClass  : { value: ['ha-popView'].concat(class_list) },
			_tmpClass : { value: 'naa-disapp' }
		})
	}

	popCloseDelay(p_vid = '') {
		const list = document.getElementsByClassName(this._tmpClass),
		     pview = list[p_vid];
		Delay.del(p_vid);
		Delay.new('Pop View Hide', 700).then(() => {
			let c = list.length - this._last_skip - 1;
			while (list[c] !== pview)
				list[c--].remove();
		});
	}

	popClear() {
		const list = document.getElementsByClassName(this._exClass[0]);
		for (let c = list.length - 1; c >= 0; c--)
			list[c].remove();
	}

	popOpenDelay(trig, [bid, tid, pid, lower]) {

		const { popControls, onScreenHighlight } = this;

		const post  = document.getElementById(this._post_d.replace('%d', pid));
		const p_vid = 'popView_'+ bid +'_'+ pid;

		let onMouseOut = null;

		Delay.del(p_vid);

		if (post && onScreenHighlight) {

			const { height, y } = post.getBoundingClientRect();
			/*const isNotOutScrn = !(
				(x + width) < 0 || (y - height * 0.75) < 0 ||
				(x > window.innerWidth || (y + height * 0.75) > window.innerHeight)
			);*/
			if (y + height > 60 && y < window.innerHeight - 60) {
				post.classList.add('ha-backLight');
				onMouseOut = ({ target }) => {
					post.classList.remove('ha-backLight');
					target.removeEventListener('mouseout', onMouseOut);
				};
			}
		}
		if (!onMouseOut) {
			let pop_view = document.getElementById(p_vid),
			    doRemove = () => pop_view.remove();

			onMouseOut = ({ target }) => {
				this._last_skip = 0;
				Delay.del('Pop View Show');
				if (!popControls && pop_view) {
					Delay.new(700, p_vid).then(doRemove);
				}
				target.removeEventListener('mouseout', onMouseOut);
			};
			Delay.new('Pop View Show', 500).then(() => {
				this._last_skip = 1;

				let anim = 'popUp',
				    need_cts = popControls,
				    mouse_fn = need_cts ? '' : 'add';

				if(!pop_view) {
					pop_view = _setup('div', { id: p_vid, class: this._exClass.join(' ') }, { mouseover: this });
					if (post) {
						for (let node of post.children)
							pop_view.append(node.cloneNode(true));
					} else {
						pop_view.textContent = 'loading...';
					}
				} else if (need_cts) {
					mouse_fn = (
						need_cts = !pop_view.querySelector('.ha-pop-ctrl')
					) ? 'remove' : '';
				}
				if (need_cts) {
					const ha_pop_close = _setup('span', { class: 'ha-pop-close' }, { click: doRemove });
					const ha_pop_clear = _setup('span', { class: 'ha-pop-clear' }, { click: () => this.popClear() });
					const ha_pop_move  = _setup('span', { class: 'ha-pop-move'  }, { mousedown: e  => {
						if (e.button === 0) {
							e.preventDefault();
							DragableObj.drag(pop_view,{ X: e.clientX, Y: e.clientY, fixed: false });
						}
					}});
					pop_view.appendChild(
						_setup('div', { class: 'ha-pop-ctrl' })
					).append(
						ha_pop_close,
						ha_pop_clear,
						ha_pop_move
					);
				}
				if (mouse_fn) {
					pop_view[mouse_fn+'EventListener']('mouseleave', this);
					pop_view[mouse_fn+'EventListener']('mouseenter', this);
					pop_view.classList[mouse_fn](this._tmpClass);
				}
				let { x, y, width, height } = trig.getBoundingClientRect();

				DragableObj.popup(pop_view, {
					X: x + width  * .5, marginX: 0,
					Y: y + height * .5, marginY: height,
					revertY: !!lower,
					fixed: false,
					animName: anim
				});
			});
		}
		trig.addEventListener('mouseout', onMouseOut);
	}

	touchOpen([bid, tid, pid]) {
		const p_vid = 'popup_post_'+ bid + pid;
		const post = document.getElementById(this.post_id_pat + pid);

	}

	handleEvent(e) {
		let arg, el = e.target;
		switch (e.type) {
		case 'touchstart':
			if (el.hasAttribute(PROP_NAV_TO)) {
				this.touchOpen(el.getAttribute(PROP_NAV_TO).split(/\s+|-|_/));
				e.preventDefault();
			}
			break;
		case 'mouseover':
			if (el.hasAttribute(PROP_NAV_TO)) {
				this.popOpenDelay(el, el.getAttribute(PROP_NAV_TO).split(/\s+|-|_/));
				e.preventDefault();
			}
			break;
		case 'mouseenter': this.popCloseDelay(el.id); break;
		case 'mouseleave': this.popCloseDelay(); break;
		}
	}
}