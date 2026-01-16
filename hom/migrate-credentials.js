/**
 * Script de Migração de Credenciais
 * 
 * Este script converte credenciais antigas (formato único) para o novo formato
 * (separado por emissor). Execute no console do navegador.
 * 
 * IMPORTANTE: Execute apenas UMA VEZ por navegador
 */

(function migrateCredentials() {
    console.log('🔄 Iniciando migração de credenciais...');
    
    const STORAGE_KEYS = {
        credenciais: 'nfse_credenciais_encrypted',
        emissorAtual: 'nfse_emissor_atual'
    };
    
    try {
        // Verificar se já está no formato novo
        const encrypted = localStorage.getItem(STORAGE_KEYS.credenciais);
        if (!encrypted) {
            console.log('ℹ️ Nenhuma credencial encontrada. Nada a migrar.');
            return;
        }
        
        const decoded = atob(encrypted);
        const credenciais = JSON.parse(decoded);
        
        // Verificar se já está no formato novo (tem IDs de emissor)
        if (credenciais.rpg || credenciais.om) {
            console.log('✅ Credenciais já estão no novo formato. Nenhuma migração necessária.');
            return;
        }
        
        // Formato antigo detectado - migrar
        if (credenciais.senha && credenciais.email) {
            console.log('⚠️ Formato antigo detectado. Migrando...');
            
            // Perguntar ao usuário para qual emissor essas credenciais pertencem
            console.log('');
            console.log('❓ Para qual emissor essas credenciais pertencem?');
            console.log('   1. RPG Prestadora (59.714.129/0001-04)');
            console.log('   2. OM Prestadora (48.952.794/0001-10)');
            console.log('');
            console.log('Execute um dos comandos abaixo:');
            console.log('   migrateToRPG()  - Se as credenciais são da RPG');
            console.log('   migrateToOM()   - Se as credenciais são da OM');
            console.log('');
            
            // Definir funções globais temporárias
            window.migrateToRPG = function() {
                migrarPara('rpg', credenciais);
            };
            
            window.migrateToOM = function() {
                migrarPara('om', credenciais);
            };
            
            function migrarPara(emissorId, oldCredentials) {
                const novasCredenciais = {
                    [emissorId]: {
                        senha: oldCredentials.senha,
                        email: oldCredentials.email,
                        timestamp: oldCredentials.timestamp || Date.now()
                    }
                };
                
                // Salvar novo formato
                const encoded = btoa(JSON.stringify(novasCredenciais));
                localStorage.setItem(STORAGE_KEYS.credenciais, encoded);
                
                // Definir emissor atual
                localStorage.setItem(STORAGE_KEYS.emissorAtual, emissorId);
                
                // Limpar funções temporárias
                delete window.migrateToRPG;
                delete window.migrateToOM;
                
                console.log('✅ Migração concluída com sucesso!');
                console.log(`   Credenciais migradas para: ${emissorId.toUpperCase()}`);
                console.log('   Emissor atual definido como:', emissorId.toUpperCase());
                console.log('');
                console.log('🔄 Recarregue a página para aplicar as mudanças.');
                console.log('   window.location.reload()');
            }
        } else {
            console.log('⚠️ Formato de credenciais desconhecido. Considere reconfigurar manualmente.');
        }
        
    } catch (error) {
        console.error('❌ Erro durante migração:', error);
        console.log('💡 Sugestão: Limpe as credenciais antigas e reconfigure manualmente:');
        console.log('   localStorage.removeItem("nfse_credenciais_encrypted")');
        console.log('   location.reload()');
    }
})();

/**
 * Função auxiliar: Visualizar credenciais atuais
 */
function viewCredentials() {
    try {
        const encrypted = localStorage.getItem('nfse_credenciais_encrypted');
        if (!encrypted) {
            console.log('ℹ️ Nenhuma credencial armazenada.');
            return;
        }
        
        const decoded = atob(encrypted);
        const credenciais = JSON.parse(decoded);
        
        console.log('📋 Credenciais armazenadas:');
        console.log(JSON.stringify(credenciais, null, 2));
    } catch (error) {
        console.error('❌ Erro ao ler credenciais:', error);
    }
}

/**
 * Função auxiliar: Limpar todas as credenciais
 */
function clearAllCredentials() {
    const confirm = window.confirm('⚠️ Isso vai remover TODAS as credenciais salvas. Continuar?');
    if (confirm) {
        localStorage.removeItem('nfse_credenciais_encrypted');
        localStorage.removeItem('nfse_emissor_atual');
        console.log('✅ Todas as credenciais foram removidas.');
        console.log('🔄 Recarregue a página: location.reload()');
    }
}

// Exportar funções úteis
console.log('');
console.log('📚 Funções disponíveis:');
console.log('   viewCredentials()      - Ver credenciais atuais');
console.log('   clearAllCredentials()  - Limpar todas as credenciais');
console.log('');
