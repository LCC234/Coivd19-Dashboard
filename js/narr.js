const width = 1000;
const height = 600;
const margin = 25;
const headerHeight = 40;
const yearIndex= {
    1990:2,
    2000:4,
    2010:6,
    2019:8
}
var chosenYear= 2019;
var chosenScale = 'temp';

const map_svg = d3.select('#map-svg')
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

    tooltip
        .style("left", (d.pageX + 10) + "px")		
        .style("top", (d.pageY + 10) + "px")
        .style("opacity", 0.9)
        .select('#tooltip-country').text(dataset[d.srcElement.id][0]);

    tooltip.select('#tooltip-year')
        .html('Year: <b>' + chosenYear + '</b>');

    tooltip.select('#tooltip-pop')
        .text('Population: ' + dataset[d.srcElement.id][1].toLocaleString());
    
    tooltip.select('#tooltip-temp')
        .html('Temp Rise: <b>' + Number(dataset[d.srcElement.id][yearIndex[chosenYear]]).toFixed(1) + ' &#8451;</b>');
    
    tooltip.select('#tooltip-co')
        .html('CO<sub>2</sub> Emission: <b>' + Number(dataset[d.srcElement.id][yearIndex[chosenYear] + 1]).toFixed(2) + ' ton/capita</b>')
    
}



let mouseLeave = (d)=>{
    d3.selectAll(".country")
        .style("opacity", 1);
    
    d3.select(d.srcElement )
        .style("stroke", "#999")
        .style("stroke-width",1);

    tooltip.style("opacity", 0)
}

var dataset = {};
const projection = d3.geoMercator();
const path = d3.geoPath(projection);
const map_g = map_svg.append('g')

var redRange = ['#FFFFFF', '#B03A2E']
var blueRange = ['#FFFFFF' ,'#2e73b0']
var minDomain_temp = -0.8;
var maxDomain_temp = 3.1;
var minDomain_co = 0;
var maxDomain_co = 49;

var scaleConfig = {
    'temp': [redRange,minDomain_temp,maxDomain_temp,0,'Global Warming Distribution', 'Temperature'],
    'co2':[blueRange,minDomain_co,maxDomain_co,1, 'Global CO<sub>2</sub> Distribution', 'CO<sub>2</sub> Emissions']
}



const legendWidth = 300
const legendHeigth = 20
var legendInterval = []
const tickNo = 5
const legend_g = map_svg.append("g")
                    .attr("transform", "translate(" + (width - legendWidth - 10) + ", 420)");


legend_g.append('text')
    .html('Temperature (&#8451;)')
    .attr('x',0)
    .attr('y',-8)
    .style('font-size','90%')

const legendAxis_g = legend_g.append("g")
.attr("transform", "translate(0, "+ (legendHeigth) +")");


var defs = map_svg.append("defs");
var linearGradient = defs.append("linearGradient")
                        .attr("id", "linearGradient")



var legendRect = legend_g.append("rect")
                    .attr("width", legendWidth)
                    .attr("height", legendHeigth)

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

        map_g.selectAll('path').data(geoData.features).enter()
            .append('path').attr('class', 'country')
            .attr('d', path)
            .attr('id', d => d.properties.iso_a3)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            .on("click", d => {
                var label = d3.select('#stackedbar-title')
                var textDes = d3.select('#stackedbar-text')
                var sb_svg = d3.select('#stackedbar-svg') 
                var countryCode = d.srcElement.id
                console.log(countryCode)
                genStackedBar(countryCode)
                    .then((d) => {
                        console.log(d)
                        label.html('<b>' + dataset[countryCode][0] + '</b>')
                        textDes.html('Disasters Frequency Chart (Climate-related)')
                        sb_svg.classed('displaynone',false)
                        

                    })
                    .catch((e) => {
                        console.log(e)
                        label.html('Sorry...no available dataset for ' + dataset[countryCode][0] + ' :(')
                        textDes.html('Please select another country.')
                        sb_svg.classed('displaynone',true)
                    })
                    .finally((d)=>{
                        scrollToDetails()
                    } )

                // if(genStackedBar(countryCode)){
                //     label.html(dataset[countryCode][0])
                // }else{
                //     label.html('Sorry...no available dataset for ' + dataset[countryCode][0])
                // }
            })


            scaleSelect(chosenScale);

    })

function scrollToDetails(){
    const yOffset = -80; 
    var drilldown = document.getElementById("drill-down-title")
    const y = drilldown.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({
        top: y,
        behavior: 'smooth'
    })
}


function yearSelect(year){
    if(yearIndex[year]){
        var offset = scaleConfig[chosenScale][3]

        d3.select('#y'+ chosenYear)
            .html(chosenYear)
            .classed('clicked', false)
            .classed('unclicked', true);
        d3.select('#y'+ year)
            .html(year + ' &#10004;')
            .classed('clicked', true)
            .classed('unclicked', false);
        chosenYear = year;

        d3.select('#map-label-title').html('<b>'+ year +'</b>')

        

        map_g.selectAll('path')
        .transition()
        .duration(200)
        .attr("fill", d => {
            return colorScale(dataset[d.properties.iso_a3][yearIndex[chosenYear] + offset])
        })
    } 
    
}


function scaleSelect(scale){
    if (scaleConfig[scale]) {
        
        var colorRange = scaleConfig[scale][0]
        var minDomain = scaleConfig[scale][1]
        var maxDomain = scaleConfig[scale][2]
        var offset = scaleConfig[scale][3]
        var des = scaleConfig[scale][4]

        colorScale = d3.scaleLinear()
                .range(colorRange)
                .domain([minDomain,maxDomain])

        var legendScale = d3.scaleLinear()
                .range([0, legendWidth])
                .domain([minDomain, maxDomain]);
        
        var interpo = d3.interpolate(minDomain,maxDomain)

        var legendInterval = []

        for (let i = 0; i < tickNo + 1; i++) {
            legendInterval.push(interpo(i/tickNo));    
        }

        var legendAxis = d3.axisBottom(legendScale)
            .tickSize(legendHeigth * 0.5)
            .tickValues(legendInterval);

        legendAxis_g.call(legendAxis)
            .select('path').attr('stroke', 'none');

        map_g.selectAll('path').attr("fill", d => {
            return colorScale(dataset[d.properties.iso_a3][yearIndex[chosenYear] + offset])
        })

        linearGradient.html('').selectAll('stop')
        .data(colorRange)
        .enter()
        .append('stop')
        .style('stop-color', function(d){ return d; })
        .attr('offset', function(d,i){
        return 100 * (i / (colorRange.length - 1)) + '%';
        })

        legendRect.style("fill", "url(#linearGradient)");

        d3.select('#'+chosenScale)
            .html(scaleConfig[chosenScale][5])
            .classed('clicked', false)
            .classed('unclicked', true);

        d3.select('#'+scale)
            .html(scaleConfig[scale][5] + ' &#10004;')
            .classed('clicked', true)
            .classed('unclicked', false);
        
        
        d3.select('#map-label-text').html(des)

        chosenScale=scale;
    }

}


const sb_width = 1000
const sb_height = 400
var sb_svg = d3.select('#stackedbar-svg')
                    .append('g')
                    .attr("transform", "translate(" + margin + "," + margin+ ")");;
var sb_xAxis_svg = sb_svg.append("g")
            .attr("transform", "translate(0,"+sb_height+")")
var sb_yAxis_svg = sb_svg.append("g")
var sb_bars_svg = sb_svg.append("g")
var sb_tooltip = d3.select('#stackedbar-tooltip')
var countryData = {};
var dateList = [];
const disastersList = ['drought', 'extremetemp','flood','landslide','storm','wildfire'];
const disastersNameList = ['Drought', 'Extreme Temperature','Flood','Landslide','Storm','Wildfire'];
const sb_colorList = ['#264653','#2a9d8f','#e9c46a','#f4a261','#e76f51','#a2d2ff'];
var minYDomain = 0;
var maxYDomain = 43;
var xAxisBand ;
var yAxisBand ;
var sb_colorScale;
var stackedCountryData;
// Stacked bar
var genStackedBar = 
function stackedBar(country){
    return new Promise(function(resolve, reject)
    {
        console.log('genStackedBar called')
        if (dataset[country]) {
            
            d3.select('#svg-container-stacked').classed('displaynone', false)
    
            d3.csv('data/disasters_freq.csv').then(data => {
                countryData = data.filter((obj) => {
                    return obj.ISO3 == country;
                })
    
                if(Object.keys(countryData).length === 0){
                        return reject(false);
                }
    
                dateList = countryData.map((d) => {
                    return d.Date;
                })
    
                maxYDomain = Math.max(...countryData.map((d) => {
                    return d.Total;
                }))
    
                xAxisBand = d3.scaleBand()
                        .domain(dateList)
                        .range([0,sb_width])
                        .padding([0.2]);
                
                sb_xAxis_svg.call(d3.axisBottom(xAxisBand).tickSizeOuter(0));
    
                yAxisBand = d3.scaleLinear()
                            .domain([0,(maxYDomain)])
                            .range([sb_height,0]);
    
                sb_yAxis_svg.call(d3.axisLeft(yAxisBand).tickValues(d3.range(maxYDomain + 1)));
                
                sb_colorScale = d3.scaleOrdinal()
                                .domain(disastersList)
                                .range(sb_colorList);
                
                stackedCountryData = d3.stack()
                                .keys(disastersList)(countryData)
                
                sb_bars_svg.html('')
                        .selectAll("g")
                        .data(stackedCountryData)
                        .enter().append("g")
                        .attr("fill", function (d) { 
                            return sb_colorScale(d.key); 
                        })
                        .selectAll("rect")
                        .data(function (d) { return d; })
                        .enter().append("rect")
                        .attr('x', (d) => {
                            
                            return xAxisBand(d.data.Date)
                        })
                        .attr('y', (d)=>{
                            
                            return yAxisBand(d[1]); 
                        })
                        .attr('height', (d) => {
                            return yAxisBand(d[0]) - yAxisBand(d[1]);
                        })
                        .attr("width", xAxisBand.bandwidth())
                        .on("mouseover", sb_mouseover)
                        .on("mousemove", sb_mousemove)
                        .on("mouseleave", sb_mouseleave)
                
                        return resolve(true);
            })
            
        }
        else{
            return reject(false);
        }
    
    })
}
    
    


var sb_mouseover = (d) => {
    var index = d3.select(d.srcElement.parentNode).datum().index;
    var dName = disastersNameList[index];
    var dAmt = d3.select(d.srcElement).data()[0].data[disastersList[index]]

    sb_tooltip
        .style("left", (d.pageX + 10) + "px")		
        .style("top", (d.pageY + 10) + "px")
        .style("opacity", 0.8)
        .html(dName + ': ' + dAmt)
}

var sb_mousemove = (d) => {
    sb_tooltip
        .style("left", (d.pageX + 10) + "px")		
        .style("top", (d.pageY + 10) + "px")
}

var sb_mouseleave = (d) => {
    sb_tooltip
        .style("opacity", 0)
}

