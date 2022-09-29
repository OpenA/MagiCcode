
const Hana = {
	name: 'DC',

	nav: null,
	popups_ct: null,
	posts_coll: null,

	get form() {
		
	},

	init() {

		const { board, page, thrid, pid } = (this.nav = parseAibAnchor(location));
		const { postform, delete_form   } = document.forms;

		const thr_lst = document.getElementsByClassName('thread'),
		   posts_coll = (this.posts_coll = new Map);

		if (thr_lst.length) {
			const popups_ct = (this.popups_ct = new PopupControl({
				exclass: 'popup',
				useHighlightOnScreen: false,
				getReplyElement: (brd, pid) => {
					let post = posts_coll.get(brd +'-'+ pid);
					if (post && !post.classList.contains('oppost'))
						post = post.querySelector('#reply'+ pid);
					return post;
				},
				reqHttpReply: (url, brd, pid) => aibDataRequest(url, { cache: 'force-cache' }).then(doc => {

					let thr_lst = doc.getElementsByClassName('thread'),
					       post = doc.getElementById('reply'+ pid) || doc.getElementById('post_'+ pid),
					    thr_wrk = thr_lst.length ? dcThreadHandling(thr_lst, brd).then(() => post) : null;

					if (!post) {
						(post = document.createElement('div')).append(
							_setup('i', { class: 'postername', text: '№'+ pid }),
							_setup('b', { class: 'abbrev', style: 'padding: 0;', text: '\n-\nНе найден.'})
						);
						return post;
					} else 
						return thr_wrk;
				})
			}));
			dcThreadHandling(thr_lst, board);
			document.body.append(popups_ct.NODE_POP_STACK);
		}

		if (postform) {

			const gBotPlace = document.createElement('div');
			const gTopPlace = document.getElementById('postform_placeholder');
			const gFormCont = document.getElementById('postFormDiv'),
			          ruls = gFormCont.getElementsByClassName('rules')[0];

			let a_top, gTop = document.getElementById('hideinfodiv');
			let a_bot, gBot = document.getElementById('hideinfotd');

			const file_max = ruls.firstElementChild.innerText.match(/\d+/)[0];
			const show_txt = gTop.firstElementChild.innerText;
			const hide_txt = gBot.firstElementChild.innerText;

			gTopPlace.prepend(gTop), gBot.parentNode.remove();
			gBotPlace.className = 'glob-fct glob-bot';
			gTopPlace.className = 'glob-fct glob-top';

			const toggleForm = ({ target }) => {
				const is_top = a_top === target,
				      parent = is_top ? gTopPlace : gBotPlace,
				     do_open = parent.classList.toggle('fm-opened');

				if (do_open) {
					target.parentNode.after(gFormCont);
					(is_top ? gBotPlace : gTopPlace).classList.remove('fm-opened');
				}
			}
			gTop  = _setup(gTop , { class: 'hideinfo', style: 'text-align: center;' });
			gBot  = _setup('div', { class: 'hideinfo', style: 'text-align: center;' });
			a_bot = _setup('a'  , { class: 'glob-btn', href: 'javascript:void(0)', show_txt, hide_txt }, { click: toggleForm }),
			a_top = _setup('a'  , { class: 'glob-btn', href: 'javascript:void(0)', show_txt, hide_txt }, { click: toggleForm });

			gTop.replaceChild( a_top, gTop.firstElementChild );
			gBot.append('[\n', a_bot, '\n]');
			gBotPlace.append(gBot, gTop.lastElementChild);

			ruls.removeChild(ruls.firstElementChild);
			ruls.lastElementChild.append(_setup('li', { text: 'Максимум '+ file_max +' файлов на пост' }));

			if (thrid) {
				delete_form.after(gBotPlace);
			} else {
				delete_form.querySelector('.pages').before(gBotPlace);
			}
		}
	}
};

const dcPostHandling = (post, from_uid, title) => new Promise(resolve => {

	const re_lnks = post.querySelectorAll('.message a[href*="/res/"]');
	
	if (re_lnks.length) {
		let map_arr = [];
		for (let a of re_lnks) {
			const to = parseAibAnchor(a),
			  to_uid = to.thrid +'-'+ to.board +'-'+ to.pid;

			_setup(a, { class: CNAME_LNK_REPLY, onmouseover: undefined, onclick: undefined })
			.setAttribute(PROP_FROM_TO,
				from_uid.substring(1 + from_uid.indexOf('-')) +' '+ to.board +'-'+ to.pid
			);
			map_arr.push( to_uid );
		}
		resolve( new ReplySetTo(from_uid, map_arr) );
	} else 
		resolve( null );

	post.addEventListener('mouseover', Hana.popups_ct);
});

let _refmapex_;

const dcUpdRefmaps = (refsets) => {

	const { posts_coll   } = Hana;
	const { board, thrid } = Hana.nav;

	const reply_map = new ReplyMap(refsets, _refmapex_);

	for (let to_uid of reply_map.keys()) {

		const post_uid = to_uid.substring(1 + to_uid.indexOf('-')),
		      post_id  = to_uid.substring(to_uid.lastIndexOf('-'))

		if (!posts_coll.has(post_uid))
			continue;

		let refmap = posts_coll.get(post_uid).querySelector('.ha-refmap-list');
		if(!refmap) {
			refmap = posts_coll.get(post_uid).querySelector('.abbrev').appendChild(
				_setup('div', { class: 'ha-refmap-list', 'habe-text': 'Ответы:'})
			);
		}
		const lnkarr = reply_map.extract(to_uid, from_uid => {
			const [ fm_tid, fm_brd, fm_pid ] = from_uid.split('-');

			const dif_brd = board !== fm_brd,
				  dif_thr = thrid !== fm_tid || dif_brd;

			let lnk = _setup('a', {
				class: CNAME_LNK_REFMAP +' ha-popUnd',
				href: (dif_thr ? `/${fm_brd}/res/${fm_tid}.xhtml#i` : '#i') + fm_pid,
				text: (dif_brd ? `>>${fm_brd}/` : '>>') + fm_pid + (dif_thr ? '→' : '')
			});
			lnk.setAttribute(PROP_FROM_TO, post_uid +' '+ fm_brd +'-'+ fm_pid);
			return lnk;
		});
		Element.prototype.append.apply(refmap, lnkarr);

		let popmap = document.querySelector('.ha-popView #refmap'+ post_id);
		if (popmap)
			popmap.replaceWith(refmap.cloneNode(true));
	}
	_refmapex_ = reply_map.toArray();
}

const dcThreadHandling = async (thr_lst, brd_id = '') => {

	const { posts_coll } = Hana;
	const post_work = [];

	for (let thread of thr_lst) {

		let posts = thread.getElementsByClassName('post'), op = posts[0],
		   thr_id = thread.id.substring('thread_'.length),
			title = op.querySelector('.replytitle');

		for (let post of posts) {
			const post_uid = brd_id +'-'+ post.id.substring('post_'.length);
			post_work.push(dcPostHandling(post, thr_id +'-'+ post_uid));
			posts_coll.set(post_uid, post);
		}
	}
	Promise.all(post_work).then(dcUpdRefmaps);
}
