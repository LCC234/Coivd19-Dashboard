const width = 1000;
const height = 600;
const margin = 20;
const headerHeight = 40;
const yearIndex= {
    1990:2,
    2000:4,
    2010:6,
    2019:8
}
var chosenYear= 2019;

const svg = d3.select('svg')
    // .attr('width', width)
    // .attr('height', height)
    // .attr("transform",
    //       "translate("+ margin+"," + (headerHeight + margin) + ")")
    .append("g")
    .attr("transform",
        "translate(0,140)");

var tooltip = d3.select("#tooltip")

let mouseOver = (d) => {
    d3.selectAll(".country")
        .style("opacity", 0.5);
    
    d3.select(d.srcElement )
        .style("opacity", 1)
        .style("stroke", "black")
        .style("stroke-width",2);
    
    console.log(d)

    tooltip
        .style("left", (d.pageX + 10) + "px")		
        .style("top", (d.pageY + 10) + "px")
        .transition()
        .duration(200)
        
        .style("opacity", 0.9)
        .select('#country').text(dataset[d.srcElement.id][0]);

    tooltip.select('#pop')
        .text('Population: ' + dataset[d.srcElement.id][1].toLocaleString());
    
    tooltip.select('#temp')
        .html('Temp Rise: <b>' + Number(dataset[d.srcElement.id][yearIndex[chosenYear]]).toFixed(1) + ' &#8451;</b>');
    
    tooltip.select('#co')
        .html('CO<sub>2</sub> Emission: <b>' + Number(dataset[d.srcElement.id][yearIndex[chosenYear] + 1]).toFixed(2) + ' ton/capita</b>')
    
}

let mouseLeave = (d)=>{
    d3.selectAll(".country")
        .style("opacity", 1);
    
    d3.select(d.srcElement )
        .style("stroke", "#999")
        .style("stroke-width",1);

    tooltip

        .style("opacity", 0)
}

var dataset = {};
const projection = d3.geoMercator();
const path = d3.geoPath(projection);
const map_g = svg.append('g')

var redRange = ['#FFFFFF', '#B03A2E']
var minDomain = -0.8;
var maxDomain = 3.1;
var colorScale = d3.scaleLinear()
                .range(redRange)
                .domain([minDomain,maxDomain ])


const legendWidth = 300
const legendHeigth = 20
var legendInterval = []
const tickNo = 5
const legend_g = svg.append("g")
                    .attr("transform", "translate(" + (width - legendWidth - 10) + ", 420)");


legend_g.append('text')
    .html('Temperature (&#8451;)')
    .attr('x',0)
    .attr('y',-8)
    .style('font-size','90%')

const legendAxis_g = legend_g.append("g")
.attr("transform", "translate(0, "+ (legendHeigth) +")");


var defs = svg.append("defs");
var linearGradient = defs.append("linearGradient")
                        .attr("id", "linearGradient")

linearGradient.selectAll('stop')
.data(redRange)
.enter()
.append('stop')
.style('stop-color', function(d){ return d; })
.attr('offset', function(d,i){
  return 100 * (i / (redRange.length - 1)) + '%';
})


const legendRect = legend_g.append("rect")
                    .attr("width", legendWidth)
                    .attr("height", legendHeigth)
                    .style("fill", "url(#linearGradient)");
var promises = []
promises.push(d3.json('data/geo.json'))
promises.push(d3.csv('data/temp.csv'))
promises.push(d3.csv('data/co2.csv'))


Promise.all(promises)
    .then(([geoData, tempData,coData]) =>{
        geoData.features.forEach(d => {
            dataset[d.properties.iso_a3] = [d.properties.name, d.properties.pop_est, 0,0,0,0,0,0,0,0]
        });

        tempData.forEach(d => {
            if (dataset[d.ISO3]) {
                dataset[d.ISO3][2] = Number(d[1990]);
                dataset[d.ISO3][4] = Number(d[2000]);
                dataset[d.ISO3][6] = Number(d[2010]);
                dataset[d.ISO3][8] = Number(d[2019]);
            }
            // else if (d.ISO3 == 'MAX') {
            //     maxDomain = Number(d.F2021);
            // }else if (d.ISO3 == 'MIN') {
            //     minDomain = Number(d.F2021);
            // }
        });

        coData.forEach(d => {
            if (dataset[d.ISO3]) {
                dataset[d.ISO3][3] = Number(d[1990]);
                dataset[d.ISO3][5] = Number(d[2000]);
                dataset[d.ISO3][7] = Number(d[2010]);
                dataset[d.ISO3][9] = Number(d[2019]);
            }
        })

        console.log(dataset)
        console.log(maxDomain)
        console.log(minDomain)

        map_g.selectAll('path').data(geoData.features).enter()
            .append('path').attr('class', 'country')
            .attr('d', path)
            .attr('id', d => d.properties.iso_a3)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            .attr("fill", d => {
                return colorScale(dataset[d.properties.iso_a3][yearIndex[chosenYear]])
            })

        var legendScale = d3.scaleLinear()
            .range([0, legendWidth])
            .domain([minDomain, maxDomain]);
        
        
        var interpo = d3.interpolate(minDomain,maxDomain)

        for (let i = 0; i < tickNo + 1; i++) {
            legendInterval.push(interpo(i/tickNo));    
        }
        
        var legendAxis = d3.axisBottom(legendScale)
            .tickSize(legendHeigth * 0.5)
            .tickValues(legendInterval);

        legendAxis_g.call(legendAxis)
            .select('path').attr('stroke', 'none');


    })



function yearSelect(year){
    if(yearIndex[year]){
        d3.select('#y'+ chosenYear).html(chosenYear)
        d3.select('#y'+ year).html(year + ' &#10004;')
        chosenYear = year;

        d3.select('.map-label-text').html('Temp Increase for Year <b>'+ year +'</b>')

        map_g.selectAll('path')
        .transition()
        .duration(200)
        .attr("fill", d => {
            return colorScale(dataset[d.properties.iso_a3][yearIndex[chosenYear]])
        })
    } 
    
}
