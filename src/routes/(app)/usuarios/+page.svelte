<script> 
    import { onMount } from "svelte"; 
    import { deserialize } from "$app/forms";
    import { toastState } from "$lib/stores/toast.svelte"; 
    import { Toaster } from "$lib/components/layout/index.js"; 
    import UserForm from "$lib/components/UserForm.svelte"; 
    import ConfirmDialog from "$lib/components/layout/ConfirmDialog.svelte"; 
    import Modal from "$lib/components/layout/Modal.svelte";
    import DataTable from "$lib/components/layout/DataTable.svelte";
    import Button from "$lib/components/layout/Button.svelte";
    import { debounce } from "$lib/utils/debounce.js";
     
    const { data } = $props(); 
 
    const currentUser = $state(data?.session?.user);
    let selectedUser = $state(null); 
    let showUserModal = $state(false); 
    let showDeleteDialog = $state(false); 
    let isEditMode = $state(false); 
    let isDeletingUser = $state(false);

    let tableState = $state({ 
        users: data?.users || [], 
        isLoading: false, 
        totalItems: data?.pagination?.totalItems || 0, 
        currentPage: data?.pagination?.currentPage || 0, 
        pageSize: data?.pagination?.itemsPerPage || 10, 
        search: data?.search || '', 
        sorting: {
            field: data?.sorting?.field || 'id',
            order: data?.sorting?.order || 'asc',
        }
    }); 

    const columns = [
        { key: "id", label: "ID", width: '70px' },
        { key: "nome", label: "Nome" },
        { key: "cpf", label: "CPF", width: '150px' },
        { key: "email", label: "Email" },
        { key: "telefone", label: "Telefone", width: '200px' },
        { key: "acoes", label: "Ações", width: '100px', sortable: false },
    ];

    onMount(() => { 
        if (data.error) { 
            toastState.error(data.error); 
        } 
    }); 

    let fetchAbortController = null;
    const fetchUsers = async () => {
        tableState.isLoading = true;
        try {
            fetchAbortController?.abort();
            fetchAbortController = new AbortController();
            const formData = new FormData();
            formData.append('page', tableState.currentPage);
            formData.append('size', tableState.pageSize);
            formData.append('search', tableState.search);
            formData.append('sort', `${tableState.sorting.field},${tableState.sorting.order}`);
            const response = await fetch('?/search', {
                method: 'POST',
                body: formData,
                signal: fetchAbortController.signal,
            });
            const result = deserialize(await response.text());
            if (result.type === 'success') {
                tableState.users = result.data.users;
                tableState.totalItems = result.data.pagination.totalItems;
                tableState.currentPage = result.data.pagination.currentPage;
                tableState.pageSize = result.data.pagination.itemsPerPage;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            if (error !== 'AbortError') {
                toastState.error(error);
            }
        } finally {
            tableState.isLoading = false;
        }
    };

    let deleteAbortController = null;
    const fetchDeleteUser = async () => {
        isDeletingUser = true;
        try {
            deleteAbortController?.abort();
            deleteAbortController = new AbortController();

            const formData = new FormData();
            formData.append('id', selectedUser.id);
            const response = await fetch(`?/delete`, {
                method: 'POST',
                body: formData,
                signal: deleteAbortController.signal,
            });
            const result = deserialize(await response.text());
            if (result.type === 'success') {
                toastState.success('Usuário excluído com sucesso');
                fetchUsers();
            } else {
                throw new Error(result.data.error);
            }
        } catch (error) {
            if (error !== 'AbortError') {
                toastState.error(error);
            }
        } finally {
            isDeletingUser = false;
        }
    };

    const changePage = (page) => { 
        tableState.currentPage = page; 
        fetchUsers();
    }; 

    const debouncedSearch = debounce(fetchUsers, 250);
    const updateSearch = (search) => { 
        tableState.search = search?.trim() || ''; 
        tableState.currentPage = 0; 
        tableState.isLoading = true;
        debouncedSearch();
    }; 
 
    const updateSort = (field, order) => { 
        tableState.sorting = { field, order }; 
        fetchUsers();
    }; 
 
    const editUser = (user) => { 
        selectedUser = user; 
        isEditMode = true; 
        showUserModal = true; 
    }; 
 
    const deleteUser = (user) => { 
        selectedUser = user; 
        showDeleteDialog = true; 
    }; 
 
    const closeUserModal = () => { 
        showUserModal = false; 
    }; 
 
    const saveUser = () => { 
        showUserModal = false; 
        toastState.success('Usuário salvo com sucesso'); 
        fetchUsers();
    }; 
 
    const showError = (error) => { 
        toastState.error(error); 
    }; 
 
    const confirmDelete = async () => { 
        await fetchDeleteUser();
        showDeleteDialog = false; 
    }; 
 
    const cancelDelete = () => { 
        deleteAbortController?.abort();
        showDeleteDialog = false; 
    }; 
</script> 
 
<Toaster /> 
 
{#if showDeleteDialog} 
    {#snippet message()}
        Tem certeza que deseja excluir o usuário <b>{selectedUser.nome}</b>?
    {/snippet}

    <ConfirmDialog 
        title="Confirmar exclusão" 
        {message}
        isOpen={showDeleteDialog} 
        isLoading={isDeletingUser} 
        confirmText="Confirmar" 
        cancelText="Cancelar" 
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
    /> 
{/if} 
 
{#if showUserModal} 
    <Modal 
        title={isEditMode ? 'Editar Usuário' : 'Criar Usuário'} 
        onClose={closeUserModal}
    >
        <UserForm  
            user={selectedUser} 
            isEditMode={isEditMode}  
            onCancel={closeUserModal}
            onSaveSuccess={saveUser} 
            onSaveError={showError} 
        /> 
    </Modal>
{/if} 
 

<DataTable 
    columns={columns} 
    items={tableState.users} 
    isLoading={tableState.isLoading}
    totalItems={tableState.totalItems}
    currentPage={tableState.currentPage}
    pageSize={tableState.pageSize}
    currentSort={tableState.sorting}
    onSort={updateSort} 
    onPageChange={changePage} 
    onSearch={updateSearch}
>
    {#snippet toolbar()}
        <Button variant="primary" icon="plus" onclick={() => showUserModal = true}>Novo Usuário</Button>
    {/snippet}

    {#snippet cell_nome(user)}
        {user.nome} {#if user.id === currentUser?.id} <span class="badge badge-warning">(Você)</span>{/if}
    {/snippet}

    {#snippet cell_acoes(user)}
        {#if user.id !== currentUser?.id}
            <div class="btn-group"> 
                <button aria-label="Editar" class="btn-icon" onclick={() => editUser(user)}>
                    <i class="fas fa-edit"></i>
                </button>
                <button aria-label="Excluir" class="btn-icon delete" onclick={() => deleteUser(user)}>
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        {/if}
    {/snippet}
</DataTable>

<style>


    .btn-group {
        display: flex;
        gap: 5px;
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

</style>
