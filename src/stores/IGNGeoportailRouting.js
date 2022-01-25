import {derived, writable} from "svelte/store";

const baseurl = "https://wxs.ign.fr/calcul/geoportail/itineraire/rest/1.0.0/route?resource=bdtopo-pgr&profile=car&optimization=fastest";

// start & end must be lng,lat string
const __getRouting = (start, end, set) => {
    if (start && start.length > 0 && end && end.length > 0) {
        let url = `${baseurl}&start=${start}&end=${end}`;
        fetch(url)
            .then(data => data.json())
            .then(data => {
                console.log(data);
                let geojson = {
                    type: 'FeatureCollection',
                    features: [{
                        "type": "Feature",
                        "properties": {},
                        "geometry": data.geometry
                    }],
                };
                data.geojson = geojson;
                set(data);
            })
    } else {
        set({})
    }
}

class IGNGeoportailRouting {
    constructor() {
        this.start = writable([]);
        this.end = writable([]);
    }

    setStart = (start) => {
        this.start.set(start);
    }

    setEnd = (end) => {
        this.end.set(end);
    }

    resetEnd() {
        this.end.set([]);
    }

    getRouting() {
        return derived(
            [this.start, this.end],
            ([$start, $end], set) => {
                __getRouting($start, $end, set);
            }, {})
    }

}

export default IGNGeoportailRouting;