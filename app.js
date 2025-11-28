const API_URL = "https://thesimpsonsapi.com/api/characters";

let allCharacters = [];



function buildImageUrl(character) {
  if (!character.portrait_path) {
    return "https://via.placeholder.com/250x250/ffd166/000000?text=Sin+imagen";
  }

  return `https://thesimpsonsapi.com${character.portrait_path}`;
}

function showMessage(msg) {
  const container = document.getElementById("cardsContainer");
  if (!container) return;
  container.innerHTML = `<p class="loading">${msg}</p>`;
}

function renderCharacters(list) {
  const container = document.getElementById("cardsContainer");
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML =
      '<p class="loading">No se encontraron personajes 😢</p>';
    return;
  }

  container.innerHTML = list
    .map((c) => {
      const imgUrl = buildImageUrl(c);
      return `
        <div class="card">
          <div class="card-header">${c.name}</div>
          <div class="card-image">
            <img 
              src="${imgUrl}" 
              alt="${c.name}"
              onerror="this.src='https://via.placeholder.com/250x250/ffd166/000000?text=Sin+imagen';"
            >
          </div>
          <div class="card-body">
            <p class="occupation">${c.occupation || "Sin ocupación"}</p>
            <p class="status">${c.status || ""}</p>
          </div>
        </div>
      `;
    })
    .join("");
}



async function loadCharacters() {
  try {
    showMessage("Cargando personajes... 🔄");

    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error("Error HTTP: " + res.status);
    }

    const data = await res.json();

   
    allCharacters = Array.isArray(data.results) ? data.results : [];

    renderCharacters(allCharacters);
  } catch (error) {
    console.error(error);
    showMessage("Error al cargar personajes 😢");
  }
}



function searchCharacters() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  const q = input.value.trim().toLowerCase();

  if (!q) {
    renderCharacters(allCharacters);
    return;
  }

  const filtered = allCharacters.filter((c) => {
    const name = (c.name || "").toLowerCase();
    const occ = (c.occupation || "").toLowerCase();
    return name.includes(q) || occ.includes(q);
  });

  renderCharacters(filtered);
}

function showRandomCharacter() {
  if (!allCharacters.length) return;

  const randomIndex = Math.floor(Math.random() * allCharacters.length);
  const character = allCharacters[randomIndex];
  renderCharacters([character]);
}

function showAllCharacters() {
  renderCharacters(allCharacters);
}



document.addEventListener("DOMContentLoaded", () => {
 
  const btnSearch = document.getElementById("btnSearch");
  const btnRandom = document.getElementById("btnRandom");
  const btnAll = document.getElementById("btnAll");

  if (btnSearch) btnSearch.addEventListener("click", searchCharacters);
  if (btnRandom) btnRandom.addEventListener("click", showRandomCharacter);
  if (btnAll) btnAll.addEventListener("click", showAllCharacters);

 
  const input = document.getElementById("searchInput");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchCharacters();
      }
    });
  }


  loadCharacters();
});


