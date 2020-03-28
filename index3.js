//margins and radius
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 1000 - margin.right - margin.left,
    height = 1000 - margin.top - margin.bottom,
    radius = width/2;

var color = d3.scaleOrdinal()
    .range(["#00529B","#FFC422"]);

//Define svg

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate (" + width/2 + "," + height/2 +")");


//import the data


d3.csv("data3.csv").then(function(data) {
    data.forEach(function(d) {
        d.points = +d.points;
        d.team = d.team;
        d.pointsE = +d.pointsE;
        d.PDO = +d.PDO;
        d.GF = +d.GF;
        d.xGF = +d.xGF;
        d.SeasonResult = +d.SeasonResult;
    })
    var key = function(d){ return d.data.label; };

    let team1 = data[0].team;
    let team2 = data[1].team;
    let index = 0;
    for (let key in data[0]) {
        if (key != "team") {
            let temp = [{team: team1, [key]: data[0][key]}, {team: team2, [key]: data[1][key]}];
            pieCharts(temp, index, key)
            index++;
        } else if (key == "team") {
            svg.append("text")
                .attr("class", "team one")
                .attr("text-anchor", "end")
                .attr("x", 475)
                .attr('y', 0)
                .text(data[0][key]);
            svg.append("text")
                .attr("class", "team one")
                .attr("text-anchor", "end")
                .attr("x", -375)
                .attr('y', 0)
                .text(data[1][key]);
        }
    }

})

//Function to draw the pie charts

var pieCharts = function(data, index, key) {
    //actually create the pie charts
    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d[key];
        })

    //Define the arcs, this will define the inner and outer radius of each donut/pie
    var arc =  d3.arc()
        .outerRadius(((index + 1) * 60) - 5)
        .innerRadius(index * 60)

    //Enter and append the pies
    var g = svg.selectAll(".arc" + index)
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc" + index);

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {return color(d.data.team);})


    g.append("text")
        .attr("transform", function(d) {
            if (d.data[key] == 1 && key == "SeasonResult") {
                return "translate(" + arc.centroid(d) + ") translate(0, -40)";
            } else {
                return "translate(" + arc.centroid(d) + ")";
            }
        })
        .attr("dy", ".35em").style("text-anchor", "middle")
        .text(function(d) {
            if (d.data[key] != 0)
                return d.data[key];
            else
                return;
        });

   g.append("text")
       .attr("transform", function(d) {
            if (d.data[key] == 1 && key == "SeasonResult") {
                return "translate(" + arc.centroid(d) + ") translate(0, -20)";
            } else {
                 return "translate(" + arc.centroid(d) + ") translate(0, 20)"
            }
       })
       .attr("dy", ".35em").style("text-anchor", "middle")
       .text(function(d) {
           if (d.data[key] !=0) {
               return key
           } else
               return;
       })


}

