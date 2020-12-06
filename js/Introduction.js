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

        const width=800
        const height=800
        const half=width/2

        const milFormat=d3.format(",")
        
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
            .attr('width', width+200)  
            .attr('height',height)
            .attr('viewBox', [0,0,width+150, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)

        
        
        const circleScale=d3.scaleLinear()
            .domain(d3.extent(compare, d=>d.total))
            .range([100,200])

        const stateScale=d3.scaleLinear()
            .domain(d3.extent(fiAvg, d=>d.avgFInum))
            .range([10,50])

        const stateForce = d3.forceSimulation(fiAvg)
            .force('charge', d3.forceManyBody().strength(-20))
            .force('center', d3.forceCenter().x(half).y(half))
        
        const nodeElements=svg2.selectAll('circle1')
            .data(fiAvg)
            .enter().append('circle')
                .attr('class', 'circle1')
                .attr('r', d=> stateScale(d.avgFInum))
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
        
        const nodes=svg2.selectAll('.circle3')
            .data(compare)
            .enter().append('circle')
                .attr('class', 'circle3')
                .attr('r', d=> circleScale(d.total))
                .attr('fill',function(d){
                    if(d.compare=='canadaPop'){
                        return "red"
                    }
                    else if(d.compare=='spainPop'){
                        return 'gold'
                    }
                    else if(d.compare=='totFI'){
                        return '#0066ff'
                    }
                    else if(d.compare=='calPop'){
                        return 'brown'
                    }
                    else{
                        return 'green'
                    }
                })
                .style('stroke','white')
                .style('opacity','0.7')
                .call(drag(compForce))



        console.log(compare)
        compForce.on("tick", function(){
            nodes    
                .attr("cx", function(d, i) { 
                    d.x=i * 200+ 30
                    return -400; 
                })
                .attr("cy", function(d){
                    if (d.compare=='totFI'){
                        d.y=450
                        return d.y
                    }
                    else if(d.compare=='canadaPop'){
                        d.y=450
                        return d.y
                    }
                    else if (d.compare=='spainPop'){
                        d.y=150
                        return d.y
                    }
                    else if(d.compare=='NEPop'){
                        d.y=450
                        return d.y
                    }
                    else {
                        d.y=150
                        return d.y
                    }
                }) 
            
        })
        

        const title=svg2.append('text')
            .attr('class','graphTitle')
            .attr('x',half)
            .attr('y',0)
            .text("Absolute Food Insecurity by State")
            .style('text-anchor','middle')
            .style('font-style','Bold')
            .attr('font-size',34)

        const subtitle=svg2.append('text')
            .attr('class','graphSubtitle')
            .attr('x',half)
            .attr('y',height)
            .text("Drag each state to compare to one another")
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
                        return '<b>State: '+nodes.name +'<br>'+'Number of Food Insecure Individuals: '+milFormat(nodes.avgFInum)+'<b>'
                    }
                   if (nodes.total) {
                       return '<b>Comparison: '+nodes.title +'<br>'+'Total: '+milFormat(nodes.total)+'<b>'
                   }
                }
                    )
        })
        .on("mouseleave", (event, nodes) => {
            d3.select('.tooltip')
                .style('display', 'none')
        })

        
        
        let dur=65  

      
        d3.select('#states').on('click', function(){
            //update(fiAvg)
            
            compForce.on("tick", function(){
                nodes.transition().duration(dur)   
                    .attr("cx", -400)
                    .attr("cy", 0)      
            })
            title.transition().duration(2000)
                .text("Absolute Food Insecurity by State")

            subtitle.transition().duration(2000)
                .text("Drag each state to compare to one another")

            stateForce.alphaTarget(0.01).restart()
            stateForce.on("tick", function(){
                nodeElements.transition().duration(dur)   
                    .attr("cx", node=>node.x)
                    .attr("cy", node=>node.y)        
            }) 
        })  
        d3.select('#compare').on('click', function(){
        
            stateForce.on("tick", function(){
                nodeElements.transition().duration(dur) 
                    .attr("cx", 1000)
                    .attr("cy", 1000)      
            })
            svg2.select('.graphTitle').transition()
                .duration(2000)
                .text("Comparing food insecurity to world populations")

            subtitle.transition().duration(2000)
                .text("Drag each population to compare to one another")

            compForce.alphaTarget(0.1).restart()
            
            compForce.on("tick", function(){
                nodes.transition().duration(dur)   
                    .attr("cx", node=>node.x)
                    .attr("cy", node=>node.y) 
                    
            }) 
            
        })
       
    })
}
export default Introduction