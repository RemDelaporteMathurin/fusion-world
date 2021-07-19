
import csv
import json

# Now we create stores.geojson, which is the GeoJSON equivalent of stores.csv
with open('tokamaks2.json') as f:
    stores = json.load(f)

geojson = {
    'type': 'FeatureCollection',
    'features': []
}

for store in stores:
    feature_dict = {
        'type': 'Feature',
        'properties': {
            'country': store['country'],
            'name': store['name'],
            'address': store['address']
        },
        'geometry': {
            'type': 'Point',
            'coordinates': store['coordinates'],
        }
    }
    if "website" in store:
        content = "<a href='" + store["website"] + "'> Website </a>"
        feature_dict['properties']['popupContent'] = content
    geojson["features"].append(feature_dict)

with open('tokamaks.geojson', 'w') as f:
    json.dump(geojson, f, indent=4)
