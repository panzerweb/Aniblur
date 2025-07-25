import { animeFind } from "./resources/js/load_anime.js";
import { loadCharacterOnDom } from "./resources/js/characters.js";

let animeFindBtn = document.getElementById("animeFindBtn");

if (animeFindBtn) {
    animeFindBtn.addEventListener("click", () => {
        animeFind();
    })
}

loadCharacterOnDom();
