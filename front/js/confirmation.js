
// fonction de récupération de l'id de la commande et suppression des produits du local storage et du panier (dom)
function userOrderConfirm() {
    const userOrderId = document.querySelector("#orderId");
    const userOrderIdUrl = new URL(location.href).searchParams.get("id");
    userOrderId.textContent = userOrderIdUrl;
  
    // Suppression des produits du localStorage et du panier lorsque la commande validée
    localStorage.removeItem("cart");
  }
  
  userOrderConfirm()