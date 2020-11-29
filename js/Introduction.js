//WILL

let drag = stateForce => {

    function dragstarted(event) {
        if (!event.active) stateForce.alphaTarget(0.01).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) stateForce.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
         

}
function Introduction(container1, container2, container3){

    

    Promise.all([ // load multiple files
        
        d3.json('data/usState.json'),
        d3.csv('data/MMG_Avg.csv',d3.autoType), 
        d3.csv('data/comparisons.csv',d3.autoType)
    ]).then(data=>{ 
        
        const states=data[0]
        const fiAvg=data[1]
        const compare=data[2]
        
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
        
        //MAP

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

           
        // FORCE DIAGRAM-- next step is to add DRAG feature, allow for comparison
        // should we add a 'total' to the force diagram?

        const svg2 = d3.select(container2)
            .append('svg')
            .attr('width', width)  
            .attr('height',height)
            .attr('viewBox', [0,0,width+150, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)

        let min=d3.min(fiAvg,d=>d.avgFInum)
        let max=d3.max(compare,d=>d.total)
        
        const circleScale=d3.scaleLinear()
            .domain([min,max])
            .range([10,150])
        
        const stateForce = d3.forceSimulation(fiAvg)
            .force('charge', d3.forceManyBody().strength(-5))
            .force('center', d3.forceCenter().x(half).y(half))
        
        const nodeElements=svg2.selectAll('circle')
            .data(fiAvg)
            .enter().append('circle')
                .attr('r', d=> circleScale(d.avgFInum))
                .attr('fill','#0066ff')
                .style('stroke','white')
                .call(drag(stateForce))
       
         .attr('font-size',12)
            
        stateForce.on("tick", function(){
            nodeElements    
                .attr("cx", node=>node.x)
                .attr("cy", node=>node.y) 
            
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
            .attr('x',half)
            .attr('y',50)
            .text("Absolute Food Insecurity by State")
            .style('text-anchor','middle')
            .style('font-style','Bold')
            .attr('font-size',40)

        svg2.append('text')
            .attr('class','graphSubtitle')
            .attr('x',half)
            .attr('y',height)
            .text("Drag each state for comparisons on the right ...")
            .style('text-anchor','middle')
            .style('font-style','Italic')
            .attr('font-size',26)

            
        //Should we get a tooltip going here to show the values behind these numbers
    
        const svg3 = d3.select(container3)
            .append('svg')
            .attr('width', 2.6*width)  
            .attr('height',height)
            .attr('viewBox', [0,0,2.6*width+150, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)
       //
        svg3.selectAll('circle')
            .data(compare)
            .enter().append('circle')
            .attr('r', function(d){
                return circleScale(d.total)} )
            .attr('fill',function(d){
                if(d.compare=='canadaPop'){
                    return 'red'
                }
                else if(d.compare=='spainPop'){
                    return 'gold'
                }
                else if(d.compare=='totFI'){
                    return '#0066ff'
                }
                else{
                    return 'green'
                }
            })
            .attr('cx', function(d, i) { return i * 200 + 100; })
            .attr('cy', function(d){
                if (d.compare=='totFI'){
                    return 160
                }
                else if(d.compare=='canadaPop'){
                    return 460
                }
                else if (d.compare=='spainPop'){
                    return 160
                }
                else if(d.compare=='lifeMeals'){
                    return 460
                }
                else {
                    return 160
                }
            })
            .style('stroke','white')
            
        svg3.selectAll('text')
            .data(compare)
            .enter().append('text')
            .text(function(d){
                if (d.compare=='totFI'){
                    return "Avg Total Yearly Food Insecurity "
                }
                else if(d.compare=='canadaPop'){
                    return 'Population of Canada'
                }
                else if (d.compare=='spainPop'){
                    return 'Population of Spain'
                }
                else if(d.compare=='lifeMeals'){
                    return "One individual's lifetime meals"
                }
                else {
                    return "500 people's meals for a lifetime"
                }
            })
            .attr('x',function(d, i) { return i *200 + 95 ; })
            .attr('y', function(d){
                if (d.compare=='totFI'){
                    return 335
                }
                else if(d.compare=='canadaPop'){
                    return 610
                }
                else if (d.compare=='spainPop'){
                    return 335
                }
                else if(d.compare=='lifeMeals'){
                    return 495
                }
                else {
                    return 335
                }
            })
            .style('font-size',30)
            .style('text-anchor','middle')
            .style('font-style','Bold')

        svg3.append('text')
            .attr('class','relativeTitle')
            .attr('x',495)
            .attr('y',-5)
            .text("Compare to the following ...")
            .style('text-anchor','middle')
            .style('font-style','Bold')
            .attr('font-size',40)

    })
}
export default Introduction