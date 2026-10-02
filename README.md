# 👠 Bot WhatsApp - Nana Shoes

Chatbot automatizado para atendimento no WhatsApp da **Nana Shoes**, desenvolvido em Node.js com `whatsapp-web.js`.

---

## 📋 
---

## 📁 Estrutura do Projeto

```
├── config.js         # Dados da loja (chave Pix, links, textos e mensagens)
├── flows.js          # Lógica dos fluxos, máquina de estados e sessões
├── chatbot.js        # Inicialização do WhatsApp e envio de mensagens
├── package.json      # Dependências do projeto
└── .gitignore        # Bloqueia pastas de sessão e node_modules
```

---

## 💻 Como Rodar Localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o robô:**
   ```bash
   node chatbot.js
   ```

3. **Escaneie o QR Code:**
   Abra o WhatsApp no celular, vá em **Aparelhos Conectados > Conectar um aparelho** e escaneie o código exibido no terminal.

---

## ☁️ Como Rodar no Servidor (Oracle Cloud / VPS Linux)

1. Instale o **Node.js** e o **Git** na máquina virtual.
2. Clone o repositório e instale as dependências:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd Chatbot
   npm install
   ```
3. Instale as bibliotecas necessárias para o Chromium (Puppeteer) rodar no Linux:
   ```bash
   sudo apt update
   sudo apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
   ```
4. Instale o **PM2** para manter o robô rodando 24 horas:
   ```bash
   sudo npm install -g pm2
   pm2 start chatbot.js --name "nanashoes-bot"
   pm2 save
   pm2 startup
   ```
5. Para visualizar o QR Code na primeira vez:
   ```bash
   pm2 logs nanashoes-bot
   ```
