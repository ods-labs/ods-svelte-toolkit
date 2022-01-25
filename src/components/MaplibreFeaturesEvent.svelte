<script>
    import {createEventDispatcher, getContext, onMount} from "svelte";
    import {Popup} from "maplibre-gl";
    import ejs from "ejs";

    let {getMap} = getContext('map');
    let {layer} = getContext('layer');
    let map = getMap();

    const dispatcher = createEventDispatcher();

    onMount(() => {
        map.on('click', layer, function (e) {
            dispatcher('click', e.features);
        });

        map.on('mouseenter', layer, function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', layer, function () {
            map.getCanvas().style.cursor = '';
        });
    })
</script>