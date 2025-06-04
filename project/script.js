let products = JSON.parse(localStorage.getItem("products") || "[]");

function showSection(section) {
  ["add", "edit", "list"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(section).classList.remove("hidden");
  if (section === "list") render();
}

function saveToStorage() {
  localStorage.setItem("products", JSON.stringify(products));
}

function render() {
  const list = document.getElementById("productList");
  list.innerHTML = "";
  products.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${p.image}" class="preview">
      <div>
        <strong>${p.name}</strong><br>
        가격: ${Number(p.price).toLocaleString()}원<br>
        재고: ${p.stock}
      </div>
      <div class="actions">
        <button onclick="editProduct(${i})">수정</button>
        <button onclick="deleteProduct(${i})">삭제</button>
      </div>`;
    list.appendChild(li);
  });
}

function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const stock = document.getElementById("stock").value.trim();
  const imageInput = document.getElementById("image");

  if (!name || !price || !stock || isNaN(price) || Number(price) <= 0 || isNaN(stock) || Number(stock) < 0) {
    alert("모든 항목을 정확히 입력하세요.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    products.push({ name, price: Number(price), stock: Number(stock), image: e.target.result });
    saveToStorage();
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stock").value = "";
    imageInput.value = "";
    alert("상품이 추가되었습니다.");
  };
  if (imageInput.files[0]) reader.readAsDataURL(imageInput.files[0]);
}

function deleteProduct(index) {
  if (confirm("정말 삭제하시겠습니까?")) {
    products.splice(index, 1);
    saveToStorage();
    render();
  }
}

function editProduct(index) {
  showSection("edit");
  const newName = prompt("상품명:", products[index].name);
  const newPrice = prompt("가격:", products[index].price);
  const newStock = prompt("재고:", products[index].stock);
  if (newName && !isNaN(newPrice) && !isNaN(newStock)) {
    products[index].name = newName;
    products[index].price = Number(newPrice);
    products[index].stock = Number(newStock);
    saveToStorage();
    showSection("list");
  } else {
    alert("입력값이 유효하지 않습니다.");
  }
}

function sortBySelect() {
  const select = document.getElementById("sortSelect").value;
  if (!select) return;
  let key = select.replace("-", "");
  let direction = select.startsWith("-") ? -1 : 1;
  products.sort((a, b) => {
    if (a[key] < b[key]) return -1 * direction;
    if (a[key] > b[key]) return 1 * direction;
    return 0;
  });
  render();
}

function clearAll() {
  if (confirm("모든 상품을 삭제하시겠습니까?")) {
    products = [];
    saveToStorage();
    render();
  }
}

showSection("add");
