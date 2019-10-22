d3.csv("words-without-force-positions.csv", data => {

    // d3.queue()
    //     .defer(d3.csv, "words-without-force-positions.csv")
    //     .await(ready);
                
    const bubbleChart = new BubbleChart(data);
    bubbleChart.setupData();
    bubbleChart.drawBubbles();
});