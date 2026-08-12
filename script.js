//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  const heading = document.createElement("h1"); 
  heading.textContent = "Game of Thrones Episodes"; 
  rootElem.appendChild(heading); 
  const source = document.createElement("p"); 
  source.textContent = "Episode data originally comes from "; 
  
  const tvMazeLink = document.createElement("a"); 
  tvMazeLink.href = "https://tvmaze.com/"; 
  tvMazeLink.textContent = "TVMaze.com"; 
  
  source.appendChild(tvMazeLink); 
  rootElem.appendChild(source);

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
    

    rootElem.appendChild(episodeContainer);
  });
}

window.onload = setup;
