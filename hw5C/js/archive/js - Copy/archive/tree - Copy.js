/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******
        
        let margin = {top: 20, right: 90, bottom: 30, left: 90},
            width = 900 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
        
        let gTree = d3.select("body").select("#tree")
            .attr("transform", "translate("
                  + margin.left + "," + margin.top + ")");
        
        //Create a tree and give it a size() of 800 by 300. 
        let treemap = d3.tree().size([300, 800]);

        //Create a root for the tree using d3.stratify(); 
        let root = d3.stratify()
            .id(function(d) { 
                let id = d.id.replace(d.Team, '') 
                id = id.replace(d.Opponent, '') 
                return id;
            })
            .parentId(function(d) { return d.ParentGame; })
            (treeData);
        
        root.x0 = height / 2;
        root.y0 = 0;
           
        //Add nodes and links to the tree. 
        
        // Assigns the x and y position for the nodes
        let treeInfo = treemap(root);

        // Compute the new tree layout.
        let nodes = treeInfo.descendants(),
            links = treeInfo.descendants().slice(1);
        
        //Nodes
        
        // Normalize for fixed-depth.
        nodes.forEach(function(d){ d.y = d.depth * 90});
        
        console.log(nodes)
        
        let node = d3.select('#tree').selectAll('g')
                    .data(nodes, function(d) {return d.id || (d.id = ++i); })
                    .enter()
                    .append('g')
                    
        // Add Circle for the nodes
        node.append('circle')
            .attr('class', 'node')
            .attr('r', 6)
            .attr('cx', function(d){ return d.y; })
            .attr('cy', function(d){ return d.x; })
            .style("fill", function(d){
                
                console.log(d)
                
                if(d.data.Wins == 1)
                    return '#034e7b';
                return '#cb181d';
            })
            
        // Add labels for the nodes
        node.append('text')
            .attr("dy", ".35em")
            .attr("x", function(d) {
                //return d.y;
                return d.children || d._children ? d.y - 10 : d.y + 10;
            })
            .attr("y", function(d) {
                return d.x;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) { return d.data.Team; })
            .attr("class", function(d) { 
                let classValue = d3.select(this).attr("class")
                
                classValue = classValue + ' ' + d.data.Team;
                
                let gameClass = d.data.Team + d.data.Opponent
                classValue = classValue + ' ' + gameClass;
                
                gameClass = d.data.Opponent + d.data.Team
                classValue = classValue + ' ' + gameClass;
                
                return classValue
            })
            
        //Links
        
        let link = d3.select('#tree').selectAll('path.link')
                    .data(links, function(d) { return d.id; });
                    
        link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function(d){
                return diagonal(d, d.parent)
            })
            .attr("class", function(d) { 
                let classValue = d3.select(this).attr("class")
                
                if(d.data.Wins == 1)
                    classValue = classValue + ' ' + d.data.Team;
                
                let gameClass = d.data.Team + d.data.Opponent
                classValue = classValue + ' ' + gameClass;
                
                gameClass = d.data.Opponent + d.data.Team
                classValue = classValue + ' ' + gameClass;
                
                return classValue
            })
            
        function diagonal(s, d) {
            
            let sy = s.y;
            let sx = s.x;
            let dy = d.y;
            let dx = d.x;
            
            let path = 'M '+ sy + ' ' + sx +
                    'C '+ ((sy + dy) / 2) + ' ' + sx + ',' +
                      ((sy + dy) / 2) + ' ' + dx + ',' +
                      dy + ' ' + dx;

            return path
        }
    }
    
    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        
        if(row.value.type == 'aggregate')
        {
            d3.selectAll('.'+row.key).filter('text')
                .classed('selectedLabel', true)
            
            d3.selectAll('.'+row.key).filter('path')
                .classed('selected', true)
            
            return;
        }
        
        let TeamOpponent = row.key + row.value.Opponent;
        
        d3.selectAll('.'+TeamOpponent).filter('path')
                .classed('selected', true)
                
        d3.selectAll('.'+TeamOpponent).filter('text')
                .classed('selectedLabel', true)
        
        TeamOpponent = row.value.Opponent + row.key;
        
        d3.selectAll('.'+TeamOpponent).filter('path')
                .classed('selected', true)
                
        d3.selectAll('.'+TeamOpponent).filter('text')
                .classed('selectedLabel', true)
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops! 
        d3.selectAll('.selected').classed('selected', false);
        d3.selectAll('.selectedLabel').classed('selectedLabel', false);
        
    }
}
