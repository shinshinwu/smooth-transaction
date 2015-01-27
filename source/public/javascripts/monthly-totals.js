(function(){

  var width = 600;
  var height = 400;
  var barPadding = 5;
  var maxValue = 5000
  var dataset = [
   { 'Jan': parseInt(Math.random() * maxValue) + 1 },
   { 'Feb': parseInt(Math.random() * maxValue) + 1 },
   { 'Mar': parseInt(Math.random() * maxValue) + 1 },
   { 'Apr': parseInt(Math.random() * maxValue) + 1 },
   { 'May': parseInt(Math.random() * maxValue) + 1 },
   { 'Jun': parseInt(Math.random() * maxValue) + 1 },
   { 'Jul': parseInt(Math.random() * maxValue) + 1 },
   { 'Aug': parseInt(Math.random() * maxValue) + 1 },
   { 'Sep': parseInt(Math.random() * maxValue) + 1 },
   { 'Oct': parseInt(Math.random() * maxValue) + 1 },
   { 'Nov': parseInt(Math.random() * maxValue) + 1 },
   { 'Dec': parseInt(Math.random() * maxValue) + 1 }
  ];
  var length = dataset.length
  var barWidth = width / length - barPadding;

  var svg = d3.select('.monthly-totals')
              .append('svg')
              .attr({
                width: width,
                height: height
              });

  svg.selectAll('rect')
     .data(dataset)
     .enter()
     .append('rect')
     .attr({
      x: xPosition,
      y: yPosition,
      width: barWidth,
      height: barHeight,
      fill: barFill
     });

  svg.selectAll('text')
     .data(dataset)
     .enter()
     .append('text')
     .text(monthLabel)
     .attr({
      x: xPosition,
      y: yPosition,
      fill: 'black',
      'font-family': 'Avenir',
      'font-size': '12px'
     });



  function xPosition(d, i, buffer) {
    return i * (width / length);
  }

  function yPosition(d, i, buffer) {
    for (month in d) {
      return parseInt(height - (d[month] / maxValue) * height) + buffer;
    }
  }

  function barHeight(d, i, buffer) {
    for (month in d) {
      return parseInt((d[month] / maxValue) * height) + buffer;
    }
  }

  function barFill(d, i) {
    for (month in d) {
      var to255 = parseInt((d[month] / maxValue) * 255);
      return 'rgb(0,' + to255 + ',' + (255 - to255) + ')'
    }
  }

  function monthLabel(d) {
    for (month in d) {
      return month + ' - $' + d[month];
    }
  }

})();