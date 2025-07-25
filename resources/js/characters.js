
// Character wrapper
let characterWrapper = document.getElementById("character-wrapper-game");

// Prepare anime id for API params
let urlParams = window.location.search;
let animeId = urlParams.replace('?', '');
console.log(animeId);


export function loadCharacterOnDom(){
    document.addEventListener("DOMContentLoaded", () => {
        fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`)
        .then(response => response.json())
        .then(characters => {
            characterWrapper.innerHTML = '';

            const getRandomCharacters = Math.floor(Math.random() * characters.data.length);

            const randomCharacter = characters.data[getRandomCharacters];

            console.log(randomCharacter);

            characterWrapper.innerHTML += 
            `
            <div class="card mb-3 mx-auto" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img
                            src="${randomCharacter.character.images.jpg.image_url}"
                            class="img-fluid rounded-start"
                            alt="${randomCharacter.character.name}"
                        />
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h3>Guess his name</h3>
                            <div class="input-group input-group-sm mb-3">
                                <input type="text" 
                                        class="form-control" 
                                        id="char-input"
                                        aria-label="Sizing example input" 
                                        aria-describedby="inputGroup-sizing-sm"
                                        placeholder="Name (Surname, First or First name only)"
                                >
                            </div>
                            <button type="button" 
                                    class="btn btn-danger w-100"
                                    id="guess-button"
                                    
                            >
                                    Guess
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `

            // Sends input value to verify in guessChar()
            let guessButton = document.getElementById("guess-button");
            let charInput = document.getElementById("char-input");

            guessButton.addEventListener("click", () => {
                const inputValue = charInput.value;
                const answerParams = randomCharacter.character.name;
                guessChar(inputValue, answerParams);
            });
        })
        .catch(error => {
            console.log(error);
        })
    })
}

export function guessChar(input, answer){
    // Case-insensitive comparison
    if (input.trim().toLowerCase() === answer.trim().toLowerCase()) {
        alert("You are correct!");
        window.location.reload();
    } else {
        alert("You are wrong!");
    }
}