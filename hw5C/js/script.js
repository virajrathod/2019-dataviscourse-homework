    /**
     * Loads in the table information from fifa-matches.json 
     */

// d3.json('data/fifa-matches.json',function(error,data){

    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */
    /*
    d3.csv("data/fifa-tree.csv", function (error, csvData) {

        //Create a unique "id" field for each game
        csvData.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(data,tree);

        table.createTable();
        table.updateTable();
    });
});
*/


 // // ********************** HACKER VERSION ***************************
 /**
  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
  * then calls the appropriate functions to create and populate the table.
  *
  */
 d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {

    /**
    * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
    *
    */
    
    //Standard Result Ranking
    let resultLabels = {};
    resultLabels['Group'] = {'label' : 'Group', 'ranking' : 0}
    resultLabels['Round of Sixteen'] = {'label' : 'Round of Sixteen', 'ranking' : 1}
    resultLabels['Quarter Finals'] = {'label' : 'Quarter Finals', 'ranking' : 2}
    resultLabels['Semi Finals'] = {'label' : 'Semi Finals', 'ranking' : 3}
    resultLabels['Fourth Place'] = {'label' : 'Fourth Place', 'ranking' : 4}
    resultLabels['Third Place'] = {'label' : 'Third Place', 'ranking' : 5}
    resultLabels['Runner-Up'] = {'label' : 'Runner-Up', 'ranking' : 6}
    resultLabels['Winner'] = {'label' : 'Winner', 'ranking' : 7}
    
    let resultRanks = {};
    resultRanks['0'] = {'label' : 'Group', 'ranking' : 0}
    resultRanks['1'] = {'label' : 'Round of Sixteen', 'ranking' : 1}
    resultRanks['2'] = {'label' : 'Quarter Finals', 'ranking' : 2}
    resultRanks['3'] = {'label' : 'Semi Finals', 'ranking' : 3}
    resultRanks['4'] = {'label' : 'Fourth Place', 'ranking' : 4}
    resultRanks['5'] = {'label' : 'Third Place', 'ranking' : 5}
    resultRanks['6'] = {'label' : 'Runner-Up', 'ranking' : 6}
    resultRanks['7'] = {'label' : 'Winner', 'ranking' : 7}
        
    let matchArray = d3.nest()
                        .key(function(d) {return d.Team} )
                        .rollup(function(leaves) { 
                            return {
                                "Goals Made": d3.sum(leaves, function(d) {return parseFloat(d['Goals Made']);}),
                                "Goals Conceded": d3.sum(leaves, function(d) {return parseFloat(d['Goals Conceded']);}),
                                "Delta Goals": d3.sum(leaves, function(d) {return parseFloat(d['Delta Goals']);}),
                                "Wins": d3.sum(leaves, function(d) {return parseFloat(d['Wins']);}),
                                "Losses": d3.sum(leaves, function(d) {return parseFloat(d['Losses']);}),
                                "TotalGames": d3.sum(leaves, function(d) {return 1;}),
                                "Result": d3.max(leaves, function(d) {return resultLabels[d['Result']]['ranking'];}),
                                "type": 'aggregate',
                                "games" : d3.nest()
                                            .key(function(d) {return d.Opponent} )
                                            .rollup(function(subleaves) { 
                                                //console.log(subleaves[0])
                                                return {
                                                    'type' : 'game',
                                                    "Goals Made": d3.sum(subleaves, function(d) {return parseFloat(d['Goals Made']);}),
                                                    "Goals Conceded": d3.sum(subleaves, function(d) {return parseFloat(d['Goals Conceded']);}),
                                                    'Opponent' : subleaves[0]['Team'],
                                                    'Result' : resultLabels[subleaves[0]['Result']],
                                                    "Delta Goals": [],
                                                    "Wins": [],
                                                    "Losses": []
                                                }
                                            })
                                            .sortValues(function(a,b) { return ((a.Result.ranking > b.Result.ranking) ? -1: 1); return 0;} )
                                            .entries(leaves)
                            } 
                        })
                        .entries(matchesCSV)
    
    matchArray.forEach(function(d){ d.value['Result'] = resultRanks[d.value['Result']]});
    
    d3.csv("data/fifa-tree-2018.csv").then(treeCSV => {

        //Create a unique "id" field for each game
        treeCSV.forEach(function (d, i) {
            //d.id = d.Team + d.Opponent + i;
            d.id = i
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        
        let table = new Table(matchArray,tree);

        table.createTable();
        table.updateTable();
        
    });

 });
 // ********************** END HACKER VERSION ***************************
