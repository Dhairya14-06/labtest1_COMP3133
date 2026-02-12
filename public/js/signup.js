$("#btnSignup").on("click", async () => {
  $("#msg").removeClass().text("");

  const payload = {
    username: $("#username").val().trim(),
    firstname: $("#firstname").val().trim(),
    lastname: $("#lastname").val().trim(),
    password: $("#password").val()
  };

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!data.ok) {
      $("#msg").addClass("text-danger").text(data.message || "Signup failed");
      return;
    }

    $("#msg").addClass("text-success").text("Signup successful. Redirecting to login...");
    setTimeout(() => (window.location.href = "/view/login.html"), 700);
  } catch (e) {
    $("#msg").addClass("text-danger").text("Network/server error.");
  }
});
