const estados = {
    'Ocupada': 'Ocupada',
    'Libre': 'Libre',
    'Pendiente': 'Pendiente de Pago'
}

class Producto {
    #id;
    #nombre;
    #precio;

    constructor(nombre, precio) {
        this.#nombre = nombre
        this.#precio = precio
        this.#id = Date.now() + Math.ceil(Math.random() * 1000)
    }

    get nombre() {
        return this.#nombre
    }

    get precio() {
        return this.#precio
    }

    get id() {
        return this.#id
    }

    notificarAEstacion() {
        console.log("Enviar a Cocina")
    }
}

class BebidaCaliente extends Producto {
    #tipo;
    constructor() {
        this.#tipo = 'Bebida Caliente'
    }
}

class BebidaFria extends Producto {
    #tipo;
    constructor() {
        this.#tipo = 'Bebida Fria'
    }

    notificarAEstacion() {
        console.log("Enviar al Bar")
    }
}

class Mesa {
    #nombre;
    #estado;
    #comandas;
    #total;
    #personas;
    #id;
    #mesasUnidas;

    constructor(nombre, personas) {
        this.#nombre = nombre
        this.#estado = 'Libre'
        this.#personas = personas
        this.#total = 0
        this.#comandas = []
        this.#mesasUnidas = []
        this.#id = Math.ceil(Math.random() * 1000) + Date.now()
    }

    get nombre() {
        return this.#nombre;
    }

    get estado() {
        return this.#estado;
    }

    get id() {
        return this.#id;
    }

    get personas() {
        return this.#personas
    }

    get mesasUnidas() {
        return this.#mesasUnidas
    }

    get comandas(){
        return this.#comandas
    }

    cobrarMesa() {
        this.#cambiarEstado(estados.Libre)
    }

    #cambiarEstado(estado) {
        if (estados[estado] != undefined) {
            this.#estado = estado
        } else {
            throw new Error('Estado no Autorizado')
        }
    }

    ingresarComanda(comanda) {
        this.#comandas = [...this.#comandas, comanda]
    }

    eliminarComanda() {

    }

    aperturarMesa() {
        this.#cambiarEstado(estados.Ocupada)
    }

    muestrame() {
        tituloMesa.innerHTML = `<i class="fa-solid fa-ticket" aria-hidden="true"></i> Comanda ${this.nombre}`
        mesaDetalleInfo.innerHTML = `  <p><strong>Mesa:</strong> ${this.nombre.split(' ')[1]} </p>
            <p><strong>Capacidad:</strong> ${this.personas}   comensales</p>`
        estadoMesa.innerHTML = this.estado
        estadoMesa.className = `mesa-estado ${this.estado.toLowerCase()}`

        panelComanda.classList.remove('d-none')
        mesaDetalle.classList.remove('d-none')
        tablaWrap.classList.add('d-none')
        totales.classList.add('d-none')
        acciones.classList.add('d-none')
        botonUnirMesa.setAttribute('data-id', this.id)
    }

    unirme(ids) {
        this.#mesasUnidas = [...this.#mesasUnidas, ids]
    }

    mostrarCuenta() {
        tituloMesa.innerHTML = `<i class="fa-solid fa-ticket" aria-hidden="true"></i> Comanda ${this.nombre}`
        mesaDetalle.classList.add('d-none')
        tablaWrap.classList.remove('d-none')
        acciones.classList.remove('d-none')
        totales.classList.remove('d-none')
    }
}

class Restaurante {
    #nombre;
    #mesasNo;
    #mesas;

    constructor(nombre, mesas) {
        this.#mesasNo = mesas;
        this.#nombre = nombre;
        this.#mesas = this.crearMesas()
    }

    crearMesas() {
        let mesas = []
        for (let i = 1; i <= this.#mesasNo; i++) {
            mesas.push(new Mesa(`Mesa ${i}`, 4))
        }

        return mesas
    }

    get mesasNo() {
        return this.#mesasNo;
    }

    get mesas() {
        return this.#mesas;
    }

    normalizeMesasHTML() {
        let html = ''

        for (let item of this.#mesas) {
            html += `<article data-id=${item.id} class="mesa-card ${item.estado.toLowerCase()}">
                        <h3 data-id=${item.id}>${item.nombre}</h3>
                        <p data-id=${item.id}><span data-id="${item.id}" class="dot"></span> ${item.estado}</p>
                     </article>`
        }
        return html;
    }
}

//Pedido seria hermano de las clases bebidas
class Pedido {
    #cantidad;
    #nombre;
    #subtotal;
    #precio;

    constructor(cantidad, nombre, precio) {
        this.#cantidad = cantidad
        this.#nombre = nombre
        this.#precio = precio
        this.#subtotal = 0
    }

    get subtotal() {
        this.#subtotal = this.#cantidad * this.#precio;
        return this.#subtotal
    }
}

class Comanda {
    #pedidos;
    #mesas;
    constructor(mesas) {
        this.#mesas = mesas //Es posible que recibamos mas de una mesa, porla funcion de unir mesas
        this.#pedidos = []
    }

    agregarPedido() {
        this.#pedidos = [...this.#pedidos, pedidos]//mutabilidad, nuevo espaicon de memoria
    }

    agregarMesas(mesa) {
        this.#mesas = [this.#mesas, mesa]
    }
}

//Clases/objetos
const restaurante = new Restaurante('El gordo', 8)
const productos = [
    new Producto('Cafe Late', 25),
    new Producto('Cafe helado', 20)
]

///DOM
let contenedorMesas = document.querySelector('.mesas-grid')
let contenedorNoMesas = document.querySelector('.badge')
let tituloMesa = document.querySelector('#tituloMesa')
let mesaDetalleInfo = document.querySelector('.mesa-detalle-info')
let estadoMesa = document.querySelector('.mesa-estado')
let panelComanda = document.querySelector('.panel-comanda')
let detalleMesaAcciones = document.querySelector('.mesa-detalle-acciones')
let botonUnirMesa = document.querySelector('.unir-mesa')
let mesaDetalle = document.querySelector('.mesa-detalle')
let tablaWrap = document.querySelector('.tabla-wrap')
let acciones = document.querySelector('.acciones')
let totales = document.querySelector('.totales')
let menuGrid = document.querySelector('.menu-grid')

contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
contenedorNoMesas.textContent = `${restaurante.mesasNo} Mesas`
let mesaActualSeleccionada;
let mesaSeleccionada;

let btnEvento = (event) => {
    if (mesaActualSeleccionada != undefined) {
        mesaActualSeleccionada.style = ''
    }
    mesaSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)
    event.target.style = 'background: green'
    if (mesaSeleccionada.estado == estados.Libre) {
        mesaSeleccionada.muestrame()
    } else {
        mesaSeleccionada.mostrarCuenta()
    }
    mesaActualSeleccionada = event.target
}

let btnEventRojo = (event) => {
    event.target.style = 'background-color: red'
    mesaSeleccionada.unirme(event.target.dataset.id)
}
contenedorMesas.addEventListener('click', btnEvento)
let click = false;
botonUnirMesa.addEventListener('click', (event) => {
    contenedorMesas.removeEventListener('click', btnEvento)
    contenedorMesas.addEventListener('click', btnEventRojo)
    if (click) {
        let comandaObjeto = new Comanda; (mesaSeleccionada.id)
        for (let i = 0; i < mesaSeleccionada.mesasUnidas.length; i++) {
            let mesaAUnir = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[i])
            mesaAUnir.aperturarMesa();
            mesaAUnir.ingresarComanda(comandaObjeto)
            comandaObjeto.agregarMesas(mesaAUnir.id)
        }
        contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
        mesaSeleccionada.aperturarMesa();
        mesaSeleccionada.ingresarComanda(comandaObjeto)
        botonUnirMesa.textContent = 'Seleccionar Mesas'
        click = false;
        contenedorMesas.removeEventListener('click', btnEventRojo)
        contenedorMesas.addEventListener('click', btnEvento)
        mesaSeleccionada.mostrarCuenta()
    } else {
        botonUnirMesa.textContent = "Unir Mesas"
        botonUnirMesa.style = 'background-color: skyblue'
        //Mesa2
        mesaSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)
    }
    click = true
})
let productoshtml = ''
for (let producto of productos) {
    productoshtml += `<article class="producto-card">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
              alt="Hamburguesa"
            />
            <div class="producto-info">
              <h3>${producto.nombre}</h3>
              <p class="categoria comida"><i class="fa-solid fa-utensils"></i> Comida</p>
              <p class="precio">Q${producto.precio}</p>
              <button data-id='${producto.id}' type="button">Agregar</button>
            </div>
          </article>`
}
menuGrid.innerHTML = productoshtml
menuGrid.addEventListener('click', (event) => {
    if (event.target.type == 'button') {
        //buscar porducto seleccionado
        let producto = productos.find(item => item.id == event.target.dataset.id)
        //crear un pedido
        const pedido = new Pedido(1, producto.nombre, producto.precio)
        //agregar el pedido a la comanda
        mesaSeleccionada.comandas[0].agregarPedido(pedido)
        //dibujar el pedido en la comanda
        console.log(mesaSeleccionada)
    }
})



