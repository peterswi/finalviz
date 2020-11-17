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
        d3.json('data/states-10m.json'),
        d3.csv('data/MMG_Master.csv',d3.autoType),
        d3.json('data/usState.json')
    ]).then(data=>{ 
        
        const us=data[0]
        const states=data[2]
        const fooData=data[1]
        
        console.log(states)
        
            const width=600
            const height=600
            const half=width/2
       
        
        const projection = d3.geoAlbersUsa().fitSize([width, height], states);
        const path = d3.geoPath().projection(projection);

        
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
            .style("fill", 'grey')
            //.attr("fill", d => colorScale(d => +d.count.split(",").join("")))
            .attr("fill-opacity", 1)
            .attr("stroke", "black");


/*
        const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9])
        
        let mapGeo=topojson.feature(us, us.objects.states)
        //const projection=d3.geoMercator().fitExtent([[0,0],[width, height]],mapGeo)
        let usPath=d3.geoPath()//.projection(projection)

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)  
            .attr('height',height)
            .attr('viewBox', [0,0,width, height])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)
        //    .append(() => legend({color, title: '', width: 260}));

        const map = svg.append("path")
            .datum(mapGeo)
            .attr("d", usPath)
            .style('fill','darkgrey')
            .style("opacity", 1)

        svg.append("g")
            .selectAll("path")
            .data(mapGeo)
            .join("path")
            .attr("fill", 'blue')
            .attr("d", usPath)
            .append("title")
            //.text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name} ${format(data.get(d.id))}`)


         svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", usPath);
*/
    })
}
export default Introduction