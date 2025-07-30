// Points
let score = 0; 
let progressBar = document.getElementById("progress-bar");

// Character wrapper
let characterWrapper = document.getElementById("character-wrapper-game");

// Prepare anime id for API params
let urlParams = window.location.search;
let animeId = urlParams.replace('?', '');
console.log(animeId);

// Data for score
const playerData = {
    totalScore: score,
    animeId: animeId
}

// MAIN LOADER OF CHARACTERS
// This function fetches characters from the Jikan API
// and displays a random character with more than 1000 favorites
export function loadCharacterOnDom(){
    fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`)
        .then(response => response.json())
        .then(characters => {
            characterWrapper.innerHTML = '';

            // Filter characters with more than 1000 favorites
            // and select a random one
            const famousChar = characters.data.filter((character) => {
                return character.favorites > 1000
            });

            const getRandomCharacters = Math.floor(Math.random() * famousChar.length);

            const randomCharacter = famousChar[getRandomCharacters];

            console.log(randomCharacter);

            characterWrapper.innerHTML += 
            `
            <div class="card guess-card mb-3 mx-auto border-0">
                <div class="row g-0">
                    <div class="col-md-4 d-flex justify-content-center">
                        <img
                            src="${randomCharacter.character.images.jpg.image_url}"
                            class="img-fluid rounded-start character-image"
                            alt="${randomCharacter.character.name}"
                        />
                    </div>
                    <div class="col-md-8">
                        <div class="card-body text-light">
                            <h3 class="card-title">Guess Their Name</h3>
                            <div class="input-group input-group-sm mb-3">
                                <input type="text"
                                    class="form-control guess-input"
                                    id="char-input"
                                    placeholder="Surname, First or Full Name"
                                    aria-label="Character name"
                                    aria-describedby="inputGroup-sizing-sm"
                                >
                            </div>
                            <button type="button"
                                    class="btn btn-guess w-100"
                                    id="guess-button"
                            >
                                Guess
                            </button>
                            <button id="next-button" 
                                    class="btn btn-success fw-semibold w-100 mt-2"
                            >
                                Next Character
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            `;

            // Click to load next character
            let nextCharButton = document.getElementById("next-button");

            nextCharButton.addEventListener("click", () => {
                loadCharacterOnDom(); //Re-call function
            })


            // Sends input value to verify in guessChar()
            let guessButton = document.getElementById("guess-button");
            let charInput = document.getElementById("char-input");

            guessButton.addEventListener("click", () => {
                const inputValue = charInput.value;
                const answerParams = randomCharacter.character.name;
                guessChar(inputValue, answerParams);
            });
            // console.log(playerData.totalScore);
            
            playerData.animeId = animeId;
            progressBar.style.width = `${localStorage.getItem("current-score")}%`;
        })
        .catch(error => {
            console.log(error);
        })
}

// GUESSING LOGIC
export function guessChar(input, answer){

    const inputLower = input.trim().toLowerCase();
    const answerParts = answer.toLowerCase().split(' ');
    // Case-insensitive comparison
    if (answerParts.some(part => part === inputLower)) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
            });
            Toast.fire({
            icon: "success",
            title: `Correct! You guessed it right. +${2} points`,
        });

        // Update score and progress bar
        // Increase score by 5 points
        score += 2;
        
        playerData.totalScore = score;
        localStorage.setItem("current-score", JSON.stringify(playerData.totalScore));
        
        //Call Loading function to load next character
        loadCharacterOnDom();
    } else {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
            });
            Toast.fire({
            icon: "error",
            title: "Wrong! Try again.",
        });
    }
}

// Run the loading of characters
// Load the anime title dynamically
// and set the progress bar width\
// Set the score from localStorage if it exists
document.addEventListener("DOMContentLoaded", () => {
    localStorage.getItem("current-score") ? score = JSON.parse(localStorage.getItem("current-score")) : score = 0;
    progressBar.style.width = `${score}%`;
    loadCharacterOnDom();
})