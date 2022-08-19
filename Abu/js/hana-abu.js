
const Hana = {
	name: 'Abu',

	nav: null,
	popctrl: null,

	get form() {
		
	},

	postHandling: (post, from_uid, title) => new Promise(resolve => {

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
	}),

	addRefmaps: (refsets, post_coll) => {

		const reply_map = new ReplyMap(refsets);
		const { board, thrid } = Hana.nav;

		for (let from_uid of reply_map.keys()) {

			if (!(from_uid in post_coll))
				continue;

			let refmap = post_coll[from_uid].children['refmap'+ from_uid.substring(from_uid.lastIndexOf('-'))];
			if(!refmap.classList.contains('ha-refmap-list')) {
				refmap.classList.add('ha-refmap-list');
				refmap.setAttribute('habe-text', 'Ответы:');
				refmap.style.display = null;
			}
			const refarr = reply_map.extract(from_uid),
			      lnkarr = [];

			for (let to_uid of refarr) {
				const [ to_tid, to_brd, to_pid ] = to_uid.split('-');

				const dif_brd = board !== to_brd,
				      dif_thr = thrid !== to_tid;

				let lnk = _setup('a', {
					class: CNAME_LNK_REFMAP +' ha-popUnd',
					href: (dif_brd || dif_thr ? `/${to_brd}/res/${to_tid}.html#` : '#') + to_pid,
					text: (dif_brd ? `>>${to_brd}/` : '>>') + to_pid
				});
				lnk.setAttribute(PROP_FROM_TO,
					from_uid.substring(1 + from_uid.indexOf('-')) +' '+ to_brd +'-'+ to_pid
				);
				lnkarr.push(lnk);
			}
			Element.prototype.append.apply(refmap, lnkarr);
		}
	},

	init() {

		const { board, page, thrid, pid } = (this.nav = parseAibAnchor(location));
		const { postform } = document.forms;

		if (postform) {

			const gBotPlace = document.getElementById('BottomNormalReply');
			const gTopPlace = document.getElementById('TopNormalReply');

		}
		const thread_list = document.getElementsByClassName('thread'),
		        post_coll = Object.create(null),
		        post_work = [],
		         pop_ctrl = new PopupControl({
					exclass: 'post post_type_reply post_preview',
					getPostElement: (brd = '', pid = '') => {
						return document.getElementById('post-'+ pid);
					}
				});

		for (let thread of thread_list) {

			let posts = thread.getElementsByClassName('post'), op = posts[0],
			   thr_id = thread.id.substring('thread-'.length),
			    title = op.querySelector('.post__title').innerText;

			for (let post of posts) {
				const post_uid = thr_id +'-'+ board +'-'+ post.id.substring('post-'.length);
				post_work.push(this.postHandling(post, post_uid, title));
				post_coll[post_uid] = post;
				post.addEventListener('mouseover', pop_ctrl);
			}
		}
		Promise.all(post_work).then(refsets => this.addRefmaps(refsets, post_coll));
		document.body.append(pop_ctrl.NODE_POP_STACK);
	}
};
