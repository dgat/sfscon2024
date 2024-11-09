<script>
    import { MapLibre, GeoJSON, FillLayer, LineLayer } from "svelte-maplibre";
    import { onMount } from "svelte";
    import { parse_tasks } from "$lib/task";
    import Marker from "./marker.svelte";
    import Legende from "./legende.svelte";
    import SelectedTask from "./selected_task.svelte";
    import { getRoute } from "$lib/route";

    let time = $state(0);
    let time_span = $state(60);

    let csvData = $state([]);
    let tasks = $state([]);

    let selectedTasks = $state([]);

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
    let geometry = $state(null);

    // Example usage with variable parameters
    const coordinates = [
        [
            [11.9421, 46.7975], // Starting point
            [11.65443, 46.71662], // Ending point
        ],
        [
            [11.65443, 46.71662], // Starting point
            [11.33772, 46.49497], // Ending point
        ],
    ];

    onMount(async () => {
        let { duration, route } = await getRoute(coordinates).catch((error) =>
            console.error("Error fetching route:", error),
        );
        geometry = route;
        overlay = await fetch("./southtyrol.geojson");
        overlay = await overlay.json();
        console.log("Overlay:", overlay);
        const response = await fetch("/api/read-csv");
        if (response.ok) {
            csvData = await response.json();
            tasks = parse_tasks(csvData).filter((x) => x.startCoordinates[0]);
        } else {
            console.error("Failed to load CSV data");
        }
    });

    function selectMarker(task) {
        tasks = tasks.filter((t) => t != task);
        selectedTasks.push(task);
    }
</script>

<div class="h-screen max-h-screen flex flex-col p-2">
    <div class="main-section grid grid-cols-4 flex-1 max-h-full">
        <div
            class="warenkorb-section px-4 overflow-scroll max-h-full flex flex-col"
        >
            <Legende colors={hospitalsColors}></Legende>
            <div class="selected-tasks mt-8 relative flex-1">
                <p class="text-lg font-semibold">Selected Tasks</p>
                <div class="flex flex-col gap-2">
                    {#each selectedTasks as task}
                        <SelectedTask {task}></SelectedTask>
                    {/each}
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-2">
                    <button
                        class="btn btn-primary btn-block {selectedTasks.length ==
                        0
                            ? 'btn-disabled'
                            : ''}">Schedule transport</button
                    >
                </div>
            </div>
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
                    let:map
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
                    <GeoJSON id="route" data={geometry}>
                        <LineLayer
                            layout={{
                                "line-cap": "round",
                                "line-join": "round",
                            }}
                            paint={{
                                "line-width": 5,
                                "line-dasharray": [5, 2],
                                "line-color": "#008800",
                                "line-opacity": 0.8,
                            }}
                        />
                    </GeoJSON>
                    {#each filteredTasks as task (task.id)}
                        <Marker
                            onSelect={() => selectMarker(task)}
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
