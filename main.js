var map = L.map('map', {center: [45.8336, 1.2611], zoom: 3});
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 13,
}).addTo(map);

var tokamakStyle = {
    fillColor: '#6E2594',
    color: '#808080',
    radius: 7,
    weight: 1,
    fillOpacity: 0.7
};

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //     layer.bringToFront();
    // }
    info.update(layer.feature.properties);
}
function resetHighlightRadius(e) {
    e.target.setStyle(makeRadiusStyle(e.target.feature));
    info.update();
}
function resetHighlightDefault(e) {
    e.target.setStyle(tokamakStyle);
    info.update();
}
function onEachFeatureAction(base_layer, resetHighlithFunction) {
    function fun(feature, layer) {
        // add data
        base_layer.addLayer(layer)
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlithFunction,
            // click: zoomToFeature
        });
    }
    return fun
}

function pointToLayerAction(feature, latlng) {
    var opt = {...tokamakStyle};

    return L.circleMarker(latlng,opt).bindTooltip(`
        <b>${feature.properties.name}</b>
        <br>
        ${feature.properties.address}
        <br>
        ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}
    `, {direction: 'top', sticky: true})
}

function france_only_pointToLayer(feature, latlng) {
    var opt = {...tokamakStyle};
    if(feature.properties.country == 'France'){

                opt.color = "#0000FF"
                opt.fillColor = "#0000FF"
                opt.radius = 12
    }
    

    return L.circleMarker(latlng,opt).bindTooltip(`
        <b>${feature.properties.name}</b>
        <br>
        ${feature.properties.address}
        <br>
        ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}
    `, {direction: 'top', sticky: true})
}

function getColorRadius(r){
   return r > 4 ? '#FDE425' :
          r > 3  ? '#5DC863' :
          r > 2  ? '#21908C' :
          r > 1  ? '#3B528B' :
                   '#440154';
   }


function makeRadiusStyle(feature){
    var opt = {...tokamakStyle};
    factor = 7
    if (feature.properties.hasOwnProperty('R')){
    console.log("opt.color");
        opt.radius = feature.properties.R*factor
        opt.fillColor = getColorRadius(feature.properties.R)
      console.log(opt.color);

    } else
    {
        opt.radius = 0
    }
    return opt
}
function pointToLayer_radius(feature, latlng) {

    return L.circleMarker(latlng,makeRadiusStyle(feature)).bindTooltip(`
        <b>${feature.properties.name}</b>
        <br>
        ${feature.properties.address}
        <br>
        ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}
    `, {direction: 'top', sticky: true})
}

let default_layer = L.layerGroup().addTo( map )
geojson = fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-machines-locations/main/tokamaks.geojson')
    .then(r => r.json())
    .then(geojson => L.geoJSON(geojson,
                {
                    onEachFeature: onEachFeatureAction(default_layer, resetHighlightDefault),
                    pointToLayer: pointToLayerAction
                }));

let based_on_radius = L.layerGroup()
geojson = fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-machines-locations/main/tokamaks.geojson')
    .then(r => r.json())
    .then(geojson => L.geoJSON(geojson,
                {
                    onEachFeature: onEachFeatureAction(based_on_radius, resetHighlightRadius),
                    pointToLayer: pointToLayer_radius,
                }));

/* Create layer control */
let layerControl = {
    "Default": default_layer,
    "Major radius": based_on_radius,
}

L.control.layers(layerControl, null, {collapsed:false}).addTo( map )


// add a legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4],
    labels = ['<strong> R (m) </strong>'],
    from, to;

for (var i = grades.length - 1; i >= 0; i--) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
        '<i style="background:' + getColorRadius(from + 1) + '"></i> ' +
        from + (to - 1? '&ndash;' + to : '+'));
}

div.innerHTML = labels.join('<br>');
return div;
};

// make the legend appear or disappear
map.on('baselayerchange', function (eventLayer) {
    // Switch to the Population legend...
    if (eventLayer.name === 'Major radius') {
        legend.addTo(this);
    } else {
        this.removeControl(legend);
    }
});

// info control
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Reactor info</h4>' +  (props ?
        '<b>' + props.name + '</b><br /> Major radius ' + props.R + ' m'
        : 'Hover over a reactor');
};

info.addTo(map);