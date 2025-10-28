import { logger } from '$lib/utils/logger';

// Classe de erro customizada para encapsular status e dados de erro da API
export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}


// Classe para gerenciar chamadas HTTP de forma padronizada
export class ApiClient {
    // Construtor: define a URL base e as opções padrão (Content-Type)
    constructor(baseURL = '') {
        this.baseURL = baseURL;
        this.defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

    // Método central para todas as requisições à API
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const method = options.method || 'GET';
        
        // Mescla opções padrão, de requisição e headers
        const config = {
            ...this.defaultOptions,
            ...options,
            headers: {
                ...this.defaultOptions.headers,
                ...options.headers,
            },
        };

        // Log: Início da requisição
        logger.info(`API Request: ${method} ${url}`, { config });

        try {
            const response = await fetch(url, config);
            
            // Log: Resposta recebida
            logger.info(`API Response: ${method} ${url} - Status ${response.status}`);

            // Lança um erro customizado para outros status HTTP de erro
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                
                // Log: Outro erro HTTP
                logger.error(`API Error (HTTP): ${method} ${url} - Status ${response.status}`, { errorData });
                
                throw new ApiError(
                    errorData?.message || `Erro HTTP! status: ${response.status}`,
                    response.status,
                    errorData
                );
            }

            // Retorna null para respostas 'No Content' (204)
            if (response.status === 204) {
                return null;
            }

            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                return await response.json();
            }

            return await response.text();
        } catch (error) {
            logger.error(error);
            
            // Relança erros customizados ou cria um ApiError genérico para falhas de rede
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error(
                error.message || 'Erro inesperado',
                0, // Status 0 para erros de rede
                null
            );
        }
    }

    // Métodos utilitários para tipos específicos de requisição
    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    patch(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    // Helper para adicionar o token de autenticação (Bearer)
    setAuthToken(token) {
        this.defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Helper para remover o token de autenticação
    removeAuthToken() {
        delete this.defaultOptions.headers['Authorization'];
    }
}

export const createApiClient = (token = null) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    if (!baseURL) {
        throw new Error('VITE_API_BASE_URL environment variable is not set or empty.');
    }
    const client = new ApiClient(baseURL);
    if (token) {
        client.setAuthToken(token);
    }
    return client;
}
