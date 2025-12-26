// Cliente HTTP para API NFS-e

class NFSeAPI {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    // Obter credenciais (senha e email) do localStorage
    getCredenciais() {
        try {
            const encrypted = localStorage.getItem(STORAGE_KEYS.credenciais);
            if (!encrypted) return null;
            
            // Decodificar de Base64 (ofuscação simples)
            const decoded = atob(encrypted);
            return JSON.parse(decoded);
        } catch (e) {
            console.error('Erro ao recuperar credenciais:', e);
            return null;
        }
    }

    // Salvar credenciais (senha e email) de forma ofuscada
    salvarCredenciais(senha, email) {
        const dados = {
            senha: senha,
            email: email,
            timestamp: Date.now()
        };
        
        // Codificar em Base64 (ofuscação simples - não é criptografia real)
        const encoded = btoa(JSON.stringify(dados));
        localStorage.setItem(STORAGE_KEYS.credenciais, encoded);
    }

    // Obter emissor atual
    getEmissorAtual() {
        const emissorId = localStorage.getItem(STORAGE_KEYS.emissorAtual);
        if (!emissorId) return null;
        return EMISSORES.find(e => e.id === emissorId);
    }

    // Headers comuns
    getHeaders(emissor, credenciais) {
        if (!credenciais) {
            throw new Error('Credenciais não configuradas');
        }
        
        return {
            'Content-Type': 'application/json',
            'X-NFSE-User': emissor.cnpj,
            'X-NFSE-Pass': credenciais.senha
        };
    }

    // Emitir nota
    async emitirNota(dados) {
        const emissor = this.getEmissorAtual();
        if (!emissor) {
            throw new Error('Nenhum emissor selecionado');
        }

        const credenciais = this.getCredenciais();
        if (!credenciais) {
            throw new Error('Credenciais não configuradas. Configure suas credenciais primeiro.');
        }

        const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.emit}`, {
            method: 'POST',
            headers: this.getHeaders(emissor, credenciais),
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.mensagem || 'Erro ao emitir nota');
        }

        return await response.json();
    }

    // Cancelar nota
    async cancelarNota(dados) {
        const emissor = this.getEmissorAtual();
        if (!emissor) {
            throw new Error('Nenhum emissor selecionado');
        }

        const credenciais = this.getCredenciais();
        if (!credenciais) {
            throw new Error('Credenciais não configuradas. Configure suas credenciais primeiro.');
        }

        const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.cancel}`, {
            method: 'POST',
            headers: this.getHeaders(emissor, credenciais),
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.mensagem || 'Erro ao cancelar nota');
        }

        return await response.json();
    }

    // Listar notas
    async listarNotas(pagina = 1, limite = 15) {
        const emissor = this.getEmissorAtual();
        if (!emissor) {
            throw new Error('Nenhum emissor selecionado');
        }

        const credenciais = this.getCredenciais();
        if (!credenciais) {
            throw new Error('Credenciais não configuradas. Configure suas credenciais primeiro.');
        }

        const url = `${this.baseURL}${API_CONFIG.endpoints.list}?pagina=${pagina}&limite=${limite}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(emissor, credenciais)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.mensagem || 'Erro ao listar notas');
        }

        const data = await response.json();
        
        // Salvar em cache local
        if (data.sucesso && data.notas) {
            localStorage.setItem(STORAGE_KEYS.notasCache, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        }

        return data;
    }

    // Obter notas do cache (para modo offline)
    getNotasFromCache() {
        try {
            const cache = localStorage.getItem(STORAGE_KEYS.notasCache);
            if (!cache) return null;
            
            const parsed = JSON.parse(cache);
            const agora = Date.now();
            const umDia = 24 * 60 * 60 * 1000;
            
            // Cache válido por 1 dia
            if (agora - parsed.timestamp < umDia) {
                return parsed.data;
            }
            
            return null;
        } catch (e) {
            return null;
        }
    }
}

// Instância global
const api = new NFSeAPI();
