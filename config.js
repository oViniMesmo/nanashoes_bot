// =====================================
// CONFIGURAÇÕES DA LOJA - NANA SHOES
// =====================================

module.exports = {
  // Nome da loja
  storeName: "Nana Shoes",

  // Dados da Chave Pix
  pixKey: "85987927266",
  pixKeyType: "Celular",

  // Link do catálogo e pagamento parcelado
  storeUrl: "https://jim.com/a/nanashoes",

  // Mensagem padrão do protocolo Pix solicitada
  pixMessage:
`Aqui está a chave pix de Nana Shoes 🔑
Chave celular: 85987927266

💳 Ou pague em até 4x sem juros aqui:
https://jim.com/a/nanashoes

Me manda o comprovante e qual sua numeração que já separo seu par! 👟`,

  // Enviar a chave Pix pura logo em seguida para facilitar o "copiar e colar" no celular
  sendRawPixKeyForEasyCopy: true,

  // Tempo de inatividade (em minutos) para reiniciar a conversa automaticamente
  sessionTimeoutMinutes: 30,

  // =====================================
  // RESPOSTAS DO MENU
  // =====================================

  catalogMessage:
`🛍️ *Catálogo & Coleções - Nana Shoes* 👠

Confira nossos modelos disponíveis e novidades no link abaixo:
👉 https://jim.com/a/nanashoes

💡 *Como pedir:*
Tire um print do modelo escolhido ou anote o nome dele e envie aqui com o seu número!

_Digite *0* para voltar ao menu ou *5* para falar com uma vendedora._`,

  deliveryMessage:
`🚚 *Informações de Frete e Entregas - Nana Shoes* 📦

• *Envios Nacionais:* Enviamos para todo o Brasil via Correios ou Transportadora.
• *Fortaleza e Região:* Entregas rápidas via Motoboy! 🛵💨

📍 *Deseja calcular o frete e prazo?*
Por favor, envie o seu *CEP* ou *Bairro* para que possamos calcular para você.

_Digite *0* para voltar ao menu ou *5* para falar com uma vendedora._`,

  sizeAndExchangeMessage:
`📏 *Guia de Tamanhos & Política de Trocas* 👟

• *Forma:* Nossos calçados possuem forma padrão brasileira. Recomendamos pedir a numeração que você costuma calçar.
• *Trocas:* Caso precise trocar a numeração, você tem até 7 dias corridos após o recebimento (com o produto sem uso).

_Digite *0* para voltar ao menu ou *5* para tirar dúvidas com nossa equipe._`,

  humanSupportMessage:
`👩‍💼 *Transferindo para Atendimento Humano...*

Nossa equipe da *Nana Shoes* já foi notificada e vai te responder aqui mesmo em breve!

⚠️ *O robô foi pausado para você poder conversar tranquilamente.*
_(Se quiser reativar o menu automático mais tarde, basta digitar *menu* ou *#*)._`,

  receiptReceivedMessage:
`🧾 *Comprovante recebido!*

Muito obrigada! Nossa equipe da *Nana Shoes* já está conferindo o pagamento e separando o seu par. Em instantes te confirmamos tudo por aqui! 👟✨`,

  invalidOptionMessage:
`Ops, não entendi essa opção! 🤔

Por favor, escolha uma das opções do menu digitando o número correspondente (1 a 5), ou digite *0* para ver o menu novamente.`
};
