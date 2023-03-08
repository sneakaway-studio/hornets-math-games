"use strict";

// Add point types here
const pointTypes = ["3 pts", "2 pts", "0 (missed 3)", "0 (missed 2)"];
let pointType = pointTypes[0];

// Add shot types here
const shotTypes = [
	"layup/dunk",
	"dribble jumper",
	"catch & shoot",
	"runner/floater",
	"post move",
	"remove",
];
let shotType = shotTypes[0];

// Set up color and shape
const eventColor = d3
	.scaleOrdinal()
	.domain(pointTypes)
	.range(d3.schemeCategory10);
const eventShape = d3.scaleOrdinal().domain(shotTypes).range(d3.symbols);
const shapeSize = 10;

/**
 * Vanilla JS mixes
 */

const pointColors = ["dc3545", "ffc107", "0d6efd", "198754"];

let mode = "Add";

const periods = [1, 2, 3, 4];
let period = periods[0];

const points = [0, 1, 2, 3];
let point = points[2];

let accuracy = "Hit";

const types = [];
let type = null;

let shotsPlaced = [];
const shotPlacedDefault = {
	period: 1,
	point: 2,
	accuracy: "hit",
	type: "",
};

function report() {
	console.log(
		`mode=${mode} | period=${period} | point=${point} | accuracy=${accuracy} | type=${type} | `
	);
}

// bootstrap dropdown with buttons
let selectorBtn = document.querySelector(".dropdown-toggle");
let items = document.querySelectorAll(".dropdown-item");
items.forEach((item) => {
	if (item.dataset.type == "0") {
		selectorBtn.innerHTML = item.innerHTML;
		selectorBtn.value = item.dataset.type;
	}
	item.addEventListener("click", function () {
		selectorBtn.innerHTML = item.innerHTML;
		selectorBtn.value = item.dataset.type;
		type = Number(item.dataset.type);
		shotType = shotTypes[type];
		// console.log(`innerHTML: ${selectorBtn.innerHTML}, type: ${selectorBtn.type}`);
	});
});

let infoVisible = false;
const shotTrackerInfo = document.querySelectorAll(".shotTrackerInfo");
document.querySelector("#shotTrackerInfoBtn").addEventListener("click", () => {
	if (infoVisible) {
		infoVisible = false;
		shotTrackerInfo.forEach((item) => {
			item.classList.add("d-none");
		});
	} else {
		infoVisible = true;
		shotTrackerInfo.forEach((item) => {
			item.classList.remove("d-none");
		});
	}
});

createControls();
createClickMap();
addListeners();

let addGroup = document.querySelector(".addGroup");
let removeGroup = document.querySelector(".removeGroup");

function addListeners() {
	// Mode btn
	document.querySelector("#modeBtn").addEventListener("click", (e) => {
		if (e.target.innerHTML == "Add") {
			mode = "Remove";
			addGroup.style.display = "none";
			removeGroup.style.display = "block";
		} else {
			mode = "Add";
			addGroup.style.display = "block";
			removeGroup.style.display = "none";
		}
		e.target.innerHTML = mode;
		report();
	});

	// Radio buttons for periods
	const periodBtns = d3
		.selectAll(".btn-period")
		.on("click", (d, i) => {
			period = d;
			report(d, i, d3.event);
		})
		.data(periods)
		.enter();

	// Radio buttons for points
	const pointsBtns = d3
		.selectAll(".btn-points")
		.on("click", (d, i) => {
			point = d;
			report(d, i, d3.event);
		})
		.data(points)
		.enter();

	// Radio buttons for points
	const accuracyBtns = d3
		.selectAll(".btn-points")
		.on("click", (d, i) => {
			point = d;
			report(d, i, d3.event);
		})
		.data(points)
		.enter();
}

function createControls() {
	// // Radio buttons for points
	// const pointEnter = d3
	// 	.select("#pointTypeButtons")
	// 	.selectAll(".form-check")
	// 	.data(pointTypes)
	// 	.enter()
	// 	.append("div")
	// 	.attr("class", "form-check pl-4 mb-1  pointTypeRadioWrapper")
	// 	.style("background-color", (d) => {
	// 		const c = d3.color(eventColor(d));
	// 		c.opacity = 0.75;
	// 		return c;
	// 	})
	// 	.style("border", "1px solid rgba(0, 0, 0, 0.75")
	// 	.style("border-radius", "5px")
	// 	.on("click", (d) => (pointType = d));
	// pointEnter
	// 	.append("input")
	// 	.attr("type", "radio")
	// 	.attr("class", "form-check-input")
	// 	.attr("name", "pointTypeRadio")
	// 	.attr("id", (d) => d + "_radio")
	// 	.attr("value", (d) => d)
	// 	.property("defaultChecked", (d) => d === pointType);
	// pointEnter
	// 	.append("label")
	// 	.text((d) => d)
	// 	.attr("class", "form-check-label")
	// 	.attr("for", (d) => d + "_radio");
	// // Radio buttons for shot types
	// const shotEnter = d3
	// 	.select("#shotTypeButtons")
	// 	.selectAll(".form-check")
	// 	.data(shotTypes)
	// 	.enter()
	// 	.append("div")
	// 	.attr("class", "form-check shotTypeRadioWrapper")
	// 	// .on("click", (d) => (shotType = d));
	// shotEnter
	// 	.append("input")
	// 	.attr("type", "radio")
	// 	.attr("class", "form-check-input")
	// 	.attr("name", "shotTypeRadio")
	// 	.attr("id", (d) => d + "_radio")
	// 	.attr("value", (d) => d)
	// 	.property("defaultChecked", (d) => d === shotType);
	// shotEnter
	// 	.append("label")
	// 	.text((d) => d)
	// 	.attr("class", "form-check-label mr-1")
	// 	.attr("for", (d) => d + "_radio")
	// 	.style("vertical-align", "20%");
	// const w = shapeSize * 2;
	// const h = shapeSize * 2;
	// shotEnter
	// 	.filter((d) => d !== "remove")
	// 	.append("svg")
	// 	.attr("width", w)
	// 	.attr("height", h)
	// 	.append("g")
	// 	.attr("class", "event")
	// 	.attr("transform", (d) => "translate(" + w / 2 + "," + h / 2 + ")")
	// 	.append("path")
	// 	.attr("d", (d) => getShape(d)());
	// Download button
	// d3.select("#downloadButton").on("click", () => {
	// 	let data = [];
	// 	let columns = [];
	// 	// Get event data
	// 	d3.select("#clickMap")
	// 		.selectAll(".event")
	// 		.each((d, i) => {
	// 			if (i === 0) {
	// 				// Get columns from first event
	// 				columns = d3.keys(d);
	// 				data = columns.join(",") + "\n";
	// 			}
	// 			// Add event data
	// 			data += columns.map((column) => d[column]).join(",") + "\n";
	// 		});
	// 	// Create temporary download link for data
	// 	const a = window.document.createElement("a");
	// 	a.href = window.URL.createObjectURL(
	// 		new Blob([data], { type: "text/csv" })
	// 	);
	// 	a.download = d3.select("#filenameInput").property("value");
	// 	// Append anchor to body
	// 	document.body.appendChild(a);
	// 	a.click();
	// 	// Remove anchor from body
	// 	document.body.removeChild(a);
	// });
}

function createClickMap() {
	d3.select("#clickMap")
		.select("img")
		.on("click", () => {
			d3.event.preventDefault();
		});

	// Select the svg element
	const svg = d3.select("#clickMap").select("svg");
    

	// Receive click events from background
	svg.on("click", function (e) {
		if (shotType === "remove") return;

		// Get the width and height
		const width = parseInt(svg.style("width"), 10);
		const height = parseInt(svg.style("height"), 10);

		const x = d3.pointer(e)[0];
		const y = d3.pointer(e)[1];

		// Set the data for this event
		const data = {
			x: x,
			y: y,
			xNorm: x / width,
			yNorm: y / height,
			pointType: point,
			shotType: shotType,
		};

		shotsPlaced.push(data);
		console.log(shotsPlaced);

		// Draw the event
		const g = svg
			.append("g")
			.datum(data)
			.attr("class", "event")
			.attr("transform", (d) => {
                console.log(d)
                return "translate(" + d.x + "," + d.y + ")"
            })
			.on("click", function () {
				if (shotType === "remove") {
					d3.event.stopPropagation();

					d3.select(this).remove();

					return;
				}
			});

		g.append("path")
			.attr("d", (d) => getShape(d.shotType)())
			// .style("fill", (d) => eventColor(d.pointType));
			.style("fill", (d) => "#" + pointColors[d.pointType]);
	});

	// Handle resizing svg div
	const resizeObserver = new ResizeObserver((entries) => {
		// Get the width and height
		const width = parseInt(svg.style("width"), 10);
		const height = parseInt(svg.style("height"), 10);

		d3.select("#clickMap")
			.selectAll(".event")
			.each(function (d) {
				d.x = d.xNorm * width;
				d.y = d.yNorm * height;

				d3.select(this).attr(
					"transform",
					(d) => "translate(" + d.x + "," + d.y + ")"
				);
			});
	});

	resizeObserver.observe(document.querySelector(".svgDiv"));

	// /**
	//  * https://stackoverflow.com/a/52132259/441878
	//  */

    // create and apply zoom behavior 
	// svg.call(d3.zoom().on("zoom", handleZoom)).on("wheel.zoom", wheeled);

    

	// let transform = d3.zoomTransform(svg);
	// // transform.x += 10;
	// // transform.y += 10;
	// svg.attr("transform", transform);

	// function handleZoom(e) {
	// 	console.log("e", e);
	// 	svg.attr("transform", e.transform);
	// }

	// // function handleZoom() {
	// // 	let current_transform = d3.zoomTransform(svg);
	// // 	current_transform.x += d3.event.sourceEvent.movementX;
	// // 	current_transform.y += d3.event.sourceEvent.movementY;
	// //     console.log("current_transform",current_transform)
	// // 	svg.attr("transform", current_transform);
	// // }

	// function wheeled() {
	// 	let current_transform = d3.zoomTransform(svg);
	// 	console.log("current_transform", current_transform);

	// 	if (d3.event.ctrlKey) {
	// 		current_transform.k = current_transform.k - d3.event.deltaY * 0.01;
	// 	} else {
	// 		current_transform.y = current_transform.y - d3.event.deltaY;
	// 	}
	// 	svg.attr("transform", current_transform);
	// }



    // svg.call(d3.zoom()
    //     .extent([[0, 0], [600, 600]])
    //     .scaleExtent([1, 8])
    //     .on("zoom", zoomed));

    // function zoomed({transform}) {
    //     svg.attr("transform", transform);
    // }



}

function getShape(shotType) {
	return d3
		.symbol()
		.type(eventShape(shotType))
		.size(shapeSize * shapeSize);
}

// Clear button
d3.select("#clearButton").on("click", () => {
	d3.select("#clickMap").selectAll(".event").remove();
	shotsPlaced = [];
	storage.setItem("shotsPlaced", shotsPlaced);
});

// let shotChartSummary = {};
// let shotChartSummaryStart = {
// 	tossCount: 0,

// };
// let nodes = {
// 	tossBtn: {},
// 	resetBtn: {},

// };
// nodes = getNodes(nodes);

// function init() {
// 	// get values from localStorage
// 	shotChartSummary =
// 		storage.getItem("shotChartSummary") || Object.assign({}, shotChartSummaryStart);
// 	// console.log("shotChartSummary", shotChartSummary);

// 	updateTable();
// }
// init();

// // INPUTS
// nodes.gameAttendance.addEventListener("change", (e) => {
// 	setStore("gameAttendance", e.target.value);
// 	updateTable();
// });

// // BUTTONS
// nodes.tossBtn.addEventListener("click", toss);
// nodes.resetBtn.addEventListener("click", reset);

// /**
//  *  Set value in global obj, save in storage
//  */
// function setStore(key, value) {
// 	shotChartSummary[key] = value;
// 	storage.setItem("shotChartSummary", shotChartSummary);
// }
// async function toss(e) {
// 	// console.log("toss", e);
// 	setStore("tossCount", (shotChartSummary.tossCount += 1));
// 	updateTable();
// }

// function updateTable() {
// 	setStore(
// 		"tossEventsEstimate1000",
// 		(1000 / shotChartSummary.tossCount).toFixed(2)
// 	);
// 	setStore(
// 		"tossEventsEstimateAttendance",
// 		Math.max(1, (shotChartSummary.gameAttendance / shotChartSummary.tossCount).toFixed(2))
// 	);

// 	nodes.tossCountLg.value = shotChartSummary.tossCount || 0;
// 	// nodes.tossCount.innerHTML = shotChartSummary.tossCount || 0;
// 	nodes.tossEventsEstimate1000.innerHTML =
// 		shotChartSummary.tossEventsEstimate1000 || 0;
// 	nodes.tossEventsEstimateAttendance.innerHTML =
// 		shotChartSummary.tossEventsEstimateAttendance || 0;
// 	nodes.gameAttendance.value = shotChartSummary.gameAttendance || 1;
// }

// function reset() {
// 	shotChartSummary = Object.assign({}, shotChartSummaryStart);
// 	storage.setItem("shotChartSummary", shotChartSummary);
// 	updateTable();
// }
