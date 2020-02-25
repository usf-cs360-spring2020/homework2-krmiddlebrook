// location of data file
let csv = 'data/yearly_volume_of_passengers_by_price_category.csv';
let parseDate = d3.timeParse('%Y');

// configuration of svg/plot area
let config = {
    svg: {height: 500, width: 500 * 1.618},
    margin: {
        top:    15,
        right:  35, // leave space for y-axis
        bottom: 40, // leave space for x-axis
        left: 40
    },
    plot: {}
};
config.plot = {
    x: config.margin.left, 
    y: config.margin.top,
    width: config.svg.width - config.margin.left - config.margin.right,
    height: config.svg.height - config.margin.top - config.margin.bottom,
};


// append the svg object to the body of the page
let  svg = d3.select('body').select("#stacked_area")
    .append("svg")
        .attr("class", "my_svg")
        .attr("width", config.svg.width)
        .attr("height", config.svg.height);

let plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + config.plot.x + "," + config.plot.y + ")");

let rec = plot.append("rect")
        .attr('id', 'background')
        .attr('width', config.plot.width)
        .attr('height', config.plot.height);


d3.csv(csv, d => {
        return {
            date: parseDate(d.year_of_date).getFullYear(),
            key: d.price_category_code,
            value: +d.passenger_count
        };
    })
    .then(drawAreaChart);


function drawAreaChart(data) {
    let keys = Array.from(d3.group(data, d => d.key).keys());
    let values = Array.from(d3.rollup(data, ([d]) => d.value, d => d.date, d => d.key));

    let series = d3.stack()
        .keys(keys)
        .value(([, values], key) => values.get(key))
        (values)
    
    // set x and y scale and axis
    let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, config.plot.width]);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
        .range([config.plot.height, 0]);
    
    let area = d3.area()
        .x(d => x(d.data[0]))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
    
    let color = d3.scaleOrdinal()
        .domain(keys)
        .range(['rgb(238,188,135)', 'rgb(152,173,199)']);

    let xAxis = g => g
        .attr("transform", `translate(0,${config.plot.height})`)
        .call(d3.axisBottom(x).ticks(15).tickSizeOuter(0))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y))
    
    let yAxis = g => g
        .call(d3.axisLeft(y).ticks(6, 's'))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y))

    // append the data to the chart
    plot.append('g')
        .selectAll('path')
        .data(series)
        .join('path')
            .attr('fill', ({key}) => color(key))
            .attr('d', area)
            .style('stroke', 'rgb(125,133,144)')
            .style('stroke-width', 1.5)
            .attr('id', "work_please")
        .append("title")
            .text(({key}) => key);
    
    plot.append("g")
        .call(xAxis);
    
    plot.append("g")
        .call(yAxis);   
};