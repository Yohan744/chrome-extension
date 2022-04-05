////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// Date /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let actualDay = new Date().getDay()
let dayOfTheWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

let actualDate = new Date().getDate()

const titleWrapper = document.querySelector(".main-title-wrapper")
titleWrapper.innerHTML += `<p>${dayOfTheWeek[actualDay] + " " + actualDate}</p>`

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Switch between sections  ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// main -> add
const addTodoButton = document.querySelector("#add-wrapper")
const mainGlobalWrapper = document.querySelector("#main-global-wrapper")
const AddGlobalWrapper = document.querySelector("#add-global-wrapper")

addTodoButton.onclick = () => {
    switchBetweenSections()
}

// add -> main
const backArrow = document.querySelector(".back-arrow-wrapper")

backArrow.onclick = () => {
    switchBetweenSections()
}

function switchBetweenSections () {
    AddGlobalWrapper.classList.toggle("active")
    mainGlobalWrapper.classList.toggle("active")
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// Toggle active class for buttons / delete date and time  //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const taskTypeButtons = document.querySelector(".type-wrapper .button-wrapper")

taskTypeButtons.addEventListener("click", e => {
    let taskTypeButton = taskTypeButtons.querySelector(".active")
    taskTypeButton.classList.remove("active")
    e.target.classList.add('active')

    hideDateTime()

})

function hideDateTime() {
    const taskTypeButtonPlanned = document.querySelector('#taskTypeButtonPlanned')
    const taskTypeButtonImportant= document.querySelector('#taskTypeButtonImportant')
    const plannedWrapper = document.querySelector('.planned-wrapper')

    if (taskTypeButtonPlanned.classList.contains('active')) {
        plannedWrapper.classList.remove('hided')
    }

    if (taskTypeButtonImportant.classList.contains('active')) {
        plannedWrapper.classList.add('hided')
        // need to reset input before adding todos
    }


}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// Clean up the add sections  ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cleanAddSection() {
    searchInputButton.value = ""
    let categoriesWrapperChild = categoriesWrapper.querySelector(".active");

    if (categoriesWrapperChild != null) {
        categoriesWrapperChild.classList.remove('active')
    }

}