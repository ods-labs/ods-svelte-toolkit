# Opendatasoft Svelte ToolKit

## Components

- [Spinner.svelte](./src/components/Spinner.svelte) : a spinner, that spins when `loading` equals true

Usage :

```html
<Spinner spin={loading}></Spinner>
```

### Map with Maplibre

- [Maplibre](./src/components/Maplibre.svelte) : create Maplibre instance
- [MaplibreSource](./src/components/MaplibreSource.svelte) : addSource to the map, from `data` GeoJson param
- [MaplibreStyleLayer](./src/components/MaplibreStyleLayer.svelte) : addLayer style to the parent source
- [MaplibrePopup](./src/components/MaplibrePopup.svelte) : add a Popup on features, taking an HTML template (with !%- property_name %! keys)
- [MaplibreFeaturesEvent](./src/components/MaplibreFeaturesEvent.svelte) : dispatch a click event from features click

Usage with popup :

```html
<div class="map-container">
    <Maplibre>
        <MaplibreSource name="data" data={$geojson}>
            <MaplibreStyleLayer name="datastyle">
                <MaplibrePopup>
                    <h3 style="margin-top: 6px">!%- insnom %!</h3>
                    <p>!%- comlib %!</p>
                    <ul>
                        <li>!%- equipementtypelib %!</li>
                        <li>!%- famille_type_d_equipement %!</li>
                    </ul>
                </MaplibrePopup>
            </MaplibreStyleLayer>
        </MaplibreSource>
    </Maplibre>
</div>
```

Usage with click handler on features :

```html
<div class="map-container">
    <Maplibre>
        <MaplibreSource name="data" data={$geojson}>
            <MaplibreStyleLayer name="datastyle">
                <MaplibreFeaturesEvent on:click={clickOnFeatures}></MaplibreFeaturesEvent>
            </MaplibreStyleLayer>
        </MaplibreSource>
    </Maplibre>
</div>
```

### Map with Openlayers

- [OLMap.svelte](./src/components/OLMap.svelte) : create en Openlayers map instance
- [OLMapView.svelte](./src/components/OLMapView.svelte) : set a map view
- [OLMapTileLayer.svelte](./src/components/OLMapTileLayer.svelte) : set a basemap, from XYZ url, or by default OSM
- [OLMapboxStyleLayer.svelte](./src/components/OLMapboxStyleLayer.svelte) : set a basemap from Mapbox style url
- [OLDataLayer.svelte](./src/components/OLDataLayer.svelte) : add a data layer
- [OLLayerSwitcher.svelte](./src/components/OLLayerSwitcher.svelte) : add a basemap layer switcher
- [OLOverlay.svelte](./src/components/OLOverlay.svelte) : add an overlay (ie. popup) on features click

Usage :

```html
<div class="map-container">
    <OLMap>
        <!-- View -->
        <OLMapView initialCenterLonLat={[2.0, 48.0]} initialZoom="6"></OLMapView>

        <!-- Basemaps -->
        <OLMapboxStyleLayer title="Jawg light" style={jawgstyle}/>
            <OLMapTileLayer title="OSM default"></OLMapTileLayer>
            <OLMapTileLayer title="ESRI" source={esri_basemap_url}/>
                <OLLayerSwitcher/>

                <!-- Data -->
                <OLDataLayer data={geojson}></OLDataLayer>

                <!-- Popup -->
                <OLOverlay title="equnom"/>
    </OLMap>
</div>
```

## Stores

- [DatasetStore.js](./src/stores/DatasetStore.js) : ODS API V2 store, to call endpoint and get the result

```html
<script>
    let data = new DatasetStore("mydomain", "mydataset");
    let records = data.getRecordsStore();
    let facet = data.getFacetStore("myfacetid");
    let geojson = data.getGeojsonExport();
</script>

<div>
    {#each $data as record}
    {record}
    {/each}

    {JSON.stringify($facet)}
</div>
```

- [IGNGeoportailRouting.js](./src/stores/IGNGeoportailRouting.js) : IGNGeoportailRouting, easily get the routing path
  between 2 coordinates

Usage :

```html
<script>
    let routing = new IGNGeoportailRouting();
    let dist = routing.getRouting();

    routing.setStart([2, 48]);
    routing.setEnd([3, 50]);
</script>
<div>
    {#if $dist.duration}
      <h4>Routing :</h4>
      <p>{$dist.duration.toLocaleString()} {$dist.timeUnit}</p>
      <p>{$dist.distance.toLocaleString()} {$dist.distanceUnit}</p>
      <button on:click={() => {routing.resetEnd()}}>Clear routing</button>
    {/if}
</div>
```

## Utilities

### Chart.js

- createChart : Chart.js helper to create a new chart 
- updateChart : update the data of a Chart.js instance

### ODS API V2

- getDatasets : get datasets from /catalog
- getRecords : get records from /catalog/datasets/records
- getGeojson : get geojson from /catalog/datasets/export
- getAggregates : get an aggregation from /catalog/datasets/records 
- getFacets : get a facet from /catalog/datasets/facets/facet
