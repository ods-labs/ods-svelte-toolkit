<script>
    import VectorSource from "ol/source/Vector";
    import VectorLayer from "ol/layer/Vector";
    import {getContext, onMount} from "svelte";
    import {GeoJSON} from "ol/format";

    let { map, addLayer } = getContext('map')

    export let data = undefined;

    let vectorFeatures = [];
    let vectorSource = new VectorSource({
        features: vectorFeatures
    })
    let vectorLayer = new VectorLayer({
        zIndex: 1,
        source: vectorSource
    })

    let geojsonFeatures = [];

    $: if (data) (geojsonFeatures = new GeoJSON().readFeatures(data, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857"
    }));

    $: if (geojsonFeatures.length > 0) {
        vectorSource.clear();
        vectorSource.addFeatures(geojsonFeatures);
        map.getView().fit(vectorSource.getExtent(), {duration: 1000});
    }

    onMount(() => {
        addLayer(vectorLayer);
    })
</script>