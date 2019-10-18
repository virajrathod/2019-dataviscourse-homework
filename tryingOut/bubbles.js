(function () {
	var width = 800,
		height = 900;
	var svg = d3.select ("#chart")
		    .append ("svg")
		    .attr("height",height)
			.attr("width", width)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    var radiusScale = d3.scaleSqrt().domain([0,50]).range([2,20])

    // the simulation will define where we want out circles to go and
    // how we want them to interact
    //STEP 1: Get them to the middle
    //STEP 2: Don't have them collide
    //Note: When you have the radius and force EQUAL to each other they won't collide

    var forceX = d3.forceX(function (d){
        return width / 2
    }).strength(0.05)

    var forceCollide = d3.forceCollide(function(d){
        return height / 2
    }).strength(0.05)

    var simulation = d3.forceSimulation()
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("collide", d3.forceCollide().strength(0.05))

	d3.queue()
	.defer(d3.csv, "words-without-force-positions.csv")
	.await(ready)

	function ready (error, datapoints) {
		var circles = svg.selectAll(".artist")
				 .data(datapoints)
				 .enter().append("circle")
				 .attr("class","artist")
				 .attr("r",function(d){
				    return radiusScale(d.total)
				 })
		 		 .attr("fill","steelblue")
		 		 .on('click', function(d){
		 		    console.log(d)
		 		 })
		 	//	 .attr("cx",100)
		 		// .attr("cy", 300)

        d3.select("#topic").on('click', function(d){
            console.log("Clicked")
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

