var w = 1650;
var h = 300;
var padding = 30

var randomAmount = function() {
	return Math.floor(Math.random() * (500 - 10 + 1)) + 10
}

var randomDay = function(){
	return Math.floor(Math.random() * (365 - 1 + 1)) + 1
}

dataset = []

for (i = 0; i < 1000; i++) {
    var set = [randomDay(), randomAmount()]
    dataset.push(set)
}

var january = d3.time.scale()
	.domain([new Date(2012, 0, 1), new Date(2012, 0, 31)])
  .range([padding, w - padding * 2]);

var margin = {top: -190, right: 0, bottom: 0, left: 0},
    width = 960 - margin.left - margin.right,
    height = 80 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
    .range([padding, w - padding * 2]);

// Scales

var xScale = d3.scale.linear()
	.domain([0, d3.max(dataset, function(d){
		return d[0];
	})])
	.range([padding, w - padding * 2]);

var yScale = d3.scale.linear()
				 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
				 .range([h - padding, padding]);

var rScale = d3.scale.linear()
	.domain([0, d3.max(dataset, function(d){
		return d[1];
	})])
	.range([2,6]);

// Axes

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(d3.time.months)
  .tickSize(16, 0)
  .tickFormat(d3.time.format("%B"));

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .ticks(12);

// Objects

var svg = d3.select('#scatter')
	.append('svg')
	.attr('width', w)
	.attr('height', h);

svg.append('g')
	.attr('id', 'circles')
	.attr('clip-path', 'url(#chart-area)')
	.selectAll('circle')
	.data(dataset)
	.enter()
	.append("circle")
	.attr('fill', '#526EC2')
	.on('mouseover', function(d){

		function dateFromDay(year, day){
  		var date = new Date(year, 0);
  		return String(new Date(date.setDate(day)));
		}

		console.log(d[1])
		console.log(d[0])
		$('.scatterplot-data-text').css('visibility', 'visible')
		$('.scatterplot-data-text').html('$'+d[1]+' on '+dateFromDay(2014, d[0]).substring(0, dateFromDay.length + 14))

		// var xPosition = parseFloat(d3.select(this).attr("cx"))
		// var yPosition = parseFloat(d3.select(this).attr("cy"))

		// d3.select('#scatter-tooltip')
		// 	.style('left', xPosition + 'px')
		// 	.style("left", xPosition + "px")
		//   .style("top", yPosition + "px")
		//   .select("#value")
		//   .text(d[1]);

		// d3.select('#scatter-tooltip').classed('hidden', false)
	})
	.on('mouseout', function(){
		$('.scatterplot-data-text').css('visibility', 'hidden')
	})
	.attr('cx', function(d){
		return xScale(d[0]);
	})
	.attr('cy', function(d){
		return yScale(d[1]);
	})
	.attr('r', function(d){
		return rScale(d[1]);
	})

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll(".tick text")
    .style("text-anchor", "start")
    .attr("x", 6)
    .attr("y", 6);

svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + padding + ",0)")
	.call(yAxis);

d3.select("button")
.on("click", function() {
	console.log('clicking')

	//New values for dataset
	var numValues = dataset.length;						 		//Count original length of dataset
	var maxRange = Math.random() * 1000;						//Max range of new values
	dataset = [];  						 				 		//Initialize empty array
	for (var i = 0; i < numValues; i++) {				 		//Loop numValues times
		var newNumber1 = Math.floor(Math.random() * maxRange);	//New random integer
		var newNumber2 = Math.floor(Math.random() * maxRange);	//New random integer
		dataset.push([newNumber1, newNumber2]);			//Add new number to array
	}

	//Update scale domains
	xScale.domain([0, d3.max(dataset, function(d) { return d[0]; })]);
	yScale.domain([0, d3.max(dataset, function(d) { return d[1]; })]);

	//Update all circles
	svg.selectAll("circle")
	  .data(dataset)
	  .transition()
		.duration(2000)
		.each('start', function(){
				d3.select(this)
					.attr('fill', 'red')
			})
	   .attr("cx", function(d) {
	   		return xScale(d[0]);
	   })
	   .attr("cy", function(d) {
	   		return yScale(d[1]);
	   })
	   .transition()
	   .duration(1000)
	   .attr('fill', '#274AB3')


	//Update X axis
	svg.select('.x.axis')
		.transition()
		.duration(1000)
		.call(xAxis)

	//Update Y axis
	svg.select('.y.axis')
		.transition()
		.duration(1000)
		.call(yAxis)

});

//Define clipping path
svg.append("clipPath")                  //Make a new clipPath
    .attr("id", "chart-area")           //Assign an ID
    .append("rect")                     //Within the clipPath, create a new rect
    .attr("x", padding)                 //Set rect's position and size…
    .attr("y", padding)
    .attr("width", w - padding * 3)
    .attr("height", h - padding * 2);






