/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {
        
        console.log(teamData[0])
        
        //Maintain reference to the tree Object; 
        this.tree = null; 

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice(); // 

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        
        this.goalScale = d3.scaleLinear()
                        .range([this.cell.buffer, this.cell.width*2]) 
                
        /** Used for games/wins/losses*/
        this.gameScale = d3.scaleLinear()
                        .domain([0, d3.max(this.teamData, d => d.value["TotalGames"])])
                        .range([0, this.cell.width]) 
        
        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        //For games/wins/losses
        this.aggregateColorScale = d3.scaleLinear()
                                    .domain([0, d3.max(this.teamData, d => d.value["TotalGames"])])
                                    .range(['#ece2f0', '#016450']) 
        
        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = d3.scaleLinear()
                                .domain([0, 5, 10])
                                .range(['#034e7b', '#ffffff', '#cb181d'])  
                                .clamp(true)
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        //To show goals made and conceeded
        
        let maxGoalsMade = d3.max(this.teamData, d => d.value[this.goalsMadeHeader])
        let maxGoalsConceded = d3.max(this.teamData, d => d.value[this.goalsConcededHeader])
        
        let maxGoals = maxGoalsMade > maxGoalsConceded ? maxGoalsMade : maxGoalsConceded;
        
        this.goalScale.domain([0, maxGoals])
        
        // Create the x axes for the goalScale.
        //X-axis
        let xAxis = d3.axisTop().scale(this.goalScale);
        
        //add GoalAxis to header of col 1.
        let xAxisSvg = d3.select('#goalHeader').append('svg')
                        .attr("width", (this.cell.width + this.cell.buffer)*2)
                        .attr("height", this.cell.height)
                        .append('g')
                        .attr("transform", "translate(" + (this.cell.buffer/2) + ", " + (this.cell.height-2) + ")")
                        .call(xAxis);
        

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers
        
        let self = this
        
        // Clicking on headers should also trigger collapseList() and updateTable(). 
        d3.select("#team").on('click', function(){
            let predicateBy;
            
            if(d3.select(this).attr('sorted') == null || d3.select(this).attr('sorted') === "desc")
            {
                predicateBy = function(a, b){
                    if( a["key"] > b["key"]){
                        return 1;
                    }else if( a["key"] < b["key"] ){
                        return -1;
                    }
                    return 0;
                };
                
                d3.select(this).attr('sorted', 'asc');
            }
            else
            {
                predicateBy = function(a, b){
                    if( a["key"] < b["key"]){
                        return 1;
                    }else if( a["key"] > b["key"] ){
                        return -1;
                    }
                    return 0;
                };
                
                d3.select(this).attr('sorted', 'desc');
            }
            
            self.tableElements.sort(predicateBy)
            self.collapseList()
            self.updateTable()
        })
        
        d3.select("#header-row").selectAll("td")
            .data(this.tableHeaders)
            .on('click', function(d,i){
                let predicateBy;
                
                if(d3.select(this).attr('sorted') == null || d3.select(this).attr('sorted') === "desc")
                {
                    predicateBy = function(a, b){
                        if( self.getValue(a, d) > self.getValue(b, d)){
                            return 1;
                        }else if( self.getValue(a, d) < self.getValue(b, d) ){
                            return -1;
                        }
                        return 0;
                    };
                    
                    d3.select(this).attr('sorted', 'asc');
                }
                else
                {
                    predicateBy = function(a, b){
                        if( self.getValue(a, d) < self.getValue(b, d)){
                            return 1;
                        }else if( self.getValue(a, d) > self.getValue(b, d) ){
                            return -1;
                        }
                        return 0;
                    };
                    
                    d3.select(this).attr('sorted', 'desc');
                }
                
                self.tableElements.sort(predicateBy)
                self.collapseList()
                self.updateTable()
            })
       
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        
        console.log("update")
        
        // ******* TODO: PART III *******
        //Create table rows
        let tr = d3.select('tbody').selectAll('tr')
                    .data(this.tableElements)
                    
        tr.exit().remove();
        
        tr = tr.enter().append('tr').merge(tr);
            
        tr.on('click', function(d, i){ 
            return self.updateList(i) 
        })

                    
        //Append th elements for the Team Names
        let th = tr.selectAll('th')
            .data(function(d) { 
                let dataArray = new Array();
                dataArray.push({"type":d.value.type, "value":d.key})
                return dataArray 
            })
        
        //th.exit().remove();

        th = th.enter().append('th').merge(th);
        
            
        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        let td = tr.selectAll('td')
            .data(function(d) { 
                
                let dataArray = new Array();
                
                dataArray.push({"type":d.value.type, "value":[d.value["Goals Conceded"], d.value["Goals Made"]], "vis":"goals"})
                
                dataArray.push({"type":d.value.type, "value":d.value.Result.label, "vis":"text"})
                
                dataArray.push({"type":d.value.type, "value":d.value.Wins, "vis":"bar"})
                
                dataArray.push({"type":d.value.type, "value":d.value.Losses, "vis":"bar"})
                
                dataArray.push({"type":d.value.type, "value":d.value.TotalGames, "vis":"bar"})
                
                return dataArray; 
            })
        
        //td.exit().remove();

        td = td.enter().append('td').merge(td);
        
        //Add scores as title property to appear on hover
        //TODO
        
        //Populate cells (do one type of cell at a time )
        th.text(function(d){ 
                if(d.type == 'game')
                    return 'x'+d.value 
                return d.value 
            })
            .classed('aggregate', function(d){
                if(d.type == 'game')
                    return false;
                return true;
            })
            .classed('game', function(d){
                if(d.type == 'game')
                    return true;
                return false;
            })
            
        
        let textTd = td.filter(function (d) {
            return d.vis == 'text'
        })
        textTd.text(function(d){ return d.value })
        
        let gamebarsTd = td.filter(function (d) {
            return (d.vis == 'bar' && d.type == 'game')
        })
        gamebarsTd.selectAll('svg').remove();
        
        let barsTd = td.filter(function (d) {
            return (d.vis == 'bar' && d.type == 'aggregate')
        })
        
        let self = this;
        
        barsTd.selectAll('svg').remove();
        
        let barsG = barsTd.append('svg')
                .attr('height', this.cell.height)
                .attr('width', this.cell.width)
                .append('g')
                //.attr('transform', "translate( 0, " + this.cell.height + ")")
        
        barsG.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', this.bar.height)
            .attr('width', function(d) { return self.gameScale(d.value) })
            .attr('fill', function(d) { return self.aggregateColorScale(d.value) })
        
        barsG.append('text')
            .attr('x', function(d) { return self.gameScale(d.value) - 10 })
            .attr('y', this.bar.height-5 )
            .attr('fill', '#ffffff')
            .text(function(d) { return d.value; })
        
        let goalsTd = td.filter(function (d) {
            return d.vis == 'goals'
        })
        
        //Create diagrams in the goals column
        //d.value["Goals Conceded"], d.value["Goals Made"]
        
        goalsTd.selectAll('svg').remove();
        
        let goalsG = goalsTd.append('svg')
                .attr('height', this.cell.height)
                .attr('width', (this.cell.width + this.cell.buffer)*2)
                .append('g')
        
        goalsG.append('rect')
            .attr('x', function(d){ 
                let delta = d.value[1] - d.value[0]
                
                if(delta < 0)
                    return self.goalScale(d.value[1]) 
                else
                    return self.goalScale(d.value[0]) 
            })
            .attr('y', function(d){
                if(d.type == 'game')
                    return self.cell.height/2 - 3
                return self.cell.height/2 - 6
            })
            .attr('width', function(d){ 
                let delta = self.goalScale(d.value[1]) - self.goalScale(d.value[0])
                return Math.abs(delta)
            })
            .attr('height', function(d){
                if(d.type == 'game')
                    return 6;
                return 6*2
            })
            .attr('fill', function(d){ 
                let delta = d.value[1] - d.value[0]
                
                if(delta > 0)
                    delta = 7.5
                else
                    delta = 2.5
                
                return self.goalColorScale(delta) 
            })
        
        goalsG.append('circle')
            .attr('cx', function(d){ return self.goalScale(d.value[0]) })
            .attr('cy', this.cell.height/2)
            .attr('r', function(d){
                if(d.type == 'game')
                    return 5;
                return 6;
            })
            .attr('stroke-width', function(d){
                if(d.type == 'game')
                    return 2;
                return 0;
            })
            .attr('fill', function(d){ 
                if(d.type == 'game')
                    return '#ffffff';
                return self.goalColorScale(0) 
            })
            .attr('stroke', function(d){ return self.goalColorScale(0) })
        
        goalsG.append('circle')
            .attr('cx', function(d){ return self.goalScale(d.value[1]) })
            .attr('cy', this.cell.height/2)
            .attr('r', function(d){
                if(d.type == 'game')
                    return 5;
                return 6;
            })
            .attr('stroke-width', function(d){
                if(d.type == 'game')
                    return 2;
                return 0;
            })
            .attr('fill', function(d){ 
                if(d.type == 'game')
                    return '#ffffff';
                return self.goalColorScale(10) 
            })
            .attr('stroke', function(d){ return self.goalColorScale(10) })
        
        //TODO : Fix order. Blue over red and vice versa
        //TODO : If Made=Conceded ==> Grey both
        
        
        //Set the color of all games that tied to light gray

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        
        //console.log(this.tableElements)
        
        let team = this.tableElements[i]
        
        //Check if item i in tableElements is game
            //return
        if(team.value.type == 'game')
            return;
        
        //Check if i + 1 is game
            //Delete all the following games
            //return
        
        let nextTeam = this.tableElements[i+1]
        if(nextTeam.value.type == 'game')
        {
            this.tableElements.splice(i+1, team.value.games.length)
            this.updateTable();
            //console.log(this.tableElements)
            return;
        }
        
        //Add all games after i
        for(let j=0; j< team.value.games.length; j++)
            this.tableElements.splice(i+1+j, 0, team.value.games[j])
        
        //this.tableElements.splice(i+1, 0, team.value.games)
        this.updateTable();
        //console.log(this.tableElements)
        return;
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******
        //Remove all elements from tableElements which are not aggregates
        
        let aggregatesOnly = new Array();
        
        for(let i=0; i<this.tableElements.length; i++)
            if(this.tableElements[i].value.type == 'aggregate')
                aggregatesOnly.push(this.tableElements[i])
        
        this.tableElements = aggregatesOnly;
        
    }

    getValue(a, d)
    {
        
        if(d == 'Result')
            return a.value["Result"]["ranking"];
        
        return a.value[d]
    }
    
}
