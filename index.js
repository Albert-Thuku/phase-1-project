function displayCategories() {
  // GET request for products data
  fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(data => {
      // Array that will contain all category names
      const categoryNames = [];
      data.forEach(product => {
        // If statement to display category names and prevent duplicates
        if (!categoryNames.includes(product.category)) {
          categoryNames.push(product.category);
          const categoryName = document.createElement("div");
          categoryName.className = "categoryDisplay";
          categoryName.textContent = product.category;
          const categoriesDiv = document.getElementById('categoryDiv');
          categoriesDiv.appendChild(categoryName);
          // Event listener to select categories
          categoryName.addEventListener('click', (e) => {
            e.preventDefault();
            let categoryIdentifier = categoryName.textContent;
            let productsInCategory = data.filter(product => product.category === categoryIdentifier);
            displayProducts(productsInCategory);
          });
        }
      });
    })
    .catch(error => console.error(error));
}

  displayCategories();


// function that displays products
function displayProducts(productsInCategory) {
  // find the cart and list elements
  const cart = document.querySelector(".cartContainer");
  const cartList = document.querySelector(".listCard");
  const quantity = document.querySelector(".quantity");
  // Clear the existing products from the productsDiv
  const productsDiv = document.getElementById("productsDiv");
  productsDiv.innerHTML = "";
  // GET request for products data
  fetch("http://localhost:3000/products")
    .then((resp) => resp.json())
    .then((data) => {
      data.forEach((product, index) => {
        // creation of a div element containing the product details
        const productCard = document.createElement("div");
        productCard.className = "productDisplay";
        productCard.innerHTML = `
          <img src ="${product.image}">
          <h3>${product.name}</h3>
          <p>
            Description : ${product.description}<br>
            Price : $ ${product.price}<br>
            Purchase count : <span id ="purchaseCount">${product.purchases_count}</span>
          </p>
          <div>
            <!--Button used to purchase an item-->
            <button class="buyItem">Buy Item</button>
          </div>
          <div>
            <!--button used to add an item to the cart-->
            <button class="addCart">Add to cart</button>
          </div>
          <div>
            <!--button used to remove an item from the cart-->
            <button class="deleteItem">Delete Item</button>
          </div>
        `;
        const productView = document.getElementById("productsDiv");
        productView.appendChild(productCard);
        // Event listener for buy item button to increase number of purchases
        const buyItem = productCard.querySelector(".buyItem");
        buyItem.addEventListener("click", (e) => {
          e.preventDefault();
          if (confirm("Do you want to confirm purchase?") === true) {
            product.purchases_count += 1;
            productCard.querySelector(
              "#purchaseCount"
            ).textContent = product.purchases_count;
            alert("Thank you for shopping with TradeZone!");
            updatePurchaseCount(product);
          } else {
            alert("ORDER HAS BEEN CANCELLED");
          }
        });
        // Event listener for delete button to remove the product from the database
        const deleteBtn = productCard.querySelector(".deleteItem");
        deleteBtn.addEventListener("click", () => {
        // send DELETE request to server
        fetch(`http://localhost:3000/products/${product.id}`, {
          method: "DELETE"
        })
        .then(response => {
        // remove the product from the page if the DELETE request was successful
        if (response.ok) {
        productView.removeChild(productCard);
        alert("Product deleted successfully!");
        } else {
        throw new Error("Failed to delete product");
        }
        })
        .catch(error => {
        console.error(error);
        alert("Failed to delete product");
        });
}); 

        // Event listener for add to cart button to add an item to the cart
        const addBtn = productCard.querySelector(".addCart");
        addBtn.addEventListener("click", () => {
          // create a new list item element and set its attributes and innerHTML
          const li = document.createElement("li");
          li.setAttribute("class", "cartItem");
          li.innerHTML = `
          <div class="cartItem">
          <img src="${product.image}"/>
          <div class="cartItemDetails">
            <h4>${product.name}</h4>
            <p>Price: $ ${product.price}</p>
          </div>
        </div>
        `;

          // append the new list item to the cart
          cartList.appendChild(li);

          // increment the quantity in the cart
          let count = parseInt(quantity.innerHTML);
          quantity.innerHTML = ++count;

          // update the total price in the cart
          const total = document.querySelector(".total");
          let currentTotal = parseFloat(total.innerHTML);
          currentTotal += product.price;
          total.innerHTML = currentTotal;

          // add a remove button to the list item
          const removeBtn = document.createElement("button");
          removeBtn.innerHTML = "Remove";
          removeBtn.setAttribute("class", "removeBtn");
          li.appendChild(removeBtn);

          // add an event listener to the remove button
          removeBtn.addEventListener("click", () => {
            // decrement the quantity in the cart
            let count = parseInt(quantity.innerHTML);
            quantity.innerHTML = --count;

            // update the total price in the cart
            let currentTotal = parseFloat(total.innerHTML);
            currentTotal -= product.price;
            total.innerHTML = currentTotal.toFixed(2);

            // remove the list item from the cart list
            cartList.removeChild(li);
          });
        });
      
        // append the product card to the product container
        productView.appendChild(productCard);
      });
    })
}

  displayProducts()


  //fucntion used to update the purhcase count
  function updatePurchaseCount(productObj){
    console.log(productObj.id)
    //PATCH request to update the purchase count
    fetch(`http://localhost:3000/products/${productObj.id}`,{
    method:'PATCH',
    headers:{
    "Content-Type" : "application/json"
    },
    body:JSON.stringify({purchases_count:productObj.purchases_count})
    }) 
  }

  //function to display the shopping cart card when the cart icon is clicked
  function displayShoppingCart(){
    const cartIcon = document.getElementById('cartIcon');
    const card = document.querySelector('.card');
    const closeShopping = document.querySelector('.clossShopping');

    cartIcon.addEventListener('click', () => {
    card.style.display = 'block';
   });

   //Event listener that closes the shopping cart card when exit cart button is clicked
    closeShopping.addEventListener('click', () => {
    card.style.display = 'none';
    });
  }
  displayShoppingCart()


  //function that submits data from the form to the db.json file
  function addProduct(){
    const addProductForm = document.getElementById('addProductForm');

    addProductForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const imageInput = document.getElementById('image');
    const categoryInput = document.getElementById('category');
    const purchaseCount = 0

    const newProduct = {
    name: nameInput.value,
    description: descriptionInput.value,
    price: parseFloat(priceInput.value),
    image: imageInput.value,
    category: categoryInput.value,
    purchases_count: purchaseCount
    };

    fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    })
    .then(response => response.json())
    .then(data => {
      console.log('New product added:', data);
      // Reset the form
      addProductForm.reset();
    })
    .catch(error => console.error(error));
});

  }
  addProduct()

 //function that edits the product's details
function editProduct() {
  // Get references to DOM elements
  const selectProduct = document.querySelector("#selectProduct");
  const editName = document.querySelector("#editName");
  const editDescription = document.querySelector("#editDescription");
  const editPrice = document.querySelector("#editPrice");
  const editImage = document.querySelector("#editImage");
  const editCategory = document.querySelector("#editCategory");
  const editProductForm = document.querySelector("#editProduct");
  const saveChanges = document.querySelector("#saveChanges");

  // Fetch products data from db.json
  fetch("http://localhost:3000/products")
    .then((resp) => resp.json())
    .then((data) => {
      // Populate select element with options
      data.forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        option.text = product.name;
        selectProduct.appendChild(option);
      });

      //adding of product details to an array
      let productDetails = [];
      productDetails.push(...data);

      // Add event listener to update product details when option is selected
      selectProduct.addEventListener("change", () => {
        const findSelectedProduct = productDetails.find(
          (product) => product.id === selectProduct.value
        );
        const selectedProduct = findSelectedProduct;
        if (selectedProduct) {
          editName.value = selectedProduct.name;
          editDescription.value = selectedProduct.description;
          editPrice.value = selectedProduct.price;
          editImage.value = selectedProduct.image;
          editCategory.value = selectedProduct.category;
        } else {
          console.log("The value is null");
        }
      });

      // Add event listener to edit product form
      saveChanges.addEventListener("submit", (event) => {
        event.preventDefault();
        const updatedProduct = {
          id: selectProduct.value,
          name: editName.value,
          description: editDescription.value,
          price: Number(editPrice.value),
          image: editImage.value,
          category: editCategory.value,
        };
        // Update product data in db.json
        fetch(`http://localhost:3000/products/${updatedProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Product updated successfully:", data);
            // Reset form fields
            selectProduct.value = "";
            editName.value = "";
            editDescription.value = "";
            editPrice.value = "";
            editImage.value = "";
            editCategory.value = "";
          })
          .catch((error) => {
            console.error("Error updating product:", error);
          });
      });
    })
    .catch((error) => {
      console.error("Error fetching products data:", error);
    });
}

  
editProduct();
