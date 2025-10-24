<script>
    import DataTable from "$lib/components/ui/table/DataTable.svelte";
	import { SvelteURLSearchParams } from 'svelte/reactivity';
    
    let columns = $state([
        { key: "id", label: "#" },
        { key: "title", label: "Titulo" },
        { key: "body", label: "Corpo" },
    ]);

    let abortController = null;
   
    const fetchItems = async ({ page, size, search, sort }) => {
        const params = new SvelteURLSearchParams();
        params.set("_page", page);
        params.set("_limit", size);
        if (search) params.set("q", search);
        if (sort) params.set("_sort", sort.key);
        if (sort) params.set("_order", sort.order);

        abortController?.abort();
        abortController = new AbortController();

        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?${params.toString()}`,
                { signal: abortController.signal }
            );
            const data = await response.json();
            return { items: data, total: data.length };
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error fetching items:", error);
            }
            return { items: [], total: 0 };
        }
    };
</script>

<DataTable {columns} fetchItems={fetchItems}>
    {#snippet title(post)}
        <span style="color: red">{post.title}</span>
    {/snippet}
</DataTable>

<style>
    :global(body) {
        background-color: #1e293b;
        color: #fff;
    }
</style>