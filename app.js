////////////////////////////////////////// GET ALL TODOS ///////////////////////////////////////////////

let today = new Date().toISOString().slice(0, 10)

const todosWrapper = document.querySelector("#todos-global-wrapper")

chrome.storage.sync.get(null, function (data) {

    for (let i = 0; i < Object.keys(data).length ; i++) {

        console.log(data)

        if (Object.values(data)[i].date === today) {

        }

        todosWrapper.innerHTML += `
        <div class="todos-wrapper ${Object.keys(data)[i]}">
            <div class="todos-left-wrapper">
                <input type="checkbox" class="todos-checkbox">
            </div>
            <div class="todos-right-wrapper">
                <div class="todos-right-image-wrapper">
                    <div class="todos-image-wrapper" style="background-color: ${Object.values(data)[i].color}">
                        <img src="image/${Object.values(data)[i].category}.png" alt="image">
                    </div>
                </div>
                <div class="todos-right-main-wrapper">
                    <h1 class="todos-h1">${Object.values(data)[i].task}</h1>
                </div>
                <div class="todos-right-time-wrapper">
                    <p class="todos-time">${Object.values(data)[i].time}</p>
                </div>
            </div>
        </div>
        `

    }

});


/////////////////////////////////////////////// ADD TODOS  ///////////////////////////////////////////////////

const searchInputButton = document.querySelector("#searchInput")

searchInputButton.onclick = () => {
    searchInputButton.addEventListener("keypress", (event)=> {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });
}

document.querySelector("#dateInput").valueAsDate = new Date()
document.querySelector("#dateInput").min = new Date()

const categoriesWrapper = document.querySelector(".all-categories-wrapper")
let category
let elementColor
let verifCategory = false
categoriesWrapper.addEventListener("click", e => {
    category = e.target.innerText
    let element = getComputedStyle(e.target)
    elementColor= element.backgroundColor

    verifCategory = true

    let categoriesWrapperChild = categoriesWrapper.querySelector(".active");

    if (categoriesWrapperChild != null) {
        categoriesWrapperChild.classList.remove('active')
    }

    e.target.classList.add("active")

})

const createTaskButton = document.querySelector("#createTaskButton")

createTaskButton.addEventListener('click', (e) => {

    let search = document.querySelector("#searchInput").value
    let date = document.querySelector("#dateInput").value
    let time = document.querySelector("#timeInput").value

    let curentData = {"task": search,"date": date,"time": time,"category": category, "color": elementColor}

    e.preventDefault();

    if ((search !== "") && (verifCategory === true)) {
        chrome.storage.sync.get(null, function (data) {
            let getLastChild = document.querySelector("#todos-global-wrapper").lastElementChild
            let number = Number(getLastChild.classList[1]) + 1
            chrome.storage.sync.set({[number]: curentData}, function () {
                todosWrapper.innerHTML += `
            <div class="todos-wrapper ${number}">
                <div class="todos-left-wrapper">
                    <input type="checkbox" class="todos-checkbox">
                </div>
                <div class="todos-right-wrapper">
                    <div class="todos-right-image-wrapper">
                        <div class="todos-image-wrapper" style="background-color: ${elementColor}">
                            <img src="image/${category}.png" alt="image">
                        </div>
                    </div>
                    <div class="todos-right-main-wrapper">
                        <h1 class="todos-h1">${curentData.task}</h1>
                    </div>
                    <div class="todos-right-time-wrapper">
                        <p class="todos-time">${curentData.time}</p>
                    </div>
                </div>
            </div>
        `
            });
            console.log(data)
        })

        switchBetweenSections()

        verifCategory = false

        cleanAddSection()

    }



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
