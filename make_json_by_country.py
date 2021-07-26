"""This script reads tokamaks.json and sort the machines by country.
The results are written in machines_by_country.json.
"""

import numpy as np
import json

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
