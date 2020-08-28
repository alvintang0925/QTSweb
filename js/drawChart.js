var bar_chart;
var line_chart;
var best_line_chart;
var ctx;
var ctx2;
var ctx3;

function quickSort(arr) {
    
    if (arr.length <= 1) {
        return arr;
    }

    const less = [];
    const greater = [];
    const pivot = arr[arr.length - 1];
    for (let i = 0; i < arr.length - 1; ++i) {
        const num = arr[i];
        if (num.trend < pivot.trend) {
        less.push(num);
        } else {
        greater.push(num);
        }
    }

    return [...quickSort(less), pivot, ...quickSort(greater)];
}

function drawChart(best_answer, stock){

    var best_name = "";
            for(var j = 0; j < best_answer.counter; j++){
                best_name += company_name[best_answer.locate[j]];
                best_name += ", ";
            }
            
            var day_label = [];
            for(var j = 0; j < DAYNUMBER; j++){
                day_label.push("day "+(j+1));
            }



            var color = getRandomColor();

            var dataset = [];

            color = getRandomColor();
            
            dataset.push({
                label : "best : " + best_answer.company_name,
                    lineTension : 0,
                    backgroundColor : "#FF0000",
                    borderColor : "#FF0000",
                    borderWidth : 3,
                    data: best_answer.totalMoney,
                    fill : false,
                    yAxisID: 'y-axis-1',
            });

            for(var j = 0; j < COMPANYNUMBER; j++){
                color = getRandomColor();
                dataset.push({
                    label : stock[j].company_name,
                    borderDash: [5, 5],
                    lineTension : 0,
                    backgroundColor : color,
                    borderColor : color,
                    borderWidth : 1,
                    data: stock[j].totalMoney,
                    fill : false,
                    pointRadius: 1,
                    yAxisID: 'y-axis-1',
                });
            } 

    

            color = getRandomColor();

            dataset.push({
                label : "趨勢線",
                    lineTension : 0,
                    backgroundColor : color,
                    borderColor : color,
                    borderWidth : 1,
                    data: best_answer.y_line,
                    fill : true,
                    yAxisID: 'y-axis-1',
            });



            color = getRandomColor();



            var lineChartData = {
                labels: day_label,
                datasets: dataset,
            }

            stock = quickSort(stock);
            stock.reverse();
            var neg_stock = [];

            for(var j = 0; j < COMPANYNUMBER; j++){
                if(stock[stock.length - 1].trend < 0){
                    neg_stock.push(stock.pop());
                }
            }

            neg_stock.reverse();

            var dataset2 = [];
            for(var j = 0; j < stock.length; j++){
                color = getRandomColor();
                dataset2.push({
                    label : stock[j].company_name,
                    backgroundColor : color,
                    borderColor : color,
                    borderWidth : 1,
                    data: [stock[j].trend],
                    yAxisID: 'y-axis-1',
                });
            } 

            for(var j = 0; j < neg_stock.length; j++){
                color = getRandomColor();
                dataset2.push({
                    label : neg_stock[j].company_name,
                    backgroundColor : color,
                    borderColor : color,
                    borderWidth : 1,
                    data: [neg_stock[j].trend],
                    yAxisID: 'y-axis-2',
                });
            } 

            
            color = getRandomColor();
            dataset2.push({
                label : "best : " + best_answer.company_name,
                backgroundColor : "#FF0000",
                borderColor : "#FF0000",
                borderWidth : 1,
                data: [best_answer.trend],
                yAxisID: 'y-axis-1',
            });

            
            var barChartData = {
                datasets: dataset2,
            };

            var dataset3 = [];

            color = getRandomColor();
            dataset3.push({
                    label : "best : " + best_answer.company_name,
                    lineTension : 0.4,
                    backgroundColor : "#FF0000",
                    borderColor : "#FF0000",
                    borderWidth : 3,
                    data: best_answer.totalMoney,
                    fill : false,
                    yAxisID: 'y-axis-2',
                });

            for(var j = 0; j < best_answer.counter; j++){
                color = getRandomColor();
                dataset3.push({
                    label : company_name[best_answer.locate[j]],
                    borderDash: [5, 5],
                    lineTension : 0,
                    backgroundColor : color,
                    borderColor : color,
                    borderWidth : 1,
                    data: best_answer.fs[j],
                    fill : false,
                    pointRadius: 1,
                    yAxisID: 'y-axis-1',
                });
            } 

            

            var bestLineChartData = {
                labels: day_label,
                datasets: dataset3,
            }

            

            
            line_chart.destroy();
            line_chart = new Chart(ctx,{
                type: 'line',
                    data: lineChartData,
                    options: {
                        responsive: true,
                        legend:{
                            display: true,
                        },
                        tooltips: {
                            enabled: true
                        },
                        scales: {
                            xAxes: [{
                                display: true
                            }],
                            yAxes: [{
                                type: 'linear',
                                display: true,
                                position: 'left',
                                id: 'y-axis-1',
                            }, 
                            ]
                        },
                    }
            });


            
            best_line_chart.destroy();
            best_line_chart = new Chart(ctx3,{
                type: 'line',
                    data: bestLineChartData,
                    options: {
                        responsive: true,
                        legend:{
                            display: true,
                        },
                        tooltips: {
                            enabled: true
                        },
                        scales: {
                            xAxes: [{
                                display: true
                            }],
                            yAxes: [{
                                type: 'linear',
                                display: true,
                                position: 'left',
                                id: 'y-axis-1',
                            }, {
                                type: 'linear', 
                                display: true,
                                position: 'right',
                                id: 'y-axis-2',

                                // grid line settings
                                gridLines: {
                                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                                },
                            }]
                        },

                    }
            });

                bar_chart.destroy();

                var bar_max = best_answer.trend * 1.3;
                var bar_min = -1 * bar_max;
                if(neg_stock.length != 0){
                    var neg_bar_min = Math.round(neg_stock[neg_stock.length - 1].trend * 1.3 / 1000000) * 1000000;
                    var neg_bar_max = -1 * neg_bar_min;
                }

                bar_chart = new Chart(ctx2,{
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend: {
                        position: 'top',
                    },
                    scales: {
                            xAxes: [{
                                display: true
                            }],
                            yAxes: [{
                                type: 'linear',
                                display: true,
                                position: 'left',
                                ticks: {
                                    min: bar_min,
                                    max: bar_max,
                                },
                                id: 'y-axis-1',
                            }, {
                                type: 'linear', 
                                display: true,
                                position: 'right',
                                ticks: {
                                    min: neg_bar_min,
                                    max: neg_bar_max,
                                },
                                id: 'y-axis-2',
                                // grid line settings
                                gridLines: {
                                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                                },
                            }]
                        },

                    }
                });
}