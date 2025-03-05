let apiUrl = 'https://fakestoreapi.com/products';
let searchInput = document.querySelector('#searchInput');
let row = document.querySelector('#row');
let loader = document.querySelector('#loader');
let Total = document.querySelector('#Total');
let select = document.querySelector('#select')
let products = [];
let isAscending = true; 

let cart = JSON.parse(localStorage.getItem('cart')) || []; 

async function Glfunc() {
    try {
        loader.style.display = 'flex';

        let response = await fetch(apiUrl);
        products = await response.json();

        loader.style.display = 'none';
        console.log(products);
        productCardData(products);
        updateTotal(); 
    } catch (error) {
        console.log(error);
    }
}

function productCardData(data) {
    row.innerHTML = '';
    data.forEach((item) => {
        let card = document.createElement('div');
        card.innerHTML = `
            <div class="w-[400px] h-[500px] shadow-[0_4px_8px_rgba(0,0,0,0.1)] p-6 rounded-lg bg-white text-center hover:scale-[1.1] duration-200">
                <img src="${item.image}" class="mx-auto w-[200px] h-[200px]" alt="Product Image">
                <h2 class="font-bold my-[10px]">${item.title}</h2>
                <p class="text-[10px] my-[10px]">${item.description}</p>
                <div class="flex justify-between items-center mx-auto w-[130px] h-[50px]">
                    <h2 class="text-indigo-500 mx-auto">${item.price} $</h2>
                    <button class="w-[50px] h-[30px] rounded-[10px] bg-indigo-500 text-white my-[20px] mx-auto" onclick="showProduct(${item.id})">Buy</button>
                </div>
            </div>`;   
        row.appendChild(card);
    });
}

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    productCardData(filteredProducts);
});

function showProduct(productId) {
    const item = products.find(product => product.id === productId);
    if (!item) return;

    document.body.innerHTML = `
        <div class="w-[400px] h-[500px] shadow-[0_4px_8px_rgba(0,0,0,0.1)] p-6 rounded-lg bg-white text-center mx-auto mt-10" id="cardos">
            <img src="${item.image}" class="mx-auto w-[200px] h-[200px]" alt="Product Image">
            <h2 class="font-bold my-[10px]">${item.title}</h2>
            <p class="text-[10px] my-[10px]">${item.description}</p>
            <h2 class="text-indigo-500 mx-auto">${item.price} $</h2>
            <button class="w-[100px] h-[40px] rounded-[10px] bg-indigo-500 text-white mt-5" onclick="addToCart(${item.id})">Add</button>
        </div>
        <button class="w-[100px] h-[40px] rounded-[10px] bg-indigo-500 text-white mt-5" onclick="location.reload()">Go Back</button>
    `;
}

function addToCart(productId) {
    const item = products.find(product => product.id === productId);
    if (!item) return;

    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart)); 
    updateTotal();
    location.reload(); 
}

function removeFromCart(index) {
    cart.splice(index, 1); 
    localStorage.setItem('cart', JSON.stringify(cart)); 
    updateTotal();
}

function updateTotal() {
    let totalSum = cart.reduce((sum, item) => sum + item.price, 0);
    Total.innerHTML = `
        <h2 class="font-bold text-lg">Total: ${totalSum.toFixed(2)} $</h2>
        <ul class="mt-2">
            ${cart.map((item, index) => `
                <li class="flex justify-between items-center">
                    ${item.title} - ${item.price} $
                    <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="removeFromCart(${index})">Remove</button>
                </li>
            `).join('')}
        </ul>
    `;
}


document.querySelector('#sortPrice').addEventListener('click', () => {
    products.sort((a, b) => isAscending ? a.price - b.price : b.price - a.price);

    isAscending = !isAscending;
    document.querySelector('#sortPrice').textContent = isAscending ? "Sort by Price ↑" : "Sort by Price ↓";

    productCardData(products);
});

select.addEventListener('change', () => {
    let selectedCategory = select.value;

    if (selectedCategory) {
        let filteredProducts = products.filter(product => product.category === selectedCategory);
        productCardData(filteredProducts);
    } else {
        productCardData(products);
    }
});


function DarklightMode() {
    document.body.classList.toggle('dark-mode');
    const button = document.querySelector('.light');

    if (document.body.classList.contains('dark-mode')) {
        button.textContent = '🌙';
        button.style.backgroundColor = "gray"
        document.body.style.color = "white";
        document.body.style.backgroundColor = "black";

 

    } else {
        button.textContent = '☀️';
        document.body.style.color = "";
        document.body.style.backgroundColor = "";
        button.style.backgroundColor = ""

    }
}


Glfunc();
