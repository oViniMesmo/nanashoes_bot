// =====================================
// PAINEL VISUAL WEB E STATUS EM TEMPO REAL - NANA SHOES
// =====================================
const http = require("http");
const QRCode = require("qrcode");
const config = require("./config");

let currentStatus = "loading"; // 'loading' | 'qr' | 'ready' | 'disconnected'
let currentQrImage = null;
let connectedAt = null;
let connectedNumber = null;
let messagesCount = 0;

function setQr(qrString) {
  currentStatus = "qr";
  QRCode.toDataURL(qrString, { width: 340, margin: 2 }, (err, url) => {
    if (!err) {
      currentQrImage = url;
    }
  });
}

function setReady(number = null) {
  currentStatus = "ready";
  currentQrImage = null;
  connectedAt = new Date();
  connectedNumber = number;
}

function setDisconnected() {
  currentStatus = "disconnected";
}

function incrementMessageCount() {
  messagesCount++;
}

function formatConnectedTime() {
  if (!connectedAt) return null;
  return connectedAt.toLocaleString("pt-BR", {
    timeZone: "America/Fortaleza",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getHtmlPage() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel de Ativação - ${config.storeName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #d81b60;
      --bg: #0d0f14;
      --card-bg: #161922;
      --border: #232733;
      --text: #ffffff;
      --text-muted: #8e95a5;
      --success: #00e676;
      --warning: #ffab00;
      --danger: #ff5252;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    body {
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .container {
      width: 100%;
      max-width: 500px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(216, 27, 96, 0.12);
      color: #ff4081;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      border: 1px solid rgba(216, 27, 96, 0.3);
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    /* STATUS PILL */
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 24px;
      transition: all 0.3s ease;
    }
    .status-pill.online {
      background: rgba(0, 230, 118, 0.12);
      color: var(--success);
      border: 1px solid rgba(0, 230, 118, 0.3);
    }
    .status-pill.waiting {
      background: rgba(255, 171, 0, 0.12);
      color: var(--warning);
      border: 1px solid rgba(255, 171, 0, 0.3);
    }
    .status-pill.offline {
      background: rgba(255, 82, 82, 0.12);
      color: var(--danger);
      border: 1px solid rgba(255, 82, 82, 0.3);
    }

    .pulse {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: currentColor;
      box-shadow: 0 0 0 0 currentColor;
      animation: pulseAnim 1.6s infinite;
    }
    @keyframes pulseAnim {
      0% { transform: scale(0.95); opacity: 0.9; box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.6); }
      70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 8px rgba(255, 255, 255, 0); }
      100% { transform: scale(0.95); opacity: 0.9; box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
    }

    /* QR BOX */
    .qr-box {
      background: #ffffff;
      padding: 16px;
      border-radius: 20px;
      margin: 0 auto 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
      width: 300px;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      border-radius: 10px;
    }

    /* INSTRUCTIONS */
    .instructions {
      text-align: left;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 18px;
      margin-top: 14px;
    }
    .instructions h3 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }
    .step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 8px;
      color: #d1d5db;
    }
    .step-number {
      background: var(--primary);
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      flex-shrink: 0;
      margin-top: 1px;
    }

    /* TELA QUANDO ESTÁ ONLINE */
    .online-card {
      display: none;
      padding: 10px 0;
    }
    .online-icon {
      font-size: 56px;
      margin-bottom: 14px;
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 24px;
      text-align: left;
    }
    .metric-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 14px;
    }
    .metric-label {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
      display: block;
    }
    .metric-value {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
    }

    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">👠 ${config.storeName}</div>
    <h1>Central do Robô</h1>
    <p class="subtitle">Monitoramento e Ativação do Atendimento Automático 24h</p>

    <!-- PÍLULA DE STATUS DINÂMICA -->
    <div id="status-pill" class="status-pill waiting">
      <span class="pulse"></span>
      <span id="status-text">Iniciando conexão...</span>
    </div>

    <!-- SEÇÃO: AGUARDANDO QR CODE -->
    <div id="qr-section">
      <div class="qr-box">
        <img id="qr-img" src="" alt="QR Code" style="display:none;">
        <span id="loading-spinner" style="color: #666; font-size: 14px;">Gerando QR Code seguro...</span>
      </div>

      <div class="instructions">
        <h3>Como conectar seu WhatsApp:</h3>
        <div class="step">
          <span class="step-number">1</span>
          <span>Abra o WhatsApp no celular da <strong>${config.storeName}</strong>.</span>
        </div>
        <div class="step">
          <span class="step-number">2</span>
          <span>Toque nos <strong>3 pontinhos</strong> (ou Configurações no iPhone).</span>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <span>Selecione <strong>Aparelhos conectados > Conectar um aparelho</strong>.</span>
        </div>
        <div class="step">
          <span class="step-number">4</span>
          <span>Aponte a câmera para o QR Code acima!</span>
        </div>
      </div>
    </div>

    <!-- SEÇÃO: ROBÔ 100% ONLINE E CONECTADO -->
    <div id="online-section" class="online-card">
      <div class="online-icon">🟢</div>
      <h2 style="font-size: 22px; color: var(--success); font-weight: 800; margin-bottom: 8px;">Robô Ativo & Operando!</h2>
      <p style="color: var(--text-muted); font-size: 14px; line-height: 1.5;">
        O WhatsApp da <strong>${config.storeName}</strong> está conectado e respondendo a todos os clientes automaticamente.
      </p>

      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-label">Status do WhatsApp</span>
          <span class="metric-value" style="color: var(--success);">100% Conectado</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Ativo Desde</span>
          <span class="metric-value" id="connected-time">--:--</span>
        </div>
        <div class="metric-item" style="grid-column: span 2;">
          <span class="metric-label">Mensagens Automáticas Respondidas</span>
          <span class="metric-value" id="messages-count">0</span>
        </div>
      </div>
    </div>

    <div class="footer">
      Ambiente de Produção &bull; Sincronização em Tempo Real
    </div>
  </div>

  <script>
    async function updateStatus() {
      try {
        const res = await fetch('/status');
        const data = await res.json();

        const pill = document.getElementById('status-pill');
        const statusText = document.getElementById('status-text');
        const qrSection = document.getElementById('qr-section');
        const onlineSection = document.getElementById('online-section');
        const qrImg = document.getElementById('qr-img');
        const loadingSpinner = document.getElementById('loading-spinner');
        const connectedTime = document.getElementById('connected-time');
        const messagesCount = document.getElementById('messages-count');

        if (data.status === 'ready') {
          pill.className = 'status-pill online';
          statusText.innerText = 'ROBÔ ONLINE & CONECTADO';
          qrSection.style.display = 'none';
          onlineSection.style.display = 'block';

          if (data.connectedAt) {
            connectedTime.innerText = data.connectedAt;
          }
          messagesCount.innerText = data.messagesCount || 0;
        } else if (data.status === 'qr' && data.qrImage) {
          pill.className = 'status-pill waiting';
          statusText.innerText = 'AGUARDANDO LEITURA DO QR CODE';
          qrSection.style.display = 'block';
          onlineSection.style.display = 'none';

          loadingSpinner.style.display = 'none';
          qrImg.src = data.qrImage;
          qrImg.style.display = 'block';
        } else if (data.status === 'disconnected') {
          pill.className = 'status-pill offline';
          statusText.innerText = 'DESCONECTADO (Reconectando...)';
        }
      } catch (e) {
        console.error('Falha ao checar status:', e);
      }
    }

    setInterval(updateStatus, 2000);
    updateStatus();
  </script>
</body>
</html>`;
}

function startServer(port = process.env.PORT || 3000) {
  const server = http.createServer((req, res) => {
    if (req.url === "/status") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: currentStatus,
          qrImage: currentQrImage,
          connectedAt: formatConnectedTime(),
          connectedNumber: connectedNumber,
          messagesCount: messagesCount,
          storeName: config.storeName,
        })
      );
      return;
    }

    if (req.url === "/" || req.url === "/qrcode") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(getHtmlPage());
      return;
    }

    res.writeHead(404);
    res.end("Not found");
  });

  server.listen(port, () => {
    console.log(`🌐 Painel visual do robô rodando em: http://localhost:${port}`);
  });

  return server;
}

module.exports = {
  startServer,
  setQr,
  setReady,
  setDisconnected,
  incrementMessageCount,
};
