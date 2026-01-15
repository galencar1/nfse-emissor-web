// Configurações da aplicação

// URL da API
const API_CONFIG = {
    baseURL: 'https://nfse-api-hom.onrender.com',
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
