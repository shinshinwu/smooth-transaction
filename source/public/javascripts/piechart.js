var width = 300;
var height = 300;
var data = [ 9, 12, 28, 48, 3 ];

var outerRadius = height / 2 - 20,
    innerRadius = outerRadius / 3,
    cornerRadius = 10;

var pie = d3.layout.pie()
    .padAngle(.02);

//Easy colors accessible via a 10-step ordinal scale
var color = d3.scale.category10();

var arc = d3.svg.arc()
    .padRadius(outerRadius)
    .innerRadius(innerRadius);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.selectAll("path")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("fill", function(d, i) {
      return color(i);
    })
    .each(function(d) { d.outerRadius = outerRadius - 20; })
    .attr("d", arc)
    .on("mouseover", arcTween(outerRadius, 0))
    .on("mouseout", arcTween(outerRadius - 20, 150));

var arcs = svg.selectAll("g.arc");

arcs.append("text")
          .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle")
          .text(function(d) {
            return d.value;
          });

function arcTween(outerRadius, delay) {
  return function() {
    d3.select(this).transition().delay(delay).attrTween("d", function(d) {
      var i = d3.interpolate(d.outerRadius, outerRadius);
      return function(t) { d.outerRadius = i(t); return arc(d); };
    });
  };
}
