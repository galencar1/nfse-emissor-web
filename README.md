# 🧾 Emissor NFS-e Web

Progressive Web App (PWA) para emissão, cancelamento e consulta de Notas Fiscais de Serviço Eletrônicas.

## 📱 Características

- ✅ **Instalável** - Adicione à tela inicial como um app nativo
- ✅ **Responsivo** - Funciona em celular, tablet e desktop
- ✅ **Offline** - Consulte notas mesmo sem internet
- ✅ **Acessível** - Interface clara e amigável para todos os usuários

## 🎯 Funcionalidades

- 📝 Emitir NFS-e
- 🗑️ Cancelar NFS-e
- 📋 Consultar notas emitidas
- 👤 Seleção de emissor
- 🏢 Seleção de tomador (Atacadão + outros)

## 🚀 Como usar

### Opção 1: Acesso Web
Acesse: [https://[seu-usuario].github.io/nfse-emissor-web](https://[seu-usuario].github.io/nfse-emissor-web)

### Opção 2: Instalar como App
1. Acesse o site pelo celular
2. Toque em "Adicionar à tela inicial"
3. Use como um app normal!

## 🛠️ Tecnologias

- HTML5
- CSS3 + Tailwind CSS
- JavaScript Vanilla
- PWA (Progressive Web App)

## 📦 Desenvolvimento Local

### Início Rápido (Recomendado)

Use o script automático que inicia backend e frontend juntos:

```bash
./start-local-dev.sh
```

Isso irá:
- ✅ Iniciar o backend em `http://localhost:8000`
- ✅ Iniciar o frontend em `http://localhost:8080`
- ✅ Configurar o frontend para usar o backend local automaticamente

### Manual

#### Backend (Python)
```bash
cd /mnt/programas/Projetos/Python/nfse-api-client
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd /mnt/programas/Projetos/WebApp/nfse-emissor-web
python3 -m http.server 8080
```

Acesse: `http://localhost:8080`

🔍 **O frontend detecta automaticamente que está rodando localmente e usa `http://localhost:8000` como API.**

📚 Para mais detalhes, veja: [LOCAL_DEV.md](LOCAL_DEV.md)
```

## 🔐 Configuração

As credenciais são armazenadas localmente no navegador (LocalStorage).
Nenhuma informação sensível é enviada para servidores externos.

## 📝 API

Este app consome a API NFS-e:
- **Desenvolvimento**: `https://nfse-api-dev.onrender.com`
- **Produção**: TBD

## 👤 Público-alvo

Trabalhadores autônomos de manutenção (elétrica, hidráulica, civil) que precisam emitir notas fiscais de forma simples e rápida.

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou envie um PR.

---

**Desenvolvido com ❤️ para facilitar o dia a dia dos trabalhadores**
