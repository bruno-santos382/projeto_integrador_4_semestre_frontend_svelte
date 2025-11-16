<script>
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    
    const plans = [
        {
            id: "essencial",
            name: "Essencial",
            subtitle: "(Gratuito)",
            icon: "🚗",
            price: "Grátis",
            description:
                "Ideal para quem está começando e quer testar a plataforma sem compromisso.",
            features: [
                { text: "Até 5 motoristas", included: true },
                { text: "Até 5 veículos", included: true },
                { text: "Sem relatórios", included: false },
                { text: "Sem BI", included: false },
                { text: "Suporte simples", included: true },
            ],
            buttonText: "Começar Grátis",
            buttonClass: "btn-free",
            recommended: false,
        },

        {
            id: "corporativo",
            name: "Corporativo",
            subtitle: "(Avançado)",
            icon: "🚚",
            price: "R$ 159,99",
            priceUnit: "/mês",
            description:
                "Para grandes frotas com foco em análise e performance avançada.",
            features: [
                { text: "Motoristas ilimitados", included: true },
                { text: "Veículos ilimitados", included: true },
                { text: "Relatórios avançados", included: true },
                { text: "Insights de acidentes", included: true },
                { text: "BI integrado", included: true },
                { text: "Suporte completo", included: true },
            ],
            buttonText: "Assinar Completo",
            buttonClass: "btn-corporate",
            recommended: false,
        },
    ];

    function selectPlan(plan) {
        goto(resolve("/login"));
    }
</script>

<!-- Pricing Section -->
<section class="pricing" id="pricing">
    <div class="pricing-header">
        <h2>Escolha o Plano Ideal para Sua Frota</h2>
        <p>Planos flexíveis que crescem com seu negócio</p>
    </div>

    <div class="pricing-cards">
        {#each plans as plan, index (index)}
            <div class="pricing-card" class:recommended={plan.recommended}>
                {#if plan.recommended}
                    <span class="recommended-badge">Recomendado</span>
                {/if}

                <div class="card-icon">{plan.icon}</div>
                <h3 class="card-title">{plan.name}</h3>
                <p class="card-subtitle">{plan.subtitle}</p>
                <p class="card-description">{plan.description}</p>

                <div class="card-price">
                    {plan.price}
                    {#if plan.priceUnit}
                        <span>{plan.priceUnit}</span>
                    {/if}
                </div>

                <ul class="features-list">
                    {#each plan.features as feature, index (index)}
                        <li>
                            <span
                                class="feature-icon"
                                class:check={feature.included}
                                class:cross={!feature.included}
                            >
                                {feature.included ? "✓" : "✗"}
                            </span>
                            {feature.text}
                        </li>
                    {/each}
                </ul>

                <button
                    class="card-button {plan.buttonClass}"
                    on:click={() => selectPlan(plan)}
                >
                    {plan.buttonText}
                </button>
            </div>
        {/each}
    </div>
</section>

<style>
    /* Pricing Section */
    .pricing {
        padding: 100px 20px;
        background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .pricing-header {
        text-align: center;
        margin-bottom: 60px;
    }

    .pricing-header h2 {
        font-size: 42px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 16px;
    }

    .pricing-header p {
        font-size: 18px;
        color: #64748b;
    }

    .pricing-cards {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 30px;
        padding: 0 20px;
    }

    .pricing-card {
        background: white;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
    }

    .pricing-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: linear-gradient(90deg, #3b82f6, #06b6d4);
    }

    .pricing-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }

    .pricing-card.recommended {
        border: 3px solid #3b82f6;
        transform: scale(1.05);
    }

    .pricing-card.recommended::before {
        height: 8px;
    }

    .recommended-badge {
        position: absolute;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
    }

    .card-icon {
        font-size: 48px;
        margin-bottom: 20px;
    }

    .card-title {
        font-size: 28px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 8px;
    }

    .card-subtitle {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 24px;
        font-style: italic;
    }

    .card-description {
        font-size: 15px;
        color: #475569;
        margin-bottom: 24px;
        line-height: 1.6;
    }

    .card-price {
        font-size: 42px;
        font-weight: 800;
        color: #3b82f6;
        margin-bottom: 24px;
    }

    .card-price span {
        font-size: 18px;
        color: #64748b;
        font-weight: 400;
    }

    .features-list {
        list-style: none;
        margin-bottom: 32px;
    }

    .features-list li {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        font-size: 15px;
        color: #475569;
    }

    .feature-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 14px;
    }

    .feature-icon.check {
        background: #22c55e;
        color: white;
    }

    .feature-icon.cross {
        background: #ef4444;
        color: white;
    }

    .card-button {
        width: 100%;
        padding: 16px;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .btn-free {
        background: linear-gradient(135deg, #64748b 0%, #475569 100%);
        color: white;
    }

    .btn-professional {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
    }

    .btn-corporate {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: white;
    }

    .card-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    
    @media (max-width: 768px) {
  
      .pricing-cards {
        grid-template-columns: 1fr;
      }
  
      .pricing-card.recommended {
        transform: scale(1);
      }
    }
</style>
