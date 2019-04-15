/* SpelzZ - a lightweight Node Work Tool */
var _z = (function(){
	function $each(arr, Fn) {
		arr = typeof arr === 'string' ? document.querySelectorAll(arr) : arr;
		Array.prototype.slice.call(arr, 0).forEach(function(el, i) {
			Fn(el, (i + 1 === arr.length))
		})
	}
	function $setup(el, attr, events) {
		if (el) {
			el = typeof el === 'string' ? document.createElement(el) : el;
			if (attr) {
				for (var key in attr) {
					attr[key] === undefined ? el.removeAttribute(key) :
					key === 'html'    ? el.innerHTML   = attr[key] :
					key === 'text'    ? el.textContent = attr[key] :
					key in el         ? el[key]        = attr[key] :
					el.setAttribute(key, attr[key]);
				}
			}
			if (events) {
				for (var key in events) {
					if (key === 'remove') {
						for (var evr in events[key]) {
							var rfs = !Array.isArray(events[key][evr]) ? [events[key][evr]] : events[key][evr];
							for (var i = 0; i < rfs.length; i++) {
								el.removeEventListener(evr, rfs[i], false);
							}
						}
					} else {
						el.addEventListener(key, events[key], false);
					}
				}
			}
		}
		return el;
	}
	function $nodeUtil(p, el, nodes) {
		if (el) {
			var i, node, meth = p.toLowerCase(), Child, Parent;
			switch (meth) {
				case 'remove':
					$each(el, function(child) {
						child.parentNode.removeChild(child);
					});
					break;
				default:
					el = typeof el === 'string' ? document.querySelector(el) : el;
					nodes = nodes && !Array.isArray(nodes) ? [nodes] : nodes;
					Parent = el.parentNode || el;
					switch (meth) {
						case 'append':
							for (i = 0; node = nodes[i++];) {
								el.appendChild(node);
							}
							break;
						case 'replace':
							Parent.replaceChild(nodes[0], el);
							break;
						default:
							switch (meth) {
								case 'after': Child = el.nextSibling;
									break;
								case 'before': Child = el;
									break;
								case 'prepend': Child = el.childNodes[0], Parent = el;
							}
							for (i = 0; node = nodes[i++];) {
								Parent.insertBefore(node, Child);
							}
					}
			}
		}
	}
	function $route(el, Fn) {
		while (el) {
			var tn = (typeof Fn === 'string' ? el.querySelector(Fn) : Fn(el));
			if (tn)
				return (typeof tn === 'object' ? tn : el);
			el = el.parentNode;
		}
	}
	function $storeItem(locate) {
		var Store = locate === 'session' ? sessionStorage : localStorage,
			probeStore = function(name, val) {
				try {
					Store.setItem(name, val);
				} catch(e) {
					Store.removeItem(name);
					Store.setItem(name, val);
				}
			}
		return {
			rm: function(names) {
					if (typeof names === 'string')
						names = [names];
					for (var name, i = 0; name = names[i++];) {
						Store.removeItem(name); 
					}
				},
			set: function(name, value) {
					if (typeof name === 'object') {
						for (var key in name) {
							probeStore(key, (name[key] === null ? value : name[key]));
						}
					} else {
						probeStore(name, value);
					}
				},
			get: function(name, def) {
					if (name in Store) {
						def = Store.getItem(name);
					} else {
						probeStore(name, def);
					}
					return (def == 'false' ? false : def == 'true' ? true : def);
				}
		}
	}
	function fallback(e) {
		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;
	}
	return {
		each: $each, setup: $setup, route: $route, fall: fallback,
		sessionS: $storeItem('session'), localS: $storeItem('local'),
		append: function(el, nodes) { $nodeUtil('append', el, nodes) },
		prepend: function(el, nodes) { $nodeUtil('prepend', el, nodes) },
		after: function(el, nodes) { $nodeUtil('after', el, nodes) },
		before: function(el, nodes) { $nodeUtil('before', el, nodes) },
		replace: function(el, nodes) { $nodeUtil('replace', el, nodes) },
		remove: function(el, nodes) { $nodeUtil('remove', el, nodes) }
	}
})();
