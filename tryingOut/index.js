d3.json("words.json", data => {
             
    const bubbleChart = new BubbleChart(data);
    bubbleChart.setupData();
    bubbleChart.drawBubbles();
    bubbleChart.updateBubbles();
    // bubbleChart.drawTable();
});