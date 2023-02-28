"use strict";

let tossSummary = {};
let tossSummaryStart = {
	tossCount: 0,

	tossEventsEstimate1000: 0,
	tossEventsEstimateAttendance: 0,
	gameAttendance: 1,
};
let nodes = {
	tossBtn: {},
	resetBtn: {},

	tossCountLg: {},
	tossCount: {},
	tossEvents: {},

	tossEventsEstimate1000: {},
	tossEventsEstimateAttendance: {},
	gameAttendance: {},
};
nodes = getNodes(nodes);

function init() {
	// get values from localStorage
	tossSummary =
		storage.getItem("tossSummary") || Object.assign({}, tossSummaryStart);
	// console.log("tossSummary", tossSummary);

	updateTable();
}
init();

// INPUTS
nodes.gameAttendance.addEventListener("change", (e) => {
	setStore("gameAttendance", e.target.value);
	updateTable();
});

// BUTTONS
nodes.tossBtn.addEventListener("click", toss);
nodes.resetBtn.addEventListener("click", reset);

/**
 *  Set value in global obj, save in storage
 */
function setStore(key, value) {
	tossSummary[key] = value;
	storage.setItem("tossSummary", tossSummary);
}
async function toss(e) {
	// console.log("toss", e);
	setStore("tossCount", (tossSummary.tossCount += 1));
	updateTable();
}

function updateTable() {
	setStore(
		"tossEventsEstimate1000",
		(1000 / tossSummary.tossCount).toFixed(2)
	);
	setStore(
		"tossEventsEstimateAttendance",
		Math.max(1, (tossSummary.gameAttendance / tossSummary.tossCount).toFixed(2))
	);
	
	nodes.tossCountLg.value = tossSummary.tossCount || 0;
	// nodes.tossCount.innerHTML = tossSummary.tossCount || 0;
	nodes.tossEventsEstimate1000.innerHTML =
		tossSummary.tossEventsEstimate1000 || 0;
	nodes.tossEventsEstimateAttendance.innerHTML =
		tossSummary.tossEventsEstimateAttendance || 0;
	nodes.gameAttendance.value = tossSummary.gameAttendance || 1;
}

function reset() {
	tossSummary = Object.assign({}, tossSummaryStart);
	storage.setItem("tossSummary", tossSummary);
	updateTable();
}
