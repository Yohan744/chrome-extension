let number = 0

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    number = number + 1
    const formData = new FormData(e.target);
    const search = formData.get("search")
    chrome.storage.sync.set({[number]: search}, function () {
    });

    console.log("La valeur rentrée est " + search)
    console.log("Number est égale à " + number)
})

const deleteButton = document.querySelector("#delete")
deleteButton.onclick = () => {
    chrome.storage.sync.clear()
    console.log("The storage is clear !")
}

////////////////////////////////////////// GET ALL TODOS ///////////////////////////////////////////////

const todosWrapper = document.querySelector("#todos-global-wrapper")

chrome.storage.sync.get(null, function (data) {
    console.log(data)
    for (let i = 1; i < Object.keys(data).length + 1; i++) {
        todosWrapper.innerHTML += `
        <div class="todos-wrapper">
            <div class="todos-left-wrapper">
                <input type="checkbox" class="todos-checkbox">
            </div>
            <div class="todos-right-wrapper">
                <div class="todos-right-image-wrapper">
                    <div class="todos-image-wrapper"></div>
                </div>
                <div class="todos-right-main-wrapper"></div>
                <div class="todos-right-time-wrapper"></div>
            </div>
        </div>
        `
    }
});