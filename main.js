var map = L.map('map', {center: [45.8336, 1.2611], zoom: 3});
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 13,
}).addTo(map);

var tokamakStyle = {
    fillColor: '#BA324F',
    // fillColor: '#6E2594',
    color: '#808080',
    radius: 7,
    weight: 1,
    fillOpacity: 0.7
};

var stellaratorStyle = {
    fillColor: '#175676',
    color: '#808080',
    radius: 7,
    weight: 1,
    fillOpacity: 0.7
};

var othersStyle = {
    fillColor: '#4BA3C3',
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
function resetHighlightCurrent(e) {
    e.target.setStyle(makeCurrentStyle(e.target.feature));
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

function getColorRadius(r){
   return r > 4 ? '#FDE425' :
          r > 3  ? '#5DC863' :
          r > 2  ? '#21908C' :
          r > 1  ? '#3B528B' :
                   '#440154';
}
function getColorCurrent(r){
    return r > 8 ? '#FDE425' :
           r > 6  ? '#5DC863' :
           r > 4  ? '#21908C' :
           r > 2  ? '#3B528B' :
                    '#440154';
 }

function makeRadiusStyle(feature){
    var opt = {...tokamakStyle};
    factor = 7;
    if (feature.properties.hasOwnProperty('R')){
        opt.radius = feature.properties.R*factor;
        opt.fillColor = getColorRadius(feature.properties.R);
    } else
    {
        opt.radius = 0;
    }
    return opt;
}
function makeCurrentStyle(feature){
    var opt = {...tokamakStyle};
    factor = 7;
    if (feature.properties.hasOwnProperty('IP')){
        opt.radius = feature.properties.IP*factor;
        opt.fillColor = getColorCurrent(feature.properties.IP);
    } else
    {
        opt.radius = 0;
    }
    return opt;
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

function pointToLayer_current(feature, latlng) {

    return L.circleMarker(latlng,makeCurrentStyle(feature)).bindTooltip(`
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
                    filter: function(feature, layer) {
                        switch (feature.properties.configuration) {
                            case 'tokamak':
                            case 'stellarator':
                                return true;
                            default:
                                return false;
                        }
                    }
                }));

let based_on_current = L.layerGroup()
geojson = fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-machines-locations/main/tokamaks.geojson')
    .then(r => r.json())
    .then(geojson => L.geoJSON(geojson,
                {
                    onEachFeature: onEachFeatureAction(based_on_current, resetHighlightCurrent),
                    pointToLayer: pointToLayer_current,
                    filter: function(feature, layer) {
                        switch (feature.properties.configuration) {
                            case 'tokamak':
                            case 'stellarator':
                                return true;
                            default:
                                return false;
                        }
                    }
                }));

let tokamaks = L.layerGroup()
geojson = fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-machines-locations/main/tokamaks.geojson')
    .then(r => r.json())
    .then(geojson => L.geoJSON(geojson,
                {
                    onEachFeature: onEachFeatureAction(tokamaks, resetHighlightDefault),
                    pointToLayer: pointToLayerAction,
                    filter: function(feature, layer) {
                        return feature.properties.configuration == "tokamak"
                    }
                }));

let stellarators = L.layerGroup()
fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-machines-locations/main/tokamaks.geojson')
    .then(r => r.json())
    .then(geojson => L.geoJSON(geojson,
                {
                    onEachFeature: onEachFeatureAction(stellarators, resetHighlightDefault),
                    pointToLayer: function (feature, latlng) {
                    
                        return L.circleMarker(latlng,stellaratorStyle).bindTooltip(`
                            <b>${feature.properties.name}</b>
                            <br>
                            ${feature.properties.address}
                            <br>
                            ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}
                        `, {direction: 'top', sticky: true})
                    },
                    filter: function(feature, layer) {
                        return feature.properties.configuration == "stellarator"
                    }
                }));

let others = L.layerGroup()
fetch('https://raw.githubusercontent.com/RemDelaporteMathurin/fusion-machines-locations/main/tokamaks.geojson')
    .then(r => r.json())
    .then(geojson => L.geoJSON(geojson,
                {
                    onEachFeature: onEachFeatureAction(others, resetHighlightDefault),
                    pointToLayer: function (feature, latlng) {
                    
                        return L.circleMarker(latlng,othersStyle).bindTooltip(`
                            <b>${feature.properties.name}</b>
                            <br>
                            ${feature.properties.address}
                            <br>
                            ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}
                        `, {direction: 'top', sticky: true})
                    },
                    filter: function(feature, layer) {
                        return feature.properties.configuration == "alternate_concept"
                    }
                }));
/* Create layer control */
let layerControl = {
    "Default": default_layer,
    "Major radius": based_on_radius,
    "Plasma Current": based_on_current,
}

let overlayMaps = {
    "Tokamaks": tokamaks,
    "Stellarators": stellarators,
    "Others": others
};

controllayers = L.control.layers(layerControl, overlayMaps, {collapsed:false}).addTo( map );


// add legends

// legend for major radius
var legend_radius = L.control({position: 'bottomright'});

legend_radius.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4],
    labels = ['<strong> R (m) </strong>'],
    from, to;

for (var i = grades.length - 1; i >= 0; i--) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
        '<i style="background:' + getColorRadius(from + 1) + '"></i> ' +
        from + (to ? '&ndash;' + to : '+'));
}

div.innerHTML = labels.join('<br>');
return div;
};

// legend for plasma current
var legend_current = L.control({position: 'bottomright'});

legend_current.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 2, 4, 6, 8],
    labels = ['<strong> IP (MA) </strong>'],
    from, to;

for (var i = grades.length - 1; i >= 0; i--) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
        '<i style="background:' + getColorCurrent(from + 1) + '"></i> ' +
        from + (to - 1? '&ndash;' + to : '+'));
}

div.innerHTML = labels.join('<br>');
return div;
};

// make the legend appear or disappear
map.on('baselayerchange', function (eventLayer) {
    setTimeout(function() {
        map.removeLayer(tokamaks);
    }, 5);
    setTimeout(function() {
        map.removeLayer(stellarators);
    }, 5);
    setTimeout(function() {
        map.removeLayer(others);
    }, 5);
    if (eventLayer.name === 'Major radius') {
        legend_radius.addTo(this);
        this.removeControl(legend_current);
    } else if (eventLayer.name === 'Plasma Current'){
        legend_current.addTo(this);
        this.removeControl(legend_radius);
    } else {
        this.removeControl(legend_radius);
        this.removeControl(legend_current);
    }
});

// removing base layer when adding overlay
map.on('overlayadd', function (eventoverlay) {
    this.removeControl(legend_radius);
    this.removeControl(legend_current);
    setTimeout(function() {
        map.removeLayer(default_layer);
    }, 5);
    setTimeout(function() {
        map.removeLayer(based_on_radius);
    }, 5);
    setTimeout(function() {
        map.removeLayer(based_on_current);
    }, 5);
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
    properties_string = (props ?
        '<b>' + props.name + '</b>' + '<br />' + props.configuration:
        'Hover over a reactor');
    
    // if tokamak or stellarator, display parameters
    if (props && (props.configuration == "tokamak" || props.configuration == "stellarator")){
        properties_string +=
            '<br /> Major radius ' + props.R + ' m' +
            '</b><br /> Minor radius ' + props.r + ' m' +
            '</b><br /> Tor. Magnetic Field ' + props.TF + ' T' +
            '</b><br /> Plasma Current ' + props.IP + ' MA';
        }

    this._div.innerHTML = '<h4>Reactor info</h4>' + properties_string;
};

info.addTo(map);