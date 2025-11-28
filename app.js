const API = "/api";
let allCharacters = [];
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");


function getImageUrl(char) {
  if (char.portrait_path) {
    // La API da "/character/1.webp"
    // El CDN es: https://cdn.thesimpsonsapi.com/500/character/1.webp
    return `https://cdn.thesimpsonsapi.com/500${char.portrait_path}`;
  }

  return "https://via.placeholder.com/300x300/ffd166/000000?text=Sin+Imagen";
}


function displayCharacters(characters) {
  const grid = document.getElementById("characters");

  if (!characters || characters.length === 0) {
    grid.innerHTML = '<p class="loading">No se encontraron personajes 😢</p>';
    return;
  }

  grid.innerHTML = characters
    .map(
      (char) => `
      <div class="card" onclick="showCharacterDetails(${char.id})">
        <img 
          src="${getImageUrl(char)}" 
          alt="${char.name}"
          onerror="this.src='https://via.placeholder.com/300x300/ffd166/000000?text=Sin+Imagen'"
        >
        <h3>${char.name}</h3>
        <div class="occupation">
          ${char.occupation || "Desconocido"}
        </div>
      </div>
    `
    )
    .join("");
}



async function loadStatistics() {
  try {
    const res = await fetch(`${API}/statistics`);
    const { data } = await res.json();

    const statsDiv = document.getElementById("stats");
    statsDiv.innerHTML = `
      <div class="stat-card">
        <div class="stat-number">${data.total}</div>
        <div class="stat-label">Personajes totales</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${data.withImage}</div>
        <div class="stat-label">Con imagen</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${favorites.length}</div>
        <div class="stat-label">Mis favoritos</div>
      </div>
    `;
  } catch (err) {
    console.error("Error cargando estadísticas:", err);
  }
}



async function loadAllCharacters() {
  const grid = document.getElementById("characters");
  grid.innerHTML = '<p class="loading">Cargando personajes... 🔄</p>';

  try {
    const res = await fetch(`${API}/characters`);
    const { data } = await res.json();
    allCharacters = data || [];
    displayCharacters(allCharacters);
  } catch (err) {
    console.error("Error al cargar personajes:", err);
    grid.innerHTML = '<p class="loading">Error al cargar 😞</p>';
  }
}



async function searchCharacters() {
  const query = document.getElementById("search").value.trim();

  if (!query) {
    return loadAllCharacters();
  }

  const grid = document.getElementById("characters");
  grid.innerHTML = '<p class="loading">Buscando... 🔍</p>';

  try {
    const res = await fetch(
      `${API}/characters/search?q=${encodeURIComponent(query)}`
    );
    const { data } = await res.json();
    displayCharacters(data || []);
  } catch (err) {
    console.error("Error en búsqueda:", err);
    grid.innerHTML = '<p class="loading">Error al buscar 😞</p>';
  }
}



async function loadRandomCharacter() {
  try {
    const res = await fetch(`${API}/characters/random`);
    const { data } = await res.json();
    showCharacterDetails(data.id);
  } catch (err) {
    console.error("Error personaje aleatorio:", err);
  }
}



async function showCharacterDetails(id) {
  try {
    const res = await fetch(`${API}/characters/${id}`);
    const { data: char } = await res.json();

    const isFav = favorites.includes(char.id);

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <img 
        src="${getImageUrl(char)}" 
        alt="${char.name}"
        onerror="this.src='https://via.placeholder.com/400x400/ffd166/000000?text=Sin+Imagen'"
      >
      <h2>${char.name}</h2>
      <div class="modal-info">
        <p><strong>Ocupación:</strong> ${char.occupation || "Desconocida"}</p>
        <p><strong>Edad:</strong> ${char.age ?? "N/A"}</p>
        <p><strong>Estado:</strong> ${char.status || "Desconocido"}</p>
        <p><strong>Frases:</strong></p>
        <ul>
          ${
            (char.phrases || [])
              .slice(0, 5)
              .map((p) => `<li>"${p}"</li>`)
              .join("") || "<li>Sin frases registradas</li>"
          }
        </ul>
      </div>
      <button 
        class="favorites-btn ${isFav ? "active" : ""}" 
        onclick="toggleFavorite(${char.id}); event.stopPropagation();"
      >
        ${isFav ? "⭐ Eliminar de favoritos" : "⭐ Agregar a favoritos"}
      </button>
    `;

    document.getElementById("modal").classList.add("active");
  } catch (err) {
    console.error("Error cargando detalle:", err);
  }
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}



function toggleFavorite(id) {
  const idx = favorites.indexOf(id);
  if (idx >= 0) {
    favorites.splice(idx, 1);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  document.getElementById("favCount").textContent = favorites.length;
  loadStatistics();
}

function showFavorites() {
  if (!favorites.length) {
    alert("No tienes favoritos aún. ¡Agrega algunos!");
    return;
  }

  const favChars = allCharacters.filter((c) => favorites.includes(c.id));
  displayCharacters(favChars);
}



async function clearCache() {
  try {
    await fetch(`${API}/cache/clear`, { method: "POST" });
    alert("Cache limpiado 🔄");
    await loadAllCharacters();
    await loadStatistics();
  } catch (err) {
    console.error("Error limpiando cache:", err);
  }
}



document.getElementById("btnSearch").onclick = searchCharacters;
document.getElementById("btnRandom").onclick = loadRandomCharacter;
document.getElementById("btnAll").onclick = loadAllCharacters;
document.getElementById("btnFavs").onclick = showFavorites;
document.getElementById("btnClearCache").onclick = clearCache;

document.getElementById("search").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchCharacters();
});

document.getElementById("modalClose").onclick = closeModal;

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});



document.getElementById("favCount").textContent = favorites.length;
loadStatistics();
loadAllCharacters();
