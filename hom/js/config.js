// Configurações da aplicação

// Detectar se está rodando localmente
function isLocalhost() {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname.startsWith('192.168.') ||
           hostname.startsWith('10.') ||
           hostname.endsWith('.local');
}

// Detectar ambiente baseado na URL
function detectarAmbiente() {
    // Se está rodando localmente, usar ambiente 'local'
    if (isLocalhost()) {
        return 'local';
    }
    
    const pathname = window.location.pathname;
    
    // Detectar ambiente pelo path
    if (pathname.includes('/dev/') || pathname.includes('/dev')) {
        return 'dev';
    } else if (pathname.includes('/hom/') || pathname.includes('/hom')) {
        return 'hom';
    } else {
        // Path raiz ou qualquer outro = produção
        return 'prod';
    }
}

// Configurações de API por ambiente
const AMBIENTE_CONFIGS = {
    local: {
        nome: 'Local (Desenvolvimento)',
        baseURL: 'http://localhost:8000',
        cor: '#9c27b0' // Roxo
    },
    dev: {
        nome: 'Desenvolvimento',
        baseURL: 'https://nfse-api-hom.onrender.com',
        cor: '#ffc107' // Amarelo
    },
    hom: {
        nome: 'Homologação',
        baseURL: 'https://nfse-api-hom.onrender.com',
        cor: '#ff9800' // Laranja
    },
    prod: {
        nome: 'Produção',
        baseURL: 'https://nfse-api-prd.onrender.com',
        cor: '#4caf50' // Verde
    }
};

// Detectar ambiente atual
const AMBIENTE_ATUAL = detectarAmbiente();
const AMBIENTE_CONFIG = AMBIENTE_CONFIGS[AMBIENTE_ATUAL];

console.log(`🌍 Ambiente detectado: ${AMBIENTE_CONFIG.nome} (${AMBIENTE_ATUAL})`);
console.log(`🔗 API: ${AMBIENTE_CONFIG.baseURL}`);

// URL da API (dinâmica baseada no ambiente)
const API_CONFIG = {
    ambiente: AMBIENTE_ATUAL,
    ambienteNome: AMBIENTE_CONFIG.nome,
    baseURL: AMBIENTE_CONFIG.baseURL,
    cor: AMBIENTE_CONFIG.cor,
    endpoints: {
        emit: '/api/v1/nfse/emit',
        cancel: '/api/v1/nfse/cancel',
        list: '/api/v1/nfse/list'
    }
};

// Emissores disponíveis (apenas dados públicos)
const EMISSORES = [
    {
        id: 'rpg',
        nome: 'RPG Prestadora',
        cnpj: '59714129000104'
    },
    {
        id: 'om',
        nome: 'OM Prestadora',
        cnpj: '48952794000110'
    }
];

// Nota: Senhas são configuradas pelo usuário na primeira vez
// e salvas de forma criptografada no LocalStorage.
// Emails de notificação são preenchidos automaticamente baseado no tomador.

// Tomadores pré-cadastrados
const TOMADORES_PREDEFINIDOS = {
    '75315333003981': {
        nome: 'ATACADÃO S.A - TIRADENTES',
        cnpj: '75315333003981'
    },
    '75315333017184': {
        nome: 'ATACADÃO S.A - BRASÍLIA',
        cnpj: '75315333017184'
    },
    '75315333025870': {
        nome: 'ATACADÃO S.A - CAMBÉ',
        cnpj: '75315333025870'
    }
};

// Mapeamento de emails de notificação por CNPJ do tomador
const EMAILS_POR_TOMADOR = {
    '75315333017184': [
        'gfalencar02@gmail.com',
        'omarmacielalencar@gmail.com',
        'geovanna_rafaela_jenani@atacadao.com.br'
    ],
    '75315333003981': [
        'gabrielfalencar@gmail.com',
        'omarmacielalencar@gmail.com',
        'silvio_eduardo_pereira_da_silva@atacadao.com.br',
        'Rodrigo_fridman_martins@atacadao.com.br'
    ],
    '48952794000110': [
        'gabrielfalencar@gmail.com',
        'gfalencar01@gmail.com',
        'gfalencar02@gmail.com',
        'limat1703@gmail.com',
        'lima.b.thais@gmail.com'
    ]
};

// Códigos de tributação disponíveis
const CODIGOS_TRIBUTACAO = [
    {
        codigo: '14.01.01',
        descricao: 'Manutenção de Máquinas'
    },
    {
        codigo: '07.02.02',
        descricao: 'Obras Civil - Hidráulica, Civil, Pintura'
    },
    {
        codigo: '14.13.02',
        descricao: 'Serralheria'
    }
];

// Motivos de cancelamento
const MOTIVOS_CANCELAMENTO = {
    1: 'Data de emissão incorreta',
    2: 'Serviço não prestado',
    3: 'Valor incorreto',
    4: 'Duplicidade',
    5: 'Outros'
};

// LocalStorage keys
const STORAGE_KEYS = {
    emissorAtual: 'nfse_emissor_atual',
    ultimoTomador: 'nfse_ultimo_tomador',
    notasCache: 'nfse_notas_cache',
    credenciais: 'nfse_credenciais_encrypted' // Senha e emails criptografados
};
