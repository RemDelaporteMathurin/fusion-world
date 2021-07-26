var options = {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Country repartition of fusion machines'
    },

    yAxis: {
        min: 0,
        title: {
            text: 'Nb machines',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    // tooltip: {
    //     valueSuffix: ' millions'
    // },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            },
        },
        series: {
            dataLabels: {
                formatter: function() {
                  if (this.y) {
                    return this.y;
                  }
                }
            },
            stacking: 'normal'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
};


async function drawBarChart() {
    var countries = [];
    const data_countries = await fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-world/stats/machines_by_country.json').then((r)=>r.json());
    // waits until the request completes...
    var series = [
        {
            name: 'Others',
            data: []
        },
        {
            name: 'Inertial',
            data: []
        },
        {
            name: 'Stellarators',
            data: []
        },
        {
            name: 'Tokamaks',
            data: []
        },

    ];
    for (var i=0; i < data_countries.length; i++){
        countries.push(data_countries[i].country);
        for (var j=0; j<series.length; j++){
            switch (series[j].name) {
                case 'Tokamaks':
                    series[j].data.push(data_countries[i].tokamak);
                    break;
                case 'Stellarators':
                    series[j].data.push(data_countries[i].stellarator);
                    break;
                case 'Inertial':
                    series[j].data.push(data_countries[i].inertial);
                    break;
                case 'Others':
                    series[j].data.push(data_countries[i].alternate_concept);
                    break;
            }
        }
    }
        
    options.series = series;
    options.xAxis = {
            categories: countries,
            title: {
                text: null
            }
        };
    var barChart = Highcharts.chart('container', options);
}

drawBarChart();
