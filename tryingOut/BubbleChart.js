class BubbleChart {

    constructor (data){
        this.data = data;  
        this.width = 1000;
		this.height = 900;
        this.svg = null;
        this.radiusScale = null;
        this.colorScale = null;
        this.xScale = null;
        this.simulation = null;
        this.forceXGroup = null;
        this.forceCollide = null;
    }

    setupData() {
        //Create a unique "id" field for each game
        this.data.forEach(function (d, i) {
            // d.id = d.Team + d.Opponent + i;
            d.id = i
            //console.log(d);
        });
        
        this.svg = d3.select("#chart")
                    .append("svg")
                    .attr("height", this.height)
                    .attr("width", this.width)
                    .append("g")
                    .attr("transform", "translate(0,0)");

        this.radiusScale = d3.scaleSqrt().domain([0, 50]).range([2, 20]);
        this.forceXGroup = d3.forceX(this.width / 2).strength(0.35)
        this.forceCollide = d3.forceCollide(d => this.radiusScale(d.total))

        this.simulation = d3.forceSimulation()
            .force("x", this.forceXGroup)
            .force("y", d3.forceY(this.height / 2).strength(0.05))
            .force("collide", this.forceCollide);

        let categories = ["crime/justice", "economy/fiscal issues", "education", "energy/environment", "health care", "mental health/substance abuse"]
        let colors = ["#CD5C5C", "#DC143C", "#C71585", "#FF8C00", "#BDB76B", "#8A2BE2"];
        
        console.log(this.data);

        this.colorScale = d3.scaleOrdinal()
            .domain(categories)
            .range(colors);

        const xScale = this.getXScale();

        let xAxis = d3.axisBottom();
            xAxis.scale(xScale);
            
        this.svg
            .append("g")
            .attr("transform", "translate(0,30)")
            .call(xAxis);
    }

    getXScale() {
       return d3.scaleLinear()
            .domain([50, 60])
            .range([0, this.width])
            // .style("padding", "8px");
    }

    drawBubbles() {
        const that = this;

        var circles = this.svg.selectAll(".bubble")
            .data(this.data)
            .enter().append("circle")
            .attr("class", "bubble")
            .attr("r", d => that.radiusScale(d.total))
            .style("fill", function(d){
				// console.log(d);
                return that.colorScale(d.category);
            })
            .style("stroke", "black")
            .attr("fill", "red")
          
            circles.on('click', function(d){
                console.log(d)
            })
            .attr("cx",function(d){
                return d.d_speeches*20
            })
            .attr("cy", function(d){
                return d.r_speeches*20
            })

        d3.select("#extremes").on('click', function (d) {
            that.simulation
                .force("x", this.forceXExtremes)
                .alphaTarget(0.25)
                .restart()
            console.log("Show Extremes")
        })

        d3.select("#group").on('click', function () {
            that.simulation
                .force("x", this.forceXGroup)
                .alphaTarget(0.25)
                .restart()
            console.log("Combine the bubbles")
        })

        this.simulation.nodes(this.data)
            .on('tick', ticked)

        this.simulation.stop(this.data)

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

}