//ERIN

// Want to answer the question: where is food insecurity getitng worse? with a candlestick chart
// HTML container = state-stat
const margin = ({top: 15, right: 15, bottom: 50, left: 40})
const width = 800 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

function StateStats(container){
    d3.csv('data/MMG_Master.csv').then(data => {
        console.log(data)
        let states = data.StateName;

        for (let i = 0; i < states.length; i++) {
            
        }

        let svg = d3.selectAll(container).append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        let xScale = d3.scaleOrdinal()
            .domain(d3.extent(data, d => d.state))
            .range([0,width]);
        
        let yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.avgFIrate))
            .range([height, 0])

        let xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(0)

        let yAxis = d3.axisLeft()
            .scale(yScale)

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)

        svg.append("g")
            .attr("class", "y-axis")

        let yAxisGroup = svg.select(".y-axis").call(yAxis)
        let xAxisGroup = svg.select(".x-axis").call(xAxis)


  /*      const label = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("text")
            .data(data)
            .join("g")
           // .attr("transform", d => `translate(${xScale(d.miles)},${yScale(d.gas)})`)
            .append("text")
            .text(data => data.stateName) */

    })

}
export default StateStats