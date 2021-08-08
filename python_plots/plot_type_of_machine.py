import matplotlib.pyplot as plt
import numpy as np
import json

with open('../tokamaks.json') as f:
    machines = json.load(f)

# by type of machine
plt.figure()

types_labels = ["Tokamaks", "Stellarators", "Inertial", "Others"]
types_machine = ["tokamak", "stellarator", "inertial", "alternate_concept"]
bottom = 0
countries = np.unique([machine["country"] for machine in machines])
for country in countries:
    country_data = []
    for type_machine in types_machine:
        country_data.append(
            len(
                [machine for machine in machines
                 if machine["configuration"] == type_machine and
                    machine["country"] == country]))
    plt.bar(
        types_labels, country_data,
        bottom=bottom, color="tab:blue", edgecolor="white")
    bottom += np.array(country_data)

# by country
plt.figure()

countries = np.unique([machine["country"] for machine in machines])
countries_total = [
    len([machine for machine in machines if machine["country"] == country])
    for country in countries]

countries = [x for _, x in sorted(zip(countries_total, countries))]
countries_total = sorted(countries_total)

tokamaks, stellarators, intertials = [], [], []
left = 0
for type_machine, label in zip(types_machine, types_labels):
    type_data = []
    for country in countries:
        type_data.append(
            len([machine for machine in machines
                 if machine["configuration"] == type_machine and
                 machine["country"] == country]))
    plt.barh(countries, type_data, label=label, left=left)
    left += np.array(type_data)

plt.legend()
plt.tight_layout()
plt.show()
