const width = 900;
const height = 600;

const svg = d3.select('svg').attr('width', width).attr('height', height);

const projection = d3.geoMercator();
const path = d3.geoPath(projection);
const g = svg.append('g')

d3.json('geo.json')
    .then(data => {
        g.selectAll('path').data(data.features).enter()
            .append('path').attr('class', 'country')
            .attr('d', path);


    })

