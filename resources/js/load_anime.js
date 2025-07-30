let animeList = document.getElementById("anime-rows");
let closestResult = document.getElementById("closest-results-row");
let findAnime = document.getElementById("find_anime");


export function animeFind(){
    let animeInput = findAnime.value.trim();
    let placeholderBox = document.getElementById("placeholder");

    console.log("Searching for:", animeInput);

    fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeInput)}`)
    .then(response => response.json())
    .then(animes => {

        console.log(animes);

        animeList.innerHTML = '';
        closestResult.innerHTML = '';

        if (!animes.data || animes.data.length === 0) {
            console.log("No Anime Found");
            return;
        }

        let result = animes.data.find(anime => {
            return anime.title.toLowerCase() === animeInput.toLowerCase()
        })

        placeholderBox.style.display = 'none';
        const nsfwGenres = ["Hentai", "Ecchi", "Erotica"];

        // IF SEARCH HAS ONE RESULT, THE EXACT RESULT
        // Show Exact Result
        if (result) {
            let isNSFW = result.genres.some(genre => nsfwGenres.includes(genre.name));
            if (isNSFW) {
                alert("18+ Content, please go back!");
                return;
            }

            animeList.innerHTML += 
            `
            <small class="text-secondary text-center d-block">Matching Result:</small>
            <div class="col-12 my-3">
                <div class="anime-card card border-0 shadow-lg text-white">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${result.images.webp.large_image_url}" class="img-fluid rounded-start h-100 object-fit-cover" alt="${result.title}" />
                        </div>
                        <div class="col-md-8">
                            <div class="card-body d-flex flex-column justify-content-between h-100">
                                <div>
                                    <h5 class="card-title mb-2 text-heading">${result.title}</h5>
                                    <p class="card-text small text-secondary">${result.synopsis || 'No description available.'}</p>
                                </div>
                                <div class="anime-info mt-3">
                                    <p class="mb-1"><strong>Episodes:</strong> ${result.episodes}</p>
                                    <p class="mb-1"><strong>Status:</strong> ${result.status}</p>
                                    <p class="mb-1"><strong>Score:</strong> ${result.score}</p>
                                    <p class="mb-1"><strong>Type:</strong> ${result.type}</p>
                                    <a href="${result.url}" target="_blank" class="btn btn-primary mt-2">More Info</a>
                                    <a href="./resources/pages/guess.html?${result.mal_id}" target="_blank" class="btn btn-warning mt-2">Play Game</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

            // Reset input field
            findAnime.value = '';
        }
        // Show Closest Results (excluding exact match)
        if (animes.data && animes.data.length > 0 && animeInput !== '') {
            const closestResults = animes.data.filter(anime => anime.mal_id !== result?.mal_id);

            if (closestResults.length > 0) {
                closestResult.innerHTML += `<small class="text-secondary text-center d-block">Related Results:</small>`;

                closestResults.forEach(anime => {
                    closestResult.innerHTML += 
                    `
                    <div class="col-12 col-lg-6 my-2 px-1">
                        <div class="d-flex bg-dark text-white rounded overflow-hidden shadow-sm" style="min-height: 140px; height:100%">
                            <div style="flex: 0 0 100px;">
                                <img src="${anime.images.webp.large_image_url}" class="w-100 h-100 object-fit-cover" alt="${anime.title}" />
                            </div>
                            <div class="p-2 d-flex flex-column justify-content-between" style="flex: 1;">
                                <div>
                                    <h6 class="mb-1">${anime.title}</h6>
                                    <p class="text-secondary small mb-1">${anime.synopsis?.slice(0, 100) || 'No description available.'}...</p>
                                </div>
                                <div class="small text-secondary">
                                    <span><strong>Episodes:</strong> ${anime.episodes} | </span>
                                    <span><strong>Status:</strong> ${anime.status} | </span>
                                    <span><strong>Score:</strong> ${anime.score}</span><br>
                                    <a href="${anime.url}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">More Info</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                });
                // Reset input field
                findAnime.value = '';
            }
        }
        // Handle empty input
        else {
            placeholderBox.style.display = 'block';
            console.log("No inputs");
            return;
        }

    })
    .catch(error => {
        console.error("Error fetching anime:", error);
    });
}