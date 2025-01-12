// Remove scroll bar ///////////////////////////////////////////////////////////////////////////////////////////////////

setTimeout(() => {

    const removeScrollBar = document.createElement('style');
    removeScrollBar.id = 'remove-scroll-style';
    removeScrollBar.textContent =
        'html::-webkit-scrollbar{display:none !important}' +
        'body::-webkit-scrollbar{display:none !important}';
    document.getElementsByTagName('body')[0].appendChild(removeScrollBar);

}, 5)

// Gsap ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function animateAllTodos() {

    setTimeout(() => {
        gsap.to(".todos-wrapper", {
            duration: 0.75,
            y: 0,
            opacity: 1,
            stagger: 0.125,
            ease: "power3.inOut",
        })
    }, 100)

}

animateAllTodos()

function switchSections(sectionToRemove, sectionToSee) {

    const timeLineSwitchSections = gsap.timeline({
        defaults: {
            ease: "power2.inOut"
        },
        onComplete: () => {
            timeLineSwitchSections.clear()
            timeLineSwitchSections.kill()
        }
    })

    timeLineSwitchSections.to(
        sectionToRemove, {opacity: 0, zIndex: 0, duration: 0.5}
    )
    timeLineSwitchSections.to(
        sectionToSee, {opacity: 1, zIndex: 1, duration: 0.5}
    )

}

// Date ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let actualDay = new Date().getDay()
let dayOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

let actualDate = new Date().getDate()

const titleWrapper = document.querySelector(".main-title-wrapper .left-part")
titleWrapper.innerHTML = `<p>Today's schedule <br>${dayOfTheWeek[actualDay] + " " + actualDate}</p>`

// Switch between sections  ////////////////////////////////////////////////////////////////////////////////////////////

const addTodoButton = document.querySelector("#add-wrapper")
const backArrow = document.querySelector(".back-arrow-wrapper")

addTodoButton.onclick = () => {
    switchSections("#main-global-wrapper", "#add-global-wrapper")
    searchInputButton.focus()
}

backArrow.onclick = () => {
    switchSections("#add-global-wrapper", "#main-global-wrapper")
    setTimeout(() => {
        gsap.set(".todos-wrapper", {y: 25, opacity: 0})
        animateAllTodos()
    }, 450)

}

// Clean up the add sections  //////////////////////////////////////////////////////////////////////////////////////////

function cleanAddSection() {
    setTimeout(() => {

        searchInputButton.value = ""
        let categoriesWrapperChild = categoriesWrapper.querySelector(".active");

        if (categoriesWrapperChild != null) {
            categoriesWrapperChild.classList.remove('active')
        }

        categoriesWrapper.classList.remove("preActive")

    }, 350)

}

createTaskButton.addEventListener("mouseenter", function () {

    if (category === undefined || searchInputButton.value === "") {
        createTaskButton.style.cursor = "not-allowed"
    } else {
        createTaskButton.style.cursor = "pointer"
    }

})

createTaskButton.addEventListener("mouseleave", function () {
    createTaskButton.style.cursor = "initial"
})

// ScrollTo when new to do is added  ///////////////////////////////////////////////////////////////////////////////////

const todosGlobalWrapper = document.querySelector("#todos-global-wrapper")


function scrollToDo(toDoToSee) {

    let todosWrapperToSee

    for (let i = 1; i < todosGlobalWrapper.childElementCount; i++) {

        if (todosGlobalWrapper.children[i].classList[1] === toDoToSee.toString()) {
            todosWrapperToSee = todosGlobalWrapper.children[i]

            todosWrapperToSee.style.opacity = "0"

            let todosWrapperToSeeOffsetTop = todosWrapperToSee.offsetTop

            setTimeout(() => {

                todosGlobalWrapper.scrollTo({
                    top: todosWrapperToSeeOffsetTop,
                    left: 0,
                    behavior: 'instant'
                });

                setTimeout(() => {
                    todosWrapperToSee.style.opacity = "1"
                    gsap.from(todosWrapperToSee, {
                        duration: 0.5,
                        scale: 0.5,
                        opacity: 0,
                        ease: "power2.inOut"
                    });
                }, 700)

                setTimeout(() => {
                    todosGlobalWrapper.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                }, 1600)

            }, 300)

            break
        }
    }

}

