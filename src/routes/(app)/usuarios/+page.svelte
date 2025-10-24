<script>
    import { toastState } from "$lib/state/toast.svelte";
    import { onMount } from "svelte";
    import {
        Toaster,
        Modal,
        Button,
        Input,
        PasswordInput,
    } from "$lib/components/ui";
    import { deserialize } from "$app/forms";
    import DataTable from "$lib/components/ui/table/DataTable.svelte";
    import { logger } from "$lib/utils/logger";

    const { data } = $props();

    let columns = $state([
        { key: "id", label: "#" },
        { key: "nome", label: "Nome" },
        { key: "cpf", label: "CPF" },
        { key: "email", label: "Email" },
        { key: "telefone", label: "Telefone" },
        { key: "acoes", label: "Ações", sortable: false },
    ]);

    let userModalState = $state({
        isOpen: false,
        userId: null,
        editing: false,
    });

    let abortController = null;
    const fetchUsers = async ({ page, size, search, sort }) => {
        abortController?.abort();
        abortController = new AbortController();

        const params = new FormData();
        params.append("page", page - 1);
        params.append("size", size);
        params.append("sort", `${sort.key},${sort.order}`);
        params.append("nome", search || "");
        params.append("email", search || "");
        params.append("telefone", search || "");
        params.append("cpf", search || "");

        try {
            const response = await fetch("?/search", {
                method: "POST",
                body: params,
            });
            const result = deserialize(await response.text());

            if (result.type !== "success") {
                toastState.error(result.data.error);
                return { items: [], total: 0 };
            } else {
                return {
                    items: result.data.users,
                    total: result.data.pagination.totalItems,
                };
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                logger.error(error);
                toastState.error("Erro ao buscar usuários");
            }
            return { items: [], total: 0 };
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(event.target);
    };

    const handleAddUser = () => {
        userModalState.isOpen = true;
        userModalState.editing = false;
        userModalState.userId = null;
    };

    const handleEditUser = (id) => {
        userModalState.isOpen = true;
        userModalState.editing = true;
        userModalState.userId = id;
    };

    const handleDeleteUser = (id) => {
        console.log(id);
    };

    onMount(async () => {
        if (data.error) {
            toastState.error(data.error);
        }
    });
</script>

<Toaster />

<Modal
    isOpen={userModalState.isOpen}
    title={userModalState.editing ? "Editar Usuário" : "Adicionar Usuário"}
    onClose={() => (userModalState.isOpen = false)}
>
    <form onsubmit={handleSubmit} method="post" action="?/save">
        <Input
            label="Nome"
            required
            type="text"
            id="nome"
            name="nome"
            placeholder="Ex: João Silva"
        />
        <Input
            label="CPF"
            required
            type="text"
            id="cpf"
            name="cpf"
            placeholder="Ex: 123.456.789-00"
        />
        <Input
            label="Email"
            required
            type="email"
            id="email"
            name="email"
            placeholder="Ex: joao@email.com"
        />
        <Input
            label="Telefone"
            required
            type="tel"
            id="telefone"
            name="telefone"
            placeholder="Ex: (11) 90000-0000"
        />
        <PasswordInput
            label="Senha"
            required
            id="senha"
            name="senha"
            placeholder="Ex: ********"
        />
        <PasswordInput
            label="Confirmar Senha"
            required
            id="senha_confirmacao"
            name="senha_confirmacao"
            placeholder="Ex: ********"
        />

        <div class="modal-actions">
            <Button
                type="button"
                variant="secondary"
                onclick={() => (userModalState.isOpen = false)}>Cancelar</Button
            >
            <Button type="submit" variant="primary">Salvar</Button>
        </div>
    </form>
</Modal>

<DataTable
    {columns}
    initialData={{ items: data.users, total: data.pagination.totalItems }}
    fetchItems={fetchUsers}
    defaultSort={{ key: "id", order: "asc" }}
    pageSize={10}
>
    {#snippet nome(user)}
        {user.name}
        {#if user.id === data.session.user.id}
            <span class="text-muted">(Você)</span>
        {/if}
    {/snippet}

    {#snippet acoes(user)}
        <div class="actions">
            <button
                title="Editar"
                class="btn-icon"
                onclick={() => handleEditUser(user.id)}
                icon="edit"
            >
                <i class="fa-solid fa-pen-to-square"></i>
            </button>

            <button
                title="Excluir"
                class="btn-icon delete"
                onclick={() => handleDeleteUser(user.id)}
                icon="trash"
            >
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    {/snippet}
</DataTable>

<style>
    .modal-actions {
        display: flex;
        gap: 12px;
        margin-top: 30px;
    }

    .text-muted {
        color: #6c757d;
        text-decoration: italic;
    }

    .btn-icon {
        padding: 8px;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 8px;
        cursor: pointer;
        color: #3b82f6;
        transition: all 0.3s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        will-change: transform;
    }

    .btn-icon i {
        pointer-events: none;
    }

    .btn-icon:hover {
        background: rgba(59, 130, 246, 0.2);
        transform: scale(1.1);
    }

    .btn-icon.delete {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
    }

    .btn-icon.delete:hover {
        background: rgba(239, 68, 68, 0.2);
        transform: scale(1.1);
    }
</style>
