import { animeFind } from "./resources/js/load_anime.js";
import { loadCharacterOnDom } from "./resources/js/characters.js";

let animeFindBtn = document.getElementById("animeFindBtn");

if (animeFindBtn) {
    animeFindBtn.addEventListener("click", () => {
        animeFind();
    })
}

// Initialize total score from localStorage
// If not present, set it to 0
if (!localStorage.getItem("current-score")) {
    localStorage.setItem("current-score", JSON.stringify(0));
}
document.addEventListener("DOMContentLoaded", () => {
    localStorage.getItem("current-score") || localStorage.setItem("current-score", JSON.stringify(0));
    const totalScore = JSON.parse(localStorage.getItem("current-score"));
    const rank = document.getElementById("rank");
    document.getElementById("total-score").textContent = totalScore;

    if (totalScore > 1 && totalScore < 10) {
        rank.textContent = "Chuunibyou"; // Pretending to be powerful but still weak 😆
    }
    else if (totalScore >= 10 && totalScore < 20) {
        rank.textContent = "Genin"; // Naruto’s lowest ninja rank
    }
    else if (totalScore >= 20 && totalScore < 30) {
        rank.textContent = "Shinigami in Training"; // Bleach-inspired mid-rank
    }
    else if (totalScore >= 30 && totalScore < 40) {
        rank.textContent = "Super Saiyan"; // Dragon Ball Z level
    }
    else if (totalScore >= 40) {
        rank.textContent = "S-Class Hero"; // Like One Punch Man's elite heroes
    }
    else {
        rank.textContent = "Unranked";
    }

})

// Load the first character when the page loads
// This will also set the anime title dynamically
loadCharacterOnDom();
