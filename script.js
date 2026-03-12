var cart = [], cartTotal = 0;

var responses = {
  laptop: {
    text: "Great choice! 💻 Here are our top laptops under $500:",
    products: [
      {e:"💻",n:"Dell Inspiron 15",p:"$449",old:"$599",val:449},
      {e:"🖥️",n:"HP Pavilion 14",p:"$399",old:"$549",val:399},
      {e:"⚡",n:"ASUS VivoBook",p:"$329",old:"$449",val:329},
    ]
  },
  headphones: {
    text: "🎧 Top wireless headphones for you:",
    products: [
      {e:"🎧",n:"Sony WH-1000XM5",p:"$299",old:"$399",val:299},
      {e:"🎵",n:"Apple AirPods Pro",p:"$249",old:"$349",val:249},
      {e:"🔊",n:"JBL Tune 760NC",p:"$89",old:"$129",val:89},
    ]
  },
  deals: {
    text: "🔥 Today's HOT deals — limited time only!",
    products: [
      {e:"📱",n:"Samsung Galaxy A54",p:"$299",old:"$449",val:299},
      {e:"⌚",n:"Smart Watch Pro",p:"$79",old:"$199",val:79},
      {e:"🖱️",n:"Gaming Mouse RGB",p:"$29",old:"$69",val:29},
    ]
  }
};

var autoReplies = {
  'track': "📦 Order Tracking:\n\nOrder #ORD-2891: **Shipped** ✅\nEstimated delivery: Tomorrow by 6 PM\nCarrier: FedEx — Tracking: FX928471\n\nAnything else I can help with?",
  'return': "↩️ Our Return Policy:\n\n✅ 30-day free returns\n✅ Full refund or exchange\n✅ Free pickup from your door\n✅ No questions asked!\n\nJust say 'I want to return' and I'll start the process!",
  'hello': "👋 Hello! Welcome to ShopBot!\n\nI'm your AI shopping assistant. I can help you:\n🔍 Find products\n💰 Compare prices\n📦 Track orders\n↩️ Process returns\n\nWhat are you looking for today?",
  'price': "💰 We have products in all price ranges!\n\nBudget: $10 – $100\nMid-range: $100 – $500\nPremium: $500+\n\nTell me your budget and I'll find the best options! 😊",
  'default': "Thanks for your message! 🛍️\n\nI can help you find products, check prices, track orders, or process returns.\n\nTry asking: 'Show me laptops under $500' or 'Best deals today'!"
};

function gt(){return new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}

function addMsg(txt, isUser, products){
  var c=document.getElementById('chat');
  var d=document.createElement('div');
  d.className='msg '+(isUser?'user':'bot');
  var fmt=txt.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
  var prods='';
  if(products){
    prods='<div class="prod-row">';
    products.forEach(function(p,i){
      prods+='<div class="prod-card" onclick="addToCart(\''+p.n+'\','+p.val+')">'+
        '<span class="prod-emoji">'+p.e+'</span>'+
        '<div class="prod-name">'+p.n+'</div>'+
        '<div class="prod-price">'+p.p+'</div>'+
        '<div class="prod-old">'+p.old+'</div>'+
        '<button class="add-btn">+ Add to Cart</button></div>';
    });
    prods+='</div>';
  }
  d.innerHTML='<div class="mav">'+(isUser?'👤':'🛍️')+'</div>'+
    '<div><div class="bub">'+fmt+prods+'</div><div class="mtime">'+gt()+'</div></div>';
  c.appendChild(d);
  c.scrollTop=c.scrollHeight;
}

function showTyping(){
  var c=document.getElementById('chat');
  var d=document.createElement('div');
  d.className='typing';d.id='typ';
  d.innerHTML='<div class="mav" style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#ff6b35,#00e5ff);display:flex;align-items:center;justify-content:center;font-size:13px;">🛍️</div>'+
    '<div class="tdots"><span></span><span></span><span></span></div>';
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}
function removeTyping(){var t=document.getElementById('typ');if(t)t.remove()}

function addToCart(name, price){
  cart.push({name,price});
  cartTotal+=price;
  document.getElementById('cartCount').textContent=cart.length+' item'+(cart.length>1?'s':'');
  document.getElementById('cartTotal').textContent='$'+cartTotal;
  addMsg('✅ **'+name+'** added to cart!\n\nCart total: **$'+cartTotal+'**\nItems: **'+cart.length+'**\n\nContinue shopping or checkout? 🛒',false);
}

function checkout(){
  if(!cart.length){addMsg("Your cart is empty! 🛒\n\nLet me help you find some products. What are you looking for?",false);return}
  addMsg('🎉 Order Confirmed!\n\n'+cart.map(function(i){return '✅ '+i.name+' — $'+i.price}).join('\n')+'\n\n**Total: $'+cartTotal+'**\n\nPayment link sent to your email! 📧\nDelivery in 3-5 business days. Thank you! 🙏',false);
  cart=[];cartTotal=0;
  document.getElementById('cartCount').textContent='0 items';
  document.getElementById('cartTotal').textContent='$0';
}

function getReply(msg){
  var m=msg.toLowerCase();
  if(m.includes('laptop')||m.includes('computer')) return {text:responses.laptop.text, products:responses.laptop.products};
  if(m.includes('headphone')||m.includes('earphone')||m.includes('audio')) return {text:responses.headphones.text, products:responses.headphones.products};
  if(m.includes('deal')||m.includes('sale')||m.includes('offer')||m.includes('discount')) return {text:responses.deals.text, products:responses.deals.products};
  if(m.includes('track')||m.includes('order')||m.includes('delivery')) return {text:autoReplies.track};
  if(m.includes('return')||m.includes('refund')||m.includes('policy')) return {text:autoReplies.return};
  if(m.includes('hello')||m.includes('hi')||m.includes('hey')) return {text:autoReplies.hello};
  if(m.includes('price')||m.includes('cost')||m.includes('budget')||m.includes('cheap')) return {text:autoReplies.price};
  if(m.includes('phone')||m.includes('mobile')||m.includes('samsung')||m.includes('iphone')) return {text:"📱 Popular smartphones:",products:[{e:"📱",n:"Samsung Galaxy S24",p:"$799",old:"$999",val:799},{e:"🍎",n:"iPhone 15 128GB",p:"$899",old:"$1099",val:899},{e:"🤖",n:"Google Pixel 8",p:"$699",old:"$899",val:699}]};
  return {text:autoReplies.default};
}

function send(){
  var i=document.getElementById('ui');
  var m=i.value.trim();if(!m)return;
  document.getElementById('qr').style.display='none';
  i.value='';addMsg(m,true);showTyping();
  var r=getReply(m);
  setTimeout(function(){removeTyping();addMsg(r.text,false,r.products)},900+Math.random()*400);
}
function sq(m){document.getElementById('ui').value=m;send()}
document.getElementById('ui').addEventListener('keypress',function(e){if(e.key==='Enter')send()});

// Welcome
window.addEventListener('load',function(){
  setTimeout(function(){
    addMsg("👋 Welcome to **ShopBot**! I'm your AI shopping assistant.\n\nI can help you find products, compare prices, track orders and more!\n\nWhat are you looking for today? 🛍️",false);
  },500);
});