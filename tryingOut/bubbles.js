d3.csv("data/words-without-force-positions.csv").then(hw6Data =>

(function () {
	var width = 800,
		height = 900;
	var svg = d3.select ("#chart")
		    .append ("svg")
		    .attr("height",height)
			.attr("width", width)
			.append("g")
			.attr("transform", "translate(0,0)")

    var radiusScale = d3.scaleSqrt().domain([0,50]).range([2,20])

    // the simulation will define where we want out circles to go and
    // how we want them to interact
    //STEP 1: Get them to the middle
    //STEP 2: Don't have them collide
    //Note: When you have the radius and force EQUAL to each other they won't collide

    var forceXExtremes = d3.forceX(function (d){
        if (d.total > 25) {
            return 200
        } else {
            return 600
        }
    }).strength(0.05)

    var forceXGroup = d3.forceX(width / 2).strength(0.05)

    var forceCollide = d3.forceCollide(function(d){
        return radiusScale(d.total)
    })

    var simulation = d3.forceSimulation()
        .force("x", forceXGroup)
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", forceCollide)

	let hw6Data = d3.queue()
	                .defer(d3.csv, "words-without-force-positions.csv")
	                .await(ready)

    let colors = ["#CD5C5C", "#DC143C", "#C71585", "#FF8C00", "#BDB76B", "#8A2BE2", "#98FB98", "#00008B", "#2F4F4F", "#808080", "#B8860B"];
    let colScale = d3.scaleOrdinal()
                     .range(colors)

    let xScale = d3.scaleLinear()
                   .domain([])
                   .range([0, width])

    let xAxis = d3.axisBottom();
    xAxis.scale(xScale);

	function ready (error, datapoints) {
		var circles = svg.selectAll(".artist")
				 .data(datapoints)
				 .enter().append("circle")
				 .attr("class","artist")
				 .attr("r",function(d){
				    return radiusScale(d.total)
				 })
		 		 .attr("fill","steelblue")
		 		 colScale.domain(d3.extent(hw6Data, function(d) {
		 		    return d.category
		 		    }));
		 		 svg.on('click', function(d){
		 		    console.log(d)
		 		 })
		 	//	 .attr("cx",100)
		 		// .attr("cy", 300)

        d3.select("#extremes").on('click', function(d){
            simulation
                .force("x", forceXExtremes)
                .alphaTarget(0.08)
                .restart()
            console.log("Show Extremes")
        })

        d3.select("#group").on('click', function(){
            simulation
                .force("x", d3.forceXGroup)
                .alphaTarget(0.07)
                .restart()
//            console.log("Combine the bubbles")
        })

		 simulation.nodes(datapoints)
            .on('tick', ticked)

		 function ticked()  {
		 circles
		    .attr("cx",function (d){
		            return d.x
		    })
		    .attr("cy", function (d){
		            return d.y
		    })
		 }

	}
})();

