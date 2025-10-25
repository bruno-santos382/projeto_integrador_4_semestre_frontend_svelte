<script>
    import { onMount } from "svelte";

    import { toastState } from "$lib/state/toast.svelte";

    import { Toaster } from "$lib/components/ui";
    import UserModal  from "$lib/components/usuarios/UserModal.svelte";
    import UsersTable from "$lib/components/usuarios/UsersTable.svelte";
    import { createUserModalState } from "$lib/state/userModal.svelte";
   
    const { data } = $props();

    let tableState = $state({
        users: data.users,
        isLoading: false,
        currentPage: 1,
        pageSize: 10,
        searchTerm: "",
        sorting: {
            field: "nome",
            direction: "asc",
        },
    });

    const getUserById = (id) => tableState.users.find((user) => user.id === id);

    const userModal = createUserModalState(
        (message) => toastState.success(message),
        (message) => toastState.error(message),
    );

    onMount(() => {
        if (data.error) {
            toastState.error(data.error);
        }
    });
</script>

<Toaster />

<UserModal 
    user={userModal.user}
    isOpen={userModal.open} 
    isEditMode={userModal.editing} 
    isSaving={userModal.saving}
    onClose={userModal.handleClose}
    onSaveSuccess={userModal.handleSaveSuccess}
    onSaveError={userModal.handleSaveError}
/>

<UsersTable 
    users={tableState.users}
    isLoading={tableState.isLoading}
    currentPage={tableState.currentPage}
    pageSize={tableState.pageSize}
    searchTerm={tableState.searchTerm}
    sorting={tableState.sorting}
    onEdit={(id) => userModal.handleEdit(getUserById(id))}
    onDelete={(id) => userModal.handleDelete(getUserById(id))}
/>