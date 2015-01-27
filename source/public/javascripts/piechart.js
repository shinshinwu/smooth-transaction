var width = 300;
var height = 300;
var data = [ 9, 12, 28, 48, 3 ];

var outerRadius = height / 2 - 20,
    innerRadius = outerRadius / 2,
    cornerRadius = 10;

var pie = d3.layout.pie()
    .padAngle(.02);

//Easy colors accessible via a 10-step ordinal scale
var color = d3.scale.category10();

var arc = d3.svg.arc()
    .padRadius(outerRadius)
    .innerRadius(innerRadius);

var svg = d3.select("#customerCardPieChart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.selectAll("path")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("id", function(d){ return "data" + d.value })
    .attr("fill", function(d, i) {
      return color(i);
    })
    .each(function(d) { d.outerRadius = outerRadius - 20; })
    .attr("d", arc)
    .on("mouseover", arcTween(outerRadius, 0))
    .on("mouseout", arcTween(outerRadius - 20, 150));

function arcTween(outerRadius, delay) {
  return function() {
    d3.select(this).transition().delay(delay).attrTween("d", function(d) {
      var i = d3.interpolate(d.outerRadius, outerRadius);
      return function(t) { d.outerRadius = i(t); return arc(d); };
    });
  };
}

$("#data48").mouseover(function(){
  $("#customerCardPieChart").html("<p>Visa: 48% </p>")
})

$("g").children().mouseout(function(){
  $("#customerCardPieChart").html("")
})

$("#data28").mouseover(function(){
  $("#customerCardPieChart").html("<p>MasterCard: 28% </p>")
})

$("#data12").mouseover(function(){
  $("#customerCardPieChart").html("<p>American Express: 28% </p>")
})

$("#data9").mouseover(function(){
  $("#customerCardPieChart").html("<p>Discover: 28% </p>")
})

$("#data3").mouseover(function(){
  $("#customerCardPieChart").html("<p>Miscellaneous: 28% </p>")
})
