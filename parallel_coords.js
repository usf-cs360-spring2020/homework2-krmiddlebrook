function drawParallelCoord(csv_path) {
    let dimensions, xAxis, yAxis, color;

    let svg = d3.select('body').select('.parallel_chart')
                .attr('width', config.svg.width)
                .attr('height', config.svg.height)
                .style('background-color', '#F5F5F5')
                .append('g')
                .attr('transform', translate(config.margin.left, config.margin.right))
                
    color = d3.scaleOrdinal()
        .range(["#706EBF", "#BE6C6C" ,"#6BBE6C"])

    d3.csv(csv_path).then(_drawParallelCoord);

    function _drawParallelCoord(data) {
        dimensions = d3.keys(data[0]).filter((d) => {return d != 'type'});
        
        color.domain(d3.extent(data, function(d) { return d['type']; }))

        yAxis = {}
        for (let i in dimensions) {
            yAxis[dimensions[i]] = d3.scaleLinear()
                .domain(d3.extent(data, (d) => { return +d[dimensions[i]] }))
                .range([config.plot.height, config.margin.top])
        }

        xAxis = d3.scalePoint()
            .range([config.margin.left, config.plot.width])
            .padding(0.25)
            .domain(dimensions)

        function path(d) {
            return d3.line()(dimensions.map((p) => {
                return [xAxis(p), yAxis[p](d[p])];
            }));
        }

        // add lines
        svg.selectAll('lines')
            .data(data)
            .enter().append('path')
            .attr('d', path)
            .style('fill', 'none')
            .style('stroke', (d) => {
                return (color(d['type']))
            })
            .style('opacity', 0.5)
            .attr('transform', (d) => {
                return translate(0, config.margin.top);
            })

        // draw axis
        svg.selectAll('x-axis')
            .data(dimensions)
            .enter().append('g')
            .style('stroke', 'black')
            .attr('transform', (d) => { return translate(xAxis(d), config.margin.top); })
            .style('fill', 'none')
            .style('opacity', 0.8)
            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(yAxis[d])); })
            .append("text")
                .attr("class", "text")
                .style("text-anchor", "middle")
                .attr("y", -2)
                .attr("dy", '.71em')
                .text(function(d) { return d; })
                .style("fill", "black")
        

       
        // draw title
        svg
            // .append("g")
            // .attr('transform', translate(config.plot.width/2, config.margin.top/2-3))
            // .attr("class", "text")
            .attr("x", config.plot.width/2 + config.margin.left/2)
            .attr("y", config.margin.top/2 - 3)
            .append('text')
            .text("Parallel coordinates of parent income rank, school tier, percent female, and kid income rank grouped by school type")
            .attr("alignment-baseline","middle")
            .style('font-size', '1em')

        // draw legend
        let legend = svg.append("g")
            .attr("class", "legend")
            .attr('transform', translate(config.plot.width-config.margin.left-config.margin.right, config.plot.height/2 - 10))
            
        legend.append('g').append('text')
            .text("Type")
            .attr("alignment-baseline","middle")
            .style('font-size', '15px')
        
        let types = ['public', 'private non-profit', 'for-profit']
        let keys = d3.map(data, function(d) { return d['type']; }).keys();
        
        legend.selectAll('dots')
            .data(keys)
            .enter().append('g')
            .append('circle')
            .attr('cx', 0)
            .attr('cy', function(d, i) { return 25 + i*25; })
            .attr('r', 7)
            .style('fill', function(d) { return color(d); })
       
        legend.selectAll('keys')
            .data(keys)
            .enter().append('g')
            .append('text')
            .attr('x', 10)
            .attr('y', function(d, i) { return 25 + i*25; })
            .style('fill', function(d) { return color(d); })
            .text(function(d) { return d })
            .attr('text-anchor', 'left')
            .style('alignment-baseline', 'middle')
        
    };  


};

