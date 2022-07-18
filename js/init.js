var container = d3.select('#intro-container')
    
var title = d3.select('#intro-title')
var des = d3.select('#intro-des')
var ref = d3.select('#intro-ref')
var button = d3.select('#intro-button')

container.transition()
.duration(1000)
.style('opacity','0.9')

title.transition()
.duration(1200)
.style('opacity','0.9')

des.transition()
    .duration(1200)
    .style('opacity','0.9')

ref.transition()
    .duration(1200)
    .style('opacity','0.9')

button.transition()
    .duration(1200)
    .style('opacity','0.9')
    .attr('onclick','firstClick()')

const desText_first = 'Here, the dashboard has collated data of temperature rises and CO<sub>2</sub> emissions at every country level, visualised on a global map.<br>These data are extracted with an approximate intervals of 10-years , specifically 1990, 2000, 2010 & 2019.<br> Natural Disasters frequencies are also collected for each individual countries, with data dating back as early as 1980 to 2021.'
const RefText_first = 'Data are retrieved from the International Monetary Fund Climate Change Datasets'
function firstClick(){
    ref.transition()
    .duration(1000)
    .style('opacity','0')
    .on('end',()=>{
        ref.html(RefText_first)
        .transition()
        .duration(1000)
        .style('opacity','0.9')
    })

    des.transition()
    .duration(1000)
    .style('opacity','0')
    .on('end',() => {
        des.html(desText_first)
        .transition()
        .duration(1000)
        .style('opacity','0.9')
    })

    button.attr('onclick','secondClick()')
}


const desText_second  = 'Users can play around with the parameters (Year, Map Scales) and dive down into each individual countries for their natural disaster frequencies.<br>From there, users can derive their own conclusions based on the data provided. Do note the dataset given might not be fully exhaustive and comprehensive.<br>It serves to give a rough overview of the global climate change based on a few of the many factors through, most importantly, the means of a narrative visualisation.'
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
}