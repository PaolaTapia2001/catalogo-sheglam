let productosGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();

    const filtroMarca = document.getElementById("filtroMarca");
    const filtroCategoria = document.getElementById("filtroCategoria");
    const filtroPrecio = document.getElementById("filtroPrecio");

    if (filtroMarca) filtroMarca.addEventListener("change", filtrarYMostrar);
    if (filtroCategoria) filtroCategoria.addEventListener("change", filtrarYMostrar);
    if (filtroPrecio) {
        filtroPrecio.addEventListener("input", (e) => {
            const valorPrecio = document.getElementById("valorPrecio");
            if (valorPrecio) valorPrecio.textContent = e.target.value;
            filtrarYMostrar();
        });
    }
});

async function cargarProductos() {
    try {
        const respuesta = await fetch("productos.json");
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        productosGlobal = await respuesta.json();
        
        inicializarFiltros(productosGlobal);
        mostrarProductos(productosGlobal);
    } catch (error) {
        console.error("No se pudo cargar el archivo productos.json:", error);
        const contenedor = document.getElementById("contenedorProductos");
        if (contenedor) {
            contenedor.innerHTML = `<div class="col-12 text-center py-4 text-danger"><p>Error al cargar los productos. Asegúrate de usar Live Server.</p></div>`;
        }
    }
}

function inicializarFiltros(productos) {
    const marcasSet = [...new Set(productos.map(p => p.marca))];
    const categoriasSet = [...new Set(productos.map(p => p.categoria))];

    const selectMarca = document.getElementById("filtroMarca");
    const selectCategoria = document.getElementById("filtroCategoria");

    if (selectMarca) {
        selectMarca.innerHTML = '<option value="">Todas las marcas</option>';
        marcasSet.forEach(marca => {
            const option = document.createElement("option");
            option.value = marca;
            option.textContent = marca;
            selectMarca.appendChild(option);
        });
    }

    if (selectCategoria) {
        selectCategoria.innerHTML = '<option value="">Todas las categorías</option>';
        categoriasSet.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            selectCategoria.appendChild(option);
        });
    }
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById("contenedorProductos");
    if (!contenedor) return;
    
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center py-4"><p class="text-muted">No se encontraron productos con los filtros seleccionados.</p></div>`;
        return;
    }

    productos.forEach(producto => {
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-secondary align-self-start mb-2">${producto.categoria}</span>
                    <h5 class="card-title fw-bold">${producto.nombre}</h5>
                    <p class="text-muted small mb-1">Marca: <strong>${producto.marca}</strong></p>
                    <p class="text-success fw-bold fs-5 mt-auto">$${producto.precio.toFixed(2)}</p>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });
}

function filtrarYMostrar() {
    const marcaSeleccionada = document.getElementById("filtroMarca")?.value || "";
    const categoriaSeleccionada = document.getElementById("filtroCategoria")?.value || "";
    const precioMaximo = parseFloat(document.getElementById("filtroPrecio")?.value) || 20;

    const filtrados = productosGlobal.filter(producto => {
        const coincideMarca = marcaSeleccionada === "" || producto.marca === marcaSeleccionada;
        const coincideCategoria = categoriaSeleccionada === "" || producto.categoria === categoriaSeleccionada;
        const coincidePrecio = producto.precio <= precioMaximo;

        return coincideMarca && coincideCategoria && coincidePrecio;
    });

    mostrarProductos(filtrados);
}