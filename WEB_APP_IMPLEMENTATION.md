# 🌐 Implementação Web App - Emissor NFS-e

## 📋 Visão Geral

Interface web moderna e acessível para emissão, cancelamento e consulta de notas fiscais.

**Público-alvo:** Trabalhador autônomo de manutenção, 56 anos, precisa de simplicidade.

---

## 🎯 Funcionalidades

### MVP (Versão 1.0)
- ✅ Emitir NFS-e
- ✅ Cancelar NFS-e
- ✅ Consultar notas emitidas
- ✅ Seleção de emissor (RPG/OM Prestadora)
- ✅ Seleção de tomador (Atacadão unidades + outros)
- ✅ Armazenamento local de credenciais
- ✅ Design responsivo (mobile-first)

### Futuro (v2.0+)
- 🔄 PWA instalável
- 🔄 Modo offline (cache de consultas)
- 🔄 Histórico local
- 🔄 Impressão de NFS-e
- 🔄 Notificações push

---

## 🏗️ Arquitetura

### Estrutura de Diretórios
```
nfse-web-app/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos customizados
├── js/
│   ├── app.js            # Lógica principal
│   ├── api.js            # Cliente HTTP para API
│   └── config.js         # Configurações (emissores, tomadores)
├── assets/
│   ├── icons/            # Ícones e logos
│   └── images/           # Imagens
├── manifest.json         # PWA manifest
├── service-worker.js     # Service Worker (PWA)
└── README.md            # Documentação
```

---

## 🎨 Design System

### Cores
```css
--primary: #2563eb      /* Azul principal (botões, links) */
--primary-dark: #1e40af /* Hover */
--success: #16a34a      /* Verde (sucesso) */
--danger: #dc2626       /* Vermelho (cancelamento) */
--warning: #f59e0b      /* Amarelo (avisos) */
--neutral: #64748b      /* Cinza (textos secundários) */
--background: #f8fafc   /* Fundo claro */
--surface: #ffffff      /* Cards, modais */
```

### Tipografia
```css
--font-base: 18px       /* Texto normal (maior para usuário 56 anos) */
--font-lg: 20px         /* Títulos */
--font-xl: 24px         /* Cabeçalhos */
--font-family: 'Inter', -apple-system, sans-serif
```

### Espaçamento
```css
--spacing-xs: 8px
--spacing-sm: 16px
--spacing-md: 24px
--spacing-lg: 32px
--spacing-xl: 48px
```

---

## 🔌 Integração com API

### Endpoints Utilizados

**Base URL:** `https://nfse-api-dev.onrender.com`

#### 1. Emitir Nota
```javascript
POST /api/v1/nfse/emit
Headers: {
  "X-NFSE-User": "59714129000104",
  "X-NFSE-Pass": "senha_aqui",
  "Content-Type": "application/json"
}
Body: {
  "cnpj_tomador": "75315333003981",
  "municipio_prestacao": "Londrina",
  "descricao_servico": "Manutenção elétrica",
  "valor_servico": 350.00,
  "emitir_automaticamente": true,
  "emails_notificacao": ["email@example.com"]
}
```

#### 2. Cancelar Nota
```javascript
POST /api/v1/nfse/cancel
Headers: { ... }
Body: {
  "chave_encrypted": "ABC123...",
  "motivo_cancelamento": 1,
  "justificativa": "Erro na emissão",
  "emails_notificacao": ["email@example.com"]
}
```

#### 3. Listar Notas
```javascript
GET /api/v1/nfse/list?pagina=1&limite=20
Headers: { ... }
```

---

## 📱 Wireframes

### Tela Inicial
```
┌─────────────────────────────────────┐
│  🧾 Emissor NFS-e                  │
│                                     │
│  Bem-vindo!                         │
│                                     │
│  👤 Emissor                         │
│  ┌─────────────────────────────┐   │
│  │ RPG Prestadora          ▼  │   │
│  └─────────────────────────────┘   │
│                                     │
│  O que deseja fazer?                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📝 EMITIR NOTA             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🗑️  CANCELAR NOTA          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📋 CONSULTAR NOTAS         │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Tela Emitir Nota
```
┌─────────────────────────────────────┐
│  ← Voltar     📝 Emitir Nota        │
├─────────────────────────────────────┤
│                                     │
│  Emissor: RPG Prestadora            │
│                                     │
│  🏢 Tomador da Nota                 │
│  ┌─────────────────────────────┐   │
│  │ Atacadão Tiradentes     ▼  │   │
│  └─────────────────────────────┘   │
│                                     │
│  📍 Município                       │
│  ┌─────────────────────────────┐   │
│  │ Londrina                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  📝 Descrição do Serviço            │
│  ┌─────────────────────────────┐   │
│  │ Manutenção elétrica         │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  💰 Valor (R$)                      │
│  ┌─────────────────────────────┐   │
│  │ 350,00                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  📧 Emails para Notificação         │
│  ┌─────────────────────────────┐   │
│  │ email@example.com           │   │
│  └─────────────────────────────┘   │
│  + Adicionar outro email            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     ✅ EMITIR NOTA          │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Tela Consultar Notas
```
┌─────────────────────────────────────┐
│  ← Voltar     📋 Minhas Notas       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NFS-e #30  │  25/12/2025    │   │
│  │ Valor: R$ 1,00               │   │
│  │ Tomador: 48.952.794 GABRIEL  │   │
│  │ ⚠️ NFS-e cancelada           │   │
│  │                              │   │
│  │ [📄 Ver Detalhes]            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NFS-e #29  │  24/12/2025    │   │
│  │ Valor: R$ 1,00               │   │
│  │ Tomador: 48.952.794 GABRIEL  │   │
│  │ ⚠️ NFS-e cancelada           │   │
│  │                              │   │
│  │ [📄 Ver Detalhes]            │   │
│  └─────────────────────────────┘   │
│                                     │
│  [← Anterior]        [Próxima →]   │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔐 Segurança

### Armazenamento de Credenciais

**LocalStorage (Criptografado):**
```javascript
// Armazenar
const credenciais = {
  emissor: "RPG",
  cnpj: "59714129000104",
  senha: btoa("senha_aqui") // Base64 simples
};
localStorage.setItem('nfse_creds', JSON.stringify(credenciais));

// Recuperar
const creds = JSON.parse(localStorage.getItem('nfse_creds'));
```

**Observações:**
- ⚠️ Base64 não é criptografia real, apenas ofuscação
- ✅ Para v1.0 é suficiente (uso local, navegador confiável)
- 🔄 v2.0: Implementar Web Crypto API para criptografia real

---

## 🚀 Stack Tecnológica

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna
- **Tailwind CSS** (via CDN) - Framework CSS utility-first
- **JavaScript Vanilla** - Sem dependências pesadas

### Hospedagem
- **GitHub Pages** (grátis, HTTPS automático)
- **Alternativas:** Netlify, Vercel, Cloudflare Pages

### Ferramentas
- **VSCode** - Editor
- **Live Server** - Desenvolvimento local
- **Git** - Controle de versão

---

## 📦 Plano de Implementação

### Fase 1: Setup (30min)
- [x] Criar repositório `nfse-web-app`
- [ ] Estrutura básica de arquivos
- [ ] HTML inicial com CDN do Tailwind
- [ ] Configurar GitHub Pages

### Fase 2: Interface (2h)
- [ ] Tela inicial (seleção de ação)
- [ ] Tela de emissão
- [ ] Tela de cancelamento
- [ ] Tela de consulta
- [ ] Componentes reutilizáveis (modais, alertas)

### Fase 3: Integração API (1h)
- [ ] Cliente HTTP (api.js)
- [ ] Handlers para cada endpoint
- [ ] Tratamento de erros
- [ ] Loading states

### Fase 4: UX/Acessibilidade (1h)
- [ ] Validação de formulários
- [ ] Mensagens de feedback
- [ ] Estados de loading
- [ ] Responsividade mobile
- [ ] Contraste de cores (WCAG)

### Fase 5: Dados Locais (30min)
- [ ] Salvar/recuperar credenciais
- [ ] Lembrar último emissor
- [ ] Cache de tomadores

### Fase 6: Testes (30min)
- [ ] Testar fluxo completo
- [ ] Testar em mobile
- [ ] Testar com usuário final

### Fase 7: Deploy (15min)
- [ ] Build final
- [ ] Deploy no GitHub Pages
- [ ] Configurar domínio customizado (opcional)
- [ ] Testar em produção

---

## 🎯 Próximos Passos

1. ✅ **Ajustar testes unitários da API** (cobertura ≥90%)
2. Criar repositório `nfse-web-app`
3. Implementar MVP (Fases 1-7)
4. Testar com usuário final
5. Iterar baseado em feedback

---

## 📚 Referências

- [Tailwind CSS](https://tailwindcss.com/)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [WCAG Acessibilidade](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Última atualização:** 26/12/2025
