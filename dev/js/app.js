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
            localStorage.setItem(STORAGE_KEYS.emissorAtual, e.target.value);
            const emissor = EMISSORES.find(em => em.id === e.target.value);
            console.log('Emissor alterado para:', emissor);
            
            // Mostrar toast informando a mudança
            showToast(
                'Emissor alterado',
                `Agora usando: ${emissor.nome} (CNPJ: ${emissor.cnpj})`,
                'info'
            );
        }
    });
}

// Carregar emissor salvo
function loadEmissorSalvo() {
    const emissorSalvo = localStorage.getItem(STORAGE_KEYS.emissorAtual);
    if (emissorSalvo) {
        document.getElementById('emissor-select').value = emissorSalvo;
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
        const resultado = await api.listarNotas(paginaAtual);

        // Debug: Log da estrutura de resposta da API
        console.log('Resposta da API:', resultado);
        console.log('Total de notas retornadas:', resultado.notas?.length);
        console.log('Página atual:', paginaAtual);

        if (resultado.sucesso && resultado.notas && resultado.notas.length > 0) {
            renderNotas(resultado.notas);
            
            // Calcular total de páginas
            // Se a API retornar paginacao.total_paginas, usar esse valor
            // Caso contrário, calcular baseado no total de registros
            if (resultado.paginacao && resultado.paginacao.total_paginas) {
                totalPaginas = resultado.paginacao.total_paginas;
                console.log('Total de páginas (da API):', totalPaginas);
            } else if (resultado.total && resultado.total > resultado.notas.length) {
                // Só usar resultado.total se for maior que o número de notas retornadas
                // (indicando que é realmente o total de registros no banco)
                totalPaginas = Math.ceil(resultado.total / 15);
                console.log('Total de páginas (calculado):', totalPaginas, '- Total registros:', resultado.total);
            } else {
                // Fallback: assumir que há mais páginas se retornou o limite completo (15 notas)
                // Isso cobre o caso onde o backend retorna total = quantidade de notas na página
                if (resultado.notas.length >= 15) {
                    totalPaginas = paginaAtual + 1; // Pelo menos mais uma página
                    console.log('Assumindo mais páginas - retornou 15 notas (limite completo)');
                } else {
                    totalPaginas = paginaAtual; // Última página
                    console.log('Última página - retornou', resultado.notas.length, 'notas (menos que o limite)');
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

// CONFIGURAÇÃO DE CREDENCIAIS

// Verificar se usuário já configurou credenciais
function verificarCredenciais() {
    const credenciais = api.getCredenciais();
    if (!credenciais) {
        mostrarModalConfig();
    }
}

// Mostrar modal de configuração
function mostrarModalConfig() {
    document.getElementById('config-modal').classList.remove('hidden');
}

// Salvar credenciais
function salvarCredenciais() {
    const senha = document.getElementById('config-senha').value.trim();
    const email = document.getElementById('config-email').value.trim();

    // Validações
    if (!senha) {
        showToast('Senha obrigatória', 'Digite a senha da API', 'error');
        return;
    }

    if (!email) {
        showToast('Email obrigatório', 'Digite um email para notificações', 'error');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Email inválido', 'Digite um email válido', 'error');
        return;
    }

    // Salvar credenciais
    api.salvarCredenciais(senha, email);

    // Fechar modal
    document.getElementById('config-modal').classList.add('hidden');

    // Limpar campos
    document.getElementById('config-senha').value = '';
    document.getElementById('config-email').value = '';

    showToast('✅ Credenciais salvas!', 'Você já pode usar o sistema', 'success');
}
