/**
 *  Get a stored value
 */
function getStorageValue(key, defaultValue) {
	const saved = localStorage.getItem(key);
	const initial = JSON.parse(saved);
	return initial || defaultValue;
}
/**
 *  Store a value
 */
const saveLocalStorage = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value));
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
		console.log(`${node}: ${nodes[node]}`);
	}
  return nodes;
}
