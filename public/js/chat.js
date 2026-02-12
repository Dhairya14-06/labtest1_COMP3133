const userRaw = localStorage.getItem("chat_user");
if (!userRaw) window.location.href = "/view/login.html";

const user = JSON.parse(userRaw);
$("#who").text(user.username);

const socket = io();
socket.emit("setUsername", { username: user.username });
let currentRoom = null;

function addLine(box, html) {
  box.append(`<div>${html}</div>`);
  box.scrollTop(box[0].scrollHeight);
}

$("#btnLogout").on("click", () => {
  localStorage.removeItem("chat_user");
  window.location.href = "/view/login.html";
});

$("#btnJoin").on("click", () => {
  const room = $("#room").val();
  currentRoom = room;
  $("#currentRoom").text(room);
  $("#messages").html("");
  socket.emit("joinRoom", { username: user.username, room });
});

$("#btnLeave").on("click", () => {
  currentRoom = null;
  $("#currentRoom").text("--");
  socket.emit("leaveRoom");
});

socket.on("groupHistory", (history) => {
  $("#messages").html("");
  history.forEach(m => {
    addLine($("#messages"), `<b>${m.from_user}</b>: ${m.message} <span class="muted">(${new Date(m.date_sent).toLocaleString()})</span>`);
  });
});

socket.on("system", ({ message }) => $("#sys").text(message));

socket.on("groupMessage", (m) => {
  if (!currentRoom || m.room !== currentRoom) return;
  addLine($("#messages"), `<b>${m.from_user}</b>: ${m.message} <span class="muted">(${new Date(m.date_sent).toLocaleString()})</span>`);
});

$("#btnSend").on("click", () => {
  const message = $("#text").val();
  $("#text").val("");
  socket.emit("groupMessage", { message });
});

let typingTimer = null;

$("#ptext").on("input", () => {
  const to_user = $("#toUser").val().trim();
  if (!to_user) return;

  socket.emit("privateTyping", { to_user, isTyping: true });

  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    socket.emit("privateTyping", { to_user, isTyping: false });
  }, 800);
});

socket.on("privateTyping", ({ from_user, to_user, isTyping }) => {
  const selected = $("#toUser").val().trim();
  if (to_user !== user.username) return;
  if (selected !== from_user) return;

  $("#typing").text(isTyping ? `${from_user} is typing...` : "");
});

socket.on("privateMessage", (m) => {
  const selected = $("#toUser").val().trim();
  const isMine = m.from_user === user.username && m.to_user === selected;
  const isToMe = m.to_user === user.username && m.from_user === selected;

  if (!isMine && !isToMe) return;

  const label = m.from_user === user.username ? "Me" : m.from_user;
  addLine($("#pmessages"), `<b>${label}</b>: ${m.message} <span class="muted">(${new Date(m.date_sent).toLocaleString()})</span>`);
});

$("#btnPSend").on("click", () => {
  const to_user = $("#toUser").val().trim();
  const message = $("#ptext").val();
  if (!to_user) return alert("Enter a username to chat privately.");
  $("#ptext").val("");
  $("#typing").text("");
  socket.emit("privateMessage", { to_user, message });
});
