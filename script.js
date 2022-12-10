// Global Variables

const emotesList = [
  { id: "like", src: "./icons/heart.svg" },
  { id: "understand", src: "./icons/tick.svg" },
  { id: "slow down", src: "./icons/snail.svg" },
  { id: "question", src: "./icons/question.svg" },
  { id: "castled", src: "./icons/castle.svg" },
];
const emoteSize = 32;
const showToolTip = true; // To show or not to show the tool tip
const limitReactions = false; // To limit the reactions per duration or not
const reactionsLimitDuration = 1; // Duration in seconds

// Connect to Socket Server
const ROOM = "room_001";
const ENDPOINT = "https://flying-emotes-webserver-pus.herokuapp.com/";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

var allowClick = true;

const socket = io(ENDPOINT, connectionOptions);
socket.emit("join", { room: ROOM });

// Add Emotes Buttons
const emotesButtonsContainer = document.querySelector(".emotes-list");

for (let emote of emotesList) {
  const newEmote = document.createElement("div");
  newEmote.classList.add("emote");
  if (showToolTip)
    newEmote.innerHTML += `<div class="toolTip">${emote.id}</div>`;
  newEmote.innerHTML += `<img src="${emote.src}" height="32px" width="32px" />`;
  emotesButtonsContainer.appendChild(newEmote);
}

// Handle Button Click
const emoteButtons = document.querySelectorAll(".emotes-list .emote");
emoteButtons.forEach((e, i) => {
  e.addEventListener("click", () => {
    if (allowClick) {
      socket.emit("user-reacted", { emote: emotesList[i].id, room: ROOM });
      if (limitReactions) {
        allowClick = false;
        setTimeout(() => {
          allowClick = true;
        }, reactionsLimitDuration * 1000);
      }
    }
  });
});
