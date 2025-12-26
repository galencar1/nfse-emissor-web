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
        cnpj: '59714129000104'
    }
];

// Nota: Senhas e emails são configurados pelo usuário na primeira vez
// e salvos de forma criptografada no LocalStorage

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
    notasCache: 'nfse_notas_cache',
    credenciais: 'nfse_credenciais_encrypted' // Senha e emails criptografados
};
