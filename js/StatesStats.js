//ERIN

// Want to answer the question: where is food insecurity getitng worse? with a candlestick chart
// HTML container = state-stat
const margin = ({top: 15, right: 15, bottom: 50, left: 40})
const width = 1200 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

function StateStats(container){
    d3.csv('data/MMG_FIchange.csv').then(data => {
        console.log(data)
        let states = data.state


        let svg = d3.selectAll(container).append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        let xScale = d3.scaleBand()
            .domain(data.map(d => d.state))
            .range([0,width]);
        
        let yScale = d3.scaleLinear()
            .domain([0.07, 0.20])
            .range([height, 0])

        let xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(51)

        let yAxis = d3.axisLeft()
            .scale(yScale)

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)

        svg.append("g")
            .attr("class", "y-axis")

        let yAxisGroup = svg.select(".y-axis").call(yAxis)
        let xAxisGroup = svg.select(".x-axis").call(xAxis)


        const g = svg.append("g")
            .attr("stroke-linecap", "round")
            .attr("stroke", "black")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => `translate(${xScale(d.state)},0)`)

        g.append("line")
            .attr("y1", d => yScale(d.start))
            .attr("x1", d => xScale(d.state))
            .attr("y2", d => yScale(d.end))
            .attr("x2", d => xScale(d.state)) 
            .attr("stroke-width", 10)
            .attr("stroke", d => {
                if (d.start < d.end) return d3.schemeSet1[0];
                else return d3.schemeSet1[2];
            })


            let tip = d3.selectAll('line')
                .on("mouseenter", (event, d) => {
                    // show tooltip
                    const pos = d3.pointer(event, window); 
                    console.log(pos)
                    console.log(d)
                    d3.select('.state-tooltip')
                        .style('display', 'inline-block')
                        .style('position', 'Fixed')
                        .style('left', pos[0]+5+'px')
                        .style('top', pos[1]+5+'px')
                        .html('<b>State: '+ d.state  +'<br>'+'FI Rate in 2009: '+ d.start +'<br>'+'FI Rate in 2018: '+ d.end+'</b>');
                        })
                .on("mouseleave", (event, d) => {
                    // hide tooltip
                    d3.select('.tooltip')
                        .style('display', 'none');
                })

    })

}
export default StateStats