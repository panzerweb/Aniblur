// Points
let score = parseInt(localStorage.getItem("current-score")) || 0; 
let level = parseInt(localStorage.getItem("player-level")) || 0;
let progressBar = document.getElementById("progress-bar");

let max = 5;
let min = 2;
let pointsIncrement = parseInt(localStorage.getItem("points-count")) || Number((Math.random() * (max - min) + min).toFixed(3));
let favoritesRange = Number(localStorage.getItem("favorite-range"));
if (isNaN(favoritesRange)) favoritesRange = 1000;

// Character wrapper and other elements
let characterWrapper = document.getElementById("character-wrapper-game");
let resetButton = document.getElementById("reset-button");
let resetAnimeButton = document.getElementById("reset-anime-button");

// Prepare anime id for API params
let urlParams = window.location.search;
let animeId = urlParams.replace('?', '');
// Check if animeId is valid
console.log(animeId);

// Data for score
const playerData = {
    totalScore: score,
    playerLevel: level
}

// Array to hold guessed characters
// This will be used to track guessed characters
const guessedCharacters = {};

if (!guessedCharacters[animeId]) {
    guessedCharacters[animeId] = [];
}

// MAIN LOADER OF CHARACTERS
// This function fetches characters from the Jikan API
// and displays a random character with more than 1000 favorites
export function loadCharacterOnDom(){
    fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`)
        .then(response => response.json())
        .then(characters => {
            characterWrapper.innerHTML = '';

            // Check if the guessedCharacters array exists for the animeId
            guessedCharacters[animeId] = JSON.parse(localStorage.getItem("guessed-" + animeId)) || [];

            // Filter characters with more than 1000 favorites
            // and select a random one
            // Ensure that the character has not been guessed before
            // MODIFY THE 1000 to higher number for testing purpose to shorten the list to test fast
            const famousChar = characters.data.filter((character) => {
                return character.favorites > favoritesRange && !guessedCharacters[animeId].includes(character.character.name);
            });
            // console.log(favoritesRange)
            const getRandomCharacters = Math.floor(Math.random() * famousChar.length);

            // console.log("Famous Characters:", famousChar);

            const randomCharacter = famousChar[getRandomCharacters];

            // console.log(randomCharacter);
            // If no characters are left to guess, show a message
            if (famousChar.length === 0) {
                console.log("No characters found matching the current favorites range.");
                characterWrapper.innerHTML = `
                    <div class="shadow-lg p-3 mb-5 rounded">
                        <h1 class="text-center text-light">No more characters to guess!</h1>
                        <p class="text-center text-secondary">You have guessed all characters from this anime.</p>
                        <p class="text-center text-secondary">Your total score is: <strong>${playerData.totalScore}</strong></p>
                        <p class="text-center text-secondary">Click "Reset Anime" to reset the characters</p>
                        <p class="text-center text-secondary">Click "Reset Score" your score back to zero</p>
                        
                    </div>
                `;
                resetButton.classList.remove("d-none");
                resetAnimeButton.classList.remove("d-none");
                return;
            }
            resetButton.classList.add("d-none");
            resetAnimeButton.classList.add("d-none");

            // Else, display the character
            // I didn't define the else condition here
            // because the character will be displayed below
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
                guessChar(inputValue, answerParams, randomCharacter);

                // ✅ Save to guessedCharacters
                guessedCharacters[animeId].push(randomCharacter.character.mal_id);
                localStorage.setItem(
                    "guessed-" + animeId,
                    JSON.stringify(guessedCharacters[animeId])
                );
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
export function guessChar(input, answer, character){

    const inputLower = input.trim().toLowerCase();
    const answerParts = answer.toLowerCase().split(' ');

    const removeCommaSurname = answerParts.map(part => part.replace(',', '').trim().toLowerCase());

    const acceptFullName = removeCommaSurname.reverse().toString().replace(',', ' ').toLowerCase();
    // console.log("Name:", acceptFullName);
    // console.log("Input:", acceptFullName === inputLower);

    // Case-insensitive comparison
    if (removeCommaSurname.some(part => part === inputLower) || acceptFullName === inputLower) {
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
            title: `Correct! You guessed it right. +${pointsIncrement} points`,
        });

        // Add the guessed character to the array
        // This will prevent guessing the same character again
        guessedCharacters[animeId].push(character.character.name);

        // console.log("Guessed Characters:", guessedCharacters);

        // Update score and progress bar
        // Increase score by 2 points
        score += pointsIncrement;
        
        playerData.totalScore = score;
        localStorage.setItem("current-score", JSON.stringify(playerData.totalScore));

        // Level up and reset to zero
        if (playerData.totalScore > 100) {
            resetScoreIfLevelUp();
            levelUp();
        }
        
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
function levelUp(){
    level++;
    favoritesRange = Math.max(favoritesRange - 200, 0);

    const randomIncreaseOfPoints = Number((Math.random() * (max - min) + min).toFixed(3));
    pointsIncrement += randomIncreaseOfPoints;
    console.log(pointsIncrement);
    popUpWhenLevelUp(level);

    localStorage.setItem("points-count", JSON.stringify(pointsIncrement));
    localStorage.setItem("favorite-range", JSON.stringify(favoritesRange));
    localStorage.setItem("player-level", JSON.stringify(level));
}
function resetScoreIfLevelUp(){
    score = 0;
    playerData.totalScore = score;
    localStorage.setItem("current-score", JSON.stringify(score));
    // console.log(playerData.totalScore);

    return score;
}
function popUpWhenLevelUp(level){
    Swal.fire({
        title: `🎉 Congratulations!`,
        html: `You've just leveled up to <strong>Level ${level}</strong>! 🚀<br><br>Keep going and aim higher!`,
        icon: 'success',
        confirmButtonText: 'Awesome!',
        background: '#f0f9ff',
        color: '#1e293b',
        confirmButtonColor: '#3b82f6',
        backdrop: `
            rgba(0,0,123,0.4)
            url("https://media.tenor.com/3hDpd2qCXBcAAAAi/party-popper-confetti.gif")
            left top
            no-repeat
        `
    });
}
// RESET FUNCTIONS START
// This function resets the anime characters and score
export function resetAnime() {
    // Clear the guessed characters for the current anime
    localStorage.removeItem("guessed-" + animeId);
}
export function resetScoreAndLevel() {
    score = 0;
    level = 0;
    localStorage.setItem("current-score", JSON.stringify(score));
    localStorage.setItem("player-level", JSON.stringify(level));
    // Reset the progress bar
    progressBar.style.width = `${score}%`;
    guessedCharacters.length = 0; // Clear the guessed characters array
    loadCharacterOnDom(); // Reload characters
}
// RESET FUNCTIONS END

// Run the loading of characters
// Load the anime title dynamically
// and set the progress bar width\
// Set the score from localStorage if it exists
document.addEventListener("DOMContentLoaded", () => {
    localStorage.getItem("current-score") ? score = JSON.parse(localStorage.getItem("current-score")) : score = 0;
    progressBar.style.width = `${score}%`;
    loadCharacterOnDom();
})