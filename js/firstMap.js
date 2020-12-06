
function createLabel(event, nodes, data) {
    const position = d3.pointer(event, window)
    let avgRate;
    let stateNode=nodes.properties.STUSPS
    for (let i = 0; i < data[1].length; i++) {
        if (data[1][i].state == stateNode) {
           // console.log(data[1][i].avgFIrate)
            avgRate = data[1][i].avgFIrate;
            break;
        }
        }
    d3.select('.tooltip2')
                .attr('class','tooltip2')
                .style('display', 'inline-block')
                .style('position', 'absolute')
                .style('left', position[0]+10+'px')
                .style('top', position[1]-10+'px')
                .style('background-color','#99ccff')
                .style('opacity', 0.7)
                .style('border-radius','10px')
                .style('padding', 5+'px')
                .style('color', 'black')
                .style('font-weight', 'bold')
                .html('State: '+ nodes.properties.NAME + '<br>Avg FI Rate: ' + Math.round(avgRate*1000)/10 + '%')  
}

function FirstMap(container){
    
    Promise.all([ // load multiple files
        
        d3.json('data/usState.json'),
        d3.csv('data/MMG_Avg.csv',d3.autoType)
    ]).then(data=>{

        console.log(data)
        const width=1000
        const height=800
        const half=width/2
        const states=data[0]
        const fiAvg=data[1] 
        const avg=new Map(fiAvg.map(d=>[d.state,d.avgFIrate]))

        const color = d3.scaleQuantize([1, 9], d3.schemeBlues[8])
            .domain(d3.extent(fiAvg, d=>d.avgFIrate))

      
       
   
        const projection = d3.geoAlbersUsa().fitSize([width, height], states);
        const path = d3.geoPath().projection(projection);

        var legend = d3.legendColor()
            .scale(color)
            .labelFormat(d3.format('.1%'))
            .title("Food Insecurity Rate")


            //MAP

        const svg = d3.select(container)
        .append('svg')
        .attr('width', width)  
        .attr('height',height)
        .attr('viewBox', [0,0,width+150, height+150])
        .append('g')
        .attr('transform', `translate(${width/16}, ${height/16})`)
         
    svg.selectAll(container)
        .data(states.features)
        .join("path")
        .attr("d", path)
        .attr("class", "state")
        .style("fill", function(d){
            const val=avg.get(d.properties.STUSPS)
            
            if (val){
                return color(val)
            }
            else {
                return '#ccc'
            }
        })
        .attr("fill-opacity", 1)
        .attr("stroke", "black");
    
    svg.append("g")
        .attr("transform", "translate(900,500)")
        .call(legend)
        
    svg.append('text')
        .attr('class','mapTitle')
        .attr('x',half+20)
        .attr('y',100)
        .text("Relative Food Insecurity")
        .style('text-anchor','middle')
        .style('font-style','Bold')
        .attr('font-size',40)

       //this toolTip not quite working
        let toolTip = d3.selectAll('path')
        .on("mouseenter", (event, nodes) => {
            let d = data 
            createLabel(event, nodes, d)
            d3.select(event.currentTarget)
                .style("stroke", "black")
                .style('stroke-width', 5+'px')
        })
        .on("mouseleave", (event, nodes) => {
            d3.select('.tooltip2')
                .style('display', 'none')
            d3.selectAll("path")
                .style("stroke", "#000000")
                .style('stroke-width', 1+'px')
        })
    }) 

}

export default FirstMap