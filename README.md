# fusion-world
How many nuclear fusion machines are there in the world? :earth_americas:

Where are they located? What technology? How big are they?

Discover the (not so small) world of fusion [here](https://remdelaportemathurin.github.io/fusion-world/)!

## Usage

**Zoom in/out, hover over the machines to get info:**
<img src="https://user-images.githubusercontent.com/40028739/126386321-f133b298-21a5-4f3b-ae59-0cbcece6e3a8.gif" width="500">

**Compare the fusion reactors based on their properties:**
<img src=https://user-images.githubusercontent.com/40028739/126386494-27c7bd2b-0099-4c0a-a848-0dd49986af7c.gif width="500">

**Display only tokamaks or stellarators or the alternate concepts:**
<img src=https://user-images.githubusercontent.com/40028739/126386589-baecb6ee-f227-4639-8e56-b7f5f8e2b86d.gif width="500">

## How to contribute

### Report a bug
Missing a reactor? Have we made a mistake somewhere?

Or maybe you just have a question or noticed a bug!

Please [submit an issue](https://github.com/RemDelaporteMathurin/fusion-world/issues/new) and we'll work this out!  :speech_balloon:

### Contribute to the database!
Any contribution to the database is welcome: add a missing machine, add/correct details about a machine, correct a machine's location...

First, fork this repository.

Then, make the necessary changes to the `tokamaks.json` file which contains all the information about the machines.
If you're adding a new machine, don't forget to specify the mandatory keys `"name"`, `"address"`, `"coordinates"`, `"country"` and `"configuration"`.

Typically, a machine has the following structure:

```python
[
    ....,
    {
        # mandatory keys
        "name": "Regional Tokamak of Brittany",
        "country": "France",
        "address": "Nantes",
        "coordinates": [-1.549333358, 47.216155004], # [Long. , Lat.]
        "configuration": "tokamak",

        # optional keys if applicable
        "R": 1,  # major radius (m)
        "r": 0.3,  # minor radius (m)
        "TF": 0.7,  # toroidal magnetic field (T)
        "IP": 1,  # plasma current (MA)
        "website": "https://www.chateaunantes.fr/en/"
    },
    ....
]
```

Once this is done, run the following [python](https://www.python.org/downloads/) command:
```
python make_json.py
```
This will add the changes to the `tokamaks.geojson` file.
Finally push the changes and [open a pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).

Click [here](https://docs.github.com/en/get-started/quickstart/fork-a-repo) for more details on contributions with Github.


## References
This project is in part based on the FusDIS project available [here](https://nucleus.iaea.org/sites/fusionportal/Pages/FusDIS.aspx).
