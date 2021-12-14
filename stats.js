var options_bar = {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Number of fusion devices per country'
    },

    yAxis: {
        min: 0,
        title: {
            text: 'Nb devices',
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
            // dataLabels: {
            //     enabled: true
            // },
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
        reversed: true
    },
    credits: {
        enabled: false
    },
};


async function drawBarChart() {
    var countries = [];
    const data_countries = await fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-world/main/machines_by_country.json').then((r)=>r.json());
    // waits until the request completes...
    var series = [
        {
            name: 'Others',
            data: [],
            color: '#4BA3C3',
        },
        {
            name: 'Inertial',
            data: [],
            color: '#FF7F51',
        },
        {
            name: 'Stellarators',
            data: [],
            color: '#175676',
        },
        {
            name: 'Tokamaks',
            data: [],
            color: '#BA324F',

        },

    ];

    data_countries.sort(function (a, b){
        sum_a = a.tokamak + a.stellarator + a.inertial + a.alternate_concept;
        sum_b = b.tokamak + b.stellarator + b.inertial + b.alternate_concept;
        if (sum_a < sum_b) {
            return 1
        } else {
            return -1
        }
    });
    for (var i=0; i < data_countries.length; i++){
        current_country = data_countries[i]
        countries.push(current_country.country);
        for (var j=0; j<series.length; j++){
            switch (series[j].name) {
                case 'Tokamaks':
                    series[j].data.push([current_country.country, current_country.tokamak]);
                    break;
                case 'Stellarators':
                    series[j].data.push([current_country.country, current_country.stellarator]);
                    break;
                case 'Inertial':
                    series[j].data.push([current_country.country, current_country.inertial]);
                    break;
                case 'Others':
                    series[j].data.push([current_country.country, current_country.alternate_concept]);
                    break;
            }
        }
    }
        
    options_bar.series = series;
    options_bar.xAxis = {
            // categories: countries,
            type: 'category',
            title: {
                text: null
            }
        };
    var barChart = Highcharts.chart('container', options_bar);
}

drawBarChart();

async function drawBarChartPrivatePublic() {
    var countries = [];
    const data_countries = await fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-world/main/machines_by_country.json').then((r)=>r.json());
    // waits until the request completes...
    var series = [
        {
            name: 'Private',
            data: [],
            color: '#A799B7',
        },
        {
            name: 'Public',
            data: [],
            color: '#B5C2B7',
        },



    ];

    data_countries.sort(function (a, b){
        sum_a = a.public + a.private;
        sum_b = b.public + b.private;
        if (sum_a < sum_b) {
            return 1
        } else {
            return -1
        }
    });
    for (var i=0; i < data_countries.length; i++){
        current_country = data_countries[i]
        countries.push(current_country.country);
        for (var j=0; j<series.length; j++){
            switch (series[j].name) {
                case 'Public':
                    series[j].data.push([current_country.country, current_country.public]);
                    break;
                case 'Private':
                    series[j].data.push([current_country.country, current_country.private]);
                    break;

            }
        }
    }
    options_bar.series = series;
    options_bar.xAxis = {
            // categories: countries,
            type: 'category',
            title: {
                text: null
            }
        };
    var barChart = Highcharts.chart('container_private_public', options_bar);
}

drawBarChartPrivatePublic();
