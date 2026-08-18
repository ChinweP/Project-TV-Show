// --------------------------
// DOM ELEMENTS
// --------------------------
const episodesContainer = document.getElementById("episodes-container")
const searchInput = document.getElementById("episode-search");
const searchCount = document.getElementById("searchCount")
const episodeSelector = document.getElementById("episode-selector")
const showSelector = document.getElementById("show-selector")
const searchContainer = document.getElementById("search-container")
const statusMessage = document.getElementById("status-message");
const totalEpisode = document.getElementById("totalEpisode")

let allEpisodes = [];
let allShows = []
const episodesCache = new Map();
searchContainer.hidden = true
// ---------------------------
// POPULATES SHOWS & EPISODES
// ---------------------------
function populateDropdown(optionData, selectElement, getText) {
    optionData.forEach((optionDatum) => {
        const option = document.createElement("option")
        option.value = optionDatum.id;
        option.textContent = getText(optionDatum);
        selectElement.appendChild(option)
    })
}

// --------------------------
//        RENDERING
// --------------------------
function render(episodeList) {
    episodesContainer.textContent = ""
    episodeList.forEach(function (episode) {
        const episodeContainer = document.createElement("article");
        const episodeTitle = document.createElement("h2");
        const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
        episodeTitle.textContent = `${episode.name} - ${episodeCode}`;
        const episodeDetails = document.createElement("p");
        episodeDetails.textContent = `Season: ${episode.season} | Episode: ${episode.number}`;

        const episodeImage = document.createElement("img");
        episodeImage.src = episode.image.medium;
        episodeImage.alt = episode.name;

        const episodeSummary = document.createElement("div");
        episodeSummary.innerHTML = episode.summary;

        const episodeLink = document.createElement("a");
        episodeLink.href = episode.url;
        episodeLink.textContent = "View on TVMaze";
        episodeContainer.appendChild(episodeTitle);
        episodeContainer.appendChild(episodeDetails);
        episodeContainer.appendChild(episodeImage);
        episodeContainer.appendChild(episodeSummary);
        episodeContainer.appendChild(episodeLink);

        episodesContainer.appendChild(episodeContainer)
    });
}

// --------------------------
// API / FETCH FUNCTIONS
// --------------------------

async function getShows() {
    const url = "https://api.tvmaze.com/shows";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        allShows = await response.json();
        return true;
    } catch (error) {
        console.error(error.message);
        return false
    }
}

async function getShowEpisodes(showId) {
    const url = `https://api.tvmaze.com/shows/${showId}/episodes`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        allEpisodes = await response.json();
        return true
    } catch (error) {
        console.error(error.message);
        return false
    }
}

// --------------------------
// INITIALISE APP
// --------------------------
async function setup() {
    statusMessage.textContent = 'Episodes loading...';
    const success = await getShows()
    if (success) {
        statusMessage.textContent = '';
    } else {
        statusMessage.textContent = 'Unable to load episodes, try again later';
        return;
    }
    allShows.sort((showA, showB) => {
        return showA.name.toLowerCase().localeCompare(showB.name.toLowerCase())
    })
    populateDropdown(
        allShows,
        showSelector,
        (show) => show.name);
}

// --------------------------
// EVENT LISTENERS
// --------------------------

let searchTerm = ""
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.toLowerCase()
    const filteredEpisodes = allEpisodes.filter((episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );

    searchCount.textContent =
        `Displaying: ${filteredEpisodes.length}/${allEpisodes.length}`;

    render(filteredEpisodes);
})

let selectedEpisode = ""
episodeSelector.addEventListener("change", () => {
    selectedEpisode = episodeSelector.value
    const foundEpisode = allEpisodes.find((oneEpisode) => {
        return oneEpisode.id === Number(selectedEpisode);
    });
    if (foundEpisode) {
        totalEpisode.textContent = `Displaying: ${[foundEpisode].length}/${allEpisodes.length}`
        render([foundEpisode])
    }
})

let selectedShow = ""
showSelector.addEventListener("change", async () => {
    selectedShow = showSelector.value
    if (episodesCache.has(selectedShow)) {
        allEpisodes = episodesCache.get(selectedShow)
    } else {
        await getShowEpisodes(selectedShow)
        episodesCache.set(selectedShow, allEpisodes);
    }
    episodeSelector.textContent = ""
    populateDropdown(
        allEpisodes,
        episodeSelector,
        (episode) =>
            `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`
    );
    searchContainer.hidden = false
    totalEpisode.textContent =
        `Displaying: ${allEpisodes.length}/${allEpisodes.length}`;
    render(allEpisodes)
})

setup();
