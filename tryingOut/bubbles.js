d3.csv("words-without-force-positions.csv", function (ready, hw6Data) {

	//Create a unique "id" field for each game
	hw6Data.forEach(function (d, i) {
		// d.id = d.Team + d.Opponent + i;
		d.id = i
		// console.log(d);
		});
		// (function () {
			var width = 800,
				height = 900;
			var svg = d3.select("#chart")
				.append("svg")
				.attr("height", height)
				.attr("width", width)
				.append("g")
				.attr("transform", "translate(0,0)")

			var radiusScale = d3.scaleSqrt().domain([0, 50]).range([2, 20])

//     the simulation will define where we want out circles to go and
//     how we want them to interact
//    STEP 1: Get them to the middle
//    STEP 2: Don't have them collide
//    Note: When you have the radius and force EQUAL to each other they won't collide

			var forceXExtremes = d3.forceX(function (d) {
				if (d.total > 25) {
					return 200
				} else {
					return 600
				}
			}).strength(0.35)

			var forceXGroup = d3.forceX(width / 2).strength(0.35)

			var forceCollide = d3.forceCollide(function (d) {
				return radiusScale(d.total)
			})

			var simulation = d3.forceSimulation()
				.force("x", forceXGroup)
				.force("y", d3.forceY(height / 2).strength(0.05))
				.force("collide", forceCollide)

			d3.queue()

				.defer(d3.csv, "words-without-force-positions.csv")
				// .defer(hw6Data)
				.await(ready)

			let colors = ["#CD5C5C", "#DC143C", "#C71585", "#FF8C00", "#BDB76B", "#8A2BE2", "#98FB98", "#00008B", "#2F4F4F", "#808080", "#B8860B"];
			let colScale = d3.scaleOrdinal()
				.range(colors)
//                     .append("g")

			let xScale = d3.scaleLinear()
				.domain([50, 60])
				.range([0, width])
			// .style("padding", "8px")

			let xAxis = d3.axisBottom();
			xAxis.scale(xScale);

			svg
				.append("g")
				.attr("transform", "translate(0,30)")
				.call(d3.axisBottom(xScale));

			function ready(error, datapoints) {
				var circles = svg.selectAll(".artist")
					.data(datapoints)
					.enter().append("circle")
					.attr("class", "artist")
					.attr("r", function (d) {
						return radiusScale(d.total)
					})
					.style("stroke", "black")
					.attr("fill", "red")

				 colScale.domain(d3.extent(hw6Data, function (d) {
				 	return colScale(d.category)
				 }));
		 		 .attr("fill", colScale)
		 		 
		 		 svg.on('click', function(d){
		 		    console.log(d)
		 		 })
				// .attr("cx",100)
				// .attr("cy", 300)

				d3.select("#extremes").on('click', function (d) {
					simulation
						.force("x", forceXExtremes)
						.alphaTarget(0.25)
						.restart()
					console.log("Show Extremes")
				})

				d3.select("#group").on('click', function () {
					simulation
						.force("x", d3.forceXGroup)
						.alphaTarget(0.25)
						.restart()
					console.log("Combine the bubbles")
				})

				simulation.nodes(datapoints)
					.on('tick', ticked)

				function ticked() {
					circles
						.attr("cx", function (d) {
							return d.x
						})
						.attr("cy", function (d) {
							return d.y
						})
				}

			}
		// })();

	});