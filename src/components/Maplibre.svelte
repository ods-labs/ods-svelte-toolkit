<svelte:head>
    <link href='https://unpkg.com/maplibre-gl@2.0.1/dist/maplibre-gl.css' rel='stylesheet' />
</svelte:head>

<script>
    import maplibregl from 'maplibre-gl';
    import {onMount, setContext} from "svelte";

    let mapHTMLElement;
    let map;
    setContext('map', {
        getMap: () => map
    });

    const initMap = (element) => {
        map = new maplibregl.Map({
            container: element,
            style: "https://api.jawg.io/styles/jawg-light.json?access-token=4cKtE4Rze1HrvxWa9a7mdolSk10lVThTFC8zadQYMIMxTjkpTeIDJAAmhReDGnCH",
            zoom: 5.5,
            center: [2.700748,46.893575]
        })
    }

    onMount(() => {
        initMap(mapHTMLElement);

        return {
            destroy() {
                map.destroy();
            }
        };
    })
</script>

<div bind:this={mapHTMLElement}>
    {#if map}
        <slot />
    {/if}
</div>

<style lang="scss">
  div {
    height: 100%;
    width: 100%;
  }
</style>