"use strict";

let shotHistory = [];
let shotSummary = {};
let shotSummaryStart = {
	playerName: "",
	playerPct: 50,
	shotCount: 0,
	shotPct: 0,
    shotMadeCount: 0,
	madeStreak: 0,
	missedStreak: 0,
};
let nodes = {
	playerName: {},
	playerPct: {},
	shootBtn: {},
	resetBtn: {},
	progressText: {},
	shotCount: {},
	shotPct: {},
	madeStreak: {},
	missedStreak: {},
	shotResults: {},
};
nodes = getNodes(nodes);

function init() {
	// get values from localStorage
	shotHistory = getStorageValue("shotHistory") || [];
	shotSummary =
		getStorageValue("shotSummary") || Object.assign({}, shotSummaryStart);
	// console.log("shotHistory", shotHistory);
	// console.log("shotSummary", shotSummary);
	updatePlayer();
	updateTable();
}
init();

// INPUTS
nodes.playerName.addEventListener("change", (e) => {
	set("playerName", e.target.value);
});
nodes.playerPct.addEventListener("change", (e) => {
	set("playerPct", e.target.value);
});

// BUTTONS
nodes.shootBtn.addEventListener("click", shoot);
nodes.resetBtn.addEventListener("click", reset);

// OUTPUTS
function updatePlayer() {
	nodes.playerName.value = shotSummary.playerName || "";
	nodes.playerPct.value = shotSummary.playerPct || 50;
}
function updateTable() {
	nodes.shotCount.innerHTML = shotSummary.shotMadeCount + " / " + shotSummary.shotCount;
	nodes.shotPct.innerHTML = Math.ceil(shotSummary.shotPct) + "%";
	nodes.madeStreak.innerHTML = shotSummary.madeStreak;
	nodes.missedStreak.innerHTML = shotSummary.missedStreak;
	updateShotResultsTable();
}

/**
 *  Set local value in obj, save in storage
 */
function set(key, value) {
	shotSummary[key] = value;
	saveLocalStorage("shotSummary", shotSummary);
}

async function shoot(e) {
	// console.log("shoot", e);
	// console.log("shotHistory", shotHistory);

	let progressText = "The ball is up...";
	const success = Math.random() < shotSummary.playerPct / 100;
    nodes.progressText.innerHTML = progressText;
	console.log(progressText, success);

	shotHistory.push(success);
	saveLocalStorage("shotHistory", shotHistory);


	await sleep(
		1000,
		() => {
			// console.log("1 second has passed", new Date());
			nodes.progressText.innerHTML = success ? `It's good!` : "No good!";
            updateStatsFromHistory();
		},
		[]
	);
}

function updateStatsFromHistory() {
	set("shotCount", shotHistory.length);
	set(
		"shotPct",
		(shotHistory.filter((d) => d).length / shotHistory.length) * 100
	);
    set("shotMadeCount", shotHistory.filter(Boolean).length)
	set("madeStreak", streak(shotHistory, true));
	set("missedStreak", streak(shotHistory, false));

	updateTable();
}

const streak = (a, value) =>
	a.reduce(
		({ count, max }, item) =>
			item === value
				? { count: ++count, max: Math.max(count, max) }
				: { count: 0, max: max },
		{ count: 0, max: 0 }
	).max;

function reset() {
	shotHistory = [];
	saveLocalStorage("shotHistory", shotHistory);
	shotSummary = Object.assign({}, shotSummaryStart);
	saveLocalStorage("shotSummary", shotSummary);
    nodes.progressText.innerHTML = "";
	updatePlayer();
	updateTable();
	updateShotResultsTable();
}

function updateShotResultsTable() {
	let str = "";
	for (let i = 0; i < shotHistory.length; i++) {
		str += `<span title='${i}' class='${
			shotHistory[i] ? "me-1 bi bi-check-circle" : "me-1 bi bi-x-circle"
		}' style='color:${shotHistory[i] ? "seagreen" : "firebrick"}'></span>`;
	}
	nodes.shotResults.innerHTML = str;
}
