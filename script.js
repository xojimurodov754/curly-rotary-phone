const PASS = "1234";
let products = JSON.parse(localStorage.getItem('feruza_db')) || [];
let cart = [];
let likes = JSON.parse(localStorage.getItem('feruza_likes')) || [];

// Admin funksiyalari
function askAdmin() {
    if (prompt("Admin paroli:") === PASS) {
        document.getElementById('adminPanel').classList.add('open');
    } else {
        alert("Xato parol!");
    }
}

function closeAdmin() {
    document.getElementById('adminPanel').classList.remove('open');
}

// Mahsulotlarni chiqarish
function render() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map((p, i) => {
        const isLiked = likes.some(l => l.name === p.name);
        return `
            <div class="card" id="prod-${i}">
                <div class="like-btn ${isLiked ? 'active' : ''}" onclick="toggleLike(${i})">
                    <i class="fa-solid fa-heart"></i>
                </div>
                <img src="${p.img || 'https://via.placeholder.com/150'}">
                <div class="info">
                    <h3>${p.name}</h3>
                    <span class="price">${parseInt(p.price).toLocaleString()} so'm</span>
                    <button class="btn-add" onclick="addToCart(${i})">Savatga</button>
                </div>
            </div>`;
    }).join('');

    const adminList = document.getElementById('admin-product-list');
    adminList.innerHTML = products.map((p, i) => `
        <div class="item-row">
            <img src="${p.img}">
            <span style="flex-grow:1">${p.name}</span>
            <i class="fa-solid fa-trash" style="color:red; cursor:pointer;" onclick="deleteProduct(${i})"></i>
        </div>`).join('');

    localStorage.setItem('feruza_db', JSON.stringify(products));
    updateLikePanel();
    updateCart();
}

// Like bosilgan mahsulotga sakrash
function goToProduct(id) {
    togglePanel('likePanel');
    const el = document.getElementById('prod-' + id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight');
        setTimeout(() => el.classList.remove('highlight'), 2000);
    }
}

function saveNewProduct() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const img = document.getElementById('p-img').value;
    if (name && price && img) {
        products.push({ name, price, img });
        render();
        document.getElementById('p-name').value = '';
        document.getElementById('p-price').value = '';
        document.getElementById('p-img').value = '';
    }
}

function deleteProduct(i) {
    if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
        products.splice(i, 1);
        render();
    }
}

function toggleLike(i) {
    const p = products[i];
    const idx = likes.findIndex(l => l.name === p.name);
    if (idx === -1) {
        likes.push(p);
    } else {
        likes.splice(idx, 1);
    }
    localStorage.setItem('feruza_likes', JSON.stringify(likes));
    render();
}

function updateLikePanel() {
    document.getElementById('like-count').innerText = likes.length;
    const list = document.getElementById('like-list');
    list.innerHTML = likes.map(item => {
        const pIndex = products.findIndex(p => p.name === item.name);
        return `
        <div class="item-row" onclick="goToProduct(${pIndex})">
            <img src="${item.img}">
            <div style="flex-grow:1">
                <b>${item.name}</b><br>
                <small style="color:#999">Ko'rish uchun bosing</small>
            </div>
        </div>`;
    }).join('');
}

function addToCart(i) {
    cart.push({ ...products[i], cid: Date.now() });
    updateCart();
}

function removeFromCart(cid) {
    cart = cart.filter(item => item.cid !== cid);
    updateCart();
}

function updateCart() {
    const list = document.getElementById('cart-list');
    document.getElementById('cart-count').innerText = cart.length;
    let total = 0;
    let msg = "Assalomu alaykum, buyurtma:\n";

    list.innerHTML = cart.map(item => {
        total += parseInt(item.price);
        msg += `- ${item.name}\n`;
        return `<div class="item-row">
                    <img src="${item.img}">
                    <span style="flex-grow:1">${item.name}</span>
                    <i class="fa-solid fa-trash" style="color:red; cursor:pointer;" onclick="removeFromCart(${item.cid})"></i>
                </div>`;
    }).join('');

    document.getElementById('total-price').innerText = "Jami: " + total.toLocaleString() + " so'm";
    document.getElementById('tg-link').href = `https://t.me/FeruzaGurman?text=${encodeURIComponent(msg + "\n💰 Jami: " + total.toLocaleString() + " so'm")}`;
}

function togglePanel(id) {
    document.getElementById(id).classList.toggle('open');
}

// Boshlang'ich yuklash
render();