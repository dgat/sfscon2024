<script>
    import { Marker } from "svelte-maplibre";
    let { color, lngLat } = $props();
</script>

<Marker
    {lngLat}
    class="{color} grid h-4 w-4 place-items-center rounded border border-gray-200  text-black shadow-2xl focus:outline-2 focus:outline-black"
></Marker>
