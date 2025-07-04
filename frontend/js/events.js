const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "index.html";
}

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

async function loadEvents() {
  try {
    const res = await fetch("/events/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const list = document.getElementById("eventsList");
    list.innerHTML = "";
    data.allEvents.forEach((event) => {
      const formattedDate = event.date
        ? new Date(event.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })
        : "sem data";

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${event.title}</strong> - ${formattedDate}
        <button class="edit">Editar</button>
        <button class="delete">Deletar</button>
      `;
      li.querySelector(".edit").addEventListener("click", () =>
        editEvent(event)
      );
      li.querySelector(".delete").addEventListener("click", () =>
        deleteEvent(event.id)
      );
      list.appendChild(li);
    });
  } catch (err) {
    console.log(err);
  }
}

async function createEvent(title, description, date) {
  try {
    await fetch("/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, date }),
    });
    loadEvents();
  } catch (err) {
    console.log(err);
  }
}

async function deleteEvent(id) {
  if (!confirm("Deletar este evento?")) return;
  try {
    await fetch(`/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadEvents();
  } catch (err) {
    console.log(err);
  }
}

function editEvent(event) {
  document.getElementById("updateId").value = event.id;
  document.getElementById("updateTitle").value = event.title || "";
  document.getElementById("updateDescription").value = event.description || "";
  document.getElementById("updateDate").value = event.date || "";

  document.getElementById("updateModal").style.display = "block";
}

document.getElementById("cancelUpdate").addEventListener("click", () => {
  document.getElementById("updateModal").style.display = "none";
});

document.getElementById("updateForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("updateId").value;
  const title = document.getElementById("updateTitle").value;
  const description = document.getElementById("updateDescription").value;
  const date = document.getElementById("updateDate").value;

  const body = {};
  if (title) body.title = title;
  if (description) body.description = description;
  if (date) body.date = date;

  try {
    await fetch(`/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    document.getElementById("updateModal").style.display = "none";
    loadEvents();
  } catch (err) {
    console.error(err);
    alert("Erro ao atualizar evento");
  }
});

document.getElementById("eventForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const description = e.target.description.value;
  const date = e.target.date.value;
  createEvent(title, description, date);
  e.target.reset();
});

loadEvents();
