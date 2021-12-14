var options_pie = {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Fusion devices distribution by configuration'
    },
    subtitle: {
        text: 'Click the slices to view detail by country.'
    },

    accessibility: {
        announceNewData: {
            enabled: true
        },
        // point: {
        //     valueSuffix: '%'
        // }
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y:.0f}'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.0f}</b>'
    },

    series: [
        {
            name: "Configurations",
            colorByPoint: true,
            data: []
        }
    ],
    drilldown: {
        series: []
    }
}
async function drawPieChart() {
    const data_countries = await fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-world/main/machines_by_country.json').then((r)=>r.json());
    var tokamaks = 0;
    var stellarators = 0;
    var inertial = 0;
    var others = 0;
    var data_drilldown_tokamaks = [];
    var data_drilldown_stellarators = [];
    var data_drilldown_inertial = [];
    var data_drilldown_others = [];
    for (var i=0; i < data_countries.length; i++){

        current_country = data_countries[i];

        tokamaks += current_country.tokamak;
        stellarators += current_country.stellarator;
        inertial += current_country.inertial;
        others += current_country.alternate_concept;

        if (current_country.tokamak > 0){
            data_drilldown_tokamaks.push([current_country.country, current_country.tokamak])
        }
        if (current_country.stellarator > 0){
            data_drilldown_stellarators.push([current_country.country, current_country.stellarator])
        }
        if (current_country.inertial > 0){
            data_drilldown_inertial.push([current_country.country, current_country.inertial])
        }
        if (current_country.alternate_concept > 0){
            data_drilldown_others.push([current_country.country, current_country.alternate_concept])
        }
    }

    options_pie.series[0].data = [
        {
            name: "Tokamaks",
            color: "#BA324F",
            y: tokamaks,
            drilldown: "Tokamaks"
        },
        {
            name: "Stellarators",
            color: "#175676",
            y: stellarators,
            drilldown: "Stellarators"
        },
        {
            name: "Inertial",
            color: "#FF7F51",
            y: inertial,
            drilldown: "Inertial"
        },
        {
            name: "Others",
            color: "#4BA3C3",
            y: others,
            drilldown: "Others"
        }
    ]
    options_pie.drilldown.series = [
        {
            name: "Tokamaks",
            id: "Tokamaks",
            data: data_drilldown_tokamaks
        },
        {
            name: "Stellarators",
            id: "Stellarators",
            data: data_drilldown_stellarators
        },
        {
            name: "Inertial",
            id: "Inertial",
            data: data_drilldown_inertial
        },
        {
            name: "Others",
            id: "Others",
            data: data_drilldown_others
        },
    ]

    var pieChart = Highcharts.chart('container_pie_chart', options_pie);
};
drawPieChart();