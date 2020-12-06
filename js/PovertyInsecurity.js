//KATHRYN and Lurein

function PovertyInsecurity(container1, container2) {

Promise.all([ // load multiple files

        d3.json("data/usState.json"),
        d3.csv("data/MMG_Avg.csv",d3.autoType)
    ]).then(data=>{
        console.log(data)
        const states=data[0]
        const fiAvg=data[1]

        const avg=new Map(fiAvg.map(d=>[d.state,d.avgChildPov]))
        const avg2=new Map(fiAvg.map(d=>[d.state,d.avgChildFIN]))

            const width=600
            const height=600
            const half=width/2

        const color = d3.scaleQuantize([1, 9], d3.schemeReds[8])
            .domain(d3.extent(fiAvg, d=>d.avgChildPov))
        const color2 = d3.scaleQuantize([1, 9], d3.schemeBlues[8])
            .domain(d3.extent(fiAvg, d=>d.avgChildFIN))

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
            .labelFormat(d3.format('.1%'))
            .title("Child Poverty Rate")

        var legend2 = d3.legendColor()
            .scale(color2)
            .labelFormat(d3.format('.1%'))
            .title("Child Food Insecurity Rate")

  //Create Poverty Map
        const svg = d3.select(container1)
            .append('svg')
            .attr('width', width)
            .attr('height',height)
            .attr('viewBox', [0,0,width+150, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)

        svg.selectAll("path")
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
            .text("Rate of Children At or Below Federal Poverty Line")
            .style('text-anchor','middle')
            .style('font-style','Bold')
            .attr('font-size',30)


  //Create Food Insecurity Map
      const svg2 = d3.select(container2)
            .append('svg')
            .attr('width', width)
            .attr('height',height)
            .attr('viewBox', [0,0,width+250, height+150])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)

        svg2.selectAll("path")
            .data(states.features)
            .join("path")
            .attr("d", path)
            .attr("class", "state")
            .attr("id", function(d){
              return d.properties.NAME
            })
            .style("fill", function(d){
                const val=avg2.get(d.properties.STUSPS)
                if (val){
                    return color2(val)
                }
                else {
                    return '#ccc'
                }
            })
            .attr("fill-opacity", 1)
            .attr("stroke", "black");('circle')


        svg2.append("g")
            .attr("transform", "translate(540,350)")
            .call(legend2)

        svg2.append('text')
            .attr('class','mapTitle')
            .attr('x',half+20)
            .attr('y',100)
            .text("Rate of Child Food Insecurity")
            .style('text-anchor','middle')
            .style('font-style','Bold')
            .attr('font-size',30)


            // this block handles the linking between two maps
            let stateHover = svg.selectAll('path')
              .on("mouseenter", (event, nodes) => {
                  let d = data
                  d3.select(event.currentTarget).style("stroke", "#fff")//.style('fill-opacity', 0.7) // highlight the state being hovered
                  svg2.selectAll("path") // here we're finding the state on the other map and highlighting it
                    .filter(function() {
                      return d3.select(this).attr("id") == nodes.properties.NAME;
                    })
                    .style("stroke", "#000000")
                  //.style('fill-opacity', 0.7)
                  // createLabel(event, nodes, d)
              })
              .on("mouseleave", (event, nodes) => {
                d3.select(event.currentTarget).style("stroke", "#000000").style('fill-opacity', 1)
                svg2.selectAll("path")
                  .filter(function() {
                    return d3.select(this).attr("id") == nodes.properties.NAME; // filter by single attribute
                  })
                  .style("stroke", "#000000")
                  .style('fill-opacity', 1)
                  // d3.select('.tooltip2')
                  //     .style('display', 'none')
              })

    })

}

export default PovertyInsecurity
