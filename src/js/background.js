
if (typeof browser === 'undefined') {
	var browser = chrome;
} else {

}

const openPorts = new Set;

browser.runtime.onConnect.addListener(port => {

	const tab_id = port.sender.tab.id,
	    { tabs } = browser,
	    js_ready = [];

	port.onMessage.addListener(messageHandler);
	port.onDisconnect.addListener(() => {
		openPorts.delete(port);
	});
	openPorts.add(port);

	for (const js of [
		'/Tools/pasL/pasL.js', 'src/js/hana-stuff.js'
	]) {
		js_ready.push(
			new Promise(ok => {
				tabs.executeScript(tab_id, { allFrames: false, file: js }, () => ok())
			})
		);
	}
	Promise.all(js_ready).then(() => {
		port.postMessage({ msg: 'bg-connected', data: null });
	});
	for (const css of [
		'src/css/hana-stuff.css'
	]) {
		tabs.insertCSS(tab_id, { allFrames: false, file: css });
	}
});

function messageHandler({ msg, data }, port) {
	// check
	console.log(msg, data, port);
}
