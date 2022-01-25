<script>
    import {getContext, onMount} from "svelte";
    import {Popup} from "maplibre-gl";
    import ejs from "ejs";

    export let multiple = false;

    let {getMap} = getContext('map');
    let {layer} = getContext('layer');
    let map = getMap();
    let popupHTMLElement;
    let popupContent;

    onMount(() => {
        map.on('click', layer, function (e) {
            let coordinates;
            popupContent = document.createElement('div');

            e.features.forEach((feature, i) => {
                if (i == 0) {
                    coordinates = feature.geometry.coordinates.slice();
                    // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                }
                if (i >= 1 && !multiple) {
                    return;
                }
                let output = document.createElement('div');
                output.innerHTML = ejs.render(
                    popupHTMLElement.innerHTML,
                    feature.properties,
                    {
                        openDelimiter: '!',
                        closeDelimiter: '!'
                    });
                popupContent.appendChild(output);
            })

            new Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent.innerHTML)
                .addTo(map);
        });

        map.on('mouseenter', layer, function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', layer, function () {
            map.getCanvas().style.cursor = '';
        });
    })
</script>

<div bind:this={popupHTMLElement}>
    <slot/>
</div>

<style>
    :global(.maplibregl-popup-content.mapboxgl-popup-content) {
        max-height: 250px;
        overflow: auto;
    }
</style>