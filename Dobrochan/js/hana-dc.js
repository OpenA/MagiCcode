
const Hana = {
	name: 'DC',

	nav: null,
	popctrl: null,

	get form() {
		
	},

	postHandling: (post, post_uid, title) => new Promise(resolve => {

		const re_lnks = post.querySelectorAll('.message a[href*="/res/"]');
	
		if (re_lnks.length) {
			let map_arr = [];
			for (let a of re_lnks) {
				const to = parseAibAnchor(a),
				   navid = to.board +'-'+ to.thrid +'-'+ to.pid;
	
				map_arr.push( navid );
				_setup(a, { 'ha-nav-to': navid, onmouseover: undefined, onclick: undefined });
			}
			resolve( new ReplySetTo(post_uid, map_arr) );
		} else 
			resolve( null );
	
		post.setAttribute('hana-uid', post_uid);
	}),

	addRefmaps: (refsets, post_coll) => {

		const reply_map = new ReplyMap(refsets);

		for (let uid of reply_map.keys()) {

			if (!(uid in post_coll))
				continue;

			let refmap = post_coll[uid].querySelector('.hana-refmap-list');
			if(!refmap) {
				refmap = post_coll[uid].querySelector('.abbrev').appendChild(
					_setup('div', { class: 'hana-refmap-list', 'habe-text': 'Ответы:'})
				);
			}
			const refarr = reply_map.extract(uid),
			      lnkarr = [];

			for (let from_uid of refarr) {
				let pid = from_uid.substring(from_uid.lastIndexOf('-') + 1);
				lnkarr.push(
					_setup('a', {
						class: 'hana-refmap-lnk',
						href: '#i'+ pid,
						text: '>>'+ pid,
						'ha-nav-to': from_uid +'-und'
					})
				);
			}
			Element.prototype.append.apply(refmap, lnkarr);
		}
	},

	init() {

		const { board, page, thrid, pid } = (this.nav = parseAibAnchor(location));
		const { postform, delete_form   } = document.forms;

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
		let thread_list, post_work = [], post_coll = Object.create(null);

		if (thrid) {
			let thread = document.getElementById('thread_'+ thrid);

			if (!thread) {
				thread = _setup('div', { id: 'thread_'+ thrid, class: 'thread' });
			}
			thread_list = [thread];
		} else {
			thread_list = document.getElementsByClassName('thread');
		}
		let popctrl = new PopupControl('post_%d', ['reply']);

		for (let thread of thread_list) {

			let posts = thread.getElementsByClassName('post'), op = posts[0],
			   thr_id = thread.id.substring('thread_'.length),
			    title = op.querySelector('.replytitle').innerText;

			for (let post of posts) {
				const post_uid = board +'-'+ thr_id +'-'+ post.id.substring('post_'.length);
				post_work.push(this.postHandling(post, post_uid, title));
				post_coll[post_uid] = post;
				post.addEventListener('mouseover', popctrl);
			}
		}
		Promise.all(post_work).then(refsets => this.addRefmaps(refsets, post_coll));
	}
};
