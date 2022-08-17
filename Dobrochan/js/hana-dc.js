
const Hana = {
	name: 'DC',

	nav: null,

	get form() {
		
	},

	init() {

		const { path, board, page, thrid, pid } = (this.nav = parseAibUrl(location.href));

		const { postform, delete_form } = document.forms;

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

		if (thrid) {
			let locThread = document.getElementById('thread_'+ thrid);

			if (!locThread) {
				locThread = _setup('div', { id: 'thread_'+ thrid, class: 'thread' });
			}
		} else {

		}
		const posts = document.getElementsByClassName('post');
	}
};

function parseAibUrl(url = '') {
	const out = Object.create(null);
	var m = url.match(/(?:https?:\/\/[^\/]+)?(\/([^\/]+)\/(?:(\d+)|res\/(\d+)|(\w+))(?:\.x?html)?)(?:#i?(\d+))?/);
	if (m) {
		out.path  = m[1];
		out.board = m[2];
		out.page  = Number(m[3]) || 0;
		out.thrid = m[4];
		out.pid   = m[5];
	}
	return out;
}
