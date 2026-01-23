# 🚀 Desenvolvimento Local

Este guia explica como executar o frontend localmente e conectá-lo ao backend local.

## 📋 Pré-requisitos

- Python 3.9+ (para o backend)
- Servidor HTTP simples (para o frontend)
- Navegador web moderno

## 🔧 Configuração do Backend

### 1. Navegar até o diretório do backend

```bash
cd /mnt/programas/Projetos/Python/nfse-api-client
```

### 2. Ativar ambiente virtual (se houver)

```bash
# Se usar venv
source .venv/bin/activate

# Se usar conda
conda activate nfse-api
```

### 3. Instalar dependências

```bash
pip install -r requirements.txt
```

### 4. Configurar variáveis de ambiente (opcional)

Crie um arquivo `.env` com suas credenciais padrão (opcional):

```env
NFSE_USER=seu_cnpj_aqui
NFSE_PASS=sua_senha_aqui
```

### 5. Iniciar o servidor backend

```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

O backend estará disponível em: **http://localhost:8000**

Você pode verificar se está rodando acessando: http://localhost:8000/health

## 🌐 Configuração do Frontend

### 1. Navegar até o diretório do frontend

```bash
cd /mnt/programas/Projetos/WebApp/nfse-emissor-web
```

### 2. Iniciar servidor HTTP

Escolha uma das opções:

#### Opção 1: Python (recomendado)
```bash
python3 -m http.server 8080
```

#### Opção 2: Node.js (se tiver instalado)
```bash
npx http-server -p 8080
```

#### Opção 3: PHP (se tiver instalado)
```bash
php -S localhost:8080
```

O frontend estará disponível em: **http://localhost:8080**

## 🎯 Como Funciona

### Detecção Automática de Ambiente

O frontend detecta automaticamente quando está rodando localmente e ajusta a URL da API:

| Ambiente | URL do Frontend | URL da API |
|----------|----------------|------------|
| **Local** | localhost:8080 | http://localhost:8000 |
| Dev | galencar1.github.io/dev/ | https://nfse-api-dev.onrender.com |
| Hom | galencar1.github.io/hom/ | https://nfse-api-hom.onrender.com |
| Prod | galencar1.github.io/ | https://nfse-api-prd.onrender.com |

### Verificação da Configuração

Abra o console do navegador (F12) ao carregar a página. Você deve ver:

```
🌍 Ambiente detectado: Local (Desenvolvimento) (local)
🔗 API: http://localhost:8000
```

## 🧪 Testando a Integração

1. Abra o frontend em http://localhost:8080
2. Selecione um emissor
3. Configure as credenciais
4. Tente listar notas ou emitir uma nota
5. Verifique o console do navegador para ver as requisições
6. Verifique o terminal do backend para ver os logs

## 🐛 Troubleshooting

### Erro: "Credenciais não configuradas"
- Configure as credenciais do emissor clicando em "⚙️ Configurar"

### Erro: "Failed to fetch" ou "Network Error"
- Verifique se o backend está rodando em http://localhost:8000
- Teste acessando http://localhost:8000/health no navegador
- Verifique o console do navegador para detalhes do erro

### Erro de CORS
- O backend já está configurado para aceitar requisições de localhost
- Se ainda tiver problemas, verifique o arquivo `api/main.py` na seção `CORSMiddleware`

### Backend não inicia
- Verifique se todas as dependências estão instaladas: `pip install -r requirements.txt`
- Verifique se a porta 8000 não está em uso: `lsof -i :8000`

### Frontend não carrega
- Verifique se a porta 8080 não está em uso: `lsof -i :8080`
- Tente usar outra porta: `python3 -m http.server 3000`
- Limpe o cache do navegador (Ctrl+Shift+R)

## 📝 Notas Importantes

1. **Credenciais**: O frontend salva as credenciais apenas no LocalStorage do navegador
2. **Cache**: Os dados de notas ficam em cache por 5 minutos no backend
3. **Logs**: Todos os logs aparecem no terminal onde você iniciou o backend
4. **Hot Reload**: O backend recarrega automaticamente ao editar arquivos Python (--reload)

## 🔄 Mudança de Ambiente

Para testar outros ambientes sem mudar o código:

1. **Dev**: Acesse via GitHub Pages `/dev/index.html`
2. **Hom**: Acesse via GitHub Pages `/hom/index.html`
3. **Prod**: Acesse via GitHub Pages `/index.html` (raiz)

Ou force um ambiente específico editando temporariamente `js/config.js`:

```javascript
// Força ambiente dev (temporário para testes)
const AMBIENTE_ATUAL = 'dev'; // comentar a linha: detectarAmbiente()
```

## 🎨 Indicador Visual de Ambiente

O frontend mostra um badge colorido indicando o ambiente:

- 🟣 **Roxo** - Local (localhost)
- 🟡 **Amarelo** - Desenvolvimento
- 🟠 **Laranja** - Homologação
- 🟢 **Verde** - Produção
