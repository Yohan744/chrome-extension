////////////////////////////////////////// GET ALL TODOS ///////////////////////////////////////////////

const todosWrapper = document.querySelector("#todos-global-wrapper")

// chrome.storage.sync.clear()

chrome.storage.sync.get(null, function (data) {

    for (let i = 0; i < Object.keys(data).length; i++) {

        todosWrapper.innerHTML += `
        <div class="todos-wrapper ${Object.keys(data)[i]}">
            <label class="todos-checkbox">
                <input class="checkbox_input" type="checkbox">
                <svg class="checkbox_check" width="25" height="25">
                    <polyline points="16 3 7 15 2 10"></polyline>
                </svg>
            </label>
            <div class="todos-right-wrapper">
                <div class="todos-image-wrapper" style="background-color: ${Object.values(data)[i].color}">
                    <img src="image/${Object.values(data)[i].category}.png" alt="image">
                </div>
                <div class="todos-right-main-wrapper">
                    <h1 class="todos-h1">${Object.values(data)[i].task}</h1>
                </div>
                <div class="todos-right-color-wrapper" style="background-color: ${Object.values(data)[i].color}"></div>
            </div>
        </div>
        `

    }

    updateBadgeText(1)

});


/////////////////////////////////////////////// ADD TODOS  ///////////////////////////////////////////////////

const searchInputButton = document.querySelector("#searchInput")

searchInputButton.onclick = () => {
    searchInputButton.addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });
}

const categoriesWrapper = document.querySelector(".all-categories-wrapper")
let category
let elementColor
let verifCategory = false

categoriesWrapper.addEventListener("click", e => {
    category = e.target.innerText
    let element = getComputedStyle(e.target)
    elementColor = element.backgroundColor

    verifCategory = true

    if (!e.target.classList.contains("all-categories-wrapper")) {
        categoriesWrapper.classList.add('preActive')
    }

    let categoriesWrapperChild = categoriesWrapper.querySelector(".active");

    if (categoriesWrapperChild != null && !e.target.classList.contains("all-categories-wrapper")) {
        categoriesWrapperChild.classList.remove('active')
    }

    if (!e.target.classList.contains("all-categories-wrapper")) {
        e.target.classList.add("active")
    }

})

const createTaskButton = document.querySelector("#createTaskButton")

createTaskButton.addEventListener('click', (e) => {

    let search = document.querySelector("#searchInput").value

    let curentData = {"task": search.replace(/<[^>]*>/g, ''), "category": category, "color": elementColor}

    e.preventDefault();

    if ((search !== "") && (verifCategory === true)) {

        let globalNumber

        chrome.storage.sync.get(null, function (data) {

            let number = 0

            let lastTodoNumber = todosGlobalWrapper.lastElementChild.classList[1]

            number = Number(lastTodoNumber) + Number(1)

            globalNumber = number

            chrome.storage.sync.set({[number]: curentData}, function () {
                todosWrapper.innerHTML += `
            <div class="todos-wrapper ${number}">
                <label class="todos-checkbox">
                    <input class="checkbox_input" type="checkbox">
                    <svg class="checkbox_check" width="25" height="25">
                        <polyline points="16 3 7 15 2 10"></polyline>
                    </svg>
                </label>
                <div class="todos-right-wrapper">
                    <div class="todos-image-wrapper" style="background-color: ${elementColor}">
                        <img src="image/${category}.png" alt="image">
                    </div>
                    <div class="todos-right-main-wrapper">
                        <h1 class="todos-h1">${curentData.task}</h1>
                    </div>
                    <div class="todos-right-color-wrapper" style="background-color: ${elementColor}"></div>
                </div>
            </div>
        `
            });
        })

        switchSections("#add-global-wrapper", "#main-global-wrapper")

        setTimeout(() => {
            scrollToDo(globalNumber)
        }, 100)

        verifCategory = false

        cleanAddSection()
        updateBadgeText(0)

    }

})

/////////////////////////////////////////////// DELETE TODOS ///////////////////////////////////////////////////

document.addEventListener("click", e => {
    if (e.target.classList.contains("checkbox_check") || e.target.classList.contains("checkbox_input")) {

        let todosRightWrapper = e.target.parentElement.parentElement.children[1]
        let parentTodos = todosRightWrapper.parentElement
        let parentTodosHeight = parentTodos.offsetHeight
        todosRightWrapper.classList.add("checked")
        todosRightWrapper.children[2].classList.add("checked")

        let deleteTimeLine = gsap.timeline()

        setTimeout(() => {
            deleteTimeLine.to(parentTodos, {
                duration: 0.35,
                ease: "power4.out",
                scale: 1.05
            });
            deleteTimeLine.to(parentTodos, {
                duration: 0.7,
                ease: "power4.out",
                scale: 0.5,
                opacity: 0
            });

            if (todosGlobalWrapper.lastElementChild !== e.target.parentElement.parentElement) {

                deleteTimeLine.to(parentTodos, {
                    duration: 0.7,
                    ease: "power4.out",
                    marginBottom: -parentTodosHeight
                }, "-=0.35");

            } else {

                deleteTimeLine.to(parentTodos, {
                    duration: 0.7,
                    ease: "power4.out",
                    marginTop: -parentTodosHeight - 15
                }, "-=0.35");

            }


        }, 350)

        let todosCount = e.target.parentElement.parentElement.className.split(' ')
        chrome.storage.sync.remove(todosCount[1], function () {})
        updateBadgeText(2)

        setTimeout(() => {
            e.target.parentElement.parentElement.remove()
        }, 1800)

    }
})

function updateBadgeText(number) {
    const numberOfTodos = document.querySelector("#todos-global-wrapper")
    if (numberOfTodos) {
        const count = numberOfTodos.children.length - number
        const value = Number(count) > 0 ? String(count) : ""
        chrome.action.setBadgeText(
            {text: value }
        )
        chrome.action.setBadgeBackgroundColor({ color: '#AB31EDFF' })
    }
}

