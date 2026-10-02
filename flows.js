// =====================================
// GERENCIADOR DE FLUXOS E SESSÕES
// =====================================
const config = require("./config");

// Estados possíveis da conversa
const STATES = {
  START: "START",
  MAIN_MENU: "MAIN_MENU",
  WAITING_HUMAN: "WAITING_HUMAN",
};

// Armazenamento em memória das sessões ativas por número (msg.from)
const sessions = new Map();

/**
 * Retorna saudação baseada no horário atual
 */
function getGreeting() {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
}

/**
 * Monta o texto do menu principal
 */
function getMainMenu() {
  const saudacao = getGreeting();
  return (
    `${saudacao}! Seja muito bem-vinda(o) à *${config.storeName}*! 👠✨\n\n` +
    `Como podemos te ajudar hoje? Digite o *número* da opção desejada:\n\n` +
    `1️⃣ *Catálogo de Modelos*\n` +
    `2️⃣ *Chave Pix e Pagamento* 🔑\n` +
    `3️⃣ *Prazos de Entrega e Frete* 🚚\n` +
    `4️⃣ *Guia de Tamanhos e Trocas* 📏\n` +
    `5️⃣ *Falar com Atendente* 👩‍💼\n\n` +
    `💡 *Dica:* Você pode digitar a palavra *pix* a qualquer momento para receber a chave Pix rapidamente.`
  );
}

/**
 * Recupera ou cria uma sessão para o contato
 */
function getSession(userId) {
  const now = Date.now();
  const session = sessions.get(userId);

  // Se a sessão expirou por inatividade, reseta para o início
  if (session && now - session.lastInteraction > config.sessionTimeoutMinutes * 60 * 1000) {
    sessions.delete(userId);
  }

  if (!sessions.has(userId)) {
    sessions.set(userId, {
      state: STATES.START,
      lastInteraction: now,
    });
  }

  const currentSession = sessions.get(userId);
  currentSession.lastInteraction = now;
  return currentSession;
}

/**
 * Processa a mensagem recebida e retorna um array de mensagens para envio
 * @returns {Array<string>|null} Lista de mensagens de texto a enviar, ou null para não responder
 */
async function processMessage(msg) {
  const userId = msg.from;
  const session = getSession(userId);
  const rawText = msg.body ? msg.body.trim() : "";
  const texto = rawText.toLowerCase();

  // 1. Se estiver com atendimento humano ativo:
  if (session.state === STATES.WAITING_HUMAN) {
    // Cliente ou atendente quer reativar o robô
    if (/^(menu|in[ií]cio|voltar|#|começar)$/i.test(texto)) {
      session.state = STATES.MAIN_MENU;
      return [getMainMenu()];
    }
    // Enquanto o humano atende, o bot se mantém em silêncio
    return null;
  }

  // 2. Detecção de envio de Comprovante de Pagamento (imagem ou texto com a palavra comprovante)
  if (msg.hasMedia || texto.includes("comprovante")) {
    session.state = STATES.WAITING_HUMAN;
    return [config.receiptReceivedMessage];
  }

  // 3. PROTOCOLO PIX DIRETO (Palavra-chave a qualquer momento)
  if (
    texto === "pix" ||
    texto === "chave pix" ||
    texto === "qual o pix" ||
    texto === "manda o pix" ||
    texto === "pagamento" ||
    texto === "pagar"
  ) {
    session.state = STATES.MAIN_MENU;
    const replies = [config.pixMessage];
    if (config.sendRawPixKeyForEasyCopy && config.pixKey) {
      // Envia a chave pura logo após para facilitar "copiar e colar" com um toque
      replies.push(config.pixKey);
    }
    return replies;
  }

  // 4. Saudações ou solicitação de menu
  if (/^(menu|oi|ol[aá]|bom dia|boa tarde|boa noite|opa|ei|in[ií]cio|começar|0)$/i.test(texto)) {
    session.state = STATES.MAIN_MENU;
    return [getMainMenu()];
  }

  // 5. Opções numéricas do Menu Principal
  switch (texto) {
    case "1":
      session.state = STATES.MAIN_MENU;
      return [config.catalogMessage];

    case "2": {
      session.state = STATES.MAIN_MENU;
      const replies = [config.pixMessage];
      if (config.sendRawPixKeyForEasyCopy && config.pixKey) {
        replies.push(config.pixKey);
      }
      return replies;
    }

    case "3":
      session.state = STATES.MAIN_MENU;
      return [config.deliveryMessage];

    case "4":
      session.state = STATES.MAIN_MENU;
      return [config.sizeAndExchangeMessage];

    case "5":
      session.state = STATES.WAITING_HUMAN;
      return [config.humanSupportMessage];

    default:
      // Se acabou de iniciar conversa e mandou algo desconhecido, envia o menu de boas-vindas
      if (session.state === STATES.START) {
        session.state = STATES.MAIN_MENU;
        return [getMainMenu()];
      }
      // Se já estava no menu e digitou algo inválido
      return [config.invalidOptionMessage];
  }
}

module.exports = {
  processMessage,
  STATES,
  sessions,
};
