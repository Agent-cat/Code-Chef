window.addEventListener("blur", () => {
   alert("You left the page");
    document.title = "Come back!";
});

window.addEventListener("focus", () => {
    
    document.title = "Welcome!";
    
});
