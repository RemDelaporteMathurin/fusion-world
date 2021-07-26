


async function fetchData() {
    var countries = [];
    const data_countries = await fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-world/stats/machines_by_country.json').then((r)=>r.json());
    // waits until the request completes...
    var series = [{
        name: 'Tokamaks',
        data: []
    }, {
        name: 'Stellarators',
        data: []
    }, {
        name: 'Inertial',
        data: []
    }, {
        name: 'Others',
        data: []
    }];
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

    var barChart = Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Country repartition of fusion machines'
        },
        xAxis: {
            categories: countries,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Population (millions)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
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
        series: series
    });
}

fetchData();
