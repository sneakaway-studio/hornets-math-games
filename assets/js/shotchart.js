"use strict";



// Add point types here
const pointTypes = ["3 pts", "2 pts", "0 (missed 3)", "0 (missed 2)"];
let pointType = pointTypes[0];

// Add shot types here
const shotTypes = ["layup/dunk", "dribble jumper", "catch & shoot", "runner/floater", "post move", "remove"];
let shotType = shotTypes[0];

// Set up color and shape
const eventColor = d3.scaleOrdinal()
    .domain(pointTypes)
    .range(d3.schemeCategory10);

const eventShape = d3.scaleOrdinal()
    .domain(shotTypes)
    .range(d3.symbols);

const shapeSize = 10;

createControls();
createClickMap();

function createControls() {

  // Radio buttons for points
  const pointEnter = d3.select("#pointTypeButtons").selectAll(".form-check")
      .data(pointTypes)
    .enter().append("div")
      .attr("class", "form-check pl-4 mb-1")
      .style("background-color", d => {
        const c = d3.color(eventColor(d));
        c.opacity = 0.75;
        return c;
      })
      .style("border", "1px solid rgba(0, 0, 0, 0.75")
      .style("border-radius", "5px")
      .on("click", d => pointType = d);

  pointEnter.append("input")
      .attr("type", "radio")
      .attr("class", "form-check-input")
      .attr("name", "pointTypeRadio")
      .attr("id", d => d + "_radio")
      .attr("value", d => d)
      .property("defaultChecked", d => d === pointType);

  pointEnter.append("label")
      .text(d => d)
      .attr("class", "form-check-label")
      .attr("for", d => d + "_radio");

  // Radio buttons for shot types
  const shotEnter = d3.select("#shotTypeButtons").selectAll(".form-check")
      .data(shotTypes)
    .enter().append("div")
      .attr("class", "form-check")
      .on("click", d => shotType = d);

  shotEnter.append("input")
      .attr("type", "radio")
      .attr("class", "form-check-input")
      .attr("name", "shotTypeRadio")
      .attr("id", d => d + "_radio")
      .attr("value", d => d)
      .property("defaultChecked", d => d === shotType);

  shotEnter.append("label")
      .text(d => d)
      .attr("class", "form-check-label mr-1")
      .attr("for", d => d + "_radio")
      .style("vertical-align", "20%");

  const w = shapeSize * 2;
  const h = shapeSize * 2;

  shotEnter.filter(d => d !== "remove").append("svg")
      .attr("width", w)
      .attr("height", h)
    .append("g")
      .attr("class", "event")
      .attr("transform", d => "translate(" + (w / 2) + "," + (h / 2) + ")")
    .append("path")
      .attr("d", d => getShape(d)());

  // Download button
  d3.select("#downloadButton").on("click", () => {
    let data = [];
    let columns = [];

    // Get event data
    d3.select("#clickMap").selectAll(".event").each((d, i) => {
      if (i === 0) {
        // Get columns from first event
        columns = d3.keys(d);
        data = columns.join(",") + "\n";
      }

      // Add event data
      data += columns.map(column => d[column]).join(",") + "\n";
    });

    // Create temporary download link for data
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([data], {type: "text/csv"}));
    a.download = d3.select("#filenameInput").property("value");

    // Append anchor to body
    document.body.appendChild(a)
    a.click();

    // Remove anchor from body
    document.body.removeChild(a)
  });

  // Clear button
  d3.select("#clearButton").on("click", () => {
    d3.select("#clickMap").selectAll(".event").remove();
  });
}

function createClickMap() {
  d3.select("#clickMap").select("img").on("click", () => {
    d3.event.preventDefault();
  });

  // Select the svg element
  const svg = d3.select("#clickMap").select("svg");



  // Receive click events from background
  svg.on("click", function() {

    if (shotType === "remove") return;

    // Get the width and height
    const width = parseInt(svg.style("width"), 10);
    const height = parseInt(svg.style("height"), 10);

    const x = d3.mouse(this)[0];
    const y = d3.mouse(this)[1];

    // Set the data for this event
    const data = {
      x: x,
      y: y,
      xNorm: x / width,
      yNorm: y / height,
      pointType: pointType,
      shotType: shotType
    };

    // Draw the event
    const g = svg.append("g").datum(data)
        .attr("class", "event")
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
        .on("click", function() {
          if (shotType === "remove") {
            d3.event.stopPropagation();

            d3.select(this).remove();

            return;
          }
        });

    g.append("path")
        .attr("d", d => getShape(d.shotType)())
        .style("fill", d => eventColor(d.pointType));

  });
}

function getShape(shotType) {
  return d3.symbol()
    .type(eventShape(shotType))
    .size(shapeSize * shapeSize);
}


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
