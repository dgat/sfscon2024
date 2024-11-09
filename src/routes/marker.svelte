<script>
    import { Marker, Popup } from "svelte-maplibre";
    let { color, number, lngLat, task, onSelect } = $props();

    function getOutline(mobilityType) {
        switch (mobilityType) {
            case "KANN GEHEN":
                return "border-2 border-red-500";
            case "STUHL":
                return "border-2 border-blue-500";
            case "LIEGE":
                return "border-2 border-green-500";
            default:
                return "";
        }
    }
</script>

<Marker
    {lngLat}
    class="{color} grid h-6 w-6 place-items-center rounded-full text-black shadow-2xl {getOutline(
        task.type,
    )}"
>
    <span ondblclick={onSelect} role="button" tabindex="0">{number}</span>

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
