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
            width = 600 - margin.left - margin.right,
            height = 900 - margin.top - margin.bottom;
        
        let gTree = d3.select("body").select("#tree")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        //Create a tree and give it a size() of 800 by 300. 
        let treemap = d3.tree().size([height, width]);
        
        let i = 0,
            duration = 750;
        
        //Create a root for the tree using d3.stratify(); 
        let root = d3.stratify()
            .id(function(d) { 
                return d.id;
            })
            .parentId(function(d) { return d.ParentGame; })
            (treeData);
        
        root.x0 = height / 2;
        root.y0 = 0;
        
        update(root);
       
        function update(source) {

            // Assigns the x and y position for the nodes
            let treeData = treemap(root);

            // Compute the new tree layout.
            let nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach(function(d){ d.y = d.depth * 90});

            // ****************** Nodes section ***************************

            // Update the nodes...
            let node = d3.select('#tree').selectAll('g')
                            .data(nodes, function(d) {return d.id || (d.id = ++i); });

            // Enter any new modes at the parent's previous position.
            let nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr("transform", function(d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                
            // Add Circle for the nodes
            nodeEnter.append('circle')
                .attr('class', 'node')
                .attr('r', 1e-6)
                .style("fill", function(d){                    
                    if(d.data.Wins == 1)
                        return '#034e7b';
                    return '#cb181d';
                })

            // Add labels for the nodes
            nodeEnter.append('text')
                .attr("dy", ".35em")
                .attr("x", function(d) {
                    return d.children || d._children ? -10 : 10;
                })
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) { return d.data.Team; })
                
            // UPDATE
            let nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function(d) { 
                    return "translate(" + d.y + "," + d.x + ")";
                });

            // Update the node attributes and style
            nodeUpdate.select('circle.node')
                .attr('r', 6)
                .style("fill", function(d){                    
                    if(d.data.Wins == 1)
                        return '#034e7b';
                    return '#cb181d';
                })
                .attr('cursor', 'pointer');


            // Remove any exiting nodes
            let nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            // On exit reduce the node circles size to 0
            nodeExit.select('circle')
                .attr('r', 1e-6);

            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // ****************** links section ***************************

            // Update the links...
            let link = d3.select('#tree').selectAll('path.link')
                    .data(links, function(d) { return d.id; });

            // Enter any new links at the parent's previous position.
            let linkEnter = link.enter().insert('path', "g")
                .attr("class", "link")
                .attr('d', function(d){
                    let o = {x: source.x0, y: source.y0}
                    return diagonal(o, o)
                })
                
            // UPDATE
            let linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(duration)
                .attr('d', function(d){ return diagonal(d, d.parent) });

            // Remove any exiting links
            let linkExit = link.exit().transition()
                .duration(duration)
                .attr('d', function(d) {
                    let o = {x: source.x, y: source.y}
                    return diagonal(o, o)
                })
                .remove();

            // Store the old positions for transition.
            nodes.forEach(function(d){
                d.x0 = d.x;
                d.y0 = d.y;
            });

            // Creates a curved (diagonal) path from parent to the child nodes
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
            d3.select('#tree').selectAll('text')
                .filter(function(d){
                    return d.data.Team == row.key
                })
                .classed('selectedLabel', true)
            
            d3.select('#tree').selectAll('path')
                .filter(function(d){
                    return d.data.Team == row.key && d.data.Wins == 1
                })
                .classed('selected', true)
            
            return;
        }
        
        d3.select('#tree').selectAll('text')
            .filter(function(d){
                return (d.data.Team == row.key && d.data.Opponent == row.value.Opponent) || (d.data.Team == row.value.Opponent && d.data.Opponent == row.key)
            })
            .classed('selectedLabel', true)
        
        d3.select('#tree').selectAll('path')
            .filter(function(d){
                return (d.data.Team == row.key && d.data.Opponent == row.value.Opponent) || (d.data.Team == row.value.Opponent && d.data.Opponent == row.key)
            })
            .classed('selected', true)
        
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
