const deleteButton = document.querySelector("#delete")
deleteButton.onclick = () => {
    chrome.storage.sync.clear()
    console.log("The storage is clear !")
}

////////////////////////////////////////// GET ALL TODOS ///////////////////////////////////////////////

const todosWrapper = document.querySelector("#todos-global-wrapper")

chrome.storage.sync.get(null, function (data) {
    for (let i = 1; i < Object.keys(data).length + 1; i++) {
        todosWrapper.innerHTML += `
        <div class="todos-wrapper ${i}">
            <div class="todos-left-wrapper">
                <input type="checkbox" class="todos-checkbox">
            </div>
            <div class="todos-right-wrapper">
                <div class="todos-right-image-wrapper">
                    <div class="todos-image-wrapper"></div>
                </div>
                <div class="todos-right-main-wrapper">
                    <h1 class="todos-h1">${data[i]}</h1>
                </div>
                <div class="todos-right-time-wrapper"></div>
            </div>
        </div>
        `
    }
});

/////////////////////////////////////////////// ADD TODOS  ///////////////////////////////////////////////////

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    chrome.storage.sync.get(null, function (data) {
        console.log(data)
        let count = Object.keys(data).length - 1
        let number = Object.keys(data)[count]
        const formData = new FormData(e.target);
        const search = formData.get("search")
        chrome.storage.sync.set({[number + 1]: search}, function () {
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
    if (e.target.classList.contains("todos-checkbox")){
        let todosCount = e.target.parentElement.parentElement.className.split(' ')
        console.log("la div a comme classe " + todosCount[1])
        e.target.parentElement.parentElement.remove()
        chrome.storage.sync.remove(todosCount[1], function (){})
        chrome.storage.sync.get(null, function (data) {
            console.log(data)
        })
    }
})