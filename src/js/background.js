
if (typeof browser === 'undefined') {
	var browser = chrome;
} else {

}

const openPorts = new Set;

browser.runtime.onConnect.addListener(port => {

	const tab_id = port.sender.tab.id;

	port.onMessage.addListener(messageHandler);
	port.onDisconnect.addListener(() => {
		openPorts.delete(port);
	});
	openPorts.add(port);
	browser.tabs.executeScript(tab_id, {
		allFrames: false, file: '/Tools/pasL/pasL.js'
	}, () => {
		port.postMessage({ msg: 'bg-connected', data: null });
	});
	//browser.tabs.insertCSS(details.tabId, {
	//	allFrames: false, file: '/js/pasL/pasL.css'
	//});
});

function messageHandler({ msg, data }, port) {
	// check
	console.log(msg, data, port);
}
