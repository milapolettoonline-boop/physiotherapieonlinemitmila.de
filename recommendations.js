document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("products-grid");
    const categoriesContainer = document.querySelector(".categories .container");

    if (!grid || !categoriesContainer) return;


    /* =========================
       CATEGORIEN ERSTELLEN
       ========================= */

    const categories = [
        "Alle",
        ...new Set(products.map(product => product.category))
    ];

    categoriesContainer.innerHTML = categories.map(category => {

        return `
            <button
                class="category-button ${category === "Alle" ? "active" : ""}"
                type="button"
                data-category="${category}">

                ${category}

            </button>
        `;

    }).join("");


    /* =========================
       PRODUKTE ANZEIGEN
       ========================= */

    function renderProducts(selectedCategory = "Alle") {

        grid.innerHTML = "";

        const filteredProducts =
            selectedCategory === "Alle"
                ? products
                : products.filter(
                    product => product.category === selectedCategory
                );


        filteredProducts.forEach(product => {

            const card = document.createElement("article");

            card.className = "product-card";

            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy">

                </div>


                <div class="product-content">

                    <span class="product-category">
                        ${product.category}
                    </span>


                    <h3>
                        ${product.name}
                    </h3>


                    <p>
                        ${product.shortDescription}
                    </p>


                    <div class="product-price">
                        ${product.price}
                    </div>


                    <div class="product-buttons">

                        <a
                            href="${product.page}"
                            class="btn-secondary">

                            Mehr erfahren

                        </a>


                        <a
                            href="${product.amazon}"
                            target="_blank"
                            rel="nofollow sponsored noopener"
                            class="btn-primary">

                            Bei Amazon kaufen

                        </a>

                    </div>

                </div>

            `;

            grid.appendChild(card);

        });

    }


    /* =========================
       KATEGORIE FILTER
       ========================= */

    categoriesContainer.addEventListener("click", event => {

        const button = event.target.closest(".category-button");

        if (!button) return;

        document
            .querySelectorAll(".category-button")
            .forEach(item => item.classList.remove("active"));


        button.classList.add("active");


        renderProducts(
            button.dataset.category
        );

    });


    /* =========================
       START
       ========================= */

    renderProducts();

});