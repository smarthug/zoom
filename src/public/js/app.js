const socket = io();

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", {payload:input.value}, (msg) => {
        console.log(`The Backend said : ${msg}`)
    })
    input.value = ""
}

form.addEventListener("submit", handleRoomSubmit);