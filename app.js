let allCharacters = [];


function renderCharacters(list) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>No se encontraron personajes.</p>";
    return;
  }

  list.forEach((c) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${c.image}" alt="${c.name}">
      <h2>${c.name}</h2>
      <p>${c.quote}</p>
    `;

    container.appendChild(card);
  });
}

async function loadAllCharacters() {
  try {
   
    const res = await fetch(
      "https://thesimpsonsquoteapi.glitch.me/quotes?count=50"
    );
    const data = await res.json();

    allCharacters = data.map((item) => ({
      name: item.character,
      image: item.image,
      quote: item.quote,
    }));

    renderCharacters(allCharacters);
  } catch (err) {
    console.error("Error cargando personajes:", err);
    const container = document.getElementById("cardsContainer");
    container.innerHTML =
      "<p>Error al cargar los personajes. Revisa la consola.</p>";
  }
}


function searchCharacters() {
  const input = document.getElementById("searchInput");
  const text = input.value.trim().toLowerCase();

  if (!text) {
    renderCharacters(allCharacters);
    return;
  }

  const filtered = allCharacters.filter((c) =>
    c.name.toLowerCase().includes(text)
  );

  renderCharacters(filtered);
}


function showRandom() {
  if (!allCharacters.length) return;

  const random =
    allCharacters[Math.floor(Math.random() * allCharacters.length)];

  renderCharacters([random]);
}


document.addEventListener("DOMContentLoaded", () => {
  loadAllCharacters();

  document.getElementById("btnSearch").onclick = searchCharacters;
  document.getElementById("btnRandom").onclick = showRandom;
  document.getElementById("btnAll").onclick = () =>
    renderCharacters(allCharacters);

  document
    .getElementById("searchInput")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchCharacters();
    });
});





