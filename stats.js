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

function mapOrder (array, order, key) {
  
    array.sort( function (a, b) {
      var A = a[key], B = b[key];
      
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
      
    });
    
    return array;
  };

async function drawBarChart() {
    var countries = [];
    const data_countries = await fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-world/stats/machines_by_country.json').then((r)=>r.json());
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
    var sort_array = [];
    for (var i=0; i < data_countries.length; i++){
        current_country = data_countries[i];
        sum_devices = current_country.tokamak + current_country.stellarator + current_country.inertial + current_country.alternate_concept;
        sort_array.push(sum_devices);
        current_country.sum_devices = sum_devices;
    }
    console.log(sort_array.sort(function (a, b){
        if (a < b) {
            return 1
        } else {
            return -1
        }
    }));
    // console.log(sort_array);

    data_countries_sort = mapOrder(data_countries, sort_array, 'sum_devices');

    for (var i=0; i < data_countries_sort.length; i++){
        current_country = data_countries_sort[i]
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
        
    options.series = series;
    options.xAxis = {
            // categories: countries,
            type: 'category',
            title: {
                text: null
            }
        };
    var barChart = Highcharts.chart('container', options);
}

drawBarChart();
