<script>
    import {getContext} from "svelte";
    import {MapboxVector} from "ol/layer";
    import LayerGroup from "ol/layer/Group";

    const {map} = getContext('map');

    export let title = 'Mapbox basemap';
    export let style = '';
    let layer;
    let group;

    if (style) {
        layer = new MapboxVector({
            styleUrl: style,
            accessToken: '',
        })
        group = new LayerGroup({
            title,
            type: 'base',
            combine: true,
            layers: [layer]
        })
        map.addLayer(group);
    } else {
        console.warn('No Mapbox style to setup.')
    }
</script>