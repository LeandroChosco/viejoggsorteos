
function agregarEventos() {
    let btn = document.querySelector(".buttonAdd");
    btn.addEventListener("mousemove", (event) => {
        let rect = btn.getBoundingClientRect();
        let x = event.clientX * 3 - rect.left;
        btn.style.setProperty("--x", x + "deg");
    });
}

export { agregarEventos };
