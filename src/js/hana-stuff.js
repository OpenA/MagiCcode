
/* post reply chains */
class ReplySetTo extends Set {

	constructor(from_uid = '', to_uids) {
		super(to_uids);
		this.from = from_uid;
	}
}
class ReplyMap extends Map {

	constructor(set_to_list = [/* ReplySetTo, ... */]) {
		
		let arr_set = [], arr_map = [];

		for (const set_to of set_to_list)
		{
			if (!set_to)
				continue;

			const from_uid = set_to.from;

			for (const to_uid of set_to) {
				let idx = arr_set.indexOf(to_uid) + 1;
				if (idx > 0) {
					arr_set[idx].add(from_uid)
				} else {
					arr_set.push(to_uid, new Set([from_uid]));
				}
			}
		}
		for (let i = 0; i < arr_set.length; i += 2) {
			arr_map.push([arr_set[i], arr_set[i + 1]]);
		}
		super(arr_map);
	}

	setFromTo(from_uid = '', to_uid = '') {
		if (super.has(to_uid)) {
			super.get(to_uid).add(from_uid);
		} else
			super.set(to_uid, new Set([from_uid]));
	}

	extract(to_uid = '') {

		let links_list = [];

		if (super.has(to_uid)) {
			for (let from_uid of super.get(to_uid)) {
				links_list.push( from_uid );
			}
			super.delete(to_uid);
		}
		return links_list;
	}
}

const parseAibAnchor = ({ pathname, hash }) => {
	const out = Object.create(null);
	let m = pathname.match(/^\/([a-zA-Z]+)(?:.*\/res\/(\d+)|\/(\d+))?/);
	if (m) {
		out.board = m[1];
		out.thrid = m[2];
		out.page  = Number(m[3]) || 0;
	}
	if (hash)
		out.pid = String(hash.match(/\d+/) || '');
	return out;
}

const parseAibUrl = (url = '') => {
	const out = Object.create(null);
	var m = url.match(/^(?:https?:\/\/[^\/]+)?(\/([a-zA-Z]+)(?:.*\/res\/(\d+)|\/(\d+))?[^#?\n]*)(?:#[^\d\n]*(\d+))?/);
	if (m) {
		out.path  = m[1];
		out.board = m[2];
		out.thrid = m[3];
		out.page  = Number(m[4]) || 0;
		out.pid   = m[5];
	}
	return out;
}
