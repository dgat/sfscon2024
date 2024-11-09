<script>
    import {
        MapLibre,
        DefaultMarker,
        Popup,
        GeoJSON,
        FillLayer,
    } from "svelte-maplibre";
    import { onMount } from "svelte";
    import { parse_tasks } from "$lib/task";

    let time = $state(0);
    let time_span = $state(60);

    let csvData = $state([]);
    let tasks = $state([]);

    function filterTasks() {
        return tasks.filter(
            (x) =>
                x.isDate("03.01.2020") &&
                x.isHinfahrt() &&
                Math.abs(time - x.startTime) < time_span / 2,
        );
    }
    let filteredTasks = $derived.by(filterTasks);

    let overlay = $state(null);

    onMount(async () => {
        overlay = await fetch("./southtyrol.geojson");
        overlay = await overlay.json();
        const response = await fetch("/api/read-csv");
        if (response.ok) {
            csvData = await response.json();
            tasks = parse_tasks(csvData).filter((x) => x.startCoordinates[0]);
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
    style="https://tiles.versatiles.org/assets/styles/colorful.json"
    class="w-full h-96"
    standardControls
    zoom={7}
    center={[11.33982, 46.49067]}
>
    <GeoJSON id="states" data={overlay} promoteId="STATEFP">
        <FillLayer
            paint={{
                "fill-color": "#000000",
                "fill-opacity": 0.5,
            }}
            beforeLayerType="symbol"
            type="background"
        />
    </GeoJSON>

    {#each filteredTasks as task}
        <script>
            console.log("hi");
        </script>
        <DefaultMarker lngLat={task.startCoordinates}>
            <Popup offset={[0, -10]}>
                <div>
                    <div>Start Time: {task.startTime}</div>
                    <div>End Time: {task.endTime}</div>
                    <div>Duration: {task.getTravelTime()} minutes</div>
                    <div>
                        Start Place: {task.startPlace} ({task.startStreet})
                    </div>
                    <div>End Place: {task.endPlace} ({task.endStreet})</div>
                </div>
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

<div>Number Markers: {filteredTasks.length}</div>
