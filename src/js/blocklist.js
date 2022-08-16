
const blockList = [
	{ // Два.ч
		js: [
			'static/js/*.js?*'
		],
		css: [

		],
		hosts: [
			'2ch.hk', '2ch.life'
		],
		block_js : false,
		block_css: false
	},
	{ // Доброчан
		js: [
			'js/*.js'
		],
		css: [

		],
		hosts: [
			'dobrochan.ru', 'dobrochan.net', 'dobrochan.com'
		],
		block_js : true,
		block_css: false
	}
];

let urls  = [];
let types = ['script', 'stylesheet'];

for (let params of blockList) {

	let { hosts, js, css, block_js, block_css } = params;

	if (!(hosts && hosts.length))
		continue;
	for (let host of hosts) {
		if (block_js && js && js.length) {
			for (let script of js)
				urls.push(`*://${host}/${script}`);
		}
		if (block_css && css && css.length) {
			for (let style of css)
				urls.push(`*://${host}/${style}`);
		}
	}
}

browser.webRequest.onBeforeRequest.addListener(
	() => new Object({ cancel: true }),
	{ urls, types },
	['blocking']
);
