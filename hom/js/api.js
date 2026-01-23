// Cliente HTTP para API NFS-e

class NFSeAPI {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    // Obter credenciais de um emissor específico do localStorage
    // Agora suporta múltiplas empresas - cada uma com suas credenciais
    getCredenciais(emissorId = null) {
        try {
            const encrypted = localStorage.getItem(STORAGE_KEYS.credenciais);
            if (!encrypted) return null;
            
            // Decodificar de Base64 (ofuscação simples)
            const decoded = atob(encrypted);
            const allCredentials = JSON.parse(decoded);
            
            // Se emissorId foi passado, retornar credenciais daquele emissor
            if (emissorId) {
                return allCredentials[emissorId] || null;
            }
            
            // Caso contrário, tentar retornar credenciais do emissor atual
            const emissorAtual = this.getEmissorAtual();
            if (emissorAtual && allCredentials[emissorAtual.id]) {
                return allCredentials[emissorAtual.id];
            }
            
            // Fallback: se houver apenas uma empresa configurada, retornar ela
            const keys = Object.keys(allCredentials);
            if (keys.length === 1) {
                return allCredentials[keys[0]];
            }
            
            return null;
        } catch (e) {
            console.error('Erro ao recuperar credenciais:', e);
            return null;
        }
    }

    // Salvar credenciais de um emissor específico
    salvarCredenciais(emissorId, senha) {
        try {
            // Obter credenciais existentes
            let allCredentials = {};
            try {
                const encrypted = localStorage.getItem(STORAGE_KEYS.credenciais);
                if (encrypted) {
                    const decoded = atob(encrypted);
                    allCredentials = JSON.parse(decoded);
                }
            } catch (e) {
                console.warn('Não foi possível recuperar credenciais existentes, criando novo objeto');
            }
            
            // Atualizar credenciais do emissor específico
            allCredentials[emissorId] = {
                senha: senha,
                timestamp: Date.now()
            };
            
            // Codificar em Base64 (ofuscação simples - não é criptografia real)
            const encoded = btoa(JSON.stringify(allCredentials));
            localStorage.setItem(STORAGE_KEYS.credenciais, encoded);
            
            console.log(`Credenciais salvas para emissor: ${emissorId}`);
        } catch (e) {
            console.error('Erro ao salvar credenciais:', e);
            throw new Error('Falha ao salvar credenciais');
        }
    }

    // Verificar se um emissor tem credenciais configuradas
    temCredenciais(emissorId) {
        const credenciais = this.getCredenciais(emissorId);
        return credenciais && credenciais.senha;
    }

    // Obter emissor atual
    getEmissorAtual() {
        const emissorId = localStorage.getItem(STORAGE_KEYS.emissorAtual);
        if (!emissorId) return null;
        const emissor = EMISSORES.find(e => e.id === emissorId);
        console.log('Emissor atual:', emissor);
        return emissor;
    }

    // Definir emissor atual
    setEmissorAtual(emissorId) {
        const emissor = EMISSORES.find(e => e.id === emissorId);
        if (!emissor) {
            throw new Error('Emissor não encontrado');
        }
        localStorage.setItem(STORAGE_KEYS.emissorAtual, emissorId);
        console.log('Emissor definido:', emissor.nome);
        return emissor;
    }

    // Headers comuns
    getHeaders(emissor, credenciais) {
        if (!credenciais) {
            throw new Error('Credenciais não configuradas');
        }
        
        console.log('Headers sendo enviados - CNPJ:', emissor.cnpj, '- Emissor:', emissor.nome);
        
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
    async listarNotas(pagina = 1, limite = 15, filtros = {}) {
        const emissor = this.getEmissorAtual();
        if (!emissor) {
            throw new Error('Nenhum emissor selecionado');
        }

        const credenciais = this.getCredenciais();
        if (!credenciais) {
            throw new Error('Credenciais não configuradas. Configure suas credenciais primeiro.');
        }

        // Construir query parameters
        const params = new URLSearchParams({
            pagina: pagina.toString(),
            limite: limite.toString()
        });

        // Adicionar filtros opcionais
        if (filtros.data_inicio) {
            params.append('data_inicio', filtros.data_inicio);
        }
        if (filtros.data_fim) {
            params.append('data_fim', filtros.data_fim);
        }
        if (filtros.ano) {
            params.append('ano', filtros.ano.toString());
        }
        if (filtros.status) {
            params.append('status', filtros.status);
        }

        const url = `${this.baseURL}${API_CONFIG.endpoints.list}?${params.toString()}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(emissor, credenciais)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.mensagem || 'Erro ao listar notas');
        }

        const data = await response.json();
        
        // Salvar em cache local
        if (data.sucesso && data.notas) {
            localStorage.setItem(STORAGE_KEYS.notasCache, JSON.stringify({
                data: data,
                filtros: filtros,
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

    // Download do PDF da nota fiscal
    async downloadPDF(chaveAcesso) {
        const emissor = this.getEmissorAtual();
        if (!emissor) {
            throw new Error('Nenhum emissor selecionado');
        }

        const credenciais = this.getCredenciais();
        if (!credenciais) {
            throw new Error('Credenciais não configuradas. Configure suas credenciais primeiro.');
        }

        const url = `${this.baseURL}/api/v1/nfse/download-pdf/${chaveAcesso}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(emissor, credenciais)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.mensagem || 'Erro ao baixar PDF');
        }

        // Retornar o blob do PDF
        return await response.blob();
    }
}

// Instância global
const api = new NFSeAPI();
