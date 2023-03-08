"use strict";

let mode = "Add";

// PERIOD
const periodTypes = [1, 2, 3, 4];
let periodType = periodTypes[0];

// POINT
const pointColors = ["dc3545", "ffc107", "0d6efd", "198754"];
const pointTypes = [0, 1, 2, 3];
let pointType = pointTypes[2];

// SHOT
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

let shotsPlaced = [];

function report() {
	console.log(
		`mode=${mode} | period=${periodType} | point=${pointType} | shot=${shotType}`
	);
}

// bootstrap dropdown with buttons
let selectorBtn = document.querySelector(".dropdown-toggle");
let items = document.querySelectorAll(".dropdown-item");
items.forEach((item) => {
	if (item.dataset.shot == "0") {
		selectorBtn.innerHTML = item.innerHTML;
		selectorBtn.value = item.dataset.shot;
	}
	item.addEventListener("click", function () {
		selectorBtn.innerHTML = item.innerHTML;
		selectorBtn.value = item.dataset.shot;
		let shotTypeIndex = Number(item.dataset.shot);
		shotType = shotTypes[shotTypeIndex];
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

createClickMap();
addListeners();

let addGroup = document.querySelector(".addGroup");
let removeGroup = document.querySelector(".removeGroup");

function addListeners() {
	// Mode btn
	// document.querySelector("#modeBtn").addEventListener("click", (e) => {
	// 	if (e.target.innerHTML == "Add") {
	// 		mode = "Remove";
	// 		addGroup.style.display = "none";
	// 		removeGroup.style.display = "block";
	// 	} else {
	// 		mode = "Add";
	// 		addGroup.style.display = "block";
	// 		removeGroup.style.display = "none";
	// 	}
	// 	e.target.innerHTML = mode;
	// 	report();
	// });

	// Radio buttons for periodTypes
	const periodBtns = d3
		.selectAll(".btn-period")
		.on("click", (d, i) => {
			periodType = i;
			report();
		})
		.data(periodTypes)
		.enter();

	// Radio buttons for pointType
	const pointsBtns = d3
		.selectAll(".btn-points")
		.on("click", (d, i) => {
			pointType = i;
			report();
		})
		.data(pointTypes)
		.enter();
}

// const svg = d3.select("#clickMap").select("svg");
// const zoomGroup = svg.select("#zoomGroup");

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
			periodType: periodType,
			pointType: pointType,
			shotType: shotType,
			xNorm: x / width,
			yNorm: y / height,
			x: x,
			y: y,
		};

		shotsPlaced.push(data);
        storage.setItem("shotsPlaced", shotsPlaced);
		console.log(shotsPlaced);

		// Draw the event
		const g = svg
			.append("g")
			.datum(data)
			.attr("class", "event")
			.attr("transform", (d) => {
				console.log(d);
				return "translate(" + d.x + "," + d.y + ")";
			})
			.on("click", function (e) {
				if (shotType === "remove") {
					e.stopPropagation();
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

	resizeObserver.observe(document.querySelector("#svgDiv"));

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
