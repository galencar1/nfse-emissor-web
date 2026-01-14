// Lógica principal da aplicação

// Estado da aplicação
let paginaAtual = 1;
let totalPaginas = 1;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initEmissores();
    initTomadorSelect();
    initCodigoTributacao();
    loadEmissorSalvo();
    verificarCredenciais(); // Verificar se precisa configurar credenciais
    
    // Inicializar filtros de data
    populateYearSelect();
    
    // Adicionar event listeners para formatação automática de data
    const dataInicio = document.getElementById('filtro-data-inicio');
    const dataFim = document.getElementById('filtro-data-fim');
    
    if (dataInicio) {
        dataInicio.addEventListener('input', (e) => formatarData(e.target));
    }
    
    if (dataFim) {
        dataFim.addEventListener('input', (e) => formatarData(e.target));
    }
});

// Inicializar seletor de emissores
function initEmissores() {
    const select = document.getElementById('emissor-select');
    
    console.log('Inicializando emissores:', EMISSORES);
    console.log('Select element:', select);
    
    EMISSORES.forEach(emissor => {
        const option = document.createElement('option');
        option.value = emissor.id;
        option.textContent = emissor.nome;
        select.appendChild(option);
        console.log('Emissor adicionado:', emissor.nome);
    });

    select.addEventListener('change', (e) => {
        if (e.target.value) {
            trocarEmissor(e.target.value);
        }
    });
}

// Trocar emissor e verificar credenciais
function trocarEmissor(emissorId) {
    const emissor = EMISSORES.find(em => em.id === emissorId);
    if (!emissor) {
        showToast('Erro', 'Emissor não encontrado', 'error');
        return;
    }
    
    // Salvar emissor atual
    api.setEmissorAtual(emissorId);
    
    // Verificar se tem credenciais para este emissor
    const temCredenciais = api.temCredenciais(emissorId);
    
    if (!temCredenciais) {
        // Mostrar modal de configuração para este emissor
        mostrarModalConfigEmissor(emissor);
    } else {
        // Atualizar indicador visual
        atualizarIndicadorEmissor(emissor);
        
        showToast(
            'Emissor alterado',
            `Agora usando: ${emissor.nome} (CNPJ: ${emissor.cnpj})`,
            'success'
        );
    }
}

// Atualizar indicador visual do emissor
function atualizarIndicadorEmissor(emissor) {
    const select = document.getElementById('emissor-select');
    const temCredenciais = api.temCredenciais(emissor.id);
    
    // Adicionar classe visual para indicar estado
    if (temCredenciais) {
        select.classList.remove('border-red-500');
        select.classList.add('border-green-500');
    } else {
        select.classList.remove('border-green-500');
        select.classList.add('border-red-500');
    }
}

// Carregar emissor salvo
function loadEmissorSalvo() {
    const emissorSalvo = localStorage.getItem(STORAGE_KEYS.emissorAtual);
    if (emissorSalvo) {
        const select = document.getElementById('emissor-select');
        select.value = emissorSalvo;
        
        // Atualizar indicador visual
        const emissor = EMISSORES.find(e => e.id === emissorSalvo);
        if (emissor) {
            atualizarIndicadorEmissor(emissor);
        }
    }
}

// Inicializar seletor de tomador
function initTomadorSelect() {
    const select = document.getElementById('tomador-select');
    
    select.addEventListener('change', (e) => {
        const cnpjOutroDiv = document.getElementById('cnpj-outro-div');
        if (e.target.value === 'outro') {
            cnpjOutroDiv.classList.remove('hidden');
            // Limpar emails quando escolher "outro"
            limparEmails();
        } else {
            cnpjOutroDiv.classList.add('hidden');
            // Preencher emails automaticamente baseado no tomador
            preencherEmailsPorTomador(e.target.value);
        }
    });
}

// Inicializar seletor de código de tributação
function initCodigoTributacao() {
    const select = document.getElementById('codigo-tributacao');
    
    CODIGOS_TRIBUTACAO.forEach(codigo => {
        const option = document.createElement('option');
        option.value = codigo.codigo;
        option.textContent = `${codigo.codigo} - ${codigo.descricao}`;
        select.appendChild(option);
    });
}

// Preencher emails automaticamente baseado no tomador
function preencherEmailsPorTomador(cnpjTomador) {
    const emailsContainer = document.getElementById('emails-container');
    
    // Limpar emails existentes
    emailsContainer.innerHTML = '';
    
    // Buscar emails para o tomador
    const emails = EMAILS_POR_TOMADOR[cnpjTomador] || [];
    
    if (emails.length > 0) {
        // Adicionar campos com os emails pré-preenchidos
        emails.forEach(email => {
            criarCampoEmail(emailsContainer, email);
        });
        
        showToast(
            'Emails preenchidos',
            `${emails.length} email(s) adicionado(s) automaticamente para este tomador`,
            'info'
        );
    } else {
        // Se não houver emails cadastrados, adicionar campo vazio
        criarCampoEmail(emailsContainer, '');
    }
}

// Criar campo de email com botão de remover
function criarCampoEmail(container, valorInicial = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex gap-2 items-center';
    
    const input = document.createElement('input');
    input.type = 'email';
    input.className = 'email-input flex-1 p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary';
    input.placeholder = 'email@exemplo.com';
    input.value = valorInicial;
    
    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.className = 'bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-4 rounded-lg transition duration-200 text-xl';
    btnRemover.innerHTML = '×';
    btnRemover.title = 'Remover email';
    btnRemover.onclick = () => {
        wrapper.remove();
        // Se não houver mais campos, adicionar um vazio
        if (container.children.length === 0) {
            criarCampoEmail(container, '');
        }
    };
    
    wrapper.appendChild(input);
    wrapper.appendChild(btnRemover);
    container.appendChild(wrapper);
}

// Limpar emails
function limparEmails() {
    const emailsContainer = document.getElementById('emails-container');
    emailsContainer.innerHTML = '';
    criarCampoEmail(emailsContainer, '');
}

// Navegação entre telas
function showScreen(screenName) {
    // Esconder todas as telas
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('emit-screen').classList.add('hidden');
    document.getElementById('cancel-screen').classList.add('hidden');
    document.getElementById('list-screen').classList.add('hidden');

    // Mostrar tela selecionada
    document.getElementById(`${screenName}-screen`).classList.remove('hidden');

    // Carregar dados se necessário
    if (screenName === 'list') {
        paginaAtual = 1;
        carregarNotas();
    }
    
    // Inicializar campo de email ao abrir tela de emissão
    if (screenName === 'emit') {
        const emailsContainer = document.getElementById('emails-container');
        if (emailsContainer.children.length === 0) {
            criarCampoEmail(emailsContainer, '');
        }
    }
}

// Loading overlay
function showLoading(text = 'Processando...') {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

// Toast notifications
function showToast(message, details = '', type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const messageEl = document.getElementById('toast-message');
    const detailsEl = document.getElementById('toast-details');

    // Definir ícone e cor da borda
    const styles = {
        success: { icon: '✅', color: 'border-green-500' },
        error: { icon: '❌', color: 'border-red-500' },
        warning: { icon: '⚠️', color: 'border-yellow-500' },
        info: { icon: 'ℹ️', color: 'border-blue-500' }
    };

    const style = styles[type] || styles.info;
    icon.textContent = style.icon;
    messageEl.textContent = message;
    detailsEl.textContent = details;

    // Remover classes antigas e adicionar nova
    toast.className = `fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50 border-l-4 ${style.color}`;
    toast.classList.remove('hidden');

    // Auto-hide após 5 segundos
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
}

// Adicionar campo de email (emissão)
function addEmailInput() {
    const container = document.getElementById('emails-container');
    criarCampoEmail(container, '');
}

// Adicionar campo de email (cancelamento)
function addEmailCancelInput() {
    const container = document.getElementById('emails-cancel-container');
    const input = document.createElement('input');
    input.type = 'email';
    input.className = 'email-cancel-input w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary';
    input.placeholder = 'email@exemplo.com';
    container.appendChild(input);
}

// Coletar emails de um container
function collectEmails(className) {
    const inputs = document.querySelectorAll(`.${className}`);
    const emails = [];
    inputs.forEach(input => {
        const email = input.value.trim();
        if (email) emails.push(email);
    });
    return emails;
}

// Validar emissor selecionado
function validarEmissor() {
    const emissorSelect = document.getElementById('emissor-select');
    if (!emissorSelect.value) {
        showToast('Selecione um emissor', 'Você precisa escolher quem está emitindo a nota', 'error');
        return false;
    }
    return true;
}

// Formatar CNPJ (00.000.000/0000-00)
function formatarCNPJ(cnpj) {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) return cnpj;
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

// EMITIR NOTA
async function emitirNota() {
    if (!validarEmissor()) return;

    const tomadorSelect = document.getElementById('tomador-select');
    const cnpjOutro = document.getElementById('cnpj-outro');
    const municipio = document.getElementById('municipio');
    const descricao = document.getElementById('descricao-servico');
    const valor = document.getElementById('valor-servico');

    // Validações
    if (!tomadorSelect.value) {
        showToast('Selecione o tomador', 'Quem vai receber a nota?', 'error');
        return;
    }

    let cnpjTomador = tomadorSelect.value;
    if (cnpjTomador === 'outro') {
        cnpjTomador = cnpjOutro.value.replace(/\D/g, '');
        if (!cnpjTomador || cnpjTomador.length !== 14) {
            showToast('CNPJ inválido', 'Digite um CNPJ válido com 14 dígitos', 'error');
            return;
        }
    }

    if (!municipio.value.trim()) {
        showToast('Município obrigatório', 'Informe o município da prestação', 'error');
        return;
    }

    if (!descricao.value.trim()) {
        showToast('Descrição obrigatória', 'Descreva o serviço prestado', 'error');
        return;
    }

    if (!valor.value || parseFloat(valor.value) <= 0) {
        showToast('Valor inválido', 'Informe um valor maior que zero', 'error');
        return;
    }

    const codigoTributacao = document.getElementById('codigo-tributacao');
    if (!codigoTributacao.value) {
        showToast('Código de tributação obrigatório', 'Selecione o código de tributação do serviço', 'error');
        return;
    }

    const emails = collectEmails('email-input');
    if (emails.length === 0) {
        // Se não houver email digitado, usar o email das credenciais
        const credenciais = api.getCredenciais();
        if (credenciais && credenciais.email) {
            emails.push(credenciais.email);
        } else {
            showToast('Email obrigatório', 'Adicione pelo menos um email para notificação', 'error');
            return;
        }
    }

    // Montar dados
    const dados = {
        cnpj_tomador: formatarCNPJ(cnpjTomador),
        municipio_prestacao: municipio.value.trim(),
        descricao_servico: descricao.value.trim(),
        valor_servico: parseFloat(valor.value),
        emitir_automaticamente: true,
        codigo_tributacao: codigoTributacao.value,
        emails_notificacao: emails
    };

    try {
        showLoading('Emitindo nota...');
        const resultado = await api.emitirNota(dados);
        hideLoading();

        if (resultado.sucesso) {
            showToast(
                '✅ Nota emitida com sucesso!',
                `NFS-e #${resultado.numero_nfse} - Valor: R$ ${dados.valor_servico.toFixed(2)}`,
                'success'
            );

            // Limpar formulário
            tomadorSelect.value = '';
            descricao.value = '';
            valor.value = '';
            codigoTributacao.value = '';
            document.getElementById('cnpj-outro-div').classList.add('hidden');
            
            // Limpar emails e deixar um campo vazio
            const emailsContainer = document.getElementById('emails-container');
            emailsContainer.innerHTML = '';
            criarCampoEmail(emailsContainer, '');

            // Voltar para home após 2 segundos
            setTimeout(() => showScreen('home'), 2000);
        } else {
            showToast('Erro ao emitir', resultado.mensagem || 'Tente novamente', 'error');
        }
    } catch (error) {
        hideLoading();
        showToast('Erro na emissão', error.message, 'error');
    }
}

// CANCELAR NOTA
async function cancelarNota() {
    if (!validarEmissor()) return;

    const chave = document.getElementById('chave-encrypted');
    const motivo = document.getElementById('motivo-cancelamento');
    const justificativa = document.getElementById('justificativa');

    // Validações
    if (!chave.value.trim()) {
        showToast('Chave obrigatória', 'Cole a chave criptografada da nota', 'error');
        return;
    }

    if (!justificativa.value.trim()) {
        showToast('Justificativa obrigatória', 'Explique o motivo do cancelamento', 'error');
        return;
    }

    const emails = collectEmails('email-cancel-input');
    if (emails.length === 0) {
        // Se não houver email digitado, usar o email das credenciais
        const credenciais = api.getCredenciais();
        if (credenciais && credenciais.email) {
            emails.push(credenciais.email);
        } else {
            showToast('Email obrigatório', 'Adicione pelo menos um email', 'error');
            return;
        }
    }

    // Montar dados
    const dados = {
        chave_encrypted: chave.value.trim(),
        motivo_cancelamento: parseInt(motivo.value),
        justificativa: justificativa.value.trim(),
        emails_notificacao: emails
    };

    try {
        showLoading('Cancelando nota...');
        const resultado = await api.cancelarNota(dados);
        hideLoading();

        if (resultado.sucesso) {
            showToast(
                '✅ Nota cancelada!',
                `NFS-e #${resultado.numero_nfse}`,
                'success'
            );

            // Limpar formulário
            chave.value = '';
            justificativa.value = '';
            document.querySelectorAll('.email-cancel-input').forEach((input, index) => {
                if (index === 0) input.value = '';
                else input.remove();
            });

            // Voltar para home
            setTimeout(() => showScreen('home'), 2000);
        } else {
            showToast('Erro ao cancelar', resultado.mensagem || 'Tente novamente', 'error');
        }
    } catch (error) {
        hideLoading();
        showToast('Erro no cancelamento', error.message, 'error');
    }
}

// LISTAR NOTAS
async function carregarNotas() {
    if (!validarEmissor()) {
        showScreen('home');
        return;
    }

    const container = document.getElementById('notas-container');
    container.innerHTML = '<p class="text-center text-gray-500">Carregando...</p>';

    try {
        const resultado = await api.listarNotas(paginaAtual, 15, filtrosAtivos);

        // Debug: Log da estrutura de resposta da API
        console.log('Resposta da API:', resultado);
        console.log('Total de notas retornadas:', resultado.notas?.length);
        console.log('Página atual:', paginaAtual);
        console.log('Filtros aplicados:', filtrosAtivos);

        if (resultado.sucesso && resultado.notas && resultado.notas.length > 0) {
            renderNotas(resultado.notas);
            
            // Calcular total de páginas
            if (resultado.total_paginas) {
                totalPaginas = resultado.total_paginas;
            } else if (resultado.total && resultado.total > resultado.notas.length) {
                totalPaginas = Math.ceil(resultado.total / 15);
            } else {
                if (resultado.notas.length >= 15) {
                    totalPaginas = paginaAtual + 1;
                } else {
                    totalPaginas = paginaAtual;
                }
            }
            
            updatePagination();
        } else {
            // Tentar cache se não houver notas
            const cache = api.getNotasFromCache();
            if (cache && cache.notas) {
                renderNotas(cache.notas);
                showToast('Modo offline', 'Exibindo notas do cache', 'info');
            } else {
                container.innerHTML = '<p class="text-center text-gray-500">Nenhuma nota encontrada</p>';
            }
        }
    } catch (error) {
        // Tentar cache em caso de erro
        const cache = api.getNotasFromCache();
        if (cache && cache.notas) {
            renderNotas(cache.notas);
            showToast('Sem conexão', 'Exibindo notas salvas localmente', 'warning');
        } else {
            container.innerHTML = `<p class="text-center text-red-500">Erro: ${error.message}</p>`;
            showToast('Erro ao carregar', error.message, 'error');
        }
    }
}

function renderNotas(notas) {
    const container = document.getElementById('notas-container');
    container.innerHTML = '';

    notas.forEach(nota => {
        const isCancelada = nota.situacao.includes('cancelada');
        const statusColor = isCancelada ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300';
        const statusIcon = isCancelada ? '⚠️' : '✅';

        const card = document.createElement('div');
        card.className = `border-2 ${statusColor} rounded-lg p-4`;
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div>
                    <p class="text-xl font-bold text-gray-800">NFS-e #${nota.numero_nfse}</p>
                    <p class="text-sm text-gray-600">${nota.data_emissao}</p>
                </div>
                <span class="text-2xl">${statusIcon}</span>
            </div>
            <p class="text-lg font-semibold text-gray-800">R$ ${nota.valor}</p>
            <p class="text-sm text-gray-600 mt-1">${nota.tomador}</p>
            <p class="text-sm font-semibold mt-2 ${isCancelada ? 'text-red-600' : 'text-green-600'}">
                ${nota.situacao}
            </p>
            <details class="mt-3">
                <summary class="cursor-pointer text-primary hover:text-primary-dark font-semibold">
                    📄 Ver chave da nota
                </summary>
                <div class="mt-2 p-3 bg-gray-100 rounded text-xs break-all">
                    <code>${nota.chave_encrypted}</code>
                </div>
            </details>
        `;
        container.appendChild(card);
    });
}

function updatePagination() {
    document.getElementById('page-info').textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    document.getElementById('prev-btn').disabled = paginaAtual <= 1;
    document.getElementById('next-btn').disabled = paginaAtual >= totalPaginas;
}

function previousPage() {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarNotas();
    }
}

function nextPage() {
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        carregarNotas();
    }
}

// FILTROS DE BUSCA DE NOTAS

// Estado dos filtros
let filtrosAtivos = {};

function populateYearSelect() {
    const select = document.getElementById('filtro-ano');
    const anoAtual = new Date().getFullYear();
    
    // Adicionar opção vazia
    select.innerHTML = '<option value="">Todos os períodos</option>';
    
    // Adicionar últimos 5 anos
    for (let i = 0; i < 5; i++) {
        const ano = anoAtual - i;
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        select.appendChild(option);
    }
}

function formatarData(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
        value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    input.value = value;
}

function validarData(dataStr) {
    if (!dataStr) return true; // Vazio é válido
    
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dataStr.match(regex);
    
    if (!match) return false;
    
    const dia = parseInt(match[1]);
    const mes = parseInt(match[2]);
    const ano = parseInt(match[3]);
    
    if (mes < 1 || mes > 12) return false;
    if (dia < 1 || dia > 31) return false;
    if (ano < 2000 || ano > 2100) return false;
    
    return true;
}

function aplicarFiltros() {
    const ano = document.getElementById('filtro-ano').value;
    const dataInicio = document.getElementById('filtro-data-inicio').value;
    const dataFim = document.getElementById('filtro-data-fim').value;
    
    // Validar datas
    if (dataInicio && !validarData(dataInicio)) {
        showToast('Data inválida', 'Data de início em formato inválido (use DD/MM/AAAA)', 'error');
        return;
    }
    
    if (dataFim && !validarData(dataFim)) {
        showToast('Data inválida', 'Data de fim em formato inválido (use DD/MM/AAAA)', 'error');
        return;
    }
    
    // Verificar período de 30 dias se ambas as datas forem informadas
    if (dataInicio && dataFim) {
        const [dia1, mes1, ano1] = dataInicio.split('/').map(Number);
        const [dia2, mes2, ano2] = dataFim.split('/').map(Number);
        const d1 = new Date(ano1, mes1 - 1, dia1);
        const d2 = new Date(ano2, mes2 - 1, dia2);
        const diffDias = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
        
        if (diffDias > 30) {
            showToast('Período inválido', 'O período entre as datas não pode ser maior que 30 dias', 'error');
            return;
        }
        
        if (diffDias < 0) {
            showToast('Período inválido', 'Data de início deve ser anterior à data de fim', 'error');
            return;
        }
    }
    
    // Construir filtros
    filtrosAtivos = {};
    
    if (ano) {
        filtrosAtivos.ano = parseInt(ano);
        // Limpar campos de data se ano foi selecionado
        document.getElementById('filtro-data-inicio').value = '';
        document.getElementById('filtro-data-fim').value = '';
    } else if (dataInicio && dataFim) {
        filtrosAtivos.data_inicio = dataInicio;
        filtrosAtivos.data_fim = dataFim;
    } else if (dataInicio || dataFim) {
        showToast('Filtro incompleto', 'Informe tanto a data de início quanto a de fim, ou selecione um ano', 'warning');
        return;
    }
    
    // Atualizar status da busca
    atualizarStatusBusca();
    
    // Resetar paginação e buscar
    paginaAtual = 1;
    carregarNotas();
}

function limparFiltros() {
    document.getElementById('filtro-ano').value = '';
    document.getElementById('filtro-data-inicio').value = '';
    document.getElementById('filtro-data-fim').value = '';
    filtrosAtivos = {};
    
    // Esconder status
    document.getElementById('status-busca').classList.add('hidden');
    
    // Resetar paginação e buscar
    paginaAtual = 1;
    carregarNotas();
}

function atualizarStatusBusca() {
    const statusDiv = document.getElementById('status-busca');
    const statusTexto = document.getElementById('status-busca-texto');
    
    if (Object.keys(filtrosAtivos).length === 0) {
        statusDiv.classList.add('hidden');
        return;
    }
    
    let texto = '';
    if (filtrosAtivos.ano) {
        texto = `Ano: ${filtrosAtivos.ano} (todas as notas do ano)`;
    } else if (filtrosAtivos.data_inicio && filtrosAtivos.data_fim) {
        texto = `Período: ${filtrosAtivos.data_inicio} até ${filtrosAtivos.data_fim}`;
    }
    
    statusTexto.textContent = texto;
    statusDiv.classList.remove('hidden');
}

// CONFIGURAÇÃO DE CREDENCIAIS

// Verificar se usuário já configurou credenciais do emissor atual
function verificarCredenciais() {
    const emissorAtual = api.getEmissorAtual();
    
    // Se não tem emissor selecionado, não fazer nada
    // (será configurado quando o usuário selecionar)
    if (!emissorAtual) {
        return;
    }
    
    // Verificar se o emissor atual tem credenciais
    const temCredenciais = api.temCredenciais(emissorAtual.id);
    if (!temCredenciais) {
        mostrarModalConfigEmissor(emissorAtual);
    }
}

// Mostrar modal de configuração para um emissor específico
function mostrarModalConfigEmissor(emissor) {
    const modal = document.getElementById('config-modal');
    const titulo = modal.querySelector('h2');
    
    // Atualizar título com nome do emissor
    titulo.textContent = `🔐 Configurar ${emissor.nome}`;
    
    // Limpar campos
    document.getElementById('config-senha').value = '';
    
    // Tentar preencher com valores existentes (se houver)
    const credenciaisExistentes = api.getCredenciais(emissor.id);
    if (credenciaisExistentes) {
        document.getElementById('config-senha').value = credenciaisExistentes.senha || '';
    }
    
    // Guardar emissor no modal para usar no save
    modal.dataset.emissorId = emissor.id;
    
    modal.classList.remove('hidden');
}

// Mostrar configuração do emissor atual (via botão)
function mostrarConfigEmissorAtual() {
    const emissor = api.getEmissorAtual();
    if (!emissor) {
        showToast('Selecione um emissor', 'Escolha o emissor primeiro', 'warning');
        return;
    }
    mostrarModalConfigEmissor(emissor);
}

// Salvar credenciais do emissor
function salvarCredenciais() {
    const modal = document.getElementById('config-modal');
    const emissorId = modal.dataset.emissorId;
    
    if (!emissorId) {
        showToast('Erro', 'Emissor não identificado', 'error');
        return;
    }
    
    const senha = document.getElementById('config-senha').value.trim();

    // Validações
    if (!senha) {
        showToast('Senha obrigatória', 'Digite a senha da API', 'error');
        return;
    }

    try {
        // Salvar credenciais para este emissor
        api.salvarCredenciais(emissorId, senha);

        // Fechar modal
        modal.classList.add('hidden');
        delete modal.dataset.emissorId;

        // Limpar campos
        document.getElementById('config-senha').value = '';

        // Atualizar indicador visual
        const emissor = EMISSORES.find(e => e.id === emissorId);
        if (emissor) {
            atualizarIndicadorEmissor(emissor);
        }

        showToast(
            '✅ Credenciais salvas!', 
            `${emissor.nome} configurado com sucesso`, 
            'success'
        );
    } catch (error) {
        showToast('Erro ao salvar', error.message, 'error');
    }
}
