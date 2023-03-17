"use strict";

// ELEMENTS
let svg;

// PROPS
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
	"remove all",
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

/****************************************************/
/******************* INTERFACE **********************/
/****************************************************/

let shotTypeBtn,
	shotTypeItems,
	toolbarLabels,
	toolbarLabelsVisible = false;


function displaySelectedShotType(text, shotTypeNum){
    shotTypeBtn.innerHTML = text;
	shotTypeBtn.value = shotTypeNum;
}


async function createToolbar() {
	// SHOT TYPE
	shotTypeBtn = document.querySelector(".dropdown-toggle");
	shotTypeItems = document.querySelectorAll(".dropdown-item");
	// show the value in the button
	shotTypeItems.forEach((item) => {
        // set the default
		if (item.dataset.shot == "0") displaySelectedShotType(item.innerHTML, item.dataset.shot);
        // add button listeners
		item.addEventListener("click", function () {
			displaySelectedShotType(item.innerHTML, item.dataset.shot);
			shotType = shotTypes[Number(item.dataset.shot)];
			// console.log(`value: ${shotTypeBtn.value}, shotType: ${shotType}`);
		});
	});

	// SHOW / HIDE LABELS
	toolbarLabelsVisible = false;
	toolbarLabels = document.querySelectorAll(".toolbarLabel");
	document
		.querySelector("#toolbarLabelsBtn")
		.addEventListener("click", () => {
			if (toolbarLabelsVisible) {
				toolbarLabelsVisible = false;
				toolbarLabels.forEach((item) => {
					item.classList.add("d-none");
				});
			} else {
				toolbarLabelsVisible = true;
				toolbarLabels.forEach((item) => {
					item.classList.remove("d-none");
				});
			}
		});

	// Radio buttons for periodTypes
	document.querySelectorAll(".btn-period").forEach((btn) => {
		btn.addEventListener("click", () => {
			periodType = btn.dataset.period;
		});
	});

	// Radio buttons for pointType
	document.querySelectorAll(".btn-points").forEach((btn) => {
		btn.addEventListener("click", () => {
			pointType = btn.dataset.point;
		});
	});
}

async function createClickMap() {
	d3.select("#clickMap")
		.select("img")
		.on("click", () => {
			d3.event.preventDefault();
		});

	// Select the svg element
	svg = d3.select("#clickMap").select("svg");

	// Receive click events from background
	svg.on("click", function (pointerEvent) {
		if (shotType === "remove" || shotType === "remove all") return;
		// console.log(pointerEvent);

		updateSvgSize();
		const x = d3.pointer(pointerEvent)[0];
		const y = d3.pointer(pointerEvent)[1];

		// Set the data for this event
		const shotData = {
			periodType: periodType,
			pointType: pointType,
			shotType: shotType,
			xNorm: x / width,
			yNorm: y / height,
			x: x,
			y: y,
		};

		shotsPlaced.push(shotData);
		storage.setItem("shotsPlaced", shotsPlaced);
		// console.log(shotsPlaced);

		addShot(shotData);
	});
}

// Remove all shots button
document.querySelector("#clearButton").addEventListener("click", () => {
	if (confirm("Remove all shots?") == true) {
		d3.select("#clickMap").selectAll(".event").remove();
		shotsPlaced = [];
		storage.setItem("shotsPlaced", shotsPlaced);
	}
    
});

async function addResizeObserver() {
	// Handle resizing svg div
	const resizeObserver = new ResizeObserver((entries) => {
		updateSvgSize();
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
}

async function updateFromLocalStorage() {
	// check for values in localStorage
	shotsPlaced = storage.getItem("shotsPlaced") || [];

	if (shotsPlaced.length > 0) {
		shotsPlaced.forEach(function (d) {
			addShot({
				periodType: d.periodType,
				pointType: d.pointType,
				shotType: d.shotType,
				xNorm: d.xNorm,
				yNorm: d.yNorm,
				x: d.x,
				y: d.y,
			});
		});
	}
}

let width, height;

// Get the width and height
function updateSvgSize() {
	width = parseInt(svg.style("width"), 10);
	height = parseInt(svg.style("height"), 10);
}

function addShot(shotData) {
	// console.log(shotData);

	// Draw the event
	const g = svg
		.append("g")
		.datum(shotData)
		.attr("class", "event")
		.attr("transform", (d) => {
			console.log(d);
			return "translate(" + d.x + "," + d.y + ")";
		})
		// add remove listener to each shot
		.on("click", function (e) {
			if (shotType === "remove") {
				e.stopPropagation();
				d3.select(this).remove();
				return;
			}
		});

	g.append("path")
		.attr("d", (d) => getShape(d.shotType)())
		.style("fill", (d) => "#" + pointColors[d.pointType]);
}

function getShape(shotType) {
	return d3
		.symbol()
		.type(eventShape(shotType))
		.size(shapeSize * shapeSize);
}

/****************************************************/
/********************** INIT ************************/
/****************************************************/

document.addEventListener("DOMContentLoaded", init);

async function init() {
	await createToolbar();
	await createClickMap();
	// addScrollListener();
	await addResizeObserver();
	await updateFromLocalStorage();
}

// let toolbar = document.querySelector(".toolbar");

// function addScrollListener() {
// 	window.addEventListener("scroll", function () {
// 		if (window.scrollY > 50) {
// 			toolbar.classList.add("fixed-top");
// 			toolbar.style.backgroundColor = "rgba(255,255,255,0.5)";
// 		} else {
// 			toolbar.classList.remove("fixed-top");
// 			toolbar.style.backgroundColor = "rgba(255,255,255,1)";
// 		}
// 	});
// }
