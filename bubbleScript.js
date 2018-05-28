
//There's going to be 68 categories for this set of data

d3.csv('bobRossElem.csv', function(error, data) {
      if (error) {
          console.error('Error getting or parsing the data.');
          throw error;
      }

      var chart = bubbleChart().width(650).height(650);
      d3.select('#chart').datum(data).call(chart);
    });

    function bubbleChart() {
        var width = 200,
            height = 350,
            maxRadius = 100,
            columnForColors = "category",
            columnForRadius = "views"; //You can replace this with "Count"

        function chart(selection) {
            var data = selection.datum();
            var div = selection,
                svg = div.selectAll('svg');
            svg.attr('width', width).attr('height', height);


            // Tooltip
            var tooltip = selection
                .append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("color", "white")
                .style("padding", "4px")
                .style("background-color", "#626D71")
                .style("border-radius", "40px")
                .style("text-align", "center")
                .style("font-family", "monospace")
                .style("width", "100px")
                .text("");


            var simulation = d3.forceSimulation(data)
                .force("charge", d3.forceManyBody().strength([-120]))
                .force("x", d3.forceX())
                .force("y", d3.forceY())

                .on("tick", ticked);

            function ticked(e) {
                node.attr("cx", function(d) {
                        return d.x;
                    })
                    .attr("cy", function(d) {
                        return d.y;
                    });
            }

            var colorCircles = d3.scaleOrdinal(d3.schemeCategory20);
            var scaleRadius = d3.scaleLinear().domain([d3.min(data, function(d) {
                return +d[columnForRadius];
            }), d3.max(data, function(d) {
                return +d[columnForRadius];
            })]).range([4, 60])

            var node = svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr('r', function(d) {
                    return scaleRadius(d[columnForRadius])
                })
                .style("fill", function(d) {
                    return colorCircles(d[columnForColors])
                })
                .attr('transform', 'translate(' + [width/1.6, height / 2] + ')')
                .on("mouseover", function(d) {
                    tooltip.html( d[columnForRadius] + " " + d[columnForColors]);
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function() {
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");


                })
                .on("mouseout", function() {
                    return tooltip.style("visibility", "hidden");
                });
        }

        //Returning the values claimed above using an anonymous function(s)
        chart.width = function(value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            return chart;
        };

        chart.height = function(value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            return chart;
        };


        chart.columnForColors = function(value) {
            if (!arguments.columnForColors) {
                return columnForColors;
            }
            columnForColors = value;
            return chart;
        };

        chart.columnForRadius = function(value) {
            if (!arguments.columnForRadius) {
                return columnForRadius;
            }
            columnForRadius = value;
            return chart;
        };

        return chart;
    }
