//WILL



function Introduction(container){

    Promise.all([ // load multiple files
        
        d3.csv('data/MMG_Master.csv',d3.autoType),
        d3.json('data/usState.json'),
        d3.csv('data/MMG_Avg.csv',d3.autoType)
    ]).then(data=>{ 
        
        const states=data[1]
        const fooData=data[0]
        const fiAvg=data[2]
        const avg=new Map(fiAvg.map(d=>[d.state,d.avgFIrate]))
       
        
            const width=600
            const height=600
            const half=width/2
        
        const color = d3.scaleQuantize([1, 9], d3.schemeBlues[8])
            .domain(d3.extent(fiAvg, d=>d.avgFIrate))
        const projection = d3.geoAlbersUsa().fitSize([width, height], states);
        const path = d3.geoPath().projection(projection);

        var legend = d3.legendColor()
            .scale(color)
            .labelFormat(d3.format('.3f'))
            .title("Food Insecurity Rate")
        
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
            .attr('class','graphTitle')
            .attr('x',half)
            .attr('y',100)
            .text("US Food Insecurity")
            .style('text-anchor','middle')
            .style('font-style','italic')
            .attr('font-size',40)

            console.log(fiAvg)
        const svg2 = d3.select('.chart')
            .append('svg')
            .attr('width', width)  
            .attr('height',height)
            .attr('viewBox', [0,0,width+150, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)

        const circleScale=d3.scaleLinear()
            .domain(d3.extent(fiAvg,d=>d.avgFInum))
            .range([8,50])
        
        const stateForce = d3.forceSimulation(fiAvg)
            .force('charge', d3.forceManyBody().strength(-4))
            .force('center', d3.forceCenter().x(half).y(half))
        
        const nodeElements=svg2.selectAll('circle')
            .data(fiAvg)
            .enter().append('circle')
                .attr('r', d=> circleScale(d.avgFInum)
                    )
                .attr('fill', d=>color(d.avgFIrate))
        
        stateForce.on("tick", function(){
            nodeElements
                .attr("cx", node=>node.x)
                .attr("cy", node=>node.y)
        })
    })
}
export default Introduction