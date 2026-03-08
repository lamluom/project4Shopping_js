

// ============================================
// function 

let allProducts = null; 
let products = [];


function loadProducts() {
    fetch("js/products.json")
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Failed to load");
            }
            return response.json();
        })
        .then(function(data) {
            products = data;
            console.log("Products loaded:", products);
            showHome();
        })
        .catch(function(error) {
            console.error("Error loading products:", error);
            products = [{
                    id: 1,
                    title: "Golden Watch",
                    name: "Golden Watch",
                    price: 400,
                    category: "Watches",
                    imageUrl: "images/watch.jpg",
                },
                {
                    id: 2,
                    title: "Silver necklace",
                    name: "Silver necklace",
                    price: 150,
                    category: "Necklace",
                    imageUrl: "images/necklace.jpg",
                },
                {
                    id: 3,
                    title: "Golden Earrings",
                    name: "Golden Earrings",
                    price: 200,
                    category: "Earrings",
                    imageUrl: "images/earrings.jpg",
                },
                {
                    id: 4,
                    title: "Black Watch",
                    name: "Black Watch",
                    price: 350,
                    category: "Watches",
                    imageUrl: "images/black-watch.jpg",
                },
                {
                    id: 5,
                    title: "Silver Set Rings",
                    name: "Silver Set Rings",
                    price: 580,
                    category: "Rings",
                    imageUrl: "images/rings.jpg",
                },
                {
                    id: 6,
                    title: "Silver necklace",
                    name: "Silver necklace",
                    price: 150,
                    category: "Necklace",
                    imageUrl: "images/necklace2.jpg",
                },
            ];
            showHome();
        });
}

let addedItem = localStorage.getItem("ProductsInCart") ?
    JSON.parse(localStorage.getItem("ProductsInCart")) : [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentUser = null;

// ============================================
// function drawItems

function drawItems(productsToShow = products) {
    allProducts = document.querySelector(".products");
    if (!allProducts) return;

    allProducts.innerHTML = productsToShow
        .map((item) => {
            let inCart = addedItem.some((cartItem) => cartItem.id === item.id);
            let isFav = favorites.includes(item.id);

            return `
            <div class="product_item">
                <img class="product_item_img" src="${item.imageUrl}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300'">
                <div class="product_item_title">${item.title}</div>
                <div class="product-item-price">Price: $${item.price}</div>
                <div class="product-category">Category: ${item.category}</div>
                <div class="product_item_action">     
                    <i class="fas fa-heart fav" onclick="toggleFavorite(${item.id}, this)" style="color: ${isFav ? "red" : "black"}; cursor: pointer; font-size: 20px;"></i>
                    <button class="add_to_cart" onclick="toggleCartItem(${item.id})" style="background: ${inCart ? "#dc3545" : "#3a86ff;"}; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">
                        ${inCart ? "Remove From Cart" : "Add To Cart"}
                    </button>
                </div>
            </div>
        `;
        })
        .join("");
}

// ============================================
// function searchProducts

function searchProducts() {
    const searchInput = document.getElementById("searchInput");
    const categorySelect = document.getElementById("categorySelect");

    if (!searchInput || !categorySelect) return;

    const searchTerm = searchInput.value.toLowerCase();
    const category = categorySelect.value;

    const filtered = products.filter((product) => {
        const productName = (product.name || product.title || "").toLowerCase();
        const matchesName = searchTerm === "" || productName.includes(searchTerm);
        const matchesCategory = category === "" || product.category === category;
        return matchesName && matchesCategory;
    });

    drawItems(filtered);

    if (filtered.length === 0) {
        alert("No products found");
    }
}

// ============================================
// function addToCart

function addToCart(id) {
    if (!localStorage.getItem("firstname")) {
        window.location = "login.html";
        return;
    }

    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (!addedItem.some((item) => item.id === id)) {
        const newItem = {...product, quantity: 1 };
        addedItem.push(newItem);
        localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
        updateCartDisplay();
        updateCartCount();
        drawItems();
    }
}

// function removeFromCart

function removeFromCart(id) {
    const product = products.find((p) => p.id === id);
    addedItem = addedItem.filter((item) => item.id !== id);
    localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
    updateCartDisplay();
    updateCartCount();
    drawItems();
  
}

// function toggleCartItem

function toggleCartItem(id) {
    if (addedItem.some((item) => item.id === id)) {
        removeFromCart(id);
    } else {
        addToCart(id);
    }
}

// function updateCartCount

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        const count = addedItem.reduce(
            (sum, item) => sum + (item.quantity || 1),
            0,
        );
        cartCount.textContent = count;
    }
}

// ============================================
// function updateCartDisplay
function updateCartDisplay() {
    const cartProductDiv = document.querySelector(".carts_products div");
    const badge = document.querySelector(".badge");
    if (!cartProductDiv) return;

    if (addedItem.length > 0) {
        let cartHTML = '<div class="cart-items-container">';
        
        addedItem.forEach((item) => {
            cartHTML += `
                <div class="cart-item-card" data-product-id="${item.id}">
                    <div class="cart-item-info">
                        <span class="cart-item-title">${item.title}</span>
                        <span class="cart-item-price">$${item.price}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="cart-item-quantity">${item.quantity || 1}</span>
                        <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    
                      
                    </div>
                </div>
            `;
        });

        const total = addedItem.reduce(
            (sum, item) => sum + item.price * (item.quantity || 1),
            0,
        );

  

        cartProductDiv.innerHTML = cartHTML;

        if (badge) {
            badge.style.display = "block";
            badge.innerHTML = addedItem.reduce((sum, item) => sum + (item.quantity || 1), 0);
        }
    } else {
        cartProductDiv.innerHTML = '<p style="text-align:center; padding: 20px;"> No products</p>';
        if (badge) badge.style.display = "none";
    }
}

// ============================================
// function opencart

function opencart() {
    const cartsProducts = document.querySelector(".carts_products");
    if (!cartsProducts) return;
    updateCartDisplay();
    cartsProducts.style.display =
        cartsProducts.style.display === "block" ? "none" : "block";
}

document.querySelector(".shopping_cart")?.addEventListener("click", opencart);

document.addEventListener("click", function(e) {
    const cart = document.querySelector(".carts_products");
    const icon = document.querySelector(".shopping_cart");
    if (cart && icon && !icon.contains(e.target) && !cart.contains(e.target)) {
        cart.style.display = "none";
    }
});

// ============================================
// function updateQuantity

function updateQuantity(id, change) {
    const itemIndex = addedItem.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
        if (!addedItem[itemIndex].quantity) {
            addedItem[itemIndex].quantity = 1;
        }

        addedItem[itemIndex].quantity += change;

        if (addedItem[itemIndex].quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
            updateCartDisplay();
            updateCartCount();
            drawItems();
        }
    }
}

// ============================================
// function toggleFavorite

function toggleFavorite(id, element) {
    if (!localStorage.getItem("firstname")) {
        window.location = "login.html";
        return;
    }

    const index = favorites.indexOf(id);

    if (index === -1) {
        favorites.push(id);
        element.style.color = "red";
    } else {
        favorites.splice(index, 1);
        element.style.color = "black";
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// ============================================
// function showHome

function showHome() {
    const categories = [...new Set(products.map((p) => p.category))];

    const content = `
        <div class="search-section">
            <div class="search-container">  
             <div class="search-box">
                    <select id="categorySelect" onchange="searchProducts()">
                        <option value="">Search by product name</option>
                        ${categories.map((cat) => `<option value="${cat}">Search by Category</option>`).join("")}
                    </select>
                </div>
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search ..." onkeyup="searchProducts()">
                </div>
             
                <button class="search-btn" onclick="searchProducts()">Search</button>
            </div>
        </div>

        <div class="products" id="productsGrid"></div>
    `;

    document.getElementById("mainContent").innerHTML = content;
    allProducts = document.querySelector(".products");
    drawItems();
}

// ============================================
// function showLogin

function showLogin() {
    const email = prompt("Enter email:");
    const password = prompt("Enter password:");

    if (email && password) {
        localStorage.setItem("firstname", email);
        currentUser = { email };
        location.reload();
    }
}

// ============================================
// function showRegister

function showRegister() {
    const name = prompt("Enter name:");
    const email = prompt("Enter email:");
    const password = prompt("Enter password:");

    if (name && email && password) {
        localStorage.setItem("firstname", email);
        currentUser = { name, email };
        location.reload();
    }
}

// ============================================
// Logout

document.querySelector("#logout")?.addEventListener("click", function() {
    localStorage.clear();
    setTimeout(() => (window.location = "login.html"), 1500);
});

// ============================================
// Check user login status

let userInfo = document.querySelector("#user_info");
let userD = document.querySelector("#user");
let links = document.querySelector("#links");

if (localStorage.getItem("firstname")) {
    if (links) links.style.display = "none";
    if (userInfo) userInfo.style.display = "flex";
    if (userD) userD.innerHTML = "Hello, " + localStorage.getItem("firstname");

}

// ============================================
// Close modal when clicking outside

window.onclick = function(event) {
    const modal = document.getElementById("cartModal");
    if (modal && event.target === modal) {
        modal.classList.remove("active");
    }
};

// ============================================
// Initialize

function init() {
    loadProducts();
    updateCartCount();
    updateCartDisplay();
}

init();