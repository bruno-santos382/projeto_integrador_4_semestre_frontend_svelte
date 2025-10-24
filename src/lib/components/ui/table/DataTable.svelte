<script>
    import { fade } from "svelte/transition";

    const {
        initialData,
        columns,
        fetchItems,
        pagination = true,
        pageSize = 10,
        toolbar = null,
        defaultSort = { key: null, order: "asc" },
        ...cellRenderers
    } = $props();

    import Grid from "./Grid.svelte";
    import Paginator from "./Paginator.svelte";
    import Toolbar from "./Toolbar.svelte";

    let items = $state(initialData?.items || []);
    let totalItems = $state(initialData?.total || 0);
    let isLoading = $state(false);
    let currentPage = $state(1);
    let searchText = $state("");
    let sortBy = $state(defaultSort);
    let searchTimer = null;

    const loadItems = async () => {
        const result = await fetchItems?.({
            page: currentPage,
            size: pageSize,
            search: searchText,
            sort: sortBy,
        });

        if (result?.items instanceof Array) {
            items = result.items;
            totalItems = result.total;
        }
    };

    const reloadData = async (delay = 0) => {
        if (searchTimer) {
            clearTimeout(searchTimer);
            searchTimer = null;
        }

        isLoading = true;

        if (delay > 0) {
            searchTimer = setTimeout(async () => {
                await loadItems();
                isLoading = false;
            }, delay);
        } else {
            await loadItems();
            isLoading = false;
        }
    };

    const handlePageChange = async (page) => {
        currentPage = page;
        reloadData();
    };

    const handleSort = (key, order) => {
        sortBy = { key, order };
        reloadData();
    };

    const handleSearch = async (search) => {
        currentPage = 1;
        searchText = search;
        reloadData(250);
    };
</script>

<Toolbar onSearch={handleSearch} {toolbar} />

<div class="content-wrapper">
    <!-- Table -->
    <div class="table-container" class:loading={isLoading}>
        <Grid {columns} {items} {cellRenderers} onSort={handleSort} />

        {#if pagination}
            <Paginator
                {totalItems}
                {currentPage}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
            />
        {/if}

        {#if isLoading}
            <div
                class="loading-overlay"
                in:fade={{ duration: 100 }}
                out:fade={{ duration: 300 }}
            >
                <div class="spinner"></div>
            </div>
        {/if}
    </div>
</div>


<style>
    /* Table */
    .table-container {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid rgba(59, 130, 246, 0.2);
        overflow-x: auto;
        position: relative;
    }

    .content-wrapper:has(.loading-overlay) {
        pointer-events: none;
    }
    /* Loading overlay - simplified */
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(15, 23, 42, 0.2);
        backdrop-filter: blur(2px);
        border-radius: 15px;
        z-index: 1000;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 2px solid rgba(59, 130, 246, 0.15);
        border-top-color: rgba(59, 130, 246, 0.6);
        border-radius: 50%;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
   
    /* Responsivo */
    @media (max-width: 768px) {
        .spinner {
            width: 50px;
            height: 50px;
        }
    }
</style>
