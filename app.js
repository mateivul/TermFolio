//all elements needed
const output = document.getElementById("output");
const input = document.getElementById("command-input");
const terminal = document.getElementById("terminal");
const convas = document.getElementById("overlay-canvas");

let commandHistory = [];
let historyIndex = -1;
let isTyping = false;

window.addEventListener("load", async () => {
    addBannerLines(DATA.banner);

    for (const line of DATA.welcome) {
        await typeLine(line, "line-output", 20);
    }

    input.focus();
});
