
const form = document.querySelector("form");
const submit = document.querySelector(".submit");
const updates = document.querySelector(".update");
const tbody = document.querySelector("table>tbody");
 
submit.addEventListener('click', () => {
    let idb = indexedDB.open('registro', 1)
    idb.onupgradeneeded = () => {
        let res = idb.result;
        res.createObjectStore('clientes', { autoIncrement: true })
        res.createObjectStore('equipos', { autoIncrement: true })
        res.createObjectStore('servicios', { autoIncrement: true })
    }   
    idb.onsuccess = () => {
        let res = idb.result;
        let tx = res.transaction('clientes', 'readwrite')
        let store = tx.objectStore('clientes')            
        store.put({
            nombre: form[0].value,
            email: form[1].value,
            celular: form[2].value,
            direccion: form[3].value
        })  
        alert("SE HAN REISTRADO LOS DATOS")
        location.reload()         
    }    
})  

function read() {
    let idb = indexedDB.open('registro', 1)
    idb.onsuccess = () => {
        let res = idb.result;
        let tx = res.transaction("clientes", "readonly")
        let store = tx.objectStore('clientes')       
        let cursor = store.openCursor()
        cursor.onsuccess = () => {
            let curRes = cursor.result;
            if (curRes) {
                console.log(curRes.value.nombre);
                tbody.innerHTML += `
                <tr>
                <td>${curRes.value.nombre}</td>
                <td>${curRes.value.email}</td>
                <td>${curRes.value.celular}</td>
                <td>${curRes.value.direccion}</td>
                <td onclick="update(${curRes.key})"class="up">Actualisar</td>
                <td onclick="del(${curRes.key})"class="up">Eliminar</td>
                </tr>
                `;
                curRes.continue()
            } 
        }
    }
}
 
function del(e) {
    let idb = indexedDB.open('registro', 1)
    idb.onsuccess = () => {
        let res = idb.result;
        let tx = res.transaction('clientes', 'readwrite')
        let store = tx.objectStore('clientes')
        store.delete(e)       

        alert("SE HAN ELIMINADO LOS DATOS")
        location.reload()
    }
}
let updateKey;
 
function update(e) {
    submit.style.display = "none";
    updates.style.display = "block";
    updateKey = e;
}
updates.addEventListener('click', () => {
    let idb = indexedDB.open('registro', 1)
    idb.onsuccess = () => {
        let res = idb.result;
        let tx = res.transaction('clientes', 'readwrite')
        let store = tx.objectStore('clientes')
        store.put({
            nombre: form[0].value,
            email: form[1].value,
            celular: form[2].value,
            direccion: form[3].value
        }, updateKey);
        alert("SE HAN ACTUALIZADO LOS DATOS")
        location.reload()
    }
})
 
read()
