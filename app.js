import { animeFind } from "./resources/js/load_anime.js";
import { loadCharacterOnDom, resetScoreAndLevel, resetAnime } from "./resources/js/characters.js";

let animeFindBtn = document.getElementById("animeFindBtn");

if (animeFindBtn) {
    animeFindBtn.addEventListener("click", () => {
        animeFind();
    })
}

// Reset button to reset the score and progress bar
let resetButton = document.getElementById("reset-button");
let resetAnimeButton = document.getElementById("reset-anime-button");

// Reset all anime characters from a completed anime
if (resetAnimeButton) {
    resetAnimeButton.addEventListener("click", () => {
        resetAnime();
        Swal.fire({
            title: "Congratulations!",
            text: "Anime characters have been reset. You can start guessing again!",
            icon: "success",
            showConfirmButton: false,
            timer: 1000
        });
        setTimeout(() => {
            window.location.reload();;
        }, 1500);
    });
}
// Resets the score and level
if (resetButton) {
    resetButton.addEventListener("click", () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Your score and level will be reset to zero.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
            title: "Reset Successful",
            text: "Your score and level has been resetted!",
            icon: "success"
            });

            // If confirm, then reset score and level to 0
            resetScoreAndLevel();
        }
        });
        
        // const Toast = Swal.mixin({
        //     toast: true,
        //     position: "top-end",
        //     showConfirmButton: false,
        //     timer: 1000,
        //     timerProgressBar: true,
        //     didOpen: (toast) => {
        //         toast.onmouseenter = Swal.stopTimer;
        //         toast.onmouseleave = Swal.resumeTimer;
        //     }
        //     });
        //     Toast.fire({
        //     icon: "success",
        //     title: `Score has been reset!`,
        // });
    });
}

// Initialize total score from localStorage and get the player level
// If not present, set it to 0
if (!localStorage.getItem("current-score")) {
    localStorage.setItem("current-score", JSON.stringify(0));
}

document.addEventListener("DOMContentLoaded", () => {
    let max = 5;
    let min = 2;
    // Set Interval to accurately update the data of score
    setInterval(() => {
        localStorage.getItem("current-score") || localStorage.setItem("current-score", JSON.stringify(0));
        localStorage.getItem("player-level") || localStorage.setItem("player-level", JSON.stringify(0));
        localStorage.getItem("favorite-range") || localStorage.setItem("favorite-range", JSON.stringify(1000));
        localStorage.getItem("points-count") || localStorage.setItem("points-count", JSON.stringify(Number((Math.random() * (max - min) + min).toFixed(3))));

        const currentLevel = JSON.parse(localStorage.getItem("player-level"));
        const totalScore = JSON.parse(localStorage.getItem("current-score"));
        // HTML Element
        const rank = document.getElementById("rank");
        const level = document.getElementById("level");
        document.getElementById("total-score").textContent = totalScore;
            if (currentLevel == 1) {
                rank.textContent = "Academy Student";
            } else if (currentLevel == 2) {
                rank.textContent = "Genin";
            } else if (currentLevel >= 3 && currentLevel <= 5) {
                rank.textContent = "Chunin";
            } else if (currentLevel >= 6 && currentLevel <= 8) {
                rank.textContent = "Jonin";
            } else if (currentLevel >= 9 && currentLevel <= 11) {
                rank.textContent = "Anbu";
            } else if (currentLevel >= 12 && currentLevel <= 14) {
                rank.textContent = "Anbu Captain";
            } else if (currentLevel >= 15 && currentLevel <= 17) {
                rank.textContent = "Kage Candidate";
            } else if (currentLevel >= 18 && currentLevel <= 20) {
                rank.textContent = "Kage";
            } else if (currentLevel >= 21 && currentLevel <= 23) {
                rank.textContent = "S-Rank Shinobi";
            } else if (currentLevel >= 24 && currentLevel <= 26) {
                rank.textContent = "Legendary Shinobi";
            } else if (currentLevel >= 27 && currentLevel <= 29) {
                rank.textContent = "Sage Warrior";
            } else if (currentLevel >= 30 && currentLevel <= 32) {
                rank.textContent = "Tailed Beast Host";
            } else if (currentLevel >= 33 && currentLevel <= 35) {
                rank.textContent = "Divine Shinobi";
            } else if (currentLevel >= 36 && currentLevel <= 40) {
                rank.textContent = "Eternal Sage";
            } else if (currentLevel >= 41 && currentLevel <= 50) {
                rank.textContent = "Cosmic Guardian";
            } else if (currentLevel >= 51 && currentLevel <= 60) {
                rank.textContent = "Dimensional Warden";
            } else if (currentLevel >= 61 && currentLevel <= 70) {
                rank.textContent = "Celestial Ninja Lord";
            } else if (currentLevel >= 71 && currentLevel <= 80) {
                rank.textContent = "Shinobi Deity";
            } else if (currentLevel >= 81 && currentLevel <= 90) {
                rank.textContent = "Primordial Shinobi";
            } else if (currentLevel >= 91) {
                rank.textContent = "God of All Shinobi";
            }

            level.textContent = currentLevel;
    }, 1000);


})

// Load the first character when the page loads
// This will also set the anime title dynamically
loadCharacterOnDom();
