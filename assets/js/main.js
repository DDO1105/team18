document.addEventListener('DOMContentLoaded', () => {
    // 搜索功能
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('search-input');

    if (searchIcon && searchInput) {
        searchIcon.addEventListener('click', () => {
            searchInput.style.display = 'inline-block';
            searchInput.focus();
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    console.log(`Searching for: ${query}`);
                    window.location.href = `search_results.html?query=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // 購物車數量顯示與加入購物車
    const cartCountElement = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartCount = () => {
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
            cartCountElement.style.display = cart.length > 0 ? 'inline-block' : 'none';
        }
    };

    updateCartCount();

    const addToCartButton = document.querySelector('.add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const product = {
                name: document.querySelector('.product-name')?.textContent.trim() || '未知商品',
                price: parseFloat(document.querySelector('.price')?.textContent.replace('$', '') || '0'),
                quantity: 1,
                image: document.querySelector('.image img')?.src || 'images/default-image.jpg' // 確保這裡設置了正確的圖片路徑
            };
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert('商品已加入購物車！');
        });
    }

    // 顯示購物車內容
    const cartTableBody = document.getElementById('cart-table-body');
    if (cartTableBody) {
        if (cart.length === 0) {
            cartTableBody.innerHTML = '<tr><td colspan="6">購物車中沒有商品</td></tr>';
        } else {
            let total = 0;
            cart.forEach((product, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td><img src="${product.image}" alt="${product.name}" style="width:50px; height:50px;"></td>
                    <td>${product.quantity}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>$${(product.price * product.quantity).toFixed(2)}</td>
                    <td><button class="remove-item" data-index="${index}">刪除</button></td>
                `;
                total += product.price * product.quantity;
                cartTableBody.appendChild(row);
            });

            const totalRow = document.createElement('tr');
            totalRow.innerHTML = `
                <td colspan="4">總計</td>
                <td>$${total.toFixed(2)}</td>
                <td></td>
            `;
            cartTableBody.appendChild(totalRow);

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = e.target.dataset.index;
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    location.reload();
                });
            });

            const checkoutButton = document.getElementById('checkout');
            if (checkoutButton) {
                checkoutButton.addEventListener('click', () => {
                    if (cart.length === 0) {
                        alert('購物車是空的');
                        return;
                    }
                    alert(`購物成功！總金額為 $${total.toFixed(2)}`);
                    const cartItems = cart.map(({ name, price, quantity, image }) => ({ name, price, quantity, image }));
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    cart.length = 0;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    window.location.href = 'rating.html';
                });
            }
        }
    }

    // 表單驗證
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            const buyerNameInput = document.querySelector('input[name="buyer-name"]');
            const addressInput = document.querySelector('input[name="address"]');

            if (!buyerNameInput?.value.trim() || !addressInput?.value.trim()) {
                alert('請填寫完整資訊');
                e.preventDefault();
            }
        });
    }
});

// score.js
document.addEventListener('DOMContentLoaded', () => {
    try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const tableBody = document.getElementById('rating-table-body');
        const submitButton = document.getElementById('submit-rating');

        if (!tableBody || !submitButton || !cartItems.length) return;

        cartItems.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td><img src="${product.image}" alt="${product.name}" style="width:50px; height:50px;"></td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>$${(product.price * product.quantity).toFixed(2)}</td>
                <td>
                    <div class="rating">
                        ${[...Array(5)].map((_, i) =>
                            `<iconify-icon icon="material-symbols:star-outline" width="24" height="24" data-rating="${i + 1}" class="star-icon"></iconify-icon>`
                        ).join('')}
                    </div>
                </td>
                <td><textarea class="item-comment" placeholder="留下您的評語"></textarea></td>
            `;
            tableBody.appendChild(row);
        });

        tableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('star-icon')) {
                const stars = Array.from(event.target.parentNode.querySelectorAll('.star-icon'));
                const rating = parseInt(event.target.getAttribute('data-rating'));
                stars.forEach((star, index) => {
                    star.setAttribute('icon', index < rating ? 'material-symbols:star' : 'material-symbols:star-outline');
                });
            }
        });

        submitButton.addEventListener('click', () => {
            const ratings = [...tableBody.querySelectorAll('tr')].map(row => {
                const name = row.querySelector('td').innerText;
                const commentBox = row.querySelector('.item-comment');
                const rating = Array.from(row.querySelectorAll('.star-icon'))
                    .filter(star => star.getAttribute('icon') === 'material-symbols:star').length;

                return { name, rating, comment: commentBox?.value.trim() || '' };
            });

            console.log('提交的評分資料：', ratings);
            cartItems.length = 0; // 清空数组
            localStorage.setItem('cartItems', JSON.stringify(cartItems)); // 更新 localStorage
            alert('評分已提交！');
        });
    } catch (error) {
        console.error('發生錯誤：', error.message);
    }
});
