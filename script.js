async function loadProperties() {
  try {
    const response = await fetch(
      "https://edu-me01.github.io/Json-Data/Real-state.json"
    );
    const data = await response.json();
    const properties = data.properties;
    return properties;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
  }
}

loadProperties().then((properties) => {
  if (!properties) return; // Prevent errors if fetch fails

  const wrapper = document.getElementsByClassName("swiper-wrapper")[0];
  // Only loop through available properties
  for (let i = 0; i < properties.length-1; i++) {
   if(i==3||i==5||i==8){
   continue;
   }
    const s = properties[i];
    wrapper.innerHTML += `<div class="swiper-slide"><img src="${s.images[0]} style="width=100%"></div>`;
  }

  // Initialize Swiper AFTER slides are added
const swiper = new Swiper(".swiper", {
    loop: true,
    autoplay: {
        delay: 3000, // 3 seconds between slides
        disableOnInteraction: false, // keep autoplay after user interaction
    },
    pagination: {
        el: ".swiper-pagination",
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
});
loadProperties().then((properties) => {
   for (let i = 0; i < properties.length; i++) {
   let card= document.createElement("div");
card.className = "property-card";
card.innerHTML = `
    <div style="width: 350px; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 10px; box-sizing: border-box; display: flex; flex-direction: column; height: 100%;">
        <img src="${properties[i].mainImage}" alt="${properties[i].title}" 
            style="width: 100%; height: 197px; border-radius: 8px; margin-bottom: 10px; aspect-ratio: 16/9; object-fit: cover;" 
            onerror="this.onerror=null;this.src='https://img.freepik.com/premium-vector/home-icon-vector_564384-123.jpg';">
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 1.2em; flex: 1;">${properties[i].title}</h3>
            <button 
                id="fav-btn-${properties[i].id}" 
                onclick="toggleFavourite(this, ${properties[i].id})" 
                title="Add to Favourites" 
                style="background: none; border: none; cursor: pointer; font-size: 22px; margin-left: 10px; color: #bbb; transition: color 0.2s; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; padding: 0;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: block;">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-.9.9-.9-.9a5.5 5.5 0 0 0-7.8 7.8l.9.9L12 21.3l8.7-8.7.9-.9a5.5 5.5 0 0 0 0-7.8z"></path>
                </svg>
            </button>
        </div>
        <p style="margin: 10px 0 5px 0; color: #555;">${properties[i].description}</p>
        <p style="margin: 5px 0;"><span style="margin-right:10px;">🏠</span>Price: $${properties[i].price}</p>
        <p style="margin: 5px 0;">
            <span style="margin-right:10px;">📍</span>
            ${(properties[i].location && properties[i].location.city && properties[i].location.state) 
                ? properties[i].location.city + ", " + properties[i].location.state 
                : "Unknown location"}
        </p>
        <p style="margin: 5px 0;">
            <span style="margin-right:10px;">🛏️</span>${properties[i].bedrooms ?? "?"} 
            <span style="margin-left:15px; margin-right:10px;">🛁</span>${properties[i].bathrooms ?? "?"}
        </p>
        <div style="display: flex; flex-direction: row; gap: 10px; align-items: center; margin-top: auto; justify-content: flex-end;">
            <button onclick="details(${properties[i].id})" style="background-color: #eb6650; color: #fff; border: none; border-radius: 4px; padding: 10px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background-color 0.3s; width: 180px;">View Details</button>
            <button onclick="showAddToCartAlert(${properties[i].id})" style="background-color: #4caf50; color: #fff; border: none; border-radius: 4px; padding: 10px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background-color 0.3s;">Add to Cart</button>
        </div>
    </div>
`;

// Add this function after your other functions (only once in your script)
window.showAddToCartAlert = function(id) {
    addToCart(id);
    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: "success",
            title: "Added to Cart!",
            text: "This property has been added to your cart.",
            confirmButtonColor: "#4caf50",
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        alert("Added to cart!");
    }
};
   document.getElementById("card").appendChild(card);
}
});

function details(i) {
    localStorage.setItem("property", JSON.stringify(i));
    window.location.href = "details.html";
}

// Add this function to handle the favorite icon toggle
function toggleFavourite(btn, id) {
    // Get current favourites from localStorage or initialize as empty array
    let favourites = JSON.parse(localStorage.getItem("favourite")) || [];
    const index = favourites.indexOf(id);

    if (index !== -1) {
        // Remove from favourites
        favourites.splice(index, 1);
        btn.style.color = "#bbb";
        btn.title = "Add to Favourites";
    } else {
        // Add to favourites
        favourites.push(id);
        btn.style.color = "#eb6650";
        btn.title = "Remove from Favourites";
    }
    localStorage.setItem("favourite", JSON.stringify(favourites));
}

function addToCart(id) {
    // Get current cart from localStorage or initialize as empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}
// Select the <a> with href="login.html" and a specific style
// Make sure SweetAlert2 is loaded in your HTML before this script:
// <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
const loginBtn = document.querySelector('nav ul li a[href="login.html"][style*="border: 2px solid #eb6650"]');
let flag=localStorage.getItem("isLoggedIn");
let fullname = localStorage.getItem("fullname");
if (flag === "true") {
    if (loginBtn) {
        loginBtn.textContent = fullname;
        loginBtn.style.border = "2px solid #eb6650";
        loginBtn.style.color = "#eb6650";
        loginBtn.addEventListener("click", function (e) {
            e.preventDefault();
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    title: "Do you want to log out?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Log out",
                    cancelButtonText: "Stay",
                    confirmButtonColor: "#eb6650"
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem("isLoggedIn");
                        window.location.href = "login.html";
                    }
                    // If cancelled, do nothing (stay on page)
                });
            } else {
                // Fallback if SweetAlert2 is not loaded
                if (confirm("Do you want to log out?")) {
                    localStorage.removeItem("isLoggedIn");
                    window.location.href = "login.html";
                }
            }
        });
    }
}