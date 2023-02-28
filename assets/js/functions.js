
/**
 * 	Local Storage Wrapper
 */
const storage = {
	setItem: (key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	},
	getItem: (key, defaultValue) => {
		const saved = localStorage.getItem(key);
		return JSON.parse(saved) || defaultValue;
	},
};

/**
 *  Settimeout with async/await
 *  https://stackoverflow.com/a/33292942/441878
 */
function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep(time, fn, ...args) {
	await timeout(time);
	return fn(...args);
}

/**
 *  Loop through object and get all nodes with matching IDs
 */
function getNodes(_nodes) {
	let nodes = {};
	for (const node in _nodes) {
		nodes[node] = document.querySelector(`#${node.toString()}`);
		// console.log(`${node}: ${nodes[node]}`);
	}
	return nodes;
}

/**
 * 	Credit: David Borland
 */
const streak = (a, value) =>
	a.reduce(
		({ count, max }, item) =>
			item === value
				? { count: ++count, max: Math.max(count, max) }
				: { count: 0, max: max },
		{ count: 0, max: 0 }
	).max;