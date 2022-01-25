import {LngLat, LngLatBounds} from "maplibre-gl";

const fitMapBoundsToGeojsonFeaturesPoint = (map, geojson) => {
    let dataBoundaries = new LngLatBounds();
    geojson.features.forEach((feature) => {
        if (Array.isArray(feature.geometry.coordinates[0])) { // list of coords (line/polygon/...)
            feature.geometry.coordinates.forEach((coords) => {
                dataBoundaries.extend(new LngLat(...coords));
            })
        } else { // single coords (point)
            let coords = feature.geometry.coordinates
            dataBoundaries.extend(new LngLat(...coords));
        }
    })
    map.fitBounds(dataBoundaries, {padding: 50});
}

export default { fitMapBoundsToGeojsonFeaturesPoint }