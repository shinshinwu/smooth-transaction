(function(){
  var margin = {top: 20, right: 20, bottom: 70, left: 40},
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  // Parse the date / time
  // var parseDate = d3.time.format("%Y-%m").parse;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  var svg = d3.select("#barchart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("/assets/dataset/customer-monthly-donations.csv", function(error, data) {

      data.forEach(function(d) {
          d.month = d.month;
          d.donations = +d.donations;
      });

    x.domain(data.map(function(d) { return d.month; }));
    y.domain([0, d3.max(data, function(d) { return d.donations; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value ($)");

    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) { return x(d.month); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.donations); })
        .attr("height", function(d) { return height - y(d.donations); })
        .attr("fill", function(d){
          return "rgb(0, 0, " + (Math.round(d.donations/10 -230)) + ")";
        })
        .on("mouseover", function() {
              d3.select(this)
                .attr("fill", "orange");
           })
        .on("mouseout", function(d) {
           d3.select(this)
              .transition()
              .duration(350)
            .attr("fill", "rgb(0, 0, " + (Math.round(d.donations/10 -230)) + ")");
        });

  });

})();

