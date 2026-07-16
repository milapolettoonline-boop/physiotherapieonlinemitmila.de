/*=========================================================
  SCRIPT.JS
  Physiotherapie online mit Mila
=========================================================*/


/*=========================================================
  FAQ ACCORDION
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        const button = item.querySelector(".faq-question");

        button.addEventListener("click", () => {

            const activeItem = document.querySelector(".faq-item.active");

            if (activeItem && activeItem !== item) {
                activeItem.classList.remove("active");
            }

            item.classList.toggle("active");

        });

    });

});


/*=========================================================
  BACK TO TOP
=========================================================*/

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});


/*=========================================================
  SMOOTH SCROLL
=========================================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            e.preventDefault();

            target.scrollIntoView({

                behavior:"smooth",

                block:"start"

            });

        }

    });

});


/*=========================================================
  HEADER SHADOW
=========================================================*/

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 80){

        header.style.boxShadow = "0 12px 30px rgba(0,0,0,.10)";

    }else{

        header.style.boxShadow = "0 5px 25px rgba(0,0,0,.05)";

    }

});


/*=========================================================
  ACTIVE MENU
=========================================================*/

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 180;

        if(window.scrollY >= sectionTop){

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if(link.getAttribute("href") === "#" + current){

            link.classList.add("active");

        }

    });

});


/*=========================================================
  IMAGE FADE-IN
=========================================================*/

const images = document.querySelectorAll("img");

const imageObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";

            entry.target.style.transform="translateY(0)";

        }

    });

},{
    threshold:0.15
});

images.forEach(image=>{

    image.style.opacity="0";

    image.style.transform="translateY(30px)";

    image.style.transition=".8s";

    imageObserver.observe(image);

});


/*=========================================================
  SECTION FADE-IN
=========================================================*/

const elements = document.querySelectorAll(

".card, .pricing-card, .contact-card, .about-content, .exercise-text, .faq-item"

);

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

},{
threshold:0.15
});

elements.forEach(el=>{

el.style.opacity="0";

el.style.transform="translateY(35px)";

el.style.transition=".8s";

observer.observe(el);

});


/*=========================================================
  PAGE LOADED
=========================================================*/

window.addEventListener("load",()=>{

document.body.classList.add("loaded");

});


/*=========================================================
  CURRENT YEAR
=========================================================*/

const year = document.getElementById("currentYear");

if(year){

year.textContent = new Date().getFullYear();

}


/*=========================================================
  END
=========================================================*/