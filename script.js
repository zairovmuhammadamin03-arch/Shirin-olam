
const products = [
    {
        id: 1,
        name: "Shokoladli tort",
        category: "tort",
        price: 180000,
        description: "Yumshoq biskvit va shokoladli krem.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Qulupnayli tort",
        category: "tort",
        price: 200000,
        description: "Qulupnay va mayin krem uyg‘unligi.",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Vanilli kapkeyk",
        category: "kapkeyk",
        price: 25000,
        description: "Vanilli krem bilan bezatilgan.",
        image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Shokoladli kapkeyk",
        category: "kapkeyk",
        price: 30000,
        description: "Shokoladni sevuvchilar uchun.",
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Makaron shirinligi",
        category: "pechenye",
        price: 15000,
        description: "Rang-barang va nafis fransuz shirinligi.",
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Shokoladli pechenye",
        category: "pechenye",
        price: 20000,
        description: "Qarsildoq va mazali pechenye.",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Kremli tort",
        category: "tort",
        price: 170000,
        description: "Bayramlar uchun ajoyib tanlov.",
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Mini kapkeyklar",
        category: "kapkeyk",
        price: 35000,
        description: "Choy bilan iste'mol qilish uchun.",
        image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80"
    }
];

// Narxni so'm ko'rinishida chiqarish
function formatPrice(price) {
    return price.toLocaleString("uz-UZ") + " so'm";
}

// HTML elementlari
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const orderModal = document.getElementById("orderModal");
const orderForm = document.getElementById("orderForm");
const orderSummary = document.getElementById("orderSummary");

// Savatcha
let cart = [];

// Mahsulotlarni ekranga chiqarish
function renderProducts() {
    const searchText = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    const filteredProducts = products.filter(product => {
        const matchesName = product.name
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            category === "all" || product.category === category;

        return matchesName && matchesCategory;
    });

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <p class="empty-message">
                Afsuski, bunday shirinlik topilmadi 😔
            </p>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-bottom">
                    <span class="price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-button"
                        data-add="${product.id}"
                    >
                        + Savatga
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// Savatchaga mahsulot qo'shish
function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
}

// Savatchadagi jami miqdor
function getCartCount() {
    return cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
}

// Savatchadagi jami narx
function getCartTotal() {
    return cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
}

// Savatchani ekranga chiqarish
function renderCart() {
    cartCount.textContent = getCartCount();
    cartTotal.textContent = formatPrice(getCartTotal());

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-message">
                Savatchangiz hozircha bo'sh 🛒
            </p>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h3>${item.name}</h3>
                <p>
                    ${formatPrice(item.price)} × ${item.quantity}
                </p>
                <p>
                    Jami: ${formatPrice(item.price * item.quantity)}
                </p>
            </div>

            <button
                class="remove-button"
                data-remove="${item.id}"
                aria-label="${item.name} mahsulotini o'chirish"
            >
                🗑 O'chirish
            </button>
        </div>
    `).join("");
}

// Mahsulot qo'shish va o'chirish tugmalari
productsGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-remove]");

    if (!button) return;

    const productId = Number(button.dataset.remove);

    cart = cart.filter(item => item.id !== productId);

    renderCart();
});

// Qidiruv va kategoriya
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

// Oynalarni ochish va yopish
function openModal(modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
}

cartButton.addEventListener("click", () => {
    renderCart();
    openModal(cartModal);
});

document.getElementById("closeCart").addEventListener("click", () => {
    closeModal(cartModal);
});

document.getElementById("closeOrder").addEventListener("click", () => {
    closeModal(orderModal);
});

// Oyna tashqarisini bosganda yopish
[cartModal, orderModal].forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});

// Buyurtma formasiga o'tish
document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Avval savatchaga shirinlik qo'shing!");
        return;
    }

    orderSummary.textContent =
        `Mahsulotlar: ${getCartCount()} ta. ` +
        `Buyurtma summasi: ${formatPrice(getCartTotal())}.`;

    closeModal(cartModal);
    openModal(orderModal);
});

// Buyurtmani tasdiqlash — hozircha demo
orderForm.addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        closeModal(orderModal);
        alert("Savatchangiz bo'sh!");
        return;
    }

    const formData = new FormData(orderForm);

    const name = formData.get("name").trim();
    const phone = formData.get("phone").trim();
    const address = formData.get("address").trim();

    if (!name || !phone || !address) {
        alert("Iltimos, barcha maydonlarni to'ldiring.");
        return;
    }

    const orderNumber = Date.now().toString().slice(-6);
    const total = getCartTotal();

    alert(
        `Rahmat, ${name}!\n\n` +
        `Buyurtma raqami: #${orderNumber}\n` +
        `Telefon: ${phone}\n` +
        `Manzil: ${address}\n` +
        `Jami: ${formatPrice(total)}\n\n` +
        `Bu demo buyurtma. Ma'lumotlar do'konga yuborilmadi.`
    );

    cart = [];
    renderCart();
    orderForm.reset();
    closeModal(orderModal);
});

// Boshlang'ich holat
renderProducts();
renderCart();
