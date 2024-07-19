const url = "https://test-api-i7ml.onrender.com/items"
const urlLocal = "http://localhost:3500/items"

var misEncabezados = new Headers();
misEncabezados.append('Content-Type', 'application/json');

let total = 0;
let listItems = [];
const objItem = { id: '', code: '', name: '', detail: '', price: 0, img: '' };
let editando = false;


cargarItemMain();
showItems();

async function showItems() {
    listItems = [];
    const divItems = document.querySelector('.items-container')
    while (divItems.firstChild) {
        divItems.removeChild(divItems.firstChild)
    }

    await procesarItems();
    listItems.forEach(item => {
        const { id, code, name, detail, price, img } = item;

        var nuevoItem = document.createElement('div');
        nuevoItem.dataset.id = id;
        nuevoItem.classList.add('item');

        var nuevaImagen = document.createElement('img');
        nuevaImagen.src = img === '' ? './assets/imgNull.jpeg' : img;
        nuevaImagen.alt = 'img' + code;

        var nameItem = document.createElement('p');
        nameItem.classList.add('text-name');
        nameItem.textContent = name;

        var detailItem = document.createElement('p');
        detailItem.textContent = detail;

        var priceItem = document.createElement('p');
        priceItem.classList.add('text-price');
        priceItem.textContent = '\$' + price;

        var boton = document.createElement('button');
        boton.onclick = () => cargarItem(item)
        boton.textContent = 'Ver';

        nuevoItem.appendChild(nuevaImagen);
        nuevoItem.appendChild(document.createElement('br'));
        nuevoItem.appendChild(document.createElement('br'));
        nuevoItem.appendChild(nameItem);
        nuevoItem.appendChild(detailItem);
        nuevoItem.appendChild(document.createElement('br'));
        nuevoItem.appendChild(priceItem);
        nuevoItem.appendChild(boton);

        var contenedor = document.querySelector('.items-container');

        const qtyProds = document.querySelector('#qtyProds');
        qtyProds.textContent = 'Productos (' + listItems.length + ')';
        contenedor.appendChild(nuevoItem);
    })

}

const title = document.querySelector('#title');
title.textContent = 'Crear Producto';
const formulario = document.querySelector('#formulario');
const codeImput = document.querySelector('#code');
const nameImput = document.querySelector('#name');
const detailImput = document.querySelector('#detail');
const priceImput = document.querySelector('#price');
const img = document.querySelector('#img');
const btnAdd = document.querySelector('#btnAdd');
formulario.addEventListener('submit', validateData);

async function validateData(e) {
    e.preventDefault();

    if (codeImput.value === '' || nameImput.value === '' || detailImput.value === '' || priceImput.value == 0) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    objItem.code = codeImput.value;
    objItem.name = nameImput.value;
    objItem.detail = detailImput.value;
    objItem.price = parseInt(priceImput.value);
    objItem.img = img.value;

    if (editando) {
        await editItemAPi()
        editando = false;
    } else {

        objItem.id = Date.now().toString();
        createItem();
    }
}

async function createItem() {
    await setItems(objItem);
    showItems();
    formulario.reset();
    clearObj();
}

async function setItems(body) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            throw new Error('Error en la petición: ' + response.statusText)
        }
    } catch (er) {
        console.log(er)
    }
}

function addShoppinCart(item) {
    total += item.price;
    listOrders.push(item);
    header();
    showShoppingCart()
}

async function getItems() {
    var opcionesDeSolicitud = {
        method: 'GET',
        headers: misEncabezados
    };
    try {
        const response = await fetch(url, opcionesDeSolicitud);
        if (!response.ok) {
            throw new Error('La solicitud no fue exitosa');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la petición: ', error);
        return null;
    }
}

async function procesarItems() {
    try {
        const data = await getItems();
        if (data) {
            data.items.forEach(item => {
                listItems.push(item);
            })
        } else {
            alert('No hay productos disponibles');
            return;
        }
    } catch (error) {
        console.error('Error al procesar los ítems: ', error);
    }
}

function cargarItem(item) {
    limpiarHtmlShopping();

    var nuevoItem = document.createElement('div');
    nuevoItem.dataset.id = item.id;
    nuevoItem.classList.add('itemDetail');

    var newDiv1 = document.createElement('div');
    newDiv1.classList.add('newDiv1');

    var nuevaImagen = document.createElement('img');
    nuevaImagen.src = item.img === '' ? './assets/imgNull.jpeg' : item.img;
    nuevaImagen.alt = 'img' + item.code;
    newDiv1.appendChild(nuevaImagen);

    var codeItem = document.createElement('p');
    codeItem.classList.add('text-code');
    codeItem.textContent = item.code;
    newDiv1.appendChild(codeItem);

    var newDiv2 = document.createElement('div');
    newDiv2.classList.add('newDiv2');


    var nameItem = document.createElement('h1');
    nameItem.textContent = item.name;

    var detailItem = document.createElement('p');
    detailItem.classList.add('text-detail');
    detailItem.textContent = item.detail;

    var priceItem = document.createElement('p');
    priceItem.classList.add('text-priceDetail');
    priceItem.textContent = '\$' + item.price;

    var editarBotton = document.createElement('button');
    editarBotton.onclick = () => editItem(item);
    editarBotton.classList.add('btn', 'edit');
    editarBotton.textContent = 'Editar';

    var deleteBotton = document.createElement('button');
    deleteBotton.onclick = () => deleteItem(item.id);
    deleteBotton.classList.add('btn', 'delete');
    deleteBotton.textContent = 'Eliminar';



    var lineBtn = document.createElement('p');
    lineBtn.append(editarBotton);
    lineBtn.append(deleteBotton);


    newDiv2.appendChild(nameItem);
    newDiv2.appendChild(document.createElement('br'));
    newDiv2.appendChild(document.createElement('br'));
    newDiv2.appendChild(detailItem);
    newDiv2.appendChild(document.createElement('br'));
    newDiv2.appendChild(priceItem);
    newDiv2.appendChild(document.createElement('br'));
    newDiv2.appendChild(document.createElement('br'));
    newDiv2.appendChild(lineBtn);

    nuevoItem.appendChild(newDiv1);
    nuevoItem.appendChild(newDiv2);
    const divShopping = document.querySelector('.div-listShoppingCart')
    divShopping.appendChild(nuevoItem);
}

function clearObj() {
    objItem.id = '';
    objItem.code = '';
    objItem.name = '';
    objItem.detail = '';
    objItem.price = 0;
    objItem.img = '';
}

function limpiarHtmlShopping() {
    const divItems = document.querySelector('.div-listShoppingCart')
    while (divItems.firstChild) {
        divItems.removeChild(divItems.firstChild)
    }
}

async function deleteItem(id) {
    var opcionesDeSolicitud = {
        method: 'DELETE',
        headers: misEncabezados
    };
    try {
        const response = await fetch(url + '/' + id, opcionesDeSolicitud);
        if (!response.ok) {
            throw new Error('La solicitud no fue exitosa');
        }
        const divItems = document.querySelector('.div-listShoppingCart')
        while (divItems.firstChild) {
            divItems.removeChild(divItems.firstChild)
        }
        showItems();
    } catch (error) {
        console.error('Error en la petición: ', error);
        return null;
    }
}

async function editItemAPi() {
    var opcionesDeSolicitud = {
        method: 'PUT',
        headers: misEncabezados,
        body: JSON.stringify(objItem)
    };
    try {
        const response = await fetch(url + '/' + objItem.id, opcionesDeSolicitud);
        if (!response.ok) {
            throw new Error('La solicitud no fue exitosa');
        }
        await showItems();

        formulario.reset();
        cargarItemMain();
        cancelEdit()

    } catch (error) {
        console.error('Error en la petición: ', error);
        return null;
    }
}

function cancelEdit() {
    formulario.reset();

    const btnEdit = document.querySelector('.btnEdit')
    while (btnEdit.firstChild) {
        btnEdit.removeChild(btnEdit.firstChild)
    }

    var crear = document.createElement('button');
    crear.onclick = () => validateData(item);
    crear.classList.add('btn', 'edit');
    crear.textContent = 'Crear';
    btnEdit.appendChild(crear);
    const title = document.querySelector('#title');
    title.textContent = 'Crear Producto';

    editando = false;
}

async function editItem(body) {

    const btnEdit = document.querySelector('.btnEdit')
    while (btnEdit.firstChild) {
        btnEdit.removeChild(btnEdit.firstChild)
    }

    var editarBotton = document.createElement('button');
    editarBotton.onclick = () => validateData(item);
    editarBotton.classList.add('btn', 'edit');
    editarBotton.textContent = 'Editar';

    var cencel = document.createElement('button');
    cencel.onclick = () => cancelEdit();
    cencel.classList.add('btn', 'delete');
    cencel.textContent = 'Cancelar';

    btnEdit.appendChild(editarBotton)
    btnEdit.appendChild(cencel)

    const title = document.querySelector('#title');
    title.textContent = 'Editar Producto';

    editando = true;
    objItem.id = body.id;
    objItem.code = body.code;
    objItem.name = body.name;
    objItem.detail = body.detail;
    objItem.price = parseInt(body.price);
    objItem.img = body.img;

    const codeImput = document.querySelector('#code');
    codeImput.value = objItem.code;

    const nameImput = document.querySelector('#name');
    nameImput.value = objItem.name;

    const detailImput = document.querySelector('#detail');
    detailImput.value = objItem.detail;

    const priceImput = document.querySelector('#price');
    priceImput.value = objItem.price

    const imgImput = document.querySelector('#img');
    imgImput.value = objItem.img
}

function cargarItemMain() {
    limpiarHtmlShopping();

    var nuevoItem = document.createElement('div');
    nuevoItem.classList.add('itemDetailDefaul');


    var detailItem = document.createElement('p');
    detailItem.classList.add('text-detail');
    detailItem.textContent = 'Bienvenidos a Cloud';


    nuevoItem.appendChild(document.createElement('br'));
    nuevoItem.appendChild(document.createElement('br'));
    nuevoItem.appendChild(detailItem);

    const divShopping = document.querySelector('.div-listShoppingCart')
    divShopping.appendChild(nuevoItem);
}


