(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var button = form.querySelector("button[type=submit]");
  var fallback = "inquiry@restaurant360ai.com";

  function say(text, kind) {
    status.textContent = text;
    status.className = "status " + (kind || "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    button.disabled = true;
    say("Sending…");

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) { return { ok: res.ok, body: body }; });
      })
      .then(function (r) {
        if (r.ok) {
          form.reset();
          say(r.body.message || "Thanks, we received your inquiry.", "ok");
        } else {
          say(r.body.error || "Something went wrong. Please email " + fallback + ".", "error");
        }
      })
      .catch(function () {
        say("We could not reach the server. Please email " + fallback + ".", "error");
      })
      .then(function () { button.disabled = false; });
  });
})();
