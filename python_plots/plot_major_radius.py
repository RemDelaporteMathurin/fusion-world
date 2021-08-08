import matplotlib.pyplot as plt
from matplotlib import cm
from matplotlib.colors import Normalize
import json

with open('../tokamaks.json') as f:
    tokamaks = json.load(f)

tokamaks_names = []
radii = []


fig, ax = plt.subplots()

for tokamak in tokamaks:
    if tokamak["configuration"] in ["tokamak", "stellarator"]:
        if "R" in tokamak:
            tokamaks_names.append(tokamak["name"])
            radii.append(float(tokamak["R"]))

tokamaks_names = [
    x for _, x in sorted(zip(radii, tokamaks_names), reverse=True)
    ]
radii = sorted(radii, reverse=True)

pos_x = 0
pos_y = 0
max_x = 40
min_x = 1 + max(radii)
to_right = True
left_or_right = 1
radii_row = []
texts = []
switch = False
for name, radius in zip(tokamaks_names, radii):
    if to_right and pos_x >= max_x:
        offset_y = -(max(radii_row)*1.5 + 2)
        pos_y += offset_y/2
        # pos_x = max_x
        to_right = False
        left_or_right = -1
        radii_row = []
        switch = True
    if not to_right and pos_x <= min_x:
        offset_y = -(max(radii_row)*1.5 + 2)
        pos_y += offset_y/2
        # pos_x = min_x
        to_right = True
        left_or_right = 1
        radii_row = []
        switch = True

    radii_row.append(radius)
    if not switch:
        pos_x += left_or_right*(1 + radius)
    circle = plt.Circle(
        (pos_x, pos_y), radius,
        color=cm.viridis(radius/max(radii)), fill=True)
    ax.add_patch(circle)
    if radius > 1.7:
        text = plt.text(
            pos_x - 0.3*len(name), pos_y, name,
            weight="bold", fontsize=12+radius**4/len(name)**3)
        texts.append(text)
    elif radius > 0.3:
        text = plt.text(
            pos_x - 0.15*len(name), pos_y + radius, name,
            rotation=15)
        texts.append(text)
    elif radius > 0:
        text = plt.text(
            pos_x - 0.15*len(name), pos_y + radius, name,
            rotation=30)
        texts.append(text)

    if switch:
        pos_y += offset_y/2
        switch = False
    else:
        pos_x += left_or_right*radius

# tweak text manually
texts[0].set_fontsize(28)
texts[0].set_position((5, -0.5))

texts[1].set_fontsize(15)
texts[1].set_position((16, -0.5))

texts[2].set_fontsize(16)
texts[2].set_position((29, -0.5))

# texts[5].set_fontsize(16)
# texts[5].set_position((29, -0.5))

ax.set_xlim((0, max_x + 7))
ax.set_ylim((pos_y*1.1, 10))
ax.set_aspect('equal', adjustable='box')
plt.axis('off')

plt.colorbar(
    cm.ScalarMappable(norm=Normalize(0, max(radii)), cmap=cm.viridis),
    label="Major radius (m)")

plt.tight_layout()
plt.show()
