<script>
    import { MapLibre, DefaultMarker, Popup } from "svelte-maplibre";
    import { onMount } from "svelte";
    import { parse_tasks } from "$lib/task";

    let time = $state(0);
    let time_span = $state(60);

    let csvData = $state([]);
    let tasks = $state([]);

    onMount(async () => {
        const response = await fetch("/api/read-csv");
        if (response.ok) {
            csvData = await response.json();
            tasks = parse_tasks(csvData);
        } else {
            console.error("Failed to load CSV data");
        }
    });

    let markers = [
        { lngLat: [-20, 0], name: "Africa" },
        { lngLat: [0, 0], name: "Prime Meridian" },
        { lngLat: [20, 0], name: "Africa" },
    ];
</script>

<h1 class="text-2xl text-center p-12">Welcome to MedRide</h1>
<MapLibre
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    class="w-full h-96"
    standardControls
    zoom={7}
    center={[11.33982, 46.49067]}
>
    {#each markers as { lngLat, name }}
        <DefaultMarker {lngLat} draggable>
            <Popup offset={[0, -10]}>
                <div class="text-lg font-bold">{name}</div>
            </Popup>
        </DefaultMarker>
    {/each}
</MapLibre>
<input
    type="range"
    min="0"
    max="1440"
    bind:value={time}
    class="range"
    step="5"
/>
<div class="flex w-full justify-between px-2 text-xs">
    {#each { length: 24 } as _, i}
        <span>{i + 1}</span>
    {/each}
</div>
<input
    type="range"
    min="0"
    max="120"
    bind:value={time_span}
    class="range range-xs mt-10"
    step="5"
/>

<div>Current time: {time}+-{time_span / 2}</div>

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
