
const Hana = {
	name: 'Abu',

	nav: null,
	popups_ct: null,
	posts_coll: null,

	get form() {
		
	},

	init() {

		const { board, page, thrid, pid } = (this.nav = parseAibAnchor(location));

		const thr_lst = document.getElementsByClassName('thread'),
		   posts_coll = (this.posts_coll = new Map);

		if (thr_lst.length) {

			const popups_ct = (this.popups_ct = new PopupControl({
				exclass: 'post post_type_reply post_preview',
				useHighlightOnScreen: true,
				getReplyElement: (brd, pid) => posts_coll.get(brd +'-'+ pid),
				reqHttpReply: (url, brd, pid) => aibDataRequest(url, { cache: 'force-cache' }).then(doc => {

					let thr_lst = doc.getElementsByClassName('thread'),
					       post = doc.getElementById('post-'+ pid),
					    thr_wrk = thr_lst.length ? abuThreadHandling(thr_lst, brd).then(() => post) : null;

					if (!post) {
						(post = document.createElement('div')).append(
							_setup('i', { class: 'post__reflink', text: '№'+ pid }),
							_setup('b', { class: 'post__reflink', text: '\n-\nНе найден.'})
						);
						return post;
					} else 
						return thr_wrk;
				})
			}));
			abuThreadHandling(thr_lst, board);
			document.body.append(popups_ct.NODE_POP_STACK);
		}
		const { postform } = document.forms;

		if (postform) {

			const gBotPlace = document.getElementById('BottomNormalReply');
			const gTopPlace = document.getElementById('TopNormalReply');

		}
	}
};

const abuPostHandling = (post, from_uid, title) => new Promise(resolve => {

	const re_lnks = post.querySelectorAll('.post-reply-link');

	if (re_lnks.length) {
		let map_arr = [];
		for (let a of re_lnks) {
			const to = parseAibAnchor(a),
			  to_uid = to.thrid +'-'+ to.board +'-'+ to.pid;
			
			_setup(a, { class: CNAME_LNK_REPLY, 'data-thread': undefined, 'data-num': undefined })
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

const abuUpdRefmaps = (refsets) => {

	const { posts_coll   } = Hana;
	const { board, thrid } = Hana.nav;

	const reply_map = new ReplyMap(refsets, _refmapex_);

	for (let to_uid of reply_map.keys()) {

		const post_uid = to_uid.substring(1 + to_uid.indexOf('-')),
		      post_id  = to_uid.substring(to_uid.lastIndexOf('-'))

		if (!posts_coll.has(post_uid))
			continue;

		let refmap = posts_coll.get(post_uid).children['refmap'+ post_id];
		if(!refmap.classList.contains('ha-refmap-list')) {
			refmap.classList.add('ha-refmap-list');
			refmap.setAttribute('habe-text', 'Ответы:');
			refmap.style.display = null;
		}
		const lnkarr = reply_map.extract(to_uid, from_uid => {
			const [ fm_tid, fm_brd, fm_pid ] = from_uid.split('-');

			const dif_brd = board !== fm_brd,
				  dif_thr = thrid !== fm_tid || dif_brd;

			let lnk = _setup('a', {
				class: CNAME_LNK_REFMAP +' ha-popUnd',
				href: (dif_thr ? `/${fm_brd}/res/${fm_tid}.html#` : '#') + fm_pid,
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

const abuThreadHandling = async (thr_lst, brd_id = '') => {

	const { posts_coll } = Hana;
	const post_work = [];

	for (let thread of thr_lst) {

		let posts = thread.getElementsByClassName('post'), op = posts[0],
		   thr_id = thread.id.substring('thread-'.length),
			title = op.querySelector('.post__title').innerText;

		for (let post of posts) {
			const post_uid = brd_id +'-'+ post.id.substring('post-'.length);
			post_work.push(abuPostHandling(post, thr_id +'-'+ post_uid));
			posts_coll.set(post_uid, post);
		}
	}
	Promise.all(post_work).then(abuUpdRefmaps);
}
