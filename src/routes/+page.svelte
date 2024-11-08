<script>
    import { MapLibre, DefaultMarker, Popup } from "svelte-maplibre";
    import { onMount } from "svelte";

    let csvData = [];

    onMount(async () => {
        const response = await fetch("/api/read-csv");
        if (response.ok) {
            csvData = await response.json();
        } else {
            console.error("Failed to load CSV data");
        }
    });

    let markers = [
        { lngLat: [-20, 0], name: "Africa" },
        { lngLat: [0, 0], name: "Prime Meridian" },
        { lngLat: [20, 0], name: "Africa" },
    ];

    let mapClasses = "w-full h-96";
</script>

<h1 class="text-2xl text-center p-12">Welcome to MedRide</h1>
<MapLibre
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    class={mapClasses}
    standardControls
    zoom={1}
    center={[-20, 0]}
>
    {#each markers as { lngLat, name }}
        <!-- Unlike the custom marker example, default markers do not have mouse events,
    and popups only support the default openOn="click" behavior -->
        <DefaultMarker {lngLat} draggable>
            <Popup offset={[0, -10]}>
                <div class="text-lg font-bold">{name}</div>
            </Popup>
        </DefaultMarker>
    {/each}
</MapLibre>

{#if csvData.length > 0}
    <table>
        <thead>
            <tr>
                {#each Object.keys(csvData[0]) as header}
                    <th>{header}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each csvData as row}
                <tr>
                    {#each Object.values(row) as value}
                        <td>{value}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <p>Loading CSV data...</p>
{/if}
