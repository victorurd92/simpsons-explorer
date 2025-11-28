const API_URL = "https://thesimpsonsapi.com/api/characters";
const IMAGE_BASE = "https://cdn.thesimpsonsapi.com";


let allCharacters = [];


function displayCharacters(characters) {
  const container = document.getElementById("characters");

  if (!characters || characters.length === 0) {
    container.innerHTML = `<p class="loading">No se encontraron personajes 😢</p>`;
    return;
  }

  container.innerHTML = characters
    .map((c) => {
      const imgUrl = c.portrait_path
        ? `${IMAGE_BASE}${c.portrait_path}`
        : "https://via.placeholder.com/260x260/ffd166/000000?text=Sin+imagen";

      return `
        <div class="card">
          <img src="${imgUrl}" alt="${c.name}"
               onerror="this.src='https://via.placeholder.com/260x260/ffd166/000000?text=Sin+imagen'"/>
          <h3>${c.name}</h3>
          <p>${c.occupation || "Ocupación desconocida"}</p>
        </div>
      `;
    })
    .join("");
}


async function loadAllCharacters() {
  const container = document.getElementById("characters");
  container.innerHTML = `<p class="loading">Cargando personajes... 🔄</p>`;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Respuesta no OK");

    const json = await res.json();
    
    const characters = Array.isArray(json) ? json : json.results;

    allCharacters = characters || [];
    displayCharacters(allCharacters);
  } catch (err) {
    console.error("Error al cargar personajes:", err);
    container.innerHTML = `<p class="loading">Error al cargar 😞</p>`;
  }
}


function searchCharacters() {
  const text = document.getElementById("search").value.trim().toLowerCase();

  if (!text) {
    displayCharacters(allCharacters);
    return;
  }

  const filtered = allCharacters.filter((c) =>
    c.name.toLowerCase().includes(text)
  );

  displayCharacters(filtered);
}


function showRandomCharacter() {
  if (!allCharacters.length) return;

  const random = allCharacters[Math.floor(Math.random() * allCharacters.length)];
  displayCharacters([random]);
}


document.getElementById("btnSearch").onclick = searchCharacters;
document.getElementById("btnRandom").onclick = showRandomCharacter;
document.getElementById("btnAll").onclick = () => displayCharacters(allCharacters);


document.getElementById("search").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchCharacters();
});


loadAllCharacters();


