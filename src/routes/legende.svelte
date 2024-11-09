<script>
    let { colors } = $props();
</script>

<div class="grid grid-cols-2 gap-1">
    {#each Object.entries(colors) as [key, value]}
        <div class="flex items-center gap-1 bg-slate-100 rounded-xl p-2">
            <span
                class="h-4 w-4 rounded {value} inline-block border-slate-200 border"
            ></span>
            <span class="text-xs capitalize">{key}</span>
        </div>
    {/each}
</div>
