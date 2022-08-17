
let opened;

const portConnect = (resolve) => {
	const port = chrome.runtime.connect({ name: Hana.name });
	port.onMessage.addListener(({ msg, data }) => {
		switch (msg) {
		case 'bg-connected':
			resolve();
		}
		console.log(msg, data);
	});
	port.onDisconnect.addListener(() => {
		opened = null;
	});
}

const sendMessage = (msg, data) => {
	if(!opened)
		opened = new Promise(portConnect);
	opened.then(
		port => port.postMessage({ msg, data })
	);
}

Promise.all(['loading'=== document.readyState ?
	new Promise(ready => { document.addEventListener('DOMContentLoaded', ready) }) : null,
	( opened = new Promise(portConnect) ),
]).then(() => {
	Hana.init();
});
