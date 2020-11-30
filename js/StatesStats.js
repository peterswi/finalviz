//ERIN

// Want to answer the question: where is food insecurity getitng worse? with a candlestick chart
// HTML container = state-stat
const margin = ({top: 15, right: 15, bottom: 50, left: 40})
const width = 1400 - margin.left - margin.right
const height = 700 - margin.top - margin.bottom

function StateStats(container){
    d3.csv('data/MMG_FIchange.csv').then(data => {
        console.log(data)
        let states = data.state

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)  
            .attr('height',height)
            .attr('viewBox', [0,0,width+150, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)

  /*      let svg = d3.selectAll(container).append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr('transform', `translate(${width/16}, ${height/16})`) */

        let xScale = d3.scaleBand()
            .domain(data.map(data => data.state))
            .range([0,width])
        
        let yScale = d3.scaleLinear()
            .domain([0.06, 0.21])
            .range([height, 0])

        let xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(51)

        let yAxis = d3.axisLeft()
            .scale(yScale)

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", 'translate(-10,630)')

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", 'translate(-10,0)')

        let yAxisGroup = svg.select(".y-axis").call(yAxis)
        let xAxisGroup = svg.select(".x-axis").call(xAxis)

        svg.append('text')
            .attr('class','ytitle')
            .attr('x',80)
            .attr('y', 0)
            .text('Food Insecurity Rate')
            .style('text-anchor', 'middle')
            

        const g = svg.append("g")
            .attr("stroke-linecap", "round")
            .attr("stroke", "black")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => `translate(${xScale(data.state)})`)

        g.append("line")
            .attr("y1", d => yScale(d.start))
            .attr("x1", d => xScale(d.state))
            .attr("y2", d => yScale(d.end))
            .attr("x2", d => xScale(d.state)) 
            .attr("stroke-width", 7)
            .attr("stroke", d => {
                if (d.start < d.end) return d3.schemeSet1[0];
                else return d3.schemeSet1[2];
            })


            let tip = d3.selectAll('line')
                .on("mouseenter", (event, d) => {
                    // show tooltip
                    const pos = d3.pointer(event)
                    console.log(pos)
                    console.log(d)
                    d3.select('.state-tooltip')
                        .attr('class', 'state-tooltip')
                        .style('display', 'inline-block')
                       // .style('position', 'fixed')
                        .style('font-style', 'italic')
                       // .style('left', pos[0]+'px')
                       // .style('top', pos[1]+'px')
                        .style('left', 100+'px')
                        .style('top', -100 +'px')
                        .html('<b>State: '+ d.state  +'<br>'+'FI Rate in 2009: '+ Math.round(d.start*100) + '%' +'<br>'+'FI Rate in 2018: '+ Math.round(100*d.end) + '%' + '</br>' + 'Percent Change:  ' + Math.round(100*(d.end - d.start),2) + '%');
                        })
                .on("mouseleave", (event, d) => {
                    // hide tooltip
                    d3.select('.state-tooltip')
                        .style('display', 'none');
                })

    })

}
export default StateStats