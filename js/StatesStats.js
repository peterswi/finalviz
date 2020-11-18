//ERIN

// Want to answer the question: where is food insecurity getitng worse? with a candlestick chart
// HTML container = state-stat
const margin = ({top: 15, right: 15, bottom: 25, left: 25})
const width = 600 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

function StateStats(container){
    d3.csv('data/MMG_Master.csv').then(data => {
        console.log(data)
        let states = data.stateName;

        let svg = d3.selectAll(container).append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        let xScale = d3.scaleOrdinal()
            .domain(d3.extent(data, d => d.stateName))
            .range([0,width]);
        
        let yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.FoodInsecurityRate))
            .range([height, 0])

        let xAxis = d3.axisBottom()
            .scale(xScale)

        let yAxis = d3.axisLeft()
            .scale(yScale)
    })

}
export default StateStats