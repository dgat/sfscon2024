<script>
    import { MapLibre, Marker, Popup } from "svelte-maplibre";
    import { onMount } from "svelte";
    import { parse_tasks } from "$lib/task";

    let time = $state(0);
    let time_span = $state(60);

    let csvData = $state([]);
    let tasks = $state([]);

    let hospitalsColors = {
        BRIXEN: "bg-red-300",
        BRUNECK: "bg-blue-300",
        BOZEN: "bg-green-300",
        MERAN: "bg-yellow-300",
        SCHLANDERS: "bg-violet-300",
        STERZING: "bg-orange-300",
        INNICHEN: "bg-slate-300",
    };

    function filterTasks() {
        return tasks.filter(
            (x) =>
                x.isDate("03.01.2020") &&
                x.isHinfahrt() &&
                Math.abs(time - x.getHinfahrtLatestStartTime()) <
                    time_span / 2 &&
                x.endTime - time > 0,
        );
    }
    let filteredTasks = $derived.by(filterTasks);

    onMount(async () => {
        const response = await fetch("/api/read-csv");
        if (response.ok) {
            csvData = await response.json();
            tasks = parse_tasks(csvData).filter((x) => x.startCoordinates[0]);
        } else {
            console.error("Failed to load CSV data");
        }
    });
</script>

<h1 class="text-2xl text-center p-12">Welcome to MedRide</h1>
<MapLibre
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    class="w-full h-96"
    standardControls
    zoom={7}
    center={[11.33982, 46.49067]}
>
    {#each filteredTasks as task}
        <Marker
            lngLat={task.startCoordinates}
            class="{hospitalsColors[
                task.endPlace
            ]} grid h-6 w-6 place-items-center rounded-full border border-gray-200  text-black shadow-2xl focus:outline-2 focus:outline-black"
        >
            <span class="text-black">{task.endTime - time}</span>
            <Popup offset={[0, 0]}>
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
        </Marker>
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
