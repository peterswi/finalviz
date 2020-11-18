//WILL

//import {legend} from "@d3/color-legend"

function Introduction(container){

/*
    var map = d3.choropleth()
        .geofile('/d3-geomap/topojson/countries/USA.json')
        .projection(d3.geoAlbersUsa)
        .column('Food Insecurity Rate')
        .unitId('State Name')
        .scale(1000)
        .legend(true);

    d3.csv('/data/MMG_Master.csv').then(data => {
        map.draw(d3.select('#map').datum(data));

});

*/

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
        
        const color = d3.scaleQuantize([1, 8], d3.schemeBlues[7])
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
            .attr('viewBox', [0,0,width+50, height+50])
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
            .attr("transform", "translate(460,-10)")
            .call(legend)

       
    })
}
export default Introduction