////////////////////////////////////////// GET ALL TODOS ///////////////////////////////////////////////


const todosWrapper = document.querySelector("#todos-global-wrapper")

chrome.storage.sync.get(null, function (data) {
    console.log(data)
    console.log(Object.keys(data))
    console.log("la longeur est de " + Object.keys(data).length)
    for (let i = 0; i < Object.keys(data).length ; i++) {
        todosWrapper.innerHTML += `
        <div class="todos-wrapper ${Object.keys(data)[i]}">
            <div class="todos-left-wrapper">
                <input type="checkbox" class="todos-checkbox">
            </div>
            <div class="todos-right-wrapper">
                <div class="todos-right-image-wrapper">
                    <div class="todos-image-wrapper"></div>
                </div>
                <div class="todos-right-main-wrapper">
                    <h1 class="todos-h1">${Object.values(data)[i]}</h1>
                </div>
                <div class="todos-right-time-wrapper"></div>
            </div>
        </div>
        `
    }
});


////////////////////////////////////////// DELETE ALL TODOS ///////////////////////////////////////////////


const deleteButton = document.querySelector("#delete")
deleteButton.onclick = () => {
    chrome.storage.sync.clear()
    todosWrapper.innerHTML = `<div class="blankTodo 0"></div>`
}


/////////////////////////////////////////////// ADD TODOS  ///////////////////////////////////////////////////


document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    chrome.storage.sync.get(null, function (data) {
        let getLastChild = document.querySelector("#todos-global-wrapper").lastElementChild
        console.log(getLastChild)
        let number = Number(getLastChild.classList[1]) + 1
        const formData = new FormData(e.target);
        const search = formData.get("search")
        chrome.storage.sync.set({[number]: search}, function () {
            todosWrapper.innerHTML += `
            <div class="todos-wrapper ${number}">
                <div class="todos-left-wrapper">
                    <input type="checkbox" class="todos-checkbox">
                </div>
                <div class="todos-right-wrapper">
                    <div class="todos-right-image-wrapper">
                        <div class="todos-image-wrapper"></div>
                    </div>
                    <div class="todos-right-main-wrapper">
                        <h1 class="todos-h1">${search}</h1>
                    </div>
                    <div class="todos-right-time-wrapper"></div>
                </div>
            </div>
        `
        });

    })
})

/////////////////////////////////////////////// DELETE TODOS ///////////////////////////////////////////////////


document.addEventListener("click", e => {
    if (e.target.classList.contains("todos-checkbox")) {
        let todosCount = e.target.parentElement.parentElement.className.split(' ')
        e.target.parentElement.parentElement.remove()
        chrome.storage.sync.remove(todosCount[1], function () {
        })
    }
})



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// Animation ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const addTodoButton = document.querySelector("#add-wrapper")
const mainGlobalWrapper = document.querySelector("#main-global-wrapper")
const AddGlobalWrapper = document.querySelector("#add-global-wrapper")
addTodoButton.onclick = () => {
    mainGlobalWrapper.classList.toggle("active")
    AddGlobalWrapper.classList.toggle("active")
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// DATE ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let actualDay = new Date().getDay()
let dayOfTheWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

let actualDate = new Date().getDate()
console.log("Nous sommes le " + dayOfTheWeek[actualDay] + " " + actualDate)