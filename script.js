//You can edit ALL of the code here
const episodesContainer = document.getElementById("episodes-container")
const searchInput = document.getElementById("episode-search");
const searchCount = document.getElementById("searchCount")
const selectEpisodes = document.getElementById("episode-selector")
const statusMessage = document.getElementById("status-message");
let allEpisodes = [];

function populateOption(episodeList){
    episodeList.forEach((episode) => {
       const episodeOption =  document.createElement("option")
        episodeOption.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
        episodeOption.value = episode.id
       selectEpisodes.appendChild(episodeOption)
    })
}

function getEpisodes() {
    return allEpisodes;
}

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

async function setup() {
    try {
        const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
        allEpisodes = await response.json();
        render(allEpisodes);
        populateOption(allEpisodes);
        searchCount.textContent = `Displaying: ${allEpisodes.length}/${allEpisodes.length}`;
        statusMessage.textContent = "";
    } catch (error) {
        console.error(error);
        statusMessage.textContent = "Failed to load episodes.";
    }
}


let searchTerm = ""
searchInput.addEventListener("input", () =>{
    searchTerm = searchInput.value.toLowerCase()
    const allEpisodes = getEpisodes()
    const filteredEpisodes =  allEpisodes.filter((episode) => 
        episode.name.toLowerCase().includes(searchTerm) || 
    episode.summary.toLowerCase().includes(searchTerm)
);
searchCount.textContent =
    `Displaying: ${filteredEpisodes.length}/${allEpisodes.length}`;
    
    render(filteredEpisodes);
})

let selectedEpisode = ""
selectEpisodes.addEventListener("change", () => {
selectedEpisode = selectEpisodes.value
    const allEpisodes = getEpisodes()
    const episode = allEpisodes.find((episode) => {
      return episode.id === Number(selectedEpisode)
    })
    if(episode){
        render([episode])
    }
})

setup();
