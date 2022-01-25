<script>
    import Map from "ol/Map";
    import {onMount, setContext} from "svelte";
    import {View} from "ol";
    import {DragRotateAndZoom} from "ol/interaction";

    let htmlElement;
    let context = {
        map: undefined,
        addLayer: (layer) => {
            console.log("call to context.addlayer");
            context.map.addLayer(layer);
        },
        removeLayer: (layer) => context.map.removeLayer(layer),
    }
    setContext('map', context);

    onMount(() => {
        console.log("call to new Map");
        context.map = new Map({
            target: htmlElement,
            view: new View()
        });
        context.map.addInteraction(new DragRotateAndZoom());
    });
</script>

<div bind:this={htmlElement}>
    {#if htmlElement}
    <slot/>
    {/if}
</div>

<style>
    div {
        width: 100%;
        height: 100%;
    }
</style>