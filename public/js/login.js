const existing = localStorage.getItem("chat_user");
if (existing) window.location.href = "/view/chat.html";

$("#btnLogin").on("click", async () => {
  $("#msg").removeClass().text("");

  const payload = {
    username: $("#username").val().trim(),
    password: $("#password").val()
  };

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!data.ok) {
      $("#msg").addClass("text-danger").text(data.message || "Login failed");
      return;
    }

    localStorage.setItem("chat_user", JSON.stringify(data.user)); // session in localStorage :contentReference[oaicite:7]{index=7}
    window.location.href = "/view/chat.html";
  } catch (e) {
    $("#msg").addClass("text-danger").text("Network/server error.");
  }
});
