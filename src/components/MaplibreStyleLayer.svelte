<script>
    import {getContext, onMount, setContext} from "svelte";

    export let name;
    export let type = 'circle';
    export let paint = {
        'circle-color': '#11b4da',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#000000'
    };

    const { getMap } = getContext('map');
    let { source } = getContext('source');
    setContext('layer', { layer: name});
    let map = getMap();
    let layerCreated = false;

    onMount(() => {
        map.addLayer({
            id: name,
            type,
            source: source,
            paint
        });
        layerCreated = true;

        return () => {
            if (map.getLayer(name)) {
                map.removeLayer(name);
            }
        }
    });
</script>

{#if layerCreated}
    <slot />
{/if}