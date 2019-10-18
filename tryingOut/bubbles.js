function () {
	var width = 500,
		height = 500;
	var svg = d3.select ("#chart")
		    .append ("svg")
		    .attr("height",height)
			.attr("width", width)
			.append("g")
			.attr("transform", "translate (300,10)")

	d3.queue()
	.defer(d3.csv, "sales.csv")
	.await(ready)

	function ready (error, datapoints) {
		var circles = svg.selectAll(".artist")
				 .data(datapoints)
				 .enter().append("circle")
				 .attr("class","artist")
				 .attr("r".10)
		 		 .attr("fill","steelblue")
	}
})();

