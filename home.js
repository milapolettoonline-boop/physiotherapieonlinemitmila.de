document.addEventListener("DOMContentLoaded", () => {

    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".navigation-list");

    if (!menuButton || !navigation) {
        return;
    }

    menuButton.addEventListener("click", () => {

        const isOpen =
            menuButton.getAttribute("aria-expanded") === "true";

        menuButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        navigation.classList.toggle("is-open");
    });


    navigation.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            navigation.classList.remove("is-open");
        });

    });

});