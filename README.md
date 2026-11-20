# Doce Alquimia — protótipo de loja

Página responsiva em HTML, CSS e JavaScript puro, inspirada no manual da marca e na estrutura editorial do site de referência. Não requer instalação de pacotes, serviços externos, API keys ou backend.

## Abrir

Abra `index.html` em um navegador moderno. Para publicar, envie os arquivos desta pasta para uma hospedagem estática.

## Ajustar para a loja real

Em `app.js`, edite:

- `STORE.whatsapp`: telefone da loja com código do país e DDD, somente números (ex.: `5511999999999`). Está vazio intencionalmente até receber o número correto; o envio fica desativado enquanto não for configurado.
- `STORE.deliveryFee`: taxa de entrega demonstrativa em reais.
- `PRODUCTS`: nomes, descrições, categorias, valores, etiquetas e cores dos produtos. O catálogo e todos os preços deste protótipo são exemplos, pois o manual visual não fornece uma tabela de preços.

O campo de endereço é incluído no texto preparado para o WhatsApp. O navegador abre a conversa somente depois do clique em “Finalizar pelo WhatsApp”; a pessoa confere e envia a mensagem no próprio WhatsApp. O protótipo não envia pedidos em segundo plano nem guarda o endereço.

## O que já está no esboço

- Identidade lavanda, creme, marrom e preto, com o gatinho bruxinho do manual.
- Catálogo filtrável e botão para adicionar produtos à sacola.
- Sacola lateral com quantidade, remoção, taxa e total em BRL.
- Formulário de nome e endereço e mensagem de pedido preenchida para WhatsApp.
- Layout adaptável a celular e desktop; ao entrar nas seções durante a rolagem, o fouet gira, o caldeirão solta fumaça e caem confetes. As animações respeitam a preferência por movimento reduzido.
- Dados exibidos pelo JavaScript são inseridos como texto, sem interpretar conteúdo do catálogo como HTML.

Para uma operação real, confirme preços, disponibilidade, área e taxa de entrega e número de WhatsApp com a loja. Pagamento online, estoque e validação de pedidos exigiriam uma integração de backend.
