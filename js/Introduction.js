//WILL

let visType

function Introduction(container1, container2, container3){

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

        const long = d3.scaleLinear()
            .domain(d3.extent(fiAvg,d=>d.longitude))
            .range([0,width])

        const lat=d3.scaleLinear()
            .domain(d3.extent(fiAvg,d=>d.latitude))
            .range([height, 0])
        
        const projection = d3.geoAlbersUsa().fitSize([width, height], states);
        const path = d3.geoPath().projection(projection);

        var legend = d3.legendColor()
            .scale(color)
            .labelFormat(d3.format('.3f'))
            .title("Food Insecurity Rate")
        
        const svg = d3.select(container1)
            .append('svg')
            .attr('width', width)  
            .attr('height',height)
            .attr('viewBox', [0,0,width+150, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)
             
        svg.selectAll(container1)
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

           
        const svg2 = d3.select(container2)
            .append('svg')
            .attr('width', width)  
            .attr('height',height)
            .attr('viewBox', [0,0,width+150, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)

        const circleScale=d3.scaleLinear()
            .domain(d3.extent(fiAvg,d=>d.avgFInum))
            .range([10,50])
        
        const stateForce = d3.forceSimulation(fiAvg)
            .force('charge', d3.forceManyBody().strength(-5))
            .force('center', d3.forceCenter().x(half).y(half))
        
        const nodeElements=svg2.selectAll('circle')
            .data(fiAvg)
            .enter().append('circle')
                .attr('r', d=> circleScale(d.avgFInum))
                .attr('fill','#0066ff')//d=>color(d.avgFIrate) COULD FILL BY RELATIVE FOOD INSECURITY RATE
                .style('stroke','white')
       
         .attr('font-size',12)
            
        stateForce.on("tick", function(){
            nodeElements    //temporarily making this junmp into a circle instead of symbol map for the sake of potentially doing absolute comparison
                .attr("cx", node=>node.x)//long(node.longitude))
                .attr("cy", node=>node.y) //lat(node.latitude))
            
        })
        let tool = d3.selectAll('circle')
            .on("mouseenter", (event, nodes) => {
                const position = d3.pointer(event, window)
                
                d3.select('.tooltip')
                    .attr('class','tooltip')
                    .style('display', 'inline-block')
                    .style('position', 'fixed')
                    .style('left', position[0]+10+'px')
                    .style('top', position[1]+10+'px')
                    .style('background-color','#99ccff')
                    .style('border-radius','10px')
                    .html('<b>State: '+nodes.name +'<br>'+'Number of Food Insecure Individuals: '+nodes.avgFInum+'<br>'+'Avg Food Insecurity Rate: '+nodes.avgFIrate+'</b>')
            })
            .on("mouseleave", (event, nodes) => {
                d3.select('.tooltip')
                    .style('display', 'none')
            })
        svg2.append('text')
            .attr('class','graphTitle')
            .attr('x',half+80)
            .attr('y',100)
            .text("Absolute Food Insecurity")
            .style('text-anchor','middle')
            .style('font-style','Bold')
            .attr('font-size',40)

            
            //INITIAL ATTEMPT AT STARTING TO MAKE THINGS A RELATIVE COMPARISON

        let totals=fiAvg.map(fiAvg=>fiAvg.avgFInum)
        const totFI=totals.reduce((a,b)=>a+b)
        console.log(totFI)
        const svg3 = d3.select(container3)
            .append('svg')
            .attr('width', width)  
            .attr('height',height)
            .attr('viewBox', [0,0,width+150, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)
       //
        svg3.selectAll('circ')
                .attr('r', function(totFI){
                    console.log(totFI)
                    return circleScale(totFi)} )
                .attr('fill','#0066ff')//d=>color(d.avgFIrate) COULD FILL BY RELATIVE FOOD INSECURITY RATE
                .style('stroke','white')
            
    })
}
export default Introduction