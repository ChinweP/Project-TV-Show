//You can edit ALL of the code here
const episodesContainer = document.getElementById("episodes-container")
const searchInput = document.getElementById("episode-search");
const searchCount = document.getElementById("searchCount")
function getEpisodes(){
    return getAllEpisodes()
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

function setup() {
    const allEpisodes = getEpisodes()
    render(allEpisodes);
}

let searchTerm = ""
searchInput.addEventListener("input", () =>{
    searchTerm = searchInput.value.toLowerCase()
    const allEpisodes = getEpisodes()
    const filteredEpisodes =  allEpisodes.filter((episode) => episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm))
    if(searchTerm ){
        searchCount.textContent = `Displaying: ${filteredEpisodes.length}/${allEpisodes.length}`
    }else{
        searchCount.textContent = ""
    }
    render(filteredEpisodes);
})




window.onload = setup;
