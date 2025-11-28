const API_BASE = "https://thesimpsonsapi.com/api";
const CDN_BASE = "https://cdn.thesimpsonsapi.com/500";

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


async function loadAllCharacters(page = 1) {
  try {
    const res = await fetch(`${API_BASE}/characters?page=${page}`);
    const data = await res.json();

    
    allCharacters = data.results.map((item) => ({
      name: item.name,
      image: `${CDN_BASE}${item.portrait_path}`, 
      quote:
        item.phrases && item.phrases.length > 0
          ? item.phrases[0]
          : "Sin frase registrada."
    }));

    renderCharacters(allCharacters);
  } catch (err) {
    console.error("Error cargando personajes:", err);
    const container = document.getElementById("cardsContainer");
    container.innerHTML =
      "<p>Error al cargar los personajes desde la API.</p>";
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

