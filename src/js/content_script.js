
let opened;

const portConnect = resolve => {
	const port = chrome.runtime.connect({ name: Hana.name });
	port.onMessage.addListener(({ msg, data }) => {
		console.log(msg, data);
	});
	port.onDisconnect.addListener(() => {
		opened = null;
	});
}

opened = new Promise(portConnect);

const sendMessage = (msg, data) => {
	if(!opened)
		opened = new Promise(portConnect);
	opened.then(
		port => port.postMessage({ msg, data })
	);
}
