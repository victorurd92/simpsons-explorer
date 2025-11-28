const API_BASE = "https://thesimpsonsapi.com/api/characters";

let allCharacters = [];



function getImageUrl(char) {
  
  if (!char.portrait_path) {
    return "https://via.placeholder.com/280x280/ffd166/000000?text=Sin+Imagen";
  }

 
  if (char.portrait_path.startsWith("http")) {
    return char.portrait_path;
  }

 
  return `https://cdn.thesimpsonsapi.com/500${char.portrait_path}`;
}

function createCard(char) {
  const div = document.createElement("div");
  div.className = "card";

  const img = document.createElement("img");
  img.src = getImageUrl(char);
  img.alt = char.name;
  img.onerror = () => {
    img.src =
      "https://via.placeholder.com/280x280/ffd166/000000?text=Sin+Imagen";
  };

  const h3 = document.createElement("h3");
  h3.textContent = char.name;

  const occupation = document.createElement("div");
  occupation.className = "occupation";
  occupation.textContent = char.occupation || "Unknown";

  const status = document.createElement("p");
  status.textContent = char.status || "";

  div.appendChild(img);
  div.appendChild(h3);
  div.appendChild(occupation);
  div.appendChild(status);

  return div;
}

function renderCharacters(list) {
  const container = document.getElementById("characters");
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML =
      '<p class="loading">No se encontraron personajes 😢</p>';
    return;
  }

  list.forEach((char) => {
    container.appendChild(createCard(char));
  });
}



async function loadAllCharacters() {
  const container = document.getElementById("characters");
  container.innerHTML =
    '<p class="loading">Cargando personajes... 🔄</p>';

  try {
    const res = await fetch(API_BASE);
    const json = await res.json();

    allCharacters = json.results || [];
    renderCharacters(allCharacters);
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="loading">Error al cargar 😞</p>';
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




