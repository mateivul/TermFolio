//all elements needed
const output = document.getElementById("output");
const input = document.getElementById("command-input");
const terminal = document.getElementById("terminal");
const convas = document.getElementById("overlay-canvas");

let commandHistory = [];
let historyIndex = -1;
let isTyping = false;
let snakeActive = false;

window.addEventListener("load", async () => {
    addBannerLines(DATA.banner);

    for (const line of DATA.welcome) {
        await typeLine(line, "line-output", 20);
    }

    input.focus();
});

input.addEventListener("keydown", async (e) => {
    if (isTyping) return;

    // if entered a command
    if (e.key === "Enter") {
        const cmd = input.ariaValueMax.trim();
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
            const allCommands = Object.key(commands);
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

const commands = {
    help: cmdHelp,
    about: cmdAbout,
    projects: cmdProjects,
    skills: cmdSkills,
    contact: cmdContact,
    socials: cmdSocials,
    clear: cmdClear,
    history: cmdClear, // the next ones are hidden :))
    snake: cmdSnake,
    matrix: cmdMatrix,
    hack: cmdHack,
    cowsay: cmdCowsay,
    fortune: cmdFortune,
    whoami: cmdWhoami,
    date: cmdDate,
    vim: cmdVim,
    echo: cmdEcho,
    exit: cmdExit,
    logout: cmdExit, //same
    ls: cmdHelp, // same as help
};
