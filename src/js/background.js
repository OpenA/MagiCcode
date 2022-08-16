
if (typeof browser === 'undefined') {
	var browser = chrome;
} else {

}

const openPorts = new Set;

browser.runtime.onConnect.addListener(port => {
	port.onMessage.addListener(messageHandler);
	port.onDisconnect.addListener(() => {
		openPorts.delete(port);
	});
	openPorts.add(port);
});

function messageHandler({ msg, data }, port) {
	// check
	console.log(msg, data, port);
}
