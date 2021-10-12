const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute")
const cameraBtn = document.getElementById("camera")
const camerasSelect = document.getElementById("cameras")


const call = document.getElementById("call")

call.hidden = true

let myStream;
let muted = false;
let cameraOff = false;
let roomName;

async function getCameras(){
  try{
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === "videoinput")
    cameras.forEach(camera => {
      const option = document.createElement("option")
      option.value = camera.deviceId
      option.innerText = camera.label;
      camerasSelect.appendChild(option)
    })
  }catch(e){
    console.log(e);
  }
}

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      {
        audio:true,
        video:true
      }
    )
    await getCameras();
    console.log(myStream)
    myFace.srcObject = myStream
  } catch (e) {
    console.log(e);
  }
}



function handleMuteBtn(){
  myStream.getAudioTracks().forEach((track)=>(track.enabled = !track.enabled));
  if(!muted){
    muteBtn.innerText = "Unmuted"
    muted = true

  } else {
    muteBtn.innerText = "Mute"
    muted = false;
  }
}

function handleCameraClick(){
  myStream.getVideoTracks().forEach((track)=>(track.enabled = !track.enabled));
  if(cameraOff){
    cameraBtn.innerText = "Turn Camera Off"
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On"
    cameraOff = true
  }
}

muteBtn.addEventListener("click", handleMuteBtn);
cameraBtn.addEventListener("click", handleCameraClick);


// Welcome Form (join a room )

const welcome = document.getElementById("welcome")
const welcomeForm = welcome.querySelector("form");

function startMedia(){
  welcome.hidden = true;
  call.hidden = false;
  getMedia();
}

function handleWelcomeSubmit(event){
  event.preventDefault()
  const input = welcomeForm.querySelector("input")
  socket.emit("join_room",input.value, startMedia)
  roomName = input.value;
  input.value = ""
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit)

// Socket Code

socket.on("welcome", () => {
  console.log("someone joined")
})