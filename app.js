const estados = {
    'Ocupada': 'Ocupada',
    'Libre': 'Libre',
    'Pendiente': 'Pendiente de Pago'
}

class Producto {
    #id;
    #nombre;
    #precio;
    #url;

    constructor(nombre, precio, url) {
        this.#nombre = nombre
        this.#precio = precio
        this.#url = url
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

    get url() {
        return this.#url
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

    notificarAEstacion() { //Aplicamos polimorfismo
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

    get comandas() {
        return this.#comandas
    }

    cobrarMesa() {
        this.#cambiarEstado(estados.Libre)
        this.#mesasUnidas = [];
    }

    #cambiarEstado(estado) {
        if (estados[estado] != undefined) {
            this.#estado = estado
        } else {
            throw new Error('Estado no Autorizado')
        }
    }

    ingresarComanda(comanda) {
        this.#comandas = [...this.#comandas, comanda]///Realizamos una copia agregandole un nuevo valor, como un push 
    }

    eliminarComanda() {
        //this.#comandas = this.#comandas.find()//Quiza sea otro opcion
        this.#comandas.pop()
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

        let mesaQueEstoyUniendo = restaurante.mesas.find(mesa => mesa.id == ids)

        if (!mesaQueEstoyUniendo.mesasUnidas.includes(this.id)) {
            mesaQueEstoyUniendo.unirme(this.id)
        }
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
        return (this.#subtotal).toFixed(2)
    }

    get cantidad() {
        return this.#cantidad
    }

    set cantidad(value) {
        this.#cantidad = value
    }

    get nombre() {
        return this.#nombre
    }

    get precio() {
        return this.#precio
    }

}

class Comanda {
    #pedidos;
    #mesas;
    #impuestos = 0.05;
    #estado;

    constructor(mesas) {
        this.#mesas = mesas //Es posible que recibamos mas de una mesa, porla funcion de unir mesas
        this.#pedidos = []
        this.#estado = 'Perndiente'
    }

    get subtotal() {
        return this.#pedidos.reduce((acumulador, actual) => acumulador + parseFloat(actual.subtotal), 0).toFixed(2)
    }

    get pedidos() {
        return this.#pedidos
    }

    agregarPedido(pedido) {
        let pedidoEncontrar = this.#pedidos.find(item => item.nombre == pedido.nombre)
        if (pedidoEncontrar == undefined) {
            this.#pedidos = [...this.#pedidos, pedido]//mutabilidad, nuevo espaicon de memoria
        } else {
            pedidoEncontrar.cantidad++
        }
    }

    agregarMesas(mesa) {
        this.#mesas = [...this.#mesas, mesa]
    }

    renderizar() {

        let html = ''
        for (let pedido of this.#pedidos) {
            html +=
                `<tr>
                <td>${pedido.cantidad}</td>
                <td>${pedido.nombre}</td>
                <td>Q${pedido.precio}</td>
                <td>Q${pedido.subtotal}</td>
              </tr> `
        }
        tablaPedido.innerHTML = html
        subtotal.textContent = `Q ${this.subtotal - (this.subtotal * this.#impuestos).toFixed(2)}`//En esta parte solo realice las operaiconees y las pinte
        impuestos.textContent = (this.subtotal * this.#impuestos).toFixed(2)//no las guarde en variables
        total.textContent = ((this.subtotal - (this.subtotal * this.#impuestos)) + (this.subtotal * this.#impuestos)).toFixed(2)
    }

    cobrar() {
        this.#estado = 'Preparando'//En pantalla de comandas proximamente
        tablaPedido.innerHTML = " "
        subtotal.textContent = '0.00'
        impuestos.textContent = '0.00'
        total.textContent = '0.00'
        alert('Comanda, Enviada')
    }
}

//Clases/objetos
const restaurante = new Restaurante('El gordo', 8)

const productos = [
    // Comida
    new Producto('Hamburguesa Clásica', 55, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpPwa_I0gVVPuun0mxexSASVn4PfIZnYRlQBFwwCPALHL17Hr4eOKe5Po&s=10'),
    new Producto('Hamburguesa Doble', 75, 'https://www.elytienda.com/cdn/shop/products/hamburguesa_doble_carne.jpg?v=1706491389'),
    new Producto('Pizza Personal', 60, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMKUglo-GyXowE2Nb2bd7iODcdMVNyed8upsc3Gj5EuQ&s=10'),
    new Producto('Tacos de Pollo', 45, 'https://campollo.com/wp-content/uploads/2024/02/GettyImages-600996126.jpeg'),
    new Producto('Tacos de Carne', 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb72Lr2CAMhV0Zq_6PB2yT4fm62f4RihzTNTVdsMFghU8J62DcItfWjrK5&s=10'),
    new Producto('Sandwich Club', 48, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_ouc3-xrrsfjaFDVPwTLpZY9wBZANiBX-G2gR43vUPHFEyxWSJgR4xhRU&s=10'),
    new Producto('Ensalada César', 40, 'https://cantina20.com/wp-content/uploads/2023/06/ensalada-cesar.jpg'),
    new Producto('Papas Fritas', 25, 'https://www.cocinadelirante.com/800x600/filters:format(webp):quality(75)/sites/default/files/images/2022/08/como-hacer-papas-francesa-crujientes-principal.jpg'),
    new Producto('Alitas BBQ', 65, 'https://cdn.shopify.com/s/files/1/0614/0962/4293/files/ALITAS_DE_POLLO_BBQ__HISTORIA.jpg?v=1754074960'),
    new Producto('Nachos Supremos', 55, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT-NsnPamayaHrkIBdIiCIjOM99nlT7Jp5bdLcAX1JOHfoyLZxr1goK-7n&s=10'),

    // Postres
    new Producto('Pastel de Chocolate', 30, 'https://www.cocinadelirante.com/800x600/filters:format(webp):quality(75)/sites/default/files/images/2023/08/receta-de-pastel-de-chocolate-facil.jpg'),
    new Producto('Cheesecake', 35, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUMSDiFKrIzB53hRzAndPRT8VXlNLDVKhsLUXpQR9z1as-PEspOvM_H3k&s=10'),
    new Producto('Brownie', 25, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLYkuKt0fIUNxi79ad9IOFOXkp1FG9ic_594o5Levkn0BtXfZk8Vh7eWk&s=10'),
    new Producto('Helado de Vainilla', 20, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5AESJ1X-_X4A8jajwuxqqG4k_4evVgTe9YL6L2NP_0hRqtuD4wAtSioaf&s=10'),
    new Producto('Helado de Chocolate', 20, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJv2YzdAlU8454KQMazYCnjESiI62hBSRLTLTcIb3KqMUENRyrcnOIjUFW&s=10'),
    new Producto('Flan Casero', 22, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO3ditsLW0X1VoCD4mvlI46WiAJXd4I94y0iDarE421mjm34e5WUL91Os&s=10'),
    new Producto('Tiramisú', 38, 'https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/7f45d6f8807ebc775928651a3398dce9.png'),

    // Bebidas Frías
    new Producto('Coca Cola', 15, 'https://m.media-amazon.com/images/I/61SISUGCDYL._AC_UF894,1000_QL80_.jpg'),
    new Producto('Pepsi', 15, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN7CpOfU_q8qq2kC9p567f3YD4sCItSFZ3ARxXlMHemA&s=10'),
    new Producto('Agua Purificada', 10, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW6adEic-yrAIj79hqYKCn5F1JZ7gM475IF1egOgrQDoiCSCo8MKLh8u6L&s=10'),
    new Producto('Limonada', 18, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUgMaozBBcmCxtBTFVKLJFl6rIGzH_Fw2ld49h6qL5qwMg4cR__APDsLNo&s=10'),
    new Producto('Té Frío', 18, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTp6thqPkcu9C_FzIJYWwLSBi4oFqglemVYxzw5Mqh6Lu3tN6wuRB7BiY&s=10'),
    new Producto('Jugo de Naranja', 20, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsLuSKujCfuOHEvo_QArpY2xwVHxeOY1pTEh3MHDOdR4tcJe2yaNi8HoQ&s=10'),
    new Producto('Jugo de Mango', 22, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMC18Tq5KfwQLgsSR_eeY89FIJlLC-XADZlcIW-z3_ISbGgxm8WJ-bXZs&s=10'),
    new Producto('Malteada de Chocolate', 28, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLGrlt7T-PziXom6yOs-zVinTtE827NDIFtfZB3wAMLgMynxmX__mEjVs5&s=10'),
    new Producto('Malteada de Fresa', 28, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQR0cPVsZXwYJatc5AgX8USq2jfqcEv0A2gThXXk69kSo2ydfx3C8OVJc&s=10'),
    new Producto('Café Helado', 20, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCdip0AylxlBZaQRQy5WKkiLHoCTXbklp3JJYc60tDnxpvrDZ-z5nNHzpT&s=10'),

    // Bebidas Calientes
    new Producto('Café Americano', 18, 'https://gourmetdemexico.com.mx/wp-content/uploads/2016/08/field_image_head-espresso.jpg'),
    new Producto('Café Latte', 25, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReznO3ZGVcUobEB5JPk8bUaQiaiSVCLzYH9caUssxLZ-CPxM-jzSn1aOeR&s=10'),
    new Producto('Capuchino', 25, 'https://www.cafes-santacristina.com/sites/default/files/2023-09/capuchino.jpg'),
    new Producto('Espresso', 15, 'https://www.cafe-mx.com/blog/app/assets/media/2018/08/cafe-expreso.jpg'),
    new Producto('Chocolate Caliente', 22, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLyCHn9K7JRjZkVEYb3CAVcvzamFwsmw1ZDzPmMLUyThQDyiAkVANdVXE&s=10'),
    new Producto('Té de Manzanilla', 15, 'https://comedera.com/wp-content/uploads/sites/9/2020/12/cup-829527_1280.jpg'),
    new Producto('Té Negro', 15, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv1TvMD4UTqzNt4WILbZK9-6vOVaiRyzVV7ynngasOxbuS74w0SgP99nM&s=10'),
    new Producto('Mocaccino', 28, 'https://osojimix.com/wp-content/uploads/2021/07/MOCACCINO.jpg')
];

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
let tablaPedido = document.querySelector('#tabla-pedido')
let subtotal = document.querySelector('#subtotal')
let impuestos = document.querySelector('#impuestos')
let total = document.querySelector('#total')
let cobrar = document.querySelector('#cobrar')
let cerrarMesa = document.querySelector('#cerrar-mesa')
let abrirCuenta = document.querySelector('#abrir-cuenta')
let cantidadProductos = document.querySelector('#cantidad-productos')

contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
contenedorNoMesas.textContent = `${restaurante.mesasNo} Mesas`
cantidadProductos.textContent = `${productos.length} Productos`
let mesaActualSeleccionada;
let mesaSeleccionada;
let modoSeleccion = false;

let btnEvento = (event) => {
    mesaSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)
    if (!event.target.className.includes('mesas-grid')) {
        if (mesaActualSeleccionada != undefined) {
            mesaActualSeleccionada.style = ''
        }

        event.target.style = 'background: green'

        if (mesaSeleccionada.estado == estados.Libre) {
            mesaSeleccionada.muestrame()
            cobrar.classList.remove('cobrar')
            cobrar.disabled = true;
        } else {

            if (mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].pedidos.length > 0) {
                cobrar.disabled = false;
                cobrar.classList.add('cobrar')
            } else {
                cobrar.disabled = true;
                cobrar.classList.remove('cobrar')
            }

            mesaSeleccionada.mostrarCuenta()
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].renderizar()

            if(mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].pedidos.length == 0){
                cerrarMesa.disabled = false;
            } else {
                cerrarMesa.disabled = true;
            }

        }
        mesaActualSeleccionada = event.target

        if (panelComanda.classList.contains('d-none')) {
            panelComanda.classList.remove('d-none')
        }

    } else {
        alert('Seleccione una mesa libre')
    }
}

let btnEventRojo = (event) => {
    let mesaSeleccionadaActual = restaurante.mesas.find(item => item.id == event.target.dataset.id)
    if (mesaSeleccionadaActual.estado != estados.Ocupada && modoSeleccion) {
        if (!event.target.className.includes('mesas-grid')) {
            event.target.style = 'background-color: red'
            mesaSeleccionada.unirme(event.target.dataset.id)
            //event.target.unirme(mesaSeleccionada)
            // mesaSeleccionadaActual.unirme(mesaSeleccionada)
        }
    } else {
        alert('Seleccione una mesa libre')
    }

}
contenedorMesas.addEventListener('click', btnEvento)
let click = false;

botonUnirMesa.addEventListener('click', (event) => {
    contenedorMesas.removeEventListener('click', btnEvento)
    contenedorMesas.addEventListener('click', btnEventRojo)

    if (click) {
        modoSeleccion = false;
        abrirCuenta.disabled = false;
        let comandaObjeto = new Comanda([mesaSeleccionada.id])

        for (let i = 0; i < mesaSeleccionada.mesasUnidas.length; i++) {
            let mesaAUnir = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[i])
            mesaAUnir.aperturarMesa();
            mesaAUnir.ingresarComanda(comandaObjeto)
            comandaObjeto.agregarMesas(mesaAUnir.id)
        }
        mesaSeleccionada.aperturarMesa();
        mesaSeleccionada.ingresarComanda(comandaObjeto)
        botonUnirMesa.textContent = 'Seleccionar Mesas'
        contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
        click = false;
        contenedorMesas.removeEventListener('click', btnEventRojo)
        contenedorMesas.addEventListener('click', btnEvento)
        mesaSeleccionada.mostrarCuenta()
        comandaObjeto.renderizar()
    } else {
        abrirCuenta.disabled = true;
        modoSeleccion = true;
        botonUnirMesa.textContent = "Unir Mesas"
        botonUnirMesa.style = 'background-color: skyblue'
        mesaSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)
        click = true;
    }
})
let productoshtml = ''
for (let producto of productos) {
    productoshtml += `<article class="producto-card">
            <img
              src="${producto.url}"
              alt="${producto.nombre}"
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
        cobrar.disabled = false;
        cobrar.classList.add('cobrar')
        cerrarMesa.disabled = true;
        //buscar porducto seleccionado
        let producto = productos.find(item => item.id == event.target.dataset.id)
        //crear un pedido
        const pedido = new Pedido(1, producto.nombre, producto.precio)
        //agregar el pedido a la comanda
        if (mesaSeleccionada && mesaSeleccionada.comandas.length > 0) {
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].agregarPedido(pedido)
            //dibujar el pedido en la comanda
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].renderizar()
        } else {
            alert('Aperture una mesa antes')
        }
    }
    //cerrarMesa.disabled = true;
})

cobrar.addEventListener('click', (event) => {
    let cambiandoMesaPrincipal = mesaSeleccionada

    //Cuando seleccionen una mesa secundaria, voy a buscar la principal
    if (mesaSeleccionada.mesasUnidas.length == 1) {
        cambiandoMesaPrincipal = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[0])
    }
    const nuevaComanda = new Comanda([cambiandoMesaPrincipal.id])

    for (let i = 0; i < cambiandoMesaPrincipal.mesasUnidas.length; i++) {
        let mesaAUnir = restaurante.mesas.find(item => item.id == cambiandoMesaPrincipal.mesasUnidas[i])
        mesaAUnir.ingresarComanda(nuevaComanda)
    }
    cambiandoMesaPrincipal.ingresarComanda(nuevaComanda)

    if(cambiandoMesaPrincipal.comandas[cambiandoMesaPrincipal.comandas.length - 1].pedidos.length == 0){
        cerrarMesa.disabled = false;
    }else{
        cerrarMesa.disabled = true;
    }

    cobrar.disabled = true;
    cobrar.classList.remove('cobrar')
    cambiandoMesaPrincipal.comandas[cambiandoMesaPrincipal.comandas.length - 1].cobrar()
})

cerrarMesa.addEventListener('click', (event) => {
    let cambiandoMesaPrincipal = mesaSeleccionada

    //Cuando seleccionen una mesa secundaria, voy a buscar la principal
    if (mesaSeleccionada.mesasUnidas.length == 1) {
        cambiandoMesaPrincipal = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[0])
    }

    for (let i = 0; i < cambiandoMesaPrincipal.mesasUnidas.length; i++) {
        let mesaAUnir = restaurante.mesas.find(item => item.id == cambiandoMesaPrincipal.mesasUnidas[i])
        mesaAUnir.cobrarMesa()
    }

    cambiandoMesaPrincipal.cobrarMesa()
    cambiandoMesaPrincipal.eliminarComanda()
    contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
    panelComanda.classList.add('d-none')
})

abrirCuenta.addEventListener('click', (event) => {
    mesaSeleccionada.aperturarMesa()
    let comandaObjeto = new Comanda([mesaSeleccionada.id])
    comandaObjeto.agregarMesas(mesaSeleccionada.id)
    mesaSeleccionada.ingresarComanda(comandaObjeto)
    contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
    mesaSeleccionada.mostrarCuenta()
    comandaObjeto.renderizar()
})


