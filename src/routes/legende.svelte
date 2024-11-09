<script>
    let { colors } = $props();
</script>

<div class="grid grid-cols-2 gap-4">
    {#each Object.entries(colors) as [key, value]}
        <div class="flex items-center gap-2 bg-slate-100 rounded-xl p-2">
            <span class="h-4 w-4 rounded {value} inline-block"></span>
            <span class="text-sm">{key}</span>
        </div>
    {/each}
</div>
