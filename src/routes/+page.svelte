<script>
    import { MapLibre, GeoJSON, FillLayer, LineLayer } from "svelte-maplibre";
    import { onMount } from "svelte";
    import { parse_tasks } from "$lib/task";
    import { Transport as TP } from "$lib/transport";
    import Marker from "./marker.svelte";
    import Legende from "./legende.svelte";
    import Transport from "./transport.svelte";
    import SelectedTask from "./selected_task.svelte";
    import PlaceholderSvg from "./placeholder_svg.svelte";
    import { getTrip } from "$lib/route";

    let time = $state(0);
    let time_span = $state(60);

    let csvData = $state([]);
    let tasks = $state([]);

    let vehicleType = $state("Undefined");
    let toDirection = $state(false);

    let selectedTasks = $state([]);
    let scheduledTransports = $state([]);

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
        if (toDirection) {
            return tasks.filter(
                (x) =>
                    x.isDate("03.01.2020") &&
                    x.isHinfahrt() &&
                    Math.abs(time - x.getHinfahrtLatestStartTime()) <
                        time_span / 2 &&
                    x.endTime - time > 0,
            );
        }
        return tasks.filter(
            (x) =>
                x.isDate("03.01.2020") &&
                !x.isHinfahrt() &&
                time - x.getStartTime() < time_span / 2 &&
                time - x.getStartTime() > 0,
        );
    }
    let filteredTasks = $derived.by(filterTasks);

    let overlay = $state(null);
    let geometry = $state(null);

    let focusedTransport = $state(null);
    async function onTransportClick(transport) {
        if (focusedTransport === transport) {
            focusedTransport = null;
            geometry = null;
            return;
        }

        let coordinates = [];
        transport.tasks.forEach((t) => coordinates.push(t.startCoordinates));
        transport.tasks.forEach((t) => coordinates.push(t.endCoordinates));

        const uniqueCoordinates = Array.from(
            new Set(coordinates.map((coord) => JSON.stringify(coord))),
        ).map((str) => JSON.parse(str));

        let { duration, route } = await getTrip(uniqueCoordinates).catch(
            (error) => console.error("Error fetching route:", error),
        );
        geometry = route;
        focusedTransport = transport;
    }

    onMount(async () => {
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

    function scheduleTransport() {
        let transport = new TP(vehicleType, [...selectedTasks]);
        scheduledTransports.push(transport);
        selectedTasks = [];
    }
</script>

<div class="h-screen max-h-screen flex flex-col p-2">
    <div class="main-section grid grid-cols-4 flex-1 max-h-full">
        <div
            class="warenkorb-section px-4 overflow-scroll max-h-full flex flex-col"
        >
            <Legende colors={hospitalsColors}></Legende>
            <div class="switch">
                <div class="join flex pt-4">
                    <input
                        class="join-item btn btn-sm flex-1"
                        type="radio"
                        name="to"
                        aria-label="to hospital"
                        bind:group={toDirection}
                        value={true}
                    />
                    <input
                        class="join-item btn btn-sm flex-1"
                        type="radio"
                        name="from"
                        aria-label="from hospital"
                        bind:group={toDirection}
                        value={false}
                    />
                </div>
            </div>
            <div class="selected-tasks mt-8 relative flex-1 flex flex-col">
                <p class="text-lg font-semibold pb-3">Selected Tasks</p>
                <div class="flex flex-col gap-2 flex-1">
                    {#each selectedTasks as task}
                        <SelectedTask {task}></SelectedTask>
                    {/each}
                    {#if selectedTasks.length == 0}
                        <PlaceholderSvg></PlaceholderSvg>
                    {/if}
                </div>
                <div class="sticky bottom-0 left-0 right-0 p-2 bg-white">
                    <select
                        class="select select-bordered w-full mb-2"
                        bind:value={vehicleType}
                    >
                        <option selected>Undefined</option>
                        <option>KTW</option>
                        <option>MFF1</option>
                        <option>MFF2</option>
                        <option>PKW</option>
                    </select>
                    <button
                        onclick={scheduleTransport}
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
                    {#if geometry != null}
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
                        </GeoJSON>{/if}
                    {#each filteredTasks as task (task.id)}
                        <Marker
                            onSelect={() => selectMarker(task)}
                            lngLat={toDirection
                                ? task.startCoordinates
                                : task.endCoordinates}
                            color={hospitalsColors[
                                toDirection ? task.endPlace : task.startPlace
                            ]}
                            number={toDirection
                                ? task.endTime - time
                                : time - task.getStartTime()}
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
            </div>
        </div>
        <div class="transport-section px-4">
            <p class="text-lg font-semibold pb-3">Scheduled Transports</p>
            <div class="flex flex-col gap-2">
                {#each scheduledTransports as transport}
                    <Transport
                        {transport}
                        onclick={() => onTransportClick(transport)}
                        focused={transport == focusedTransport}
                    ></Transport>
                {/each}
            </div>
        </div>
    </div>
</div>
