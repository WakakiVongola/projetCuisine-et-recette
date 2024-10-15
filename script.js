// const openButton = document.getElementById("button_select_1");

// function openModal() {
//     modal.style.visibility = "visible";
// }
// openButton.addEventListener("click", openModal);

// closeButton.addEventListener("click", () => {
//   modal.style.display = "none";
// });

document.querySelectorAll("legend").forEach(legend => {
  legend.addEventListener("click", function() {
    const content = this.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
  });
});
