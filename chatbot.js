// =====================================
// IMPORTAÇÕES
// =====================================
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const flows = require("./flows");

// =====================================
// CONFIGURAÇÃO DO CLIENTE WHATSAPP
// =====================================
const puppeteerOptions = {
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-zygote",
  ],
};

if (process.env.PUPPETEER_EXECUTABLE_PATH) {
  puppeteerOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
}

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: process.env.SESSION_DATA_PATH || "./",
  }),
  puppeteer: puppeteerOptions,
});

// =====================================
// EVENTOS DO CLIENTE
// =====================================
client.on("qr", (qr) => {
  console.log("\n📲 Escaneie o QR Code abaixo com o WhatsApp da loja:\n");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Tudo certo! WhatsApp da Nana Shoes conectado e pronto para atender.");
});

client.on("disconnected", (reason) => {
  console.log("⚠️ WhatsApp desconectado:", reason);
});

// =====================================
// FUNÇÃO UTILITÁRIA DE DELAY
// =====================================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// =====================================
// RECEBIMENTO E PROCESSAMENTO DE MENSAGENS
// =====================================
client.on("message", async (msg) => {
  try {
    // ❌ Ignora grupos e mensagens de transmissão/status
    if (!msg.from || msg.from.endsWith("@g.us") || msg.from.includes("@broadcast")) {
      return;
    }

    const chat = await msg.getChat();
    if (chat.isGroup) return;

    // Processa a mensagem através dos fluxos da loja
    const replies = await flows.processMessage(msg);

    // Se houver respostas a enviar (caso não esteja em atendimento humano)
    if (replies && replies.length > 0) {
      // Simula digitação para resposta natural
      await chat.sendStateTyping();
      await delay(1500);

      for (let i = 0; i < replies.length; i++) {
        await client.sendMessage(msg.from, replies[i]);
        if (i < replies.length - 1) {
          await delay(800); // pequeno intervalo entre mensagens múltiplas
        }
      }
    }
  } catch (error) {
    console.error("❌ Erro no processamento da mensagem:", error);
  }
});

// =====================================
// INICIALIZAÇÃO
// =====================================
client.initialize();
