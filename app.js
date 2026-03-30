//all elements needed
const output = document.getElementById("output");
const input = document.getElementById("command-input");
const terminal = document.getElementById("terminal");
const canvas = document.getElementById("overlay-canvas");

let commandHistory = [];
let historyIndex = -1;
let isTyping = false;
let snakeActive = false;

// all comands available
const commands = {
    help: cmdHelp,
    about: cmdAbout,
    projects: cmdProjects,
    // skills: cmdSkills,
    // contact: cmdContact,
    // socials: cmdSocials,
    // clear: cmdClear,
    // history: cmdClear, // the next ones are hidden :))
    // snake: cmdSnake,
    // matrix: cmdMatrix,
    // hack: cmdHack,
    // cowsay: cmdCowsay,
    // fortune: cmdFortune,
    // whoami: cmdWhoami,
    // date: cmdDate,
    // vim: cmdVim,
    // echo: cmdEcho,
    // exit: cmdExit,
    // logout: cmdExit, //same
    ls: cmdHelp, // same as help
};

window.addEventListener("load", async () => {
    addBannerLines(DATA.banner);

    for (const line of DATA.welcome) {
        await typeLine(line, "line-output", 20);
    }

    input.focus();
});

terminal.addEventListener("click", async (e) => {
    if (!snakeActive) {
        input.focus();
    }
});

input.addEventListener("keydown", async (e) => {
    if (isTyping) return;

    // if entered a command
    if (e.key === "Enter") {
        const cmd = input.value.trim();
        input.value = "";
        if (cmd) {
            commandHistory.unshift(cmd);
            historyIndex = -1;
            addLine(`${DATA.username}@${DATA.hostname}:~$ ${cmd}`, "line-input");
            await processCommand(cmd);
        } else {
            addLine(`${DATA.username}@${DATA.hostname}:~$`, "line-input");
        }

        scrollToBottom();
    }
    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
            historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
            input.value = commandHistory[historyIndex];
        }
    }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        historyIndex = Math.max(historyIndex - 1, -1);
        input.value = historyIndex >= 0 ? commandHistory[historyIndex] : "";
    }

    if (e.key === "Tab") {
        e.preventDefault();
        const partial = input.value.trim().toLowerCase();
        if (partial) {
            const allCommands = Object.keys(commands);
            const matches = allCommands.filter((c) => c.startsWith(partial));
            if (matches.length == 1) {
                input.value = matches[0];
            } else if (matches.length > 1) {
                addLine(`${DATA.username}@${DATA.hostname}:~$ ${partial}`, "line-input");
                addLine(matches.join("  "), "line-dim");
            }
        }
    }
});

async function processCommand(rawCmd) {
    //need to parse cmd and arg
    const parts = rawCmd.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // easter egg command 'hire-me'
    if (cmd == "sudo" && args.length > 0) {
        const sudoCmd = args.join("-");
        if (sudoCmd === "hire-me") {
            await cmdSudoHireMe();
            return;
        }
    }

    // only execut if exists
    if (commands[cmd]) {
        await commands[cmd](args);
    } else {
        await typeLine(`Command not found: ${cmd}. Type 'help' for available commands.`, "line-error", 15);
    }
}

// all comands functions
async function cmdHelp() {
    addLine("", "line-output");
    await typeLine("    Available Commands:", "line-accent", 15);
    await typeLine("    ----------------------------------", "line-dim", 5);
    await typeLine("    about       - Who am I?", "line-output", 8);
    await typeLine("    projects    - What i've build", "line-output", 8);
    await typeLine("    skills      - My tech stack", "line-output", 8);
    await typeLine("    contact     - How to reach me", "line-output", 8);
    await typeLine("    socials     - Find me online", "line-output", 8);
    await typeLine("    history     - Command history", "line-dim", 8);
    await typeLine("    clear       - Clear terminal", "line-dim", 8);
    await typeLine("    help        - Show this message", "line-dim", 8);
    addLine("", "line-output");
    await typeLine("    ...and some secret commands 🤫", "line-yellow", 15);
    addLine("", "line-output");
}

async function cmdAbout() {
    addLine("", "line-output");

    for (const line of DATA.about) {
        await typeLine(line, "line-output", 18);
    }

    addLine("", "line-output");
}

async function cmdProjects() {
    addLine("", "line-output");
    await typeLine("    My Projects:", "line-accent", 15);
    await typeLine("    ------------------------------", "line-dim", 5);

    // each proj rendered as card with all data
    for (const project of DATA.projects) {
        addLine("", "line-output");

        const nameDiv = document.createElement("div");
        nameDiv.className = "line project-card";

        const nameLine = document.createElement("div");
        nameLine.classNmae = "project-name";
        nameLine.textContent = `${project.emoji} ${project.name}`;
        nameDiv.appendChild(nameLine);

        const descLine = document.createElement("div");
        descLine.className = "line-output";
        descLine.textContent = `    ${project.description}`;
        nameDiv.appendChild(descLine);

        const techLine = document.createElement("div");
        techLine.className = "project-tech";
        techLine.textContent = `    [${project.tech.join(", ")}]`;
        nameDiv.appendChild(techLine);

        if (project.url) {
            const linkLine = document.createElement("div");
            linkLine.innerHTML = `  → <a href="${project.url}" target="_blank">${project.url}</a>`;
            nameDiv.appendChild(linkLine);
        }

        output.appendChild(nameDiv);
        await sleep(100);
    }

    addLine("", "line-output");
}

//typing functions (output)
function addLine(text, className = "line-output") {
    const div = document.createElement("div");
    div.className = `line ${className}`;
    div.textContent = text;
    output.appendChild(div);
    scrollToBottom();
}

function addBannerLines(bannerText) {
    const lines = bannerText.split("\n");
    for (const line of lines) {
        const div = document.createElement("div");
        div.className = "line line-banner";
        div.textContent = line;
        output.appendChild(div);
    }
}

function addHTMLLine(html, className = "line-output") {
    const div = document.createElement("div");
    div.className = `line ${className}`;
    div.innerHTML = html;
    output.appendChild(div);
    scrollToBottom();
}

async function typeLine(text, className = "line-output", speed = 20) {
    isTyping = true;

    const div = document.createElement("div");
    div.className = `line ${className}`;
    output.appendChild(div);

    // delay after each char
    for (let i = 0; i < text.length; i++) {
        div.textContent = text.substring(0, i + 1);
        scrollToBottom();
        await sleep(speed);
    }

    isTyping = false;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}
