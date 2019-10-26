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
        this.checked = false;
        this.thead = null;

        //Default values for the Table Headers
//        this.tableHeaders = ["Phrases", "Frequency", "Percentage", "Total"]

         /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

//        this.gameScale = d3.scaleLinear()
//                        .domain([0, d3.max(this.teamData, d => d.value["TotalGames"])])
//                        .range([0, this.cell.width])


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

        d3.select("#toggle").on("click", this.updateBubbles);
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
            .attr("transform", "translate(70,120)")
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
    // toggle_click() {
    //     console.log("TEST")
    // }

    updateBubbles(){


        const that = this;

        that.checked = !that.checked;

        d3.select('#toggle').on("click", this.toggleF)

      if (that.checked == true){
        function toggleF () {
//             if (document.getElementById('toggle')){
                console.log("testing")
                that.svg.selectAll("circle")
                .data(that.data)
                .transition()
                .duration(500)
                .attr("cx", function(d){
                    return d.moveX
                })           
                .attr("cy", function(d){
                    return d.moveY
                })
                .checked = false;
            }
        }
            else {
                console.log("NONONO")
                that.svg.selectAll("circle")
                .data(that.data)
                .transition()
                .duration(500)
                .attr("cx", function(d){
                    return d.sourceX
                })
                .attr("cy", function(d){
                    return d.sourceY
                })
                that.checked = true;
            }
        }


//      drawTable(data){
//
//       this.tableHeaders = ["phrase", "total", "percent_of_d_speeches", "total"];
//       this.ColumnValues = this.tableHeaders.map(k => {
//           return { head: k, sorted: false };
//       });
//
//        let table = d3.select("#bubbleTable");

//        let headers = table
//                        .select("thead")
//                        .selectAll("td:not([id])")
//                        .data(this.ColumnValues)
//                        .join("td")
//                        .classed("reverse_resize", d => d.sorted);

//        headers.on("click", (d, i) => {
//            if (d.sorted === false) {
//                let newData = data.sort((a, b) => {
//                    if (d.head=='phrase'){
//                        return a[d.head]< b[d.head] ? -1 : 1
//                    } else {
//                        return +a[d.head]< +b[d.head] ? -1 : 1}
//                });
//                d.sorted = true;
//                // this.collapseList()
//                this.create_table(newData);
//            } else {
//                let newData = data.sort((a, b) => {
//                    if (d.head=='phrase'){
//                        return a[d.head]> b[d.head] ? -1 : 1
//                    } else {
//                        return +a[d.head]> +b[d.head] ? -1 : 1}
//                });
//                d.sorted = false;
//                this.create_table(newData);
//            }
//        })

//        let tableRows = table
//            .select("tbody")
//            .selectAll("tr")
//            .data(data)
//            .join("tr")
//        let cells = tableRows
//            .selectAll("td")
//            .data(d => {
//                let tmp=d3.entries(d.value);
//                let tmp2=[[d.total,d.category]];
//                let tmp1=[d.phrase]
//                // let type_index=tmp.map(function(oo) { return oo.key; }).indexOf("type");
//                tmp1.col=1
//                // tmp1.type=tmp[type_index].value;
//                tmp2.col=2;
//                // tmp2.type=tmp[type_index].value;
//                let tmp3=[[d.percent_of_d_speeches,d.percent_of_r_speeches]]
//                tmp3.col=3;
//                let tmp4=[d.total]
//                tmp4.col=4;
//                return [tmp1, tmp2,tmp3,tmp4];
//                    }).join('td')
//                cells.filter((d,i) => {
//                    return d.col==1
//                }).join(enter =>
//                    enter.text(d=> d[0]).attr('class','ngram').attr('font-weight','bold'),
//                    update => update.text(d=> d[0]).attr('class','ngram').attr('font-weight','bold'),
//                    exit => exit.remove()
//                      );
//                cells.filter((d,i) => {
//                    return d.col==4
//                }).join(
//                enter =>
//                    enter.text(d=> d[0]).attr('class','ngram')
//                                        .attr('font-weight','bold'),
//                update =>
//                    update.text(d=> d[0]).attr('class','ngram')
//                                    .attr('font-weight','bold'),
//                exit => exit.remove()
//                  );
//
//        let bars = cells.filter(d => d.col == 2 ).selectAll('.bars').data(d=>d)
//        bars.exit().remove();
//
//        let newbars = bars.enter().append("svg")
//                            .attr('height',20)
//                            .attr('width',100)
//                            .classed("bars", true)
//
//        newbars.append('rect').attr('x',8).attr('y',0)
//            .attr('width', d=>d[0]*2*84/100).attr('height',20)
//            .attr('fill',d=>this.colorscale(d[1]))
//            .classed("bars_rect", true)
//
//        bars=bars.merge(newbars);
//
//        bars.select('.bars_rect').attr('x',8).attr('y',0)
//            .attr('width', d=> d[0]*2*84/100).attr('height',20)
//            .attr('fill', d=> this.colorscale(d[1]))
//
//        let bars2= cells.filter(d => d.col == 3 ).selectAll('.bars2').data(d=>d)
//        bars2.exit().remove();
//
//        let newbars2 = bars2.enter().append("svg")
//                            .attr('height',20)
//                            .attr('width',120)
//                            .classed("bars2", true)
//
//        newbars2.append('rect').attr('x',60).attr('y',0)
//            .attr('width', d=>d[1]/2).attr('height',20)
//            .attr('fill',  '#db403d')
//            .classed("bars_rect2R", true)
//
//        newbars2.append('rect').attr('transform','translate (60,0) scale(-1,1)')
//            .attr('width', d=>d[0]/2).attr('height',20)
//            .attr('fill',  '#4552db')
//            .classed("bars_rect2L", true)
//
//        bars2=bars2.merge(newbars2);
//        bars2.select('.bars_rect2R').attr('x',60).attr('y',0)
//            .attr('width', d=>d[1]/2).attr('height',20)
//            .attr('fill',  '#db403d')
//
//        bars2.select('.bars_rect2L').attr('transform','translate (60,0) scale(-1,1)')
//            .attr('width', d=>d[0]/2).attr('height',20)
//            .attr('fill',  '#4552db')
//
//    };
//    drawTable(){
//        const that = this;
//
//        this.thead =
//
//        var table = this.svg.select("table")
//                        .data(this.data)
//                        .enter().append("table")
//
//        var redraw = this.thead.selectAll("th")
//                           .data(that.data)
////                        .data("that.data", function(d){
////                                return d.phrase
////                            })
//                            .enter()
//                            .append("th")
//                            .text(function (d){
//                                    return d.phrase
//                                });
//        }
//        // alert("button was clicked");
        // const toggle = document.getElementById('toggle');
        // console.log(toggle)
    }
// }