<script>
    import { toastState } from "$lib/state/toast.svelte";
    import { onMount } from "svelte";
    import { Pagination, Toaster } from "$lib/components/ui";
    import Toolbar from "$lib/components/usuarios/Toolbar.svelte";
    import { deserialize } from "$app/forms";
    import { fade } from "svelte/transition";

    const { data } = $props();

    let users = $state(data.users);
    let pagination = $state(data.pagination);
    let isLoading = $state(false);

    let searchState = {
        timeout: null,
        controller: null,
        query: null,
    };

    function sort(key) {
        console.log(key);
    }

    function editUser(id) {
        console.log(id);
    }

    function deleteUser(id) {
        console.log(id);
    }

    async function handlePageChange(page) {
        isLoading = true;

        try {
            const params = new FormData();
            params.append("page", page);
            params.append("size", 10);
            params.append("sort", "id,asc");
            params.append("nome", searchState.query || "");
            params.append("email", searchState.query || "");
            params.append("telefone", searchState.query || "");
            params.append("cpf", searchState.query || "");

            const response = await fetch("?/search", {
                method: "POST",
                body: params,
            });

            const result = deserialize(await response.text());
            if (result.type === "success") {
                users = result.data.users;
                pagination = result.data.pagination;
            } else {
                toastState.error(result.data.error);
            }
        } catch (error) {
            toastState.error(error.message);
        } finally {
            isLoading = false;
        }
    }

    async function handleSearchInput(event) {
        isLoading = true;

        if (searchState.timeout) {
            clearTimeout(searchState.timeout);
            searchState.timeout = null;
        }
        if (searchState.controller) {
            searchState.controller.abort();
            searchState.controller = null;
        }

        searchState.query = event.target.value.trim();
        searchState.timeout = setTimeout(async () => {
            try {
                const params = new FormData();
                params.append("page", 0); // reset page to 0
                params.append("size", pagination.itemsPerPage);
                params.append("sort", "id,asc");
                params.append("nome", searchState.query || "");
                params.append("email", searchState.query || "");
                params.append("telefone", searchState.query || "");
                params.append("cpf", searchState.query || "");

                searchState.controller = new AbortController();
                const response = await fetch("?/search", {
                    method: "POST",
                    body: params,
                    signal: searchState.controller.signal,
                });
                const result = deserialize(await response.text());

                if (result.type === "success") {
                    users = result.data.users;
                    pagination = result.data.pagination;
                } else {
                    toastState.error(result.data.error);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    toastState.error(error.message);
                }
            } finally {
                isLoading = false;
            }
        }, 250);
    }

    onMount(async () => {
        if (data.error) {
            toastState.error(data.error);
        }
    });
</script>

<Toaster />
<Toolbar onSearchInput={handleSearchInput} />

<div class="content-wrapper">
    <!-- Table -->
    <div class="table-container" class:loading={isLoading}>
        <table>
            <thead>
                <tr>
                    <th onclick={() => sort("id")}>#</th>
                    <th onclick={() => sort("name")}>Nome</th>
                    <th onclick={() => sort("cpf")}>CPF</th>
                    <th onclick={() => sort("email")}>Email</th>
                    <th onclick={() => sort("phone")}>Telefone</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {#each users as user, index (index)}
                    <tr>
                        <td>{user.id}</td>
                        <td
                            >{user.name}
                            {#if user.id === data.session.user.id}
                                <span class="text-muted">(Você)</span>{/if}</td
                        >
                        <td>{user.cpf}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                            {#if user.id !== data.session.user.id}
                                <div class="action-btns">
                                    <button
                                        title="Editar"
                                        class="btn-icon"
                                        onclick={() => editUser(user.id)}
                                        icon="edit"
                                        ><i class="fa-solid fa-pen-to-square"
                                        ></i></button
                                    >
                                    <button
                                        title="Excluir"
                                        class="btn-icon delete"
                                        onclick={() => deleteUser(user.id)}
                                        icon="trash"
                                        ><i class="fa-solid fa-trash"
                                        ></i></button
                                    >
                                </div>
                            {/if}
                        </td>
                    </tr>
                {/each}

                {#if !users?.length}
                    <tr>
                        <td colspan="6" class="no-data"
                            >Nenhum resultado encontrado.</td
                        >
                    </tr>
                {/if}
            </tbody>
        </table>

        <Pagination
            totalItems={pagination.totalItems}
            currentPage={pagination.currentPage}
            itemsPerPage={pagination.itemsPerPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
        />

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
    .text-muted {
        color: #6c757d;
        text-decoration: italic;
    }

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
    table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    thead {
        background: rgba(59, 130, 246, 0.1);
    }

    th {
        padding: 12px 14px;
        text-align: left;
        font-weight: 600;
        color: #3b82f6;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-align: center;
    }

    th:nth-child(1) {
        width: 55px;
    } /* # */
    th:nth-child(2) {
        width: auto;
    } /* Nome */
    th:nth-child(3) {
        width: 150px;
    } /* CPF */
    th:nth-child(4) {
        width: auto;
    } /* Email */
    th:nth-child(5) {
        width: 180px;
    } /* Telefone */
    th:nth-child(6) {
        width: 110px;
    } /* Ações */

    td {
        padding: 12px 14px;
        border-top: 1px solid rgba(59, 130, 246, 0.1);
        color: #cbd5e1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }

    td.no-data {
        color: #94a3b8;
        padding: 20px;
        font-style: italic;
        font-size: 14px;
        text-align: center;
        opacity: 0.8;
    }

    tbody tr {
        transition: all 0.3s;
    }

    tbody tr:hover {
        background: rgba(59, 130, 246, 0.05);
    }

    /* Disable hover effect while loading */
    .table-container.loading tbody tr:hover {
        background: transparent;
    }

    .action-btns {
        display: flex;
        gap: 8px;
        justify-content: center;
    }

    .btn-icon {
        padding: 8px;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 8px;
        cursor: pointer;
        color: #3b82f6;
        transition: all 0.3s;
    }

    .btn-icon:hover {
        background: rgba(59, 130, 246, 0.2);
        transform: scale(1.1);
    }

    .btn-icon.delete {
        color: #ef4444;
        border-color: rgba(239, 68, 68, 0.3);
    }

    .btn-icon.delete:hover {
        background: rgba(239, 68, 68, 0.1);
    }

    /* Responsivo */
    @media (max-width: 768px) {
        table {
            font-size: 12px;
        }

        th,
        td {
            padding: 12px 10px;
        }

        .spinner {
            width: 50px;
            height: 50px;
        }
    }
</style>
