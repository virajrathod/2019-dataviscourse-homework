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
        this.circleScale = null;
        this.rCircle = null;
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
                    // .attr("transform", "translate(0,0)");

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

        let xAxis = d3.axisBottom()
                    
            xAxis.scale(xScale);
            
        this.svg
            .append("g")
            .attr("transform", "translate(20,30)")
            .call(xAxis);
    }


    getXScale() {
       return d3.scaleLinear()
                .domain([
                    d3.min(this.data.map(d => d.position)),
                    d3.max(this.data.map(d => d.position))
                    ])
            .range([0, this.width]);
            // .style("padding", "8px");
    }

    drawBubbles() {
        const that = this;

        const circleScale = d3.scaleLinear()
        .domain([
        d3.min(that.data.map(d => +d.total)),
        d3.max(that.data.map(d => +d.total))
        ])
        .range([3, 12]);

        var circles = this.svg.selectAll(".bubble")
            .data(this.data)
            .enter().append("circle")
            .attr("class", "bubble")
            // .attr("r", d => that.radiusScale(d.total))
            .attr("transform", "translate(0,120)")
            .attr("r",function(d){
                return circleScale(d.total);
            })

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
                return d.sourceX
            })
            .attr("cy", function(d){
                return d.sourceY
            })

    }
    // updateBubbles(){
       
        toggle_click(){
            alert("button was clicked");
           if(document.getElementById('button').clicked == true)
            {
                alert("button was clicked");
            
                    var updatedBubbles = this.svg.selectAll(".chart")
                            .data(this.data)
                            .exit().remove("circles")
                            .append()
                            .attr("cx", function(d){
                                return d.moveX
                            })
                            .attr("cy", function(d){
                                return d.moveY
                            });
            }                    
                             }                   
                    //  }
    drawTable(){
        
    }

        // similarly for lines
    }
