<script>
    import { MapLibre, GeoJSON, FillLayer } from "svelte-maplibre";
    import { onMount } from "svelte";
    import { parse_tasks } from "$lib/task";
    import Marker from "./marker.svelte";
    import Legende from "./legende.svelte";
    import HospitalMarker from "./hospital_marker.svelte";

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
        TRIENT: "bg-purple-300",
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
</script>

<div class="h-screen flex flex-col">
    <h1 class="text-2xl text-center p-4">Welcome to MedRide</h1>
    <div class="main-section grid grid-cols-4 flex-1">
        <div class="warenkorb-section p-4">
            <Legende colors={hospitalsColors}></Legende>
        </div>
        <div class="mid-section col-span-2 flex flex-col">
            <div class="map-section flex-1">
                <MapLibre
                    style="https://tiles.versatiles.org/assets/styles/colorful.json"
                    class="w-full h-full"
                    standardControls
                    zoom={7}
                    center={[11.33982, 46.49067]}
                    bounds={[
                        [10.3, 47.08],
                        [12.52, 46.25],
                    ]}
                    minZoom={8}
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
                        <Marker
                            lngLat={task.startCoordinates}
                            color={hospitalsColors[task.endPlace]}
                            number={task.endTime - time}
                            {task}
                        ></Marker>
                    {/each}
                </MapLibre>
            </div>
            <div class="slider-section py-6">
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
            </div>
        </div>
        <div class="transport-section"></div>
    </div>
</div>
