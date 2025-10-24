<script>
    // Agora, currentPage é o índice da página (0-based)
    let { totalItems, currentPage, itemsPerPage, totalPages, onPageChange } = $props();

    // Lógica de exibição (mantida em 1-based para o regsitro)
    // O cálculo agora usa currentPage (0-based)
    let showingStart = $derived(totalItems > 0 ? currentPage * itemsPerPage + 1 : 0);
    let showingEnd = $derived(totalItems > 0 ? Math.min((currentPage + 1) * itemsPerPage, totalItems) : 0);

    /**
     * Navega para a página anterior ou próxima.
     * A lógica de limite agora usa 0 e totalPages - 1.
     */
    function changePage(direction) {
        const newPage = direction === "prev" ? currentPage - 1 : currentPage + 1;
        // Limites: 0 <= newPage < totalPages
        if (newPage >= 0 && newPage < totalPages) {
            goToPage(newPage);
        }
    }

    /**
     * Navega para uma página específica.
     * A página de entrada (page) é o índice 0-based.
     */
    function goToPage(page) {
        // Limites: 0 <= page < totalPages
        if (page >= 0 && page < totalPages && page !== currentPage) {
            // Retorna o índice 0-based para a função de callback
            onPageChange?.(page);
        }
    }
</script>

<!-- Pagination -->
<div class="pagination">
    <div class="pagination-info">
        Mostrando <span>{showingStart}</span> a <span>{showingEnd}</span> de <span>{totalItems}</span> registros
    </div>
    <div class="pagination-controls">
        <button
            aria-label="Anterior"
            class="page-btn"
            disabled={currentPage === 0}
            onclick={() => changePage("prev")}
        >
            <i class="fas fa-chevron-left"></i>
        </button>
        
        {#each Array.from({ length: totalPages }, (_, i) => i) as pageIndex (pageIndex)}
            <!-- Exibe o número da página (1-based) para o regsitro, mas passa o índice (0-based) para goToPage -->
            <button
                aria-label="Página {pageIndex + 1}"
                class="page-btn {pageIndex === currentPage ? 'active' : ''}"
                onclick={() => goToPage(pageIndex)}
            >
                {pageIndex + 1} <!-- Exibe 1, 2, 3... -->
            </button>
        {/each}
        
        <button
            aria-label="Próximo"
            class="page-btn"
            disabled={currentPage === totalPages - 1}
            onclick={() => changePage("next")}
        >
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>
</div>

<style>
    /* Estilos de Paginação (Sem Alteração) */
    .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: rgba(15, 23, 42, 0.6);
        border-radius: 0 0 15px 15px;
        margin-top: -1px;
    }

    .pagination-info {
        color: #94a3b8;
        font-size: 14px;
    }

    .pagination-controls {
        display: flex;
        gap: 5px;
    }

    .page-btn {
        padding: 8px 12px;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 8px;
        color: #3b82f6;
        cursor: pointer;
        transition: all 0.3s;
        min-width: 36px;
        text-align: center;
    }

    .page-btn:hover:not(:disabled) {
        background: rgba(59, 130, 246, 0.2);
    }

    .page-btn.active {
        background: #3b82f6;
        color: white;
    }

    .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
