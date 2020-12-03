//WILL
let visType = 'states'

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
function Introduction(container2){

    

    Promise.all([ // load multiple files
        
        
        d3.csv('data/MMG_Avg.csv',d3.autoType), 
        d3.csv('data/comparisons.csv',d3.autoType)
    ]).then(data=>{ 
        
        
        const fiAvg=data[0]
        const compare=data[1]
        
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
    

        const svg2 = d3.select(container2)
            .append('svg')
            .attr('width', 2.6*width)  
            .attr('height',height)
            .attr('viewBox', [0,0,2.6*width+150, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)

        let min=d3.min(fiAvg,d=>d.avgFInum)
        let max=d3.max(compare,d=>d.total)
        
        const circleScale=d3.scaleLinear()
            .domain([min,max])
            .range([10,150])
        
        svg2.selectAll('circle2')
            .data(compare)
            .enter().append('circle')
            .attr('class','circle2')
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
            .attr('cx', function(d, i) { return i * 175+ 750; })
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
            
        svg2.selectAll('text')
            .data(compare)
            .enter().append('text')
            .text(function(d){
                if (d.compare=='totFI'){
                    return "US Food Insecure Population"
                }
                else if(d.compare=='canadaPop'){
                    return 'Population of Canada'
                }
                else if (d.compare=='spainPop'){
                    return 'Population of Spain'
                }
                else if(d.compare=='lifeMeals'){
                    return "Count of one person's lifetime meals"
                }
                else {
                    return "500 people's meals for a lifetime"
                }
            })
            .attr('x',function(d, i) { return i *200 + 720 ; })
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
            .style('font-size',25)
            .style('text-anchor','middle')
            .style('font-style','Bold')
/*
        svg2.append('text')
            .attr('class','relativeTitle')
            .attr('x',1200)
            .attr('y',0)
            .text("Comparisons")
            .style('text-anchor','middle')
            .style('font-style','Bold')
            .attr('font-size',40)
*/
        
        const stateForce = d3.forceSimulation(fiAvg)
            .force('charge', d3.forceManyBody().strength(-5))
            .force('center', d3.forceCenter().x(half).y(half))
        
        const nodeElements=svg2.selectAll('circle1')
            .data(fiAvg)
            .enter().append('circle')
                .attr('class', 'circle1')
                .attr('r', d=> circleScale(d.avgFInum))
                .attr('fill','#0066ff')
                .style('stroke','white')
                .style('opacity','0.7')
                .call(drag(stateForce))
                

            
        stateForce.on("tick", function(){
            nodeElements    
                .attr("cx", node=>node.x)
                .attr("cy", node=>node.y) 
            
        })
        
        const compForce = d3.forceSimulation(compare)
            .force('charge', d3.forceManyBody().strength(-5))
            .force('center', d3.forceCenter().x(half).y(half))
        
        const nodes=svg2.selectAll('circle3')
            .data(compare)
            .enter().append('circle')
                .attr('class', 'circle3')
                .attr('r', d=> circleScale(d.total))
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
                .style('stroke','white')
                .style('opacity','0.7')
                .call(drag(compForce))
        
        compForce.on("tick", function(){
            nodes    
                .attr("cx", 0)
                .attr("cy", 0) 
            
        })
        

        svg2.append('text')
            .attr('class','graphTitle')
            .attr('x',half)
            .attr('y',height-50)
            .text("Absolute Food Insecurity by State")
            .style('text-anchor','middle')
            .style('font-style','Bold')
            .attr('font-size',34)

        svg2.append('text')
            .attr('class','graphSubtitle')
            .attr('x',half)
            .attr('y',height)
            .text("Drag each state to compare to the values on the right..")
            .style('text-anchor','middle')
            .style('font-style','Italic')
            .attr('font-size',26)

        let tool = d3.selectAll('circle')
        .on("mouseenter", (event, nodes) => {
            const pos = d3.pointer(event, window)
            
            d3.select('.tooltip')
                .attr('class', 'tooltip')
                .style('display', 'inline-block')
                .style('position', 'absolute')
                .style('font-weight', 'bold')
                .style('background-color','#99ccff')
                .style('opacity', 0.7)
                .style('color', 'black')
                .style('padding', 5+'px')
                .style('border-radius','10px')
                .style('left', pos[0]+10+ "px")
                .style('top', pos[1] +'px')
                .html(function(d){
                    if (nodes.state){
                        return '<b>State: '+nodes.name +'<br>'+'Number of Food Insecure Individuals: '+nodes.avgFInum+'<b>'
                    }
                   if (nodes.total) {
                       return '<b>Comparison: '+nodes.title +'<br>'+'Total: '+nodes.total+'<b>'
                   }
                }
                    )
        })
        .on("mouseleave", (event, nodes) => {
            d3.select('.tooltip')
                .style('display', 'none')
        })

        d3.select('#states').on('click', function(){
            visType='states'
            console.log('states')
            
            compForce.on("tick", function(){
                nodes   
                    .attr("cx", -400)
                    .attr("cy", 0)      
            })
            stateForce.alphaTarget(0.01).restart()
            stateForce.on("tick", function(){
                nodeElements   
                    .attr("cx", node=>node.x)
                    .attr("cy", node=>node.y) 
                    
            }) 
            

            
        })  
        d3.select('#compare').on('click', function(){
            visType='compare'
            console.log('compare')
            stateForce.on("tick", function(){
                nodeElements 
                    .attr("cx", -400)
                    .attr("cy", 0)      
            })
            compForce.alphaTarget(0.05).restart()
            nodes.transition(2000)
                .attr("cx", node=>node.x)
                .attr("cy", node=>node.y) 
                

            compForce.on("tick", function(){
                nodes   
                    .attr("cx", node=>node.x)
                    .attr("cy", node=>node.y) 
                    
            }) 
            
        })
       
    })
}
export default Introduction