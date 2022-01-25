<script>
    import View from "ol/View";
    import {getContext, onMount} from "svelte";
    import {fromLonLat} from "ol/proj";

    export let initialCenterLonLat;
    export let initialZoom = 3;

    const { map } = getContext('map');

    const view = new View({
        center: fromLonLat(initialCenterLonLat),
        zoom: initialZoom
    });

    onMount(() => {
        map.setView(view);
    });
</script>