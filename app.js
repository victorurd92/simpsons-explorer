// app.js

// Base de la API
const API_BASE = "https://thesimpsonsapi.com/api";
const CDN_BASE = "https://cdn.thesimpsonsapi.com/500";

let allCharacters = [];

// Normaliza la URL del retrato (soporta ruta relativa o URL completa)
function normalizePortrait(path) {
  if (!path) {
    return "https://via.placeholder.com/300x300?text=No+Image";
  }

  // Si ya es una URL completa, la devolvemos tal cual
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Si es "/character/1.webp", armamos la URL completa al CDN
  return `${CDN_BASE}${path}`;
}

// Renderiza las tarjetas de personajes
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

// Carga personajes desde la API externa
async function loadAllCharacters(page = 1) {
  try {
    const res = await fetch(`${API_BASE}/characters?page=${page}`);
    const data = await res.json();

    // La API devuelve: { count, next, prev, pages, results: [...] }
    allCharacters = data.results.map((item) => ({
      name: item.name,
      image: normalizePortrait(item.portrait_path),
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

// Buscar por nombre
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

// Mostrar un personaje aleatorio
function showRandom() {
  if (!allCharacters.length) return;

  const random =
    allCharacters[Math.floor(Math.random() * allCharacters.length)];

  renderCharacters([random]);
}

// Inicializar al cargar el DOM
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
