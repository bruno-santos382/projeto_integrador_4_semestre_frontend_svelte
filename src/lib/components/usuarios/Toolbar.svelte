<script>
    import Button from "../ui/Button.svelte";

    const { onSearchInput } = $props();

    let searchInput = $state(null);

    function toggleFilters() {
        console.log("toggleFilters");
    }

    function addUser() {
        console.log("addUser");
    }

    function clearFilters() {
        console.log("clearFilters");
    }

    function applyFilters() {
        console.log("applyFilters");
    }

    function clearSearch() {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
</script>

<!-- Toolbar -->
<div class="toolbar">
    <div class="search-box">
        <i class="search-icon fas fa-search"></i>
        <input
            bind:this={searchInput}
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            id="searchInput"
            oninput={onSearchInput}
        />
        <button
          type="button"
          class="clear-btn"
          onclick={clearSearch}
          title="Limpar"
        >
          <i class="fa-solid fa-times"></i>
        </button>
    </div>
    <div class="toolbar-actions">
        <Button icon="filter" variant="secondary" onclick={toggleFilters}>
            Mais filtros
        </Button>
        <Button icon="plus" variant="primary" onclick={addUser}>
            Adicionar Usuário
        </Button>

        <!-- Dropdown de Filtros -->
        <div class="filter-dropdown" id="filterDropdown">
            <div class="filter-group">
                <label for="filterStatus">Status</label>
                <select id="filterStatus">
                    <option value="">Todos</option>
                    <option value="ativo">Ativo</option>
                    <option value="manutenção">Manutenção</option>
                    <option value="inativo">Inativo</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="filterTipo">Tipo</label>
                <select id="filterTipo">
                    <option value="">Todos</option>
                    <option value="Carro">Carro</option>
                    <option value="Caminhão">Caminhão</option>
                    <option value="Van">Van</option>
                    <option value="Moto">Moto</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="filterAno">Ano (Mínimo)</label>
                <input type="number" id="filterAno" placeholder="Ex: 2020" />
            </div>
            <div class="filter-actions">
                <Button icon="cross" variant="secondary" onclick={clearFilters}
                    >Limpar</Button
                >
                <Button icon="check" variant="primary" onclick={applyFilters}
                    >Aplicar</Button
                >
            </div>
        </div>
    </div>
</div>

<style>
    /* Toolbar */
    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        gap: 15px;
        flex-wrap: wrap;
    }

    .search-box {
        flex: 1;
        min-width: 250px;
        max-width: 400px;
        position: relative;
    }

    .search-box input {
        width: 100%;
        padding: 12px 20px 12px 45px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 10px;
        color: #e0e6ed;
        font-size: 14px;
        transition: all 0.3s;
    }

    .search-box input:focus {
        outline: none;
        border-color: #3b82f6;
        background: rgba(15, 23, 42, 0.8);
    }

    .search-icon {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
    }

    .clear-btn {
        position: absolute;
        right: 8px;
        top: 8px;
        background: transparent;
        border: none;
        color: #8b9cb6;
        cursor: pointer;
        padding: 6px 8px;
        border-radius: 4px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        }

        .clear-btn:hover {
        background-color: #1a2f4d;
        color: #3b82f6;
        }

        .clear-btn:active {
        transform: scale(0.95);
        }

        .clear-btn i {
        font-size: 13px;
        }

    .toolbar-actions {
        display: flex;
        gap: 10px;
        position: relative;
    }

    /* Dropdown de Filtros */
    .filter-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 10px;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 15px;
        padding: 25px;
        width: 320px;
        display: none;
        z-index: 1000;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
    }

    .filter-dropdown.active {
        display: block;
        animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .filter-group {
        margin-bottom: 20px;
    }

    .filter-group label {
        display: block;
        margin-bottom: 8px;
        color: #94a3b8;
        font-size: 13px;
        font-weight: 600;
    }

    .filter-group select,
    .filter-group input {
        width: 100%;
        padding: 10px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 8px;
        color: #e0e6ed;
        font-size: 14px;
    }

    .filter-group select:focus,
    .filter-group input:focus {
        outline: none;
        border-color: #3b82f6;
    }

    .filter-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    /* Responsivo */
    @media (max-width: 768px) {
        .toolbar {
            flex-direction: column;
            align-items: stretch;
        }

        .search-box {
            max-width: 100%;
        }
    }
</style>
