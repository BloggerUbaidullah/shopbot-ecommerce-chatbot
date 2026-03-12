/* ===== SHOPBOT SCRIPT.JS ===== */

// ---- State ----
var cart = [];
var cartTotal = 0;

// ---- Product Data ----
var products = {
  laptop: {
    title: "💻 Top laptops for you:",
    items: [
      { e: "💻", n: "Dell Inspiron 15", p: "$449", v: 449 },
      { e: "⚡", n: "ASUS VivoBook",    p: "$329", v: 329 },
      { e: "🖥️", n: "HP Pavilion 14",   p: "$399", v: 399 }
    ]
  },
  phone: {
    title: "📱 Popular smartphones:",
    items: [
      { e: "📱", n: "Samsung S24",  p: "$799", v: 799 },
      { e: "🍎", n: "iPhone 15",    p: "$899", v: 899 },
      { e: "🤖", n: "Google Pixel 8", p: "$699", v: 699 }
    ]
  },
  deal: {
    title: "🔥 Today's best deals:",
    items: [
      { e: "⌚", n: "Smart Watch Pro",  p: "$79",  v: 79  },
      { e: "🖱️", n: "Gaming Mouse",    p: "$29",  v: 29  },
      { e: "🎧", n: "Sony WH-1000XM5", p: "$249", v: 249 }
    ]
  },
  headphone: {
    title: "🎧 Top headphones:",
    items: [
      { e: "🎧", n: "Sony WH-1000XM5", p: "$299", v: 299 },
      { e: "🎵", n: "AirPods Pro",      p: "$249", v: 249 },
      { e: "🔊", n: "JBL Tune 760",     p: "$89",  v: 89  }
    ]
  }
};

// ---- Utility: Get current time ----
function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ---- Add message to chat ----
function addMessage(text, isUser, productItems) {
  var container = document.getElementById('msgs');
  var div = document.createElement('div');
  div.className = 'msg ' + (isUser ? 'user' : 'bot');

  // Build product cards if provided
  var cardsHTML = '';
  if (productItems && productItems.length) {
    cardsHTML = '<div class="prod-cards">' +
      productItems.map(function(p) {
        return '<div class="prod-c" onclick="addToCart(\'' + p.n + '\',' + p.v + ')">' +
          '<div class="prod-c-e">' + p.e + '</div>' +
          '<div class="prod-c-n">' + p.n + '</div>' +
          '<div class="prod-c-p">' + p.p + '</div>' +
          '<button class="prod-c-btn">+ Add</button>' +
          '</div>';
      }).join('') + '</div>';
  }

  var formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  div.innerHTML =
    '<div class="msg-av">' + (isUser ? '👤' : '🛍️') + '</div>' +
    '<div>' +
      '<div class="bubble">' + formattedText + cardsHTML + '</div>' +
      '<div class="msg-time">' + getTime() + '</div>' +
    '</div>';

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// ---- Show typing indicator ----
function showTyping() {
  var container = document.getElementById('msgs');
  var div = document.createElement('div');
  div.className = 'typing-wrap';
  div.id = 'typingDots';
  div.innerHTML =
    '<div class="msg-av" style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#ff6b35,#e85520);display:flex;align-items:center;justify-content:center;font-size:12px;">🛍️</div>' +
    '<div class="typing-bub"><span></span><span></span><span></span></div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// ---- Remove typing indicator ----
function removeTyping() {
  var el = document.getElementById('typingDots');
  if (el) el.remove();
}

// ---- Add item to cart ----
function addToCart(name, price) {
  cart.push({ name: name, price: price });
  cartTotal += price;
  document.getElementById('cc').textContent =
    cart.length + ' item' + (cart.length > 1 ? 's' : '') + ' — $' + cartTotal;
  addMessage('✅ **' + name + '** added!\nCart total: **$' + cartTotal + '**', false);
}

// ---- Checkout ----
function checkout() {
  if (!cart.length) {
    addMessage('🛒 Cart is empty! Let me show you products.', false);
    return;
  }
  var summary = cart.map(function(i) { return '✅ ' + i.name + ' — $' + i.price; }).join('\n');
  addMessage('🎉 **Order Confirmed!**\n\n' + summary + '\n\n**Total: $' + cartTotal + '**\n🚚 Delivery in 3-5 days!', false);
  cart = [];
  cartTotal = 0;
  document.getElementById('cc').textContent = '0 items — $0';
}

// ---- Get bot reply ----
function getReply(msg) {
  var m = msg.toLowerCase();

  if (m.includes('laptop') || m.includes('computer'))
    return { text: products.laptop.title, items: products.laptop.items };
  if (m.includes('phone') || m.includes('mobile') || m.includes('samsung'))
    return { text: products.phone.title, items: products.phone.items };
  if (m.includes('deal') || m.includes('sale') || m.includes('offer'))
    return { text: products.deal.title, items: products.deal.items };
  if (m.includes('headphone') || m.includes('earphone') || m.includes('audio'))
    return { text: products.headphone.title, items: products.headphone.items };
  if (m.includes('track') || m.includes('order'))
    return { text: '📦 Order #ORD-2891 **Shipped** ✅\nDelivery: Tomorrow by 6PM\nCarrier: FedEx — FX928471' };
  if (m.includes('return') || m.includes('refund'))
    return { text: '↩️ **30-Day Free Returns!**\n✅ Full refund guaranteed\n✅ Free pickup from your door\nJust say "I want to return my order"' };
  if (m.includes('hi') || m.includes('hello') || m.includes('hey'))
    return { text: '👋 Hi! Welcome to **ShopBot**! What are you shopping for today? 🛍️' };

  return { text: 'I can help find products, track orders, or process returns.\nTry: "Show me laptops" or "Best deals today" 🛍️' };
}

// ---- Send message ----
function send() {
  var input = document.getElementById('ci');
  var msg = input.value.trim();
  if (!msg) return;

  // Hide quick replies after first message
  document.getElementById('qr').style.display = 'none';
  input.value = '';

  addMessage(msg, true);
  showTyping();

  var reply = getReply(msg);
  setTimeout(function() {
    removeTyping();
    addMessage(reply.text, false, reply.items || null);
  }, 900);
}

// ---- Quick reply shortcut ----
function sq(msg) {
  document.getElementById('ci').value = msg;
  send();
}

// ---- Enter key ----
document.getElementById('ci').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') send();
});

// ---- Hamburger menu ----
document.getElementById('hamBtn').addEventListener('click', function() {
  document.getElementById('mobMenu').classList.toggle('open');
});

// ---- Welcome message on load ----
window.addEventListener('load', function() {
  setTimeout(function() {
    addMessage(
      "👋 Hi! Welcome to **ShopBot**!\n\nI'm your AI shopping assistant. I can help you find products, compare prices, and checkout.\n\nWhat are you looking for today? 🛍️",
      false
    );
  }, 600);
});
