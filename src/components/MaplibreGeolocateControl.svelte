<script>
    import {createEventDispatcher, getContext, onMount} from "svelte";
    import {GeolocateControl} from "maplibre-gl";

    let {getMap} = getContext('map');
    let map = getMap();

    let geolocate;

    let dispatcher = createEventDispatcher();
    const watchSuccess = (event) => {
        console.log('User moved !', event.coords);
        dispatcher('geolocate', [event.coords.longitude, event.coords.latitude]);
    }

    onMount(() => {
        geolocate = new GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
        map.addControl(geolocate);
        geolocate.on('geolocate', watchSuccess);

        return () => {
            map.removeControl(geolocate);
        }
    })
</script>