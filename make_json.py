import json
import numpy as np


def make_geojson():
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


def make_json_by_country():
    with open('tokamaks.json') as f:
        machines = json.load(f)

    data_out = []
    types_machine = ["tokamak", "stellarator", "inertial", "alternate_concept"]
    countries = np.unique([machine["country"] for machine in machines])
    for country in countries:
        data_out.append({
            "country": country,
            "tokamak": 0,
            "stellarator": 0,
            "inertial": 0,
            "alternate_concept": 0
        })
        for type_machine in types_machine:
            data_out[-1][type_machine] += len(
                    [machine for machine in machines
                     if machine["configuration"] == type_machine and
                        machine["country"] == country])

    with open('machines_by_country.json', 'w') as f:
        json.dump(data_out, f, indent=4)


if __name__ == "__main__":
    make_geojson()
    make_json_by_country()
