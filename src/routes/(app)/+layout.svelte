<script>
    import { goto } from '$app/navigation';

    import '$lib/assets/app.css';

    let { children } = $props();
</script>

<div class="layout">
  <nav>
    <div class="nav-brand">
      <i class="fa-solid fa-truck-fast"></i>
      <span>Frota Pro</span>
    </div>
    
    <ul class="nav-menu">
      <li><a href="/dashboard">Dashboard</a></li>
      <li><a href="/usuarios">Usuários</a></li>
      <li><a href="/veiculos">Veículos</a></li>
      <li><a href="/manutencoes">Manutenções</a></li>
      <li><a href="/relatorios">Relatórios</a></li>
    </ul>

    <div class="nav-user">
      <span>Anderson</span>
      <button aria-label="Sair" class="btn-logout" onclick={() => goto('/logout')}>
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  </nav>

  <main>
    {@render children()}
  </main>
</div>

<style>

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1e293b;
    color: #fff;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .nav-brand i {
    font-size: 1.5rem;
    color: #3b82f6;
  }

  .nav-menu {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }

  .nav-menu li a {
    color: #cbd5e1;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
    font-weight: 500;
  }

  .nav-menu li a:hover {
    background-color: #334155;
    color: #fff;
  }

  .nav-user {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-user span {
    font-weight: 500;
  }

  .btn-logout {
    background: none;
    border: none;
    color: #cbd5e1;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }

  .btn-logout:hover {
    background-color: #dc2626;
    color: #fff;
  }

  main {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Responsive */
  @media (max-width: 768px) {
    nav {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .nav-menu {
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      text-align: center;
    }

    .nav-user {
      width: 100%;
      justify-content: center;
    }
  }
</style>