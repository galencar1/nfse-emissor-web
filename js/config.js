// Configurações da aplicação

// URL da API
const API_CONFIG = {
    baseURL: 'https://nfse-api-dev.onrender.com',
    endpoints: {
        emit: '/api/v1/nfse/emit',
        cancel: '/api/v1/nfse/cancel',
        list: '/api/v1/nfse/list'
    }
};

// Emissores disponíveis
const EMISSORES = [
    {
        id: 'rpg',
        nome: 'RPG Prestadora',
        cnpj: '59714129000104',
        senha: '28042018Bes!',
        emails: ['ivone442015@gmail.com']
    },
    {
        id: 'om',
        nome: 'OM Prestadora',
        cnpj: '59714129000104',
        senha: '28042018Bes!',
        emails: ['ivone442015@gmail.com']
    }
];

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
    notasCache: 'nfse_notas_cache'
};
