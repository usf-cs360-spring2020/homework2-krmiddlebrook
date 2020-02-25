// location of data file
let bar_csv = 'data/volume_of_passengers_by_boarding_area.csv';



// append the svg object to the body of the page
let bar_svg = d3.select('body').select("#bar_chart")
    .append("svg")
        .attr("class", "my_svg")
        .attr("width", config.svg.width+20)
        .attr("height", config.svg.height+20);

let bar_plot = bar_svg.append("g")
        .attr("id", "plot")
        .attr("transform",  translate(config.plot.x, config.plot.y));

let bar_rec = bar_plot.append("rect")
        .attr('id', 'background')
        .attr('width', config.plot.width)
        .attr('height', config.plot.height);



//get data
d3.csv(bar_csv)
    .then((data) => {
        return data.map((d) => {
            d['Avg Passenger Count'] = +d['Avg Passenger Count'];
            return d;
        });
    })
    .then((data) => {
        data = data.sort(function(a, b) { return d3.ascending(a['Avg Passenger Count'], b['Avg Passenger Count']) });
        let x = d3.scaleLinear().rangeRound([0, config.plot.width]);
        let y = d3.scaleBand().range([0, config.plot.height]).padding(0.1);
        x.domain([0, d3.max(data, (d) => { return d['Avg Passenger Count']; } )]).nice();
        y.domain(data.map((d) => { return d['Boarding Group']; }));
        
        let xAxis = bar_plot.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', translate(0, config.plot.height))
            .call(d3.axisBottom(x).ticks(11, 's'));
        
        let yAxis = bar_plot.append('g')
                .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y));

        // append the data to the chart
        bar_plot.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
                .attr('class', 'bar')
                .attr('x', x(0))
                .attr('y', (d) => { return y(d['Boarding Group']); })
                .attr('width', (d) => { return x(d['Avg Passenger Count']); })
                .attr('height', y.bandwidth())
                .style('fill', "#4D79A7");
        
        // x axis title
        bar_plot.append('g')
            .append("text")             
            .attr("transform", translate(config.plot.width/2, config.plot.height + config.plot.y + 20))
            .style("text-anchor", "middle")
            .text("Avg. Passenger Count");
        
        //  y axis title
        bar_plot.append('g')
            .append("text")             
            .attr("transform", translate(config.margin.top, config.plot.y-10))
            .style("text-anchor", "middle")
            .text("Boarding Group");
    });



function convertRows(row) {
    return row.map((row) => {
        d['Avg Passenger Count'] = +d['Avg Passenger Count'];
    });
    
    // for (let col in row) {
    //     switch (col) {
    //         case 'Boarding Area':
    //             out.values.boarding_group = row[col];
    //             break;
            
    //         case 'Avg Passenger Count':
    //             out.values.avg_ct = +row[col];
    //             break;
    //     }
    // }
    // console.log(out);
    console.log(row["Avg Passenger Count"]);
    return out;
}

function buildBars(data) {
    console.log("buildBars");
}





// helper method to make translating easier
function translate(x, y) {
    return 'translate(' + x + ',' + y + ')';
}