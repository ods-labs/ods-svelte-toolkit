<script>
    import {getContext, onDestroy, onMount} from "svelte";
    import TileLayer from "ol/layer/Tile";
    import OSM from "ol/source/OSM";
    import {XYZ} from "ol/source";

    let { map, addLayer, removeLayer } = getContext('map');

    export let title = 'layer';
    export let visible = true;
    export let opacity = 1;
    export let type = 'base';
    export let source = undefined;

    let layer;

    if (!source) {
        console.log("TileLayer will be OSM()");
        layer = new TileLayer({
            title,
            visible,
            opacity,
            type,
            source: new OSM()
        })
    } else {
        console.log(`TileLayer will be ${typeof source === "string" ? "XYZ" : source}`);
        layer = new TileLayer({
            title,
            visible,
            opacity,
            type,
            source: typeof source === "string" ? new XYZ({ url: source }) : source,
    });
    }

    onMount(() => {
        addLayer(layer);
    })

    onDestroy(() => {
        removeLayer(layer);
    })
</script>