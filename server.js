// =====================================
// PAINEL VISUAL WEB DO QR CODE - NANA SHOES
// =====================================
const http = require("http");
const QRCode = require("qrcode");
const config = require("./config");

let currentStatus = "loading"; // 'loading' | 'qr' | 'ready' | 'disconnected'
let currentQrImage = null;

function setQr(qrString) {
  currentStatus = "qr";
  QRCode.toDataURL(qrString, { width: 340, margin: 2 }, (err, url) => {
    if (!err) {
      currentQrImage = url;
    }
  });
}

function setReady() {
  currentStatus = "ready";
  currentQrImage = null;
}

function setDisconnected() {
  currentStatus = "disconnected";
}

function getHtmlPage() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ativação WhatsApp - ${config.storeName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #d81b60;
      --primary-light: #fce4ec;
      --bg: #0f1115;
      --card-bg: #181b22;
      --border: #2a2e39;
      --text: #ffffff;
      --text-muted: #9aa0a6;
      --success: #00e676;
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
      max-width: 480px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 36px 28px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(216, 27, 96, 0.15);
      color: #ff4081;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
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
    .qr-box {
      background: #ffffff;
      padding: 16px;
      border-radius: 18px;
      display: inline-block;
      margin: 12px auto 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      min-width: 280px;
      min-height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-box img {
      width: 100%;
      max-width: 280px;
      height: auto;
      display: block;
      border-radius: 8px;
    }
    .status-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 14px;
      color: #ff80ab;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ff4081;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 64, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(255, 64, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 64, 129, 0); }
    }
    .instructions {
      text-align: left;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 16px;
      margin-top: 10px;
    }
    .instructions h3 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 10px;
    }
    .step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 8px;
      color: #e0e0e0;
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
    .success-card {
      display: none;
      padding: 20px 0;
    }
    .success-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }
    .success-title {
      font-size: 22px;
      color: var(--success);
      font-weight: 800;
      margin-bottom: 8px;
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
    <h1>Ativação do WhatsApp</h1>
    <p class="subtitle">Este QR Code é exclusivo para conectar o WhatsApp oficial da <strong>${config.storeName}</strong> ao robô de atendimento 24h.</p>

    <!-- ÁREA DO QR CODE -->
    <div id="qr-section">
      <div class="qr-box">
        <img id="qr-img" src="" alt="Carregando QR Code..." style="display:none;">
        <span id="loading-text" style="color: #666; font-size: 14px;">Iniciando conexão segura...</span>
      </div>

      <div class="status-text">
        <span class="pulse-dot"></span>
        <span id="status-label">Aguardando leitura do código...</span>
      </div>

      <div class="instructions">
        <h3>Passo a passo no seu celular:</h3>
        <div class="step">
          <span class="step-number">1</span>
          <span>Abra o WhatsApp no aparelho da <strong>${config.storeName}</strong>.</span>
        </div>
        <div class="step">
          <span class="step-number">2</span>
          <span>Toque nos <strong>3 pontinhos</strong> (ou Configurações no iPhone).</span>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <span>Acesse <strong>Aparelhos conectados > Conectar um aparelho</strong>.</span>
        </div>
        <div class="step">
          <span class="step-number">4</span>
          <span>Aponte a câmera para o QR Code acima!</span>
        </div>
      </div>
    </div>

    <!-- TELA DE SUCESSO (EXIBIDA APÓS ESCANEAR) -->
    <div id="success-section" class="success-card">
      <div class="success-icon">🎉</div>
      <div class="success-title">WhatsApp Conectado!</div>
      <p style="color: var(--text-muted); font-size: 14px; line-height: 1.6; margin-top: 12px;">
        O atendimento automático da <strong>${config.storeName}</strong> já está ativo e respondendo aos clientes em tempo real.
      </p>
    </div>

    <div class="footer">
      Ambiente Seguro &bull; Atualização em tempo real
    </div>
  </div>

  <script>
    async function checkStatus() {
      try {
        const res = await fetch('/status');
        const data = await res.json();

        const qrSection = document.getElementById('qr-section');
        const successSection = document.getElementById('success-section');
        const qrImg = document.getElementById('qr-img');
        const loadingText = document.getElementById('loading-text');
        const statusLabel = document.getElementById('status-label');

        if (data.status === 'ready') {
          qrSection.style.display = 'none';
          successSection.style.display = 'block';
        } else if (data.status === 'qr' && data.qrImage) {
          loadingText.style.display = 'none';
          qrImg.src = data.qrImage;
          qrImg.style.display = 'block';
          statusLabel.innerText = 'Código atualizado! Aponte a câmera do WhatsApp.';
        }
      } catch (e) {
        console.error('Erro ao verificar status:', e);
      }
    }

    // Consulta o status a cada 2.5 segundos
    setInterval(checkStatus, 2500);
    checkStatus();
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
    console.log(`🌐 Painel visual do QR Code rodando em: http://localhost:${port}`);
  });

  return server;
}

module.exports = {
  startServer,
  setQr,
  setReady,
  setDisconnected,
};
