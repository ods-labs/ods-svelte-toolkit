<script>
    import LayerSwitcher from 'ol-layerswitcher';
    import {getContext, onDestroy, onMount} from "svelte";

    let { map } = getContext('map');

    const layerSwitcher = new LayerSwitcher();

    onMount(() => {
        map.addControl(layerSwitcher);
    })

    onDestroy(() => {
        map.removeControl(layerSwitcher);
    })
</script>
