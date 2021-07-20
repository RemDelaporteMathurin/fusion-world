
import csv
import json

# Now we create stores.geojson, which is the GeoJSON equivalent of stores.csv
with open('tokamaks.json') as f:
    stores = json.load(f)

geojson = {
    'type': 'FeatureCollection',
    'features': []
}

for store in stores:
    if 'coordinates' in store:
        feature_dict = {
            'type': 'Feature',
            'properties': {
                'country': store['country'],
                'name': store['name'],
                'address': store['address'],
                "configuration": store["configuration"]
            },
            'geometry': {
                'type': 'Point',
                'coordinates': store['coordinates'],
            }
        }
        if "website" in store:
            content = "<a href='" + store["website"] + "'> Website </a>"
            feature_dict['properties']['popupContent'] = content

        for prop in ["R", "r", "TF", "IP"]:
            if prop in store:
                feature_dict['properties'][prop] = store[prop]
        geojson["features"].append(feature_dict)
    else:
        print(store["name"] + " doesn't have coordinates")

with open('tokamaks.geojson', 'w') as f:
    json.dump(geojson, f, indent=4)
