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
 d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

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
    
    let matchData = {};
    
    for(let i=0; i<matchesCSV.length; i++)
    {
        if(matchesCSV[i].Team in matchData == false)
        {
            let data = {}
            
            data['Goals Made'] = parseInt(matchesCSV[i]['Goals Made'])
            data['Goals Conceded'] = parseInt(matchesCSV[i]['Goals Conceded'])
            data['Delta Goals'] = parseInt(matchesCSV[i]['Delta Goals'])
            data['Wins'] = parseInt(matchesCSV[i]['Wins'])
            data['Losses'] = parseInt(matchesCSV[i]['Losses'])
            data['TotalGames'] = 1
            data['Result'] = resultLabels[matchesCSV[i]['Result']]
            data['type'] = 'aggregate'
            
            let gameData = []
            
            let game = {}
            game['key'] = matchesCSV[i]['Opponent']
            
            let gameValue = {}
            gameValue['Goals Made'] = parseInt(matchesCSV[i]['Goals Made'])
            gameValue['Goals Conceded'] = parseInt(matchesCSV[i]['Goals Conceded'])
            gameValue['Delta Goals'] = []
            gameValue['Wins'] = []
            gameValue['Losses'] = []
            gameValue['Result'] = resultLabels[matchesCSV[i]['Result']]
            gameValue['type'] = 'game'
            gameValue['Opponent'] = matchesCSV[i].Team
            
            game['value'] = gameValue
            
            gameData.push(game)
            
            data['games'] = gameData
            
            matchData[matchesCSV[i].Team] = data;
        }
        else
        {
            
            let data = matchData[matchesCSV[i].Team]
            
            data['Goals Made'] = data['Goals Made'] + parseInt(matchesCSV[i]['Goals Made'])
            data['Goals Conceded'] = data['Goals Conceded'] + parseInt(matchesCSV[i]['Goals Conceded'])
            data['Delta Goals'] = data['Goals Made'] - data['Goals Conceded']
            data['Wins'] = data['Wins'] + parseInt(matchesCSV[i]['Wins'])
            data['Losses'] = data['Losses'] + parseInt(matchesCSV[i]['Losses'])
            data['TotalGames'] = data['TotalGames'] + 1
            
            if(data['Result'].ranking < resultLabels[matchesCSV[i]['Result']].ranking)
                data['Result'] = resultLabels[matchesCSV[i]['Result']]
            
            let gameData = data['games']
            
            let game = {}
            game['key'] = matchesCSV[i]['Opponent']
            
            let gameValue = {}
            gameValue['Goals Made'] = parseInt(matchesCSV[i]['Goals Made'])
            gameValue['Goals Conceded'] = parseInt(matchesCSV[i]['Goals Conceded'])
            gameValue['Delta Goals'] = []
            gameValue['Wins'] = []
            gameValue['Losses'] = []
            gameValue['Result'] = resultLabels[matchesCSV[i]['Result']]
            gameValue['type'] = 'game'
            gameValue['Opponent'] = matchesCSV[i].Team
            
            game['value'] = gameValue
            
            gameData.push(game)
            
            data['games'] = gameData
            
            matchData[matchesCSV[i].Team] = data;
        }
    }
    
    let matchArray = []
    for (var i in matchData)
    {
        let team = {}
        team['key'] = i
        team['value'] = matchData[i]
        
        matchArray.push(team)
    }
    
    d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

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
