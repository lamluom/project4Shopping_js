

let products = JSON.parse(localStorage.getItem('ProductsInCart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let allProducts = [
    { id: 1, title: 'Golden Watch', category: 'Watches', price: 400, imageUrl: 'images/watch.jpg' },
    { id: 2, title: 'Silver necklace', category: 'Necklace', price: 150, imageUrl: 'images/necklace.jpg' },
    { id: 3, title: 'Golden Earrings', category: 'Earrings', price: 200, imageUrl: 'images/earrings.jpg' },
    { id: 4, title: 'Black Watch', category: 'Watches', price: 350, imageUrl: 'images/black-watch.jpg' },
    { id: 5, title: 'Silver Set Rings', category: 'Rings', price: 580, imageUrl: 'images/rings.jpg' },
    { id: 6, title: 'Silver necklace', category: 'Necklace', price: 150, imageUrl: 'images/necklace2.jpg' },
    { id: 7, title: 'Black bracelet', category: 'Bracelet', price: 200, imageUrl: 'images/bracelet.jpg' },
    { id: 8, title: 'Set Neck', category: 'Necklace', price: 300, imageUrl: 'images/set-neck.jpg' }
];

// ============================================
function displayCartItems() {
    const productsContainer = document.querySelector(".cartproducts");

    if (!productsContainer) return;

    let totalPrice = 0;
    let cartHTML = '';

    if (products.length === 0) {
        cartHTML += '<div style="text-align: center; padding: 2rem; width: 100%;"> No Products</div>';
    } else {
        products.forEach(item => {
            const quantity = item.quantity || 1;
            totalPrice += item.price * quantity;

            cartHTML += `

    <div class="cartproducts_item">
     
           <img class="cartproducts_item_img" src="${item.imageUrl}" alt="${item.title}" >
        <div class="item-details">
            <h3>${item.title}</h3>
            <p class="category">Category: ${item.category}</p>
            <p class="price">Price: $${item.price}</p>
            <div class="quantity-controls">
                <button class="btn-dec" onclick="decreaseQuantity(${item.id})">−</button>
                <span>${quantity}</span>
                <button class="btn-inc"onclick="increaseQuantity(${item.id})">+</button>
                <button  class="btn-rem"onclick="removeFromCart(${item.id})" id ="removeFromCart" >remove From Cart</button>

            </div>
        </div>
    </div>


            `;
        });


        cartHTML += `
            <div  class ="totleprice" >
                Total Price: $${totalPrice.toFixed(2)}
            </div>
        `;
    }

    productsContainer.innerHTML = cartHTML;
}

// ============================================
function updateQuantity(id, change) {
    const itemIndex = products.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        if (!products[itemIndex].quantity) {
            products[itemIndex].quantity = 1;
        }

        products[itemIndex].quantity += change;

        if (products[itemIndex].quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem("ProductsInCart", JSON.stringify(products));
            displayCartItems();
            updateCartCount();
        }
    }
}

// ============================================


function removeFromCart(id) {
    products = products.filter(item => item.id !== id);
    localStorage.setItem("ProductsInCart", JSON.stringify(products));
    displayCartItems();
    updateCartCount();

}

// ============================================

function displayFavorites() {
    const favoriteProducts = allProducts.filter(p => favorites.includes(p.id));

    if (favoriteProducts.length === 0) {
        return '<div class ="favo_title">No Favorites Products</div>';
    }

    return favoriteProducts.map(product => `
 <div class="cart_favo" >

 

   <div class="cart_favo_title">${product.title}</div>
  <div class ="cart_favo_cat"  >Category: ${product.category}</div>
        <div class ="cart_favo_pri" >Price: $${product.price}</div>
         <button  class="cart_favo_rem"
         onclick="removeFromFavorites(${product.id})" >
             Remove from Favorites
         </button>

  </div>

    `).join('');
}

// ============================================

function removeFromFavorites(id) {
    const product = allProducts.find(p => p.id === id);
    favorites = favorites.filter(favId => favId !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));


    const favoritesContainer = document.getElementById('favoritesContainer');
    if (favoritesContainer) {
        favoritesContainer.innerHTML = displayFavorites();
    }

    alert(` Removed ${product.title} from favorites`);
}

// ============================================


function updateCartCount() {
    const badge = document.querySelector(".badge");
    if (badge) {
        const count = products.reduce((sum, item) => sum + (item.quantity || 1), 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? "block" : "none";
    }
}

// ==========================================
function addFavoritesSection() {
    const productsContainer = document.querySelector(".cartproducts");
    if (!productsContainer) return;

    const favoritesHTML = displayFavorites();

    const favoritesSection = document.createElement('div');
    favoritesSection.style.cssText = 'width: 100%; margin-top: 40px; padding: 25px;  border-radius: 12px; ';
    favoritesSection.innerHTML = `
        <h2 id="favo_title_h2" >   
         <span>Favorite Items</span>
            <span id="favo_title_span" ></span>
        
        </h2>
        <div id="favoritesContainer" >
            ${favoritesHTML}
        </div>
    `;

    productsContainer.appendChild(favoritesSection);
}

// ============================================

let userInfo = document.querySelector("#user_info");
let userD = document.querySelector("#user");
let links = document.querySelector("#links");

if (localStorage.getItem("username")) {
    if (links) links.style.display = "none";
    if (userInfo) userInfo.style.display = "flex";
    if (userD) userD.innerHTML = localStorage.getItem("username");
}

document.querySelector("#logout")?.addEventListener("click", function () {
    localStorage.clear();
    alert('👋 Logged out successfully');
    setTimeout(() => window.location = "login.html", 1500);
});

// ============================================
document.querySelector(".shopping_cart")?.addEventListener("click", function (e) {
    e.stopPropagation();
    const cartDiv = document.querySelector(".carts_products");
    if (cartDiv) {
        cartDiv.style.display = cartDiv.style.display === "block" ? "none" : "block";
    }
});

document.addEventListener("click", function () {
    const cartDiv = document.querySelector(".carts_products");
    if (cartDiv) cartDiv.style.display = "none";
});

document.querySelector(".carts_products")?.addEventListener("click", function (e) {
    e.stopPropagation();
});

// ============================================

function increaseQuantity(id) {
    const itemIndex = products.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        if (!products[itemIndex].quantity) {
            products[itemIndex].quantity = 1;
        }
        products[itemIndex].quantity += 1;

        localStorage.setItem("ProductsInCart", JSON.stringify(products));
        displayCartItems();
        updateCartCount();
    }
}

// دالة نقص الكمية
function decreaseQuantity(id) {
    const itemIndex = products.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        if (!products[itemIndex].quantity) {
            products[itemIndex].quantity = 1;
        }

        if (products[itemIndex].quantity > 1) {
            products[itemIndex].quantity -= 1;
            localStorage.setItem("ProductsInCart", JSON.stringify(products));
        } else {
            // لو الكمية 1 ونقصناها، نشيل المنتج
            removeFromCart(id);
            return;
        }

        displayCartItems();
        updateCartCount();
    }
}

function init() {
    if (products.length === 0) {
        window.location.href = "index.html";
    } else {


        displayCartItems();
        addFavoritesSection();
        updateCartCount();


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

    }
}

init();