//STORAGE CONTROLLER
const StorageCtrl = (function(){
    return {
        storeItem: function(item){
            let items;
            //VERIFICAR SI HAY ITEMS EN EL LOCAL STORAGE
            if(localStorage.getItem('items')===null){
                items = [];
                //PUSH EL NUEVO ITEM
                items.push(item);
                //SETEAR EL LOCAL STORAGE
                localStorage.setItem('items', JSON.stringify(items)); //CONVIERTE EL ARRAY EN STRING
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                //PUSH EL NUEVO ITEM
                items.push(item);
                //VOLVER A SETEAR EL LOCAL STORAGE
                localStorage.setItem('items', JSON.stringify(items)); //CONVIERTE EL ARRAY EN STRING
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items')===null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);

                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);

                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();
//ITEM CONTROLLER
const ItemCtrl = (function(){
    //CONSTRUCTOR //ESTO ESTÁ PRIVADO
    const Item = function(id, nombre, calorias){
        this.id = id;
        this.nombre = nombre;
        this.calorias = calorias;
    }

    //ESTRUCTURA DE DATOS / STATE
    const state = { //ESTO ESTÁ PRIVADO
        //items: [
            // {id: 0, nombre:'Filete', calorias: 1200},
            // {id: 1, nombre:'Galleta Oreo', calorias: 400},
            // {id: 2, nombre:'Huevo frito', calorias: 300},
        //],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    return { //ESTO ES PÚBLICO
        getItems: function(){
            return state.items;
        },
        addItem: function(nombre, calorias){
            let ID;
            //CREAR ID's
            if(state.items.length > 0){
                ID = state.items[state.items.length-1].id + 1; //AUTOINCREMENTO
            } else {
                ID = 0
            }

            //CALORIAS A NÚMERO
            calorias = parseInt(calorias);

            //CREAR UN ITEM NUEVO
            newItem = new Item(ID, nombre, calorias);
            //AÑADIR AL ARRAY DE ITEMS
            state.items.push(newItem);
            return newItem;
        },
        getItemById: function(id){
            let found = null;
            //HACER BUCLE CON LOS ITEMS
            state.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(nombre, calorias){
            //VOLVER LAS CALORIAS TIPO NÚMERO
            calorias = parseInt(calorias)
            let found = null;
            state.items.forEach(function(item){
                if(item.id===state.currentItem.id){
                    item.nombre = nombre;
                    item.calorias = calorias;
                    found = item;
                }
                
            });
            return found;
        },
        deleteItem: function(id){
            //OBTENER LOS IDS
            ids = state.items.map(function(item){
                return item.id;
            })
            //OBTENER EL INDEX
            const index = ids.indexOf(id);
            //REMOVER ITEM
            state.items.splice(index, 1);
        },
        clearAllItems: function(){
            state.items = [];
        },
        setCurrentItem: function(item){
            state.currentItem = item;
        },
        getCurrentItem: function(){
            return state.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;
            state.items.forEach(function(item){
                //const calories = parseInt(item.calorias);
                total += item.calorias;
            });
            //SETEAR TOTAL DE CALORÍAS EN LAS ESTRUCTURA DE DATOS
            state.totalCalories = total;
            return state.totalCalories;
        },
        logData: function(){
            return state;
        }
    }
})();
//UI CONTROLLER
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
    }
    //METODOS PÚBLICOS
    return{
        
        populateItemlist: function(items){
            let html = '';
            items.forEach(function(item){
                html += 
                `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.nombre}: </strong> <em>${item.calorias} Calorias</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>
                `;
            });
            //INSERTAR LISTA DE ITEMS
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                nombre: document.querySelector(UISelectors.itemNameInput).value,
                calorias: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //MOSTRAR LISTA
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //CREAR ELEMENTO li
            const li = document.createElement('li');
            //AÑADIR CLASES
            li.className = 'collection-item';
            //AÑADIR ID
            li.id = `item-${item.id}`;
            //AÑADIR EL HTML
            li.innerHTML = 
            `
            <strong>${item.nombre}: </strong> <em>${item.calorias} Calorias</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            //INSERTAR ITEM
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems); //ESTO NOS DEVUELVE UNA LISTA DE NODOS

            //CONVERTIR LA LISTA DE NODOS EN ARRAY
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = 
                    `
                    <strong>${item.nombre}: </strong> <em>${item.calorias} Calorias</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            });
        },
        deleteListItem: function(id){
            const itemID =`#item-${id}`;
            const item = document.querySelector(itemID);
            //OBTENER TOTAL DE CALORÍAS
            const totalCalories = ItemCtrl.getTotalCalories();
            //AÑADIR CALORÍAS A LA UI
            UICtrl.showTotalCalories(totalCalories);
            UICtrl.clearEditState();
            item.remove();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //CONVERTIR LOS NODOS EN ARRAY
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            })
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().nombre;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calorias;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
        
    }
    
})();
//APP CONTROLLER
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors(); //DE ESTA MANERA SE LOGRAN USAR LOS SELECTORES "#item-list"
        //AÑADIR ITEM DE EVENTO
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        //DESHABILITAR EL AGREGAR ITEMS CON ENTER
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })
        //EVENTO DEL ICONO DE EDIT
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick); 
        //UPDATE ITEM EVENT
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit); 
        //BOTON DE 'VOLVER'
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState); 
        //BOTÓN DE 'ELIMINAR'
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit); 
        //BOTÓN PARA LIMPIAR TODO
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }
    //ADD ITEM SUBMIT
    const itemAddSubmit = function(e){
        //OBTENER DEL INPUT DE UICTRL
        const input = UICtrl.getItemInput();
        //VALIDER EL NOMBRE Y LAS CALORIAS DEL INPUT
        if(input.nombre !== '' && input.calorias !== ''){
            //AÑADIR ITEM
            const newItem = ItemCtrl.addItem(input.nombre, input.calorias);

            //AÑADIR EL ITEM NUEVO A LA UI
            UICtrl.addListItem(newItem);
            //OBTENER TOTAL DE CALORÍAS
            const totalCalories = ItemCtrl.getTotalCalories();
            //AÑADIR CALORÍAS A LA UI
            UICtrl.showTotalCalories(totalCalories);
            //DEPOSITAR EN EL LOCAL STORAGE
            StorageCtrl.storeItem(newItem);
            //LIMPIAR LOS INPUT LUEGO DE AGREGAR UN ITEM
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    //ACTUALIZAR ITEM SUBMIT
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //OBTENER EL ID DEL ITEM EN LA LISTA
            const listId = e.target.parentNode.parentNode.id;
            
            //AHORA SOLO NECESITAMOS EL NÚMERO DE ID, PARA ESO VAMOS A HACER "BREAK" AL ARRAY
            const listIdArr = listId.split('-');
            
            //OBTENER EL ID
            const id = parseInt(listIdArr[1]);

            //OBTENER ITEM
            const itemToEdit = ItemCtrl.getItemById(id);

            //SETEAR A CURRENT ITEM
            ItemCtrl.setCurrentItem(itemToEdit);

            //AÑADIR ITEM AL FORM
            UICtrl.addItemToForm();
            
        }
        e.preventDefault();
    }
    //ITEM UPDATE SUBMIT
    const itemUpdateSubmit = function(e){
        //OBTENER EL ITEM EN EL INPUT
        const input = UICtrl.getItemInput();
        //ACTUALIZAR ITEM
        const updatedItem = ItemCtrl.updateItem(input.nombre, input.calorias);

        //ACTUALIZAR LA UI
        UICtrl.updateListItem(updatedItem);
        //OBTENER TOTAL DE CALORÍAS
        const totalCalories = ItemCtrl.getTotalCalories();
        //AÑADIR CALORÍAS A LA UI
        UICtrl.showTotalCalories(totalCalories);

        //ACTUALIZAR EL LOCAL STORAGE
        StorageCtrl.updateItemStorage(updatedItem);
        
        UICtrl.clearEditState();
        e.preventDefault();
    }
    //EVENTO DEL BOTÓN DE ELIMINAR
    const itemDeleteSubmit = function(e){
        //OBTENER CURRENT ITEM
        const currentItem = ItemCtrl.getCurrentItem();
        //BORRAR DE LA ESTRUCTURA DE DATOS
        ItemCtrl.deleteItem(currentItem.id);
        //ELIMINAR DE LA UI
        UICtrl.deleteListItem(currentItem.id);
        //OBTENER TOTAL DE CALORÍAS
        const totalCalories = ItemCtrl.getTotalCalories();
        //AÑADIR CALORÍAS A LA UI
        UICtrl.showTotalCalories(totalCalories);
        
        //ELIMINAR DEL LOCAL STORAGE
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();
        e.preventDefault();
    }

    //EVENTO DEL BOTÓN PARA LIMPIAR TODOS LOS ELEMENTOS
    const clearAllItemsClick = function(e){
        // ELIMINAR TODOS LOS ITEMS DE LA ESTRUCTURA DE DATOS
        ItemCtrl.clearAllItems();
        //OBTENER TOTAL DE CALORÍAS
        const totalCalories = ItemCtrl.getTotalCalories();
        //AÑADIR CALORÍAS A LA UI
        UICtrl.showTotalCalories(totalCalories);
        // REMOVER DE LA UI
        UICtrl.removeItems();
        //LIMPIAR TODO EN EL LOCAL STORAGE
        StorageCtrl.clearItemsFromStorage();
        UICtrl.hideList();
        e.preventDefault();
    }

    //ESTO ES PÚBLICO
    return {
        init: function(){
            //LIMPIAR EDIT STATE / SETTEAR INITIAL SET
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();
            //CHEQUEAR SI HAY ITEMS
            if(items.length === 0){
                UICtrl.hideList();
            } else {
                //POPULAR LISTA CON ITEMS
                UICtrl.populateItemlist(items); 
            }
            //BUSCAR ITEMS DE LA ESTRUCTURA DE DATOS
            //console.log(items)
            //OBTENER TOTAL DE CALORÍAS
            const totalCalories = ItemCtrl.getTotalCalories();
            //AÑADIR CALORÍAS A LA UI
            UICtrl.showTotalCalories(totalCalories);
            //CARGAR EVENT LISTENERS
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

//INICIALIZAR APP
App.init();