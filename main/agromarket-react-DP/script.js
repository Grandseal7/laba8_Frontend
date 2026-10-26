
const btn = document.querySelector("#greetBtn");
const btnTheme = document.querySelector("#themeBtn");
const btnShow = document.querySelector("#showBtn");
const currentTheme = document.querySelector("#currentTheme");

let countClick = 0;
let cartClick = 0;
let hasError = false;

if (btn) {
  btn.addEventListener("click", function () {
    btn.textContent = "Привет!";
    countClick += 1;
  });
}

if (btnShow) {
  btnShow.addEventListener("click", function () {
    alert(`Кнопка была нажата - ${countClick} раз`);
  });
}

if (btnTheme) {
  btnTheme.addEventListener("click", function () {
    const isDark =
      document.body.style.backgroundColor === "rgb(17, 17, 17)" ||
      document.body.style.backgroundColor === "rgb(34, 34, 34)";

    if (isDark) {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";

      if (currentTheme) {
        currentTheme.textContent = "Светлая";
      }
    } else {
      document.body.style.backgroundColor = "#111111";
      document.body.style.color = "#fff";

      if (currentTheme) {
        currentTheme.textContent = "Темная";
      }
    }
  });
}

async function loadProducts() {
  try {
    const response = await fetch("http://localhost:3001/products");

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    const products = await response.json();
    hasError = false;
    renderProducts(products);
  } catch {
    hasError = true;
    renderProducts([]);
  }
}

function renderProducts(products) {
  const catalog = document.querySelector(".catalog");

  if (!catalog) return;

  const itemCount = document.querySelector("#items_count");
  const cartCount = document.querySelector("#cart_count");

  if (hasError || products.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Данные отсутствуют";
    catalog.appendChild(message);
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "card";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = `${product.price} тг`;

    const button = document.createElement("button");
    button.textContent = "В корзину";

    button.addEventListener("click", function () {
      cartClick++;

      if (cartCount) {
        cartCount.textContent = `В корзине: ${cartClick}`;
      }
    });

    card.append(image, title, price, button);
    catalog.appendChild(card);
  });

  if (itemCount) {
    itemCount.textContent = `Количество товаров: ${products.length}`;
  }
}

loadProducts();
