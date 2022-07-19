var container = d3.select('#intro-container').classed('displaynone',false)
var body = d3.select('body')
var title = d3.select('#intro-title')
var des = d3.select('#intro-des')
var ref = d3.select('#intro-ref')
var button = d3.select('#intro-button')
var svg_line = d3.select('#svg-container-line')
var svg_sb = d3.select('#svg-container-sb')
//Tooltip
var init_lineChart_tooltip = d3.select('#line-tooltip').classed('displaynone',true)

body.style('overflow','hidden')

container.transition()
.duration(1000)
.style('opacity','0.9')

title.transition()
.duration(1200)
.style('opacity','0.9')

des.transition()
    .duration(1500)
    .style('opacity','0.9')

ref.transition()
    .duration(1500)
    .style('opacity','0.9')

button.transition()
    .duration(1200)
    .style('opacity','0.9')
    .attr('onclick','zeroClick()')

const desText_zero = "Take a look at these 2 charts (data collected from IMF datasets)... You may hover over the points for more specifics :)"
const RefText_zero = "From these plots, we can tell that there is, in fact, some correlations between temperature rise (global warming) and natural disaster frequencies."

function zeroClick(){
    des.transition()
    .duration(1000)
    .style('opacity','0')
    
    ref.transition()
    .duration(1000)
    .style('opacity','0')
    .on('end',() => {
        des.style('top','8%')
        .html(desText_zero)
        .transition()
        .duration(1000)
        .style('opacity','0.9')

        svg_line.transition()
        .duration(2000)
        .style('opacity','0.9')

        svg_sb.transition()
        .duration(2000)
        .style('opacity','0.9')

        ref.style('top','70%')
        .html(RefText_zero)
        .transition()
        .duration(2000)
        .style('opacity','0.9')

        init_lineChart_tooltip.classed('displaynone',false)


    })

    button.attr('onclick','firstClick()')
}

const desText_first = 'We can dive deeper.<br><br>Here, the dashboard has collated data of temperature rises and CO<sub>2</sub> emissions at every country level, presented on a global map.<br>These data are extracted with an approximate intervals of 10-years , specifically 1990, 2000, 2010 & 2019.<br> Natural Disasters frequencies are also collected for each individual countries, with data dating back to as early as 1980 to 2021.'
const RefText_first = 'These data are retrieved from the International Monetary Fund Climate Change Datasets'
function firstClick(){

    init_lineChart_tooltip.transition()
    .duration(1000)
    .style('opacity','0')
    
    svg_line.transition()
    .duration(1000)
    .style('opacity','0')

    svg_sb.transition()
    .duration(1000)
    .style('opacity','0')
    .on('end' ,() => {
        init_lineChart_tooltip.classed('displaynone',true)
    })

    ref.transition()
    .duration(1000)
    .style('opacity','0')
    .on('end',()=>{
        ref.html(RefText_first)
        .style('top','40%')
        .transition()
        .duration(1000)
        .style('opacity','0.9')
    })

    des.transition()
    .duration(1000)
    .style('opacity','0')
    .on('end',() => {
        des.html(desText_first)
        .style('top','25%')
        .transition()
        .duration(1000)
        .style('opacity','0.9')
    })

    button.attr('onclick','secondClick()')
}


const desText_second  = 'Users can play around with the parameters (Year, Map Scales) and dive down into each individual countries for their natural disaster frequencies.<br>From there, users can derive their own conclusions based on the data provided.<br><br><br><br> Do note the dataset given might not be fully exhaustive and comprehensive.<br>It serves to give a rough overview of the global climate change based on a few of the many factors through, most importantly, the means of a narrative visualisation.'
function secondClick(){
    ref.transition()
    .duration(1000)
    .style('opacity','0')

    des.transition()
    .duration(1000)
    .style('opacity','0')
    .on('end',() => {
        des.html(desText_second)
        .transition()
        .duration(1000)
        .style('opacity','0.9')
    })

    button.attr('onclick','thirdClick()')
}

const desText_third  = 'Have fun! :)'

function thirdClick(){

    des.transition()
    .duration(1000)
    .style('opacity','0')
    .on('end',() => {
        des.html(desText_third)
        .transition()
        .duration(1000)
        .style('opacity','0.9')
    })

    button.html('Let\'s start!')
    .attr('onclick','fourthClick()')
}


function fourthClick(){
    container.classed('displaynone',true)
    body.style('overflow','scroll')
}



//Line Chart
const init_svg_margin = 50;
const init_lineChart_width = 400
const init_lineChart_height = 400

var init_lineChart_svg = d3.select('#intro-line-svg')
                            .append('g')
                            .attr("transform", "translate(" + init_svg_margin + "," + init_svg_margin + ")");

var init_lineChart_xDomain = ['1990','2000','2010','2019']
var init_lineChart_xAxis = d3.scaleBand()
        .domain(init_lineChart_xDomain)
        .range([ 0, init_lineChart_width]);


//X Axis
init_lineChart_svg.append("g")
      .attr("transform", "translate("+init_svg_margin+"," + (init_lineChart_height + init_svg_margin) + ")")
      .call(d3.axisBottom(init_lineChart_xAxis))
      .style('color','white')
      .style('font-size', 15);

var init_lineChart_yAxis = d3.scaleLinear()
                    
// Title
var xPos = init_lineChart_width/2 + init_svg_margin
var titleText = '<tspan dy="1.2em">Graph of Global Surface Temperature Rise</tspan><tspan x="'+xPos+'" dy="1.2em">against Year</tspan>'

init_lineChart_svg.append('text')
        .attr('x', xPos)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-size', 20)
        .style('fill', 'white')
        .html(titleText);
// X label
init_lineChart_svg.append('text')
        .attr('x', init_lineChart_width/2 + 50)
        .attr('y', init_lineChart_height - 15 + 110)
        .attr('text-anchor', 'middle')
        .style('font-size', 18)
        .style('fill', 'white')
        .text('Year');
// Y label
init_lineChart_svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(0,' + (init_lineChart_height/2 + init_svg_margin) + ')rotate(-90)')
        .style('font-size', 18)
        .style('fill', 'white')
        .html('Temperature (&#8451;)');

d3.csv('data/temp.csv')
    .then((tempData) => {

        worldTempData = tempData.filter((obj) => {
            return obj.ISO3 == 'WLD';
        })


        var lineChart_data = []
        init_lineChart_xDomain.forEach(d => {
            lineChart_data.push({date:d,value:worldTempData[0][d]})
        })

        var init_lineChart_yDomain = [ Number(lineChart_data[0]['value']) - 0.1 ,Number(lineChart_data[lineChart_data.length-1]['value'])  + 0.01];

        init_lineChart_yAxis.domain(init_lineChart_yDomain)
            .range([init_lineChart_height, 0 ]);

        //yAxis
        init_lineChart_svg.append("g")
            .call(d3.axisLeft(init_lineChart_yAxis))
            .style('color','white')
            .attr("transform", "translate(" + init_svg_margin + "," + init_svg_margin + ")")
            .style('font-size', 15)

        init_lineChart_svg.append('g')
            .selectAll("circle")
            .data(lineChart_data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return init_lineChart_xAxis(d.date) ; } )
            .attr("cy", function (d) { return init_lineChart_yAxis(d.value); } )
            .attr("r", 6)
            .attr("transform", "translate(" + (50 + init_svg_margin) + "," + 50 + ")")
            .style("fill", "#b5b3b3")
            .on("mouseover", lineChart_mouseover)
            .on("mousemove", lineChart_mousemove)
            .on("mouseleave", lineChart_mouseleave);
    

        init_lineChart_svg.append("path")
            .datum(lineChart_data)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .attr("transform", "translate(" + (50 + init_svg_margin) + "," + 50 + ")")
            .attr("d", d3.line()
              .x(function(d) { 
                console.log(d.date)
                console.log(init_lineChart_xAxis(d.date))
                return init_lineChart_xAxis(d.date) 
            })
              .y(function(d) { 
                console.log(d.value)
                console.log(init_lineChart_yAxis(d.value))
                return init_lineChart_yAxis(d.value) 
            })
             .curve(d3.curveMonotoneX)
              )
    })


    var lineChart_mouseover = (d) => {
        var selectedDot = d3.select(d.srcElement)
        var year = selectedDot.data()[0]["date"]
        var temp = selectedDot.data()[0]["value"]
        selectedDot.transition()
            .duration(200)
            .attr("r", 12)

        init_lineChart_tooltip
            .style("left", (d.pageX + 10) + "px")		
            .style("top", (d.pageY + 10) + "px")
            .style("opacity", 0.8)
            .html('Year: '+year + '</br>Temp: ' + temp + ' (&#8451;)')
    }
    
    var lineChart_mousemove = (d) => {
        init_lineChart_tooltip
            .style("left", (d.pageX + 10) + "px")		
            .style("top", (d.pageY + 10) + "px")
    }
    
    var lineChart_mouseleave = (d) => {
        init_lineChart_tooltip
            .style("opacity", 0)

        var selectedDot = d3.select(d.srcElement)
        selectedDot.transition()
            .duration(200)
            .attr("r", 6)
    }




d3.csv('data/disasters_freq.csv').then((disaData) =>{
    const init_sb_width = 1000
    const init_sb_height = 400

    var sb_svg = d3.select('#intro-sb-svg')
                    .append('g')
                    .attr("transform", "translate(" + init_svg_margin + "," + init_svg_margin+ ")")
                    

    var sb_xAxis_svg = sb_svg.append("g")
                    .attr("transform", "translate(0,"+(init_sb_height+150) +")")
                    .style('color','white')
                    .style('font-size', 18);
    
    var sb_yAxis_svg = sb_svg.append("g")
                    .attr("transform", "translate(0,150)")
                    .style('color','white')
                    .style('font-size', 18);

    var sb_bars_svg = sb_svg.append("g")
                    .attr("transform", "translate(0,150)")

    

    var worldDisaData = disaData.filter((obj) => {
        return obj.ISO3 == 'WLD';
    })

    var dateList = worldDisaData.map((d) => {
        return d.Date;
    })

    var maxYDomain = Math.max(...worldDisaData.map((d) => {
        return d.Total;
    }))

    var xAxisBand = d3.scaleBand()
                        .domain(dateList)
                        .range([0,init_sb_width])
                        .padding([0.2]);

    sb_xAxis_svg.call(d3.axisBottom(xAxisBand).tickValues(xAxisBand.domain().filter(function(d,i){ return !(i%10)})));

    var yAxisBand = d3.scaleLinear()
                            .domain([0,(maxYDomain)])
                            .range([sb_height,0]);
    
    sb_yAxis_svg.call(d3.axisLeft(yAxisBand));

    stackedWorldData = d3.stack()
                    .keys(disastersList)(worldDisaData)

    //title
    sb_svg.append('text')
        .attr('x', init_sb_width/2)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-size', 22)
        .style('fill', 'white')
        .text('Global Disaster Frequencies From 1980 to 2021');
        
    sb_bars_svg.html('')
        .selectAll("g")
        .data(stackedWorldData)
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
        .on("mouseover", init_sb_mouseover)
        .on("mousemove", init_sb_mousemove)
        .on("mouseleave", init_sb_mouseleave)

    
} )

var init_sb_mouseover = (d) => {
    var index = d3.select(d.srcElement.parentNode).datum().index;
    var dName = disastersNameList[index];
    var dAmt = d3.select(d.srcElement).data()[0].data[disastersList[index]]

    var date = d3.select(d.srcElement).data()[0].data["Date"]
    
    init_lineChart_tooltip
        .style("left", (d.pageX + 10) + "px")		
        .style("top", (d.pageY + 10) + "px")
        .style("opacity", 0.8)
        .html('Year: '+date + '</br>' + dName + ': ' + dAmt)
}

var init_sb_mousemove = (d) => {
    init_lineChart_tooltip
        .style("left", (d.pageX + 10) + "px")		
        .style("top", (d.pageY + 10) + "px")
}

var init_sb_mouseleave = (d) => {
    init_lineChart_tooltip
        .style("opacity", 0)
}
