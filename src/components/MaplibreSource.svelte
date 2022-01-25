<script>
    import {getContext, onMount, setContext} from "svelte";
    import mapUtilities from "../utilities/mapUtilities";

    export let name;
    export let data;

    const { getMap } = getContext('map');
    setContext('source', { source: name});

    let map;
    let sourceReady = false;

    onMount(() => {
        map = getMap();
        map.on('load', () => {
            map.addSource(name, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [],
                }
            })
            sourceReady = true;
        })

        return () => {
            const { layers } = map.getStyle();
            layers.forEach((layer) => map.removeLayer(layer.id));
            if (map.getSource(name)) {
                map.removeSource(name);
            }
            sourceReady = false;
        };
    })

    $: if (data && data.features && sourceReady) {
        map.getSource(name).setData(data);
        mapUtilities.fitMapBoundsToGeojsonFeaturesPoint(map, data);
    }
</script>

{#if sourceReady}
    <slot />
{/if}