function cargarDatos(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const datosItems = data; 
            inicializarAutocompletado(datosItems);
        });
}

function inicializarAutocompletado(datosItems) {
    const buscador = document.getElementById("buscador");
    const sugerencias = document.getElementById("sugerencias");
    const valorSeleccionado = document.getElementById("valorSeleccionado");

    buscador.addEventListener("input", (event) => {
        const valorBuscado = event.target.value.toLowerCase();
        sugerencias.innerHTML = "";

        const resultados = datosItems.filter((item) =>
            item.texto.toLowerCase().includes(valorBuscado)
        );
        resultados.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item.texto;
            li.addEventListener("click", () => {
                buscador.value = item.texto;
                valorSeleccionado.value = item.valor;
                sugerencias.innerHTML = "";
                sugerencias.style.display = "none";
            });
            sugerencias.appendChild(li);
        });

        sugerencias.style.display = "block";

        document.addEventListener("click", handleClickOutside);
    });

    function handleClickOutside(event) {
        if (!event.target.closest("#sugerencias")) {
            sugerencias.style.display = "none";
            document.removeEventListener("click", handleClickOutside);
        }
    }
}

export { cargarDatos };
