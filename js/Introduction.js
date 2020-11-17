//WILL

import {legend} from "@d3/color-legend"

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
    d3.csv('data/MMG_Master.csv',d3.autoType).then(data=>{
        console.log(data)
    
        const svg = d3.create("svg")
        .attr("viewBox", [0, 0, 975, 610]);

        const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9])

        svg.append("g")
            .attr("transform", "translate(610,20)")
            .append(() => legend({color, title: '', width: 260}));

        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .join("path")
            .attr("fill", d => color(data.get(d.id)))
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