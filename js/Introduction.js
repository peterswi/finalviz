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
    const width=800
    const height=800
    const half=width/2

    Promise.all([ // load multiple files
        d3.json('data/states-10m.json'),
        d3.csv('data/MMG_Master.csv',d3.autoType)
    ]).then(data=>{ 
        
        const us=data[0]
        const fooData=data[1]
        

        const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9])
        const path = d3.geoPath()

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)  
            .attr('height',height)
            .attr('viewBox', [0,0,width, height])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)
        //    .append(() => legend({color, title: '', width: 260}));

        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .join("path")
            .attr("fill", d => color(fooData.id))
            .attr("d", path)
            .append("title")
            //.text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name} ${format(data.get(d.id))}`)


         svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

    })
}
export default Introduction