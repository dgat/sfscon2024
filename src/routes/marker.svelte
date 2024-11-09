<script>
    import { Marker, Popup } from "svelte-maplibre";
    let { color, number, lngLat, task, onSelect } = $props();
</script>

<Marker
    {lngLat}
    class="{color} grid h-6 w-6 place-items-center rounded-full border border-gray-200  text-black shadow-2xl focus:outline-2 focus:outline-black"
>
    <span
        class="text-black pt-2 font-bold text-base"
        ondblclick={onSelect}
        role="button"
        tabindex="0">{number}</span
    >

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
