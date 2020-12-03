

function FirstMap(container){
    
    Promise.all([ // load multiple files
        
        d3.json('data/usState.json'),
        d3.csv('data/MMG_Avg.csv',d3.autoType)
    ]).then(data=>{

        const width=600
        const height=600
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
        .attr("transform", "translate(560,350)")
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
            const position = d3.pointer(event, window)
            let d = data 
            console.log(d)
            let stateNode=nodes.properties.STUSPS
            d3.select('.tooltip2')
                .attr('class','tooltip2')
                .style('display', 'inline-block')
                .style('position', 'absolute')
                .style('left', position[0]+10+'px')
                .style('top', position[1]-10+'px')
                .style('background-color','#99ccff')
                .style('border-radius','10px')
                .style('padding', 5+'px')
                .html('State: '+ nodes.properties.NAME +'<br> Average Rate: ' + data.avgFIrate)
                /*.html(function(d){
                    console.log(nodes.properties.STUSPS)
                    return ''+nodes.properties.STUSPS+''
                }
                    ) */
        })
        .on("mouseleave", (event, nodes) => {
            d3.select('.tooltip2')
                .style('display', 'none')
        })
    }) 

}

export default FirstMap