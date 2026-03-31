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
    skills: cmdSkills,
    contact: cmdContact,
    socials: cmdSocials,
    clear: cmdClear,
    history: cmdHistory, // the next ones are hidden :))
    // snake: cmdSnake,
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

async function cmdSkills() {
    addLine("", "line-output");
    await typeLine("    My Skills:", "line-accent", 15);
    await typeLine("    --------------------------", "line-dim", 5);
    addLine("", "line-output");

    // so 4 skill categ , all w/ special color
    const categories = [
        { label: "Languages", items: DATA.skills.languages, color: "line-accent" },
        { label: "Frameworks", items: DATA.skills.frameworks, color: "line-cyan" },
        { label: "Tools", items: DATA.skills.tools, color: "line-green" },
        { lavel: "Learning", items: DATA.skills.learning, color: "line-yellow" },
    ];

    for (const cat of categories) {
        await typeLine(`    ${cat.label}:`, cat.color, 15);

        //showing stars as level for each
        //representing how much i know of that
        const skillStrings = cat.items.map((skill) => {
            const stars = "★".repeat(skill.stars) + "☆".repeat(5 - skill.stars);
            return `${skill.name} ${stars}`;
        });

        await typeLine(`    ${skillStrings.join("   <>   ")}`, "line-output", 10);
        addLine("", "line-output");
    }
}

async function cmdContact() {
    addLine("", "line-output");
    await typeLine("    Contact:", "line-output", 15);
    await typeLine("    ------------------------", "line-dim", 5);

    if (DATA.contact.email) {
        const emailLine = document.createElement("div");
        emailLine.className = "line line-cyan";
        emailLine.innerHTML = `    📧 Email: <a href="mailto:${DATA.contact.email}">${DATA.contact.email}</a>`;
        output.appendChild(emailLine);
        await sleep(80);
    }

    if (DATA.contact.location) {
        await typeLine(`    📍 Location: ${DATA.contact.location}`, "line-cyan", 15);
    }

    addLine("", "line-output");
}

async function cmdSocials() {
    addLine("", "line-output");
    await typeLine("    Find me online:", "line-accent", 15);
    await typeLine("    --------------------------", "line-dim", 5);

    const icons = {
        //cooler this way sry
        github: "🐙",
        instagram: "📸",
        hackclub: "🦕",
        linkedin: "💼",
    };

    for (const [platform, url] of Object.entries(DATA.socials)) {
        const icon = icons[platform] || "";
        const linkDiv = document.createElement("div");
        linkDiv.className = "line";
        linkDiv.innerHTML = `   ${icon} ${platform}: <a href="${url}" target="_blank">${url}</a>`;
        output.appendChild(linkDiv);
        await sleep(80);
    }

    addLine("", "line-output");
}

async function cmdHistory() {
    addLine("", "line-output");

    if (commandHistory.length <= 1) {
        await typeLine("    No command history yet.", "line-dim", 15);
    } else {
        for (let i = Math.min(commandHistory.length - 1, 15); i >= 1; i--) {
            //only last 15
            const num = commandHistory.length - i;
            const cmd = commandHistory[i];
            const line = document.createElement("div");
            line.className = "line";
            line.innerHTML = `    <span style="color: var(--cyan)">${num}</span>    ${cmd}`;
            output.appendChild(line);
            await sleep(5);
        }
    }
    addLine("", "line-output");
}

function cmdClear() {
    output.innerHTML = "";
}

async function cmdSudoHireMe() {
    addLine("", "line-output");
    await typeLine("    [sudo] password for visitor: ********", "line-dim", 30);
    addLine("", "line-output");
    await typeLine("    🔓 Access granted.", "line-green", 25);
    addLine("", "line-output");
    await typeLine("    Initializing resume transmission...", "line-cyan", 25);
    await typeLine("    Contacting all Future 500 companies...", "line-cyan", 25);
    await typeLine("    Sending cover letter... ██████████ 100%", "line-green", 30);
    await typeLine("    Scheduling interviews... ██████████ 100", "line-green", 30);
    addLine("", "line-output");
    await typeLine("    ✅ Done! Just kidding... :D", "line-yellow", 25);
    await typeLine(`    But seriously, reach out: ${DATA.contact.email}`, "line-accent", 20);
    addLine("", "line-output");
}

async function cmdMatrix() {
    //somesort of a rain matrix effect (like in movies ofc)
    canvas.classList.add("active");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    //random japanese text + some chars
    const chars =
        "ヴォパッㇳヒグㇱエニョドォヷメシプツテネガㇱョフョラァツダヒヌヘミャリッヨガクペヷヸヹヺヷヰヱヲンㇷ゚キㇽ0123456789ABCDEFG";

    let frames = 0;
    const maxFrames = 150;

    function drawMatrix() {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ec3750";
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        // actually drawing the chras
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.9751) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        frames++;
        if (frames < maxFrames) {
            requestAnimationFrame(drawMatrix);
        } else {
            //clean after
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.classList.remove("active");
            addLine("   Wake up, Neo...🐇", "line-green");
            addLine("", "line-output");
            input.focus();
        }
    }

    drawMatrix();
}

async function cmdHack() {
    await typeLine("    Initializing hack sequence...", "line-cyan", 20);
    await typeLine("    Bypassing firewall ██████▒▒▒▒ 60%", "line-yellow", 30);
    await typeLine("    Bypassing firewall ████████▒▒ 80%", "line-yellow", 30);
    await typeLine("    Bypassing firewall ██████████ 100%", "line-green", 30);
    await typeLine("    Cracking encryption: AES-256... FAILED", "line-accent", 20);
    await typeLine("    Cracking encryption: ROT13... SUCCESS", "line-green", 20);
    await typeLine("    Accessing mainframe...", "line-cyan", 20);
    await typeLine("    Downloading secret files...", "line-cyan", 20);
    await typeLine("    nuclear_codes.txt ........... 1.2 KB", "line-dim", 15);
    await typeLine("    grandma_cookies_recipe.pdf .. 4.7 MB", "line-dim", 15);
    await typeLine("    meaning_of_life.txt .. 64 TB", "line-dim", 15);
    addLine("", "line-output");
    await typeLine("    ERROR: Hack interrupted.", " line-accent", 20);
    await typeLine("    Reason: This is a portofolio, not a hacking tool. :D", "line-yellow", 20);
    await typeLine("    Try: 'projects' instead, that's where the real magic is...", "line-output", 20);
    addLine("", "line-output");
}

async function cmdCowsay(args) {
    const message = args.length > 0 ? args.join(" ") : DATA.cowsayDefault;
    const border = "-".repeat(message.length + 2);

    const cow = [
        `   ┌${border}┐`,
        `   | ${message} |`,
        `   └${border}┘`,
        `          \\   ^__^`,
        `           \\  (oo)\\_______`,
        `              (__)\\       )\\/\\`,
        `                  ||----w |`,
        `                  ||     ||`,
    ];
    //bro this asci art stuff is cool but hard

    addLine("", "line-output");
    for (const line of cow) {
        addLine(line, "line-yellow");
    }
    addLine("", "line-output");
}

async function cmdFortune() {
    const fortune = DATA.fortunes[Math.floor(Math.random() * DATA.fortunes.length)];
    addLine("", "line-output");
    await typeLine(`    ${fortune}`, "line-purple", 18);
    addLine("", "line-output");
}

async function cmdWhoami() {
    addLine("", "line-outpu");
    await typeLine("    You're a curious visitor exploring my portofolio.", "line-cyan", 18);
    await typeLine("    Welcome! Type 'help' to see what you can do.", "line-output", 15);
    addLine("", "line-output");
}

async function cmdDate() {
    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    addLine("", "line-output");
    await typeLine(`    ${formatted}`, "line-cyan", 12);
    addLine("", "line-output");
}

async function cmdVim() {
    addLine("", "line-output");
    await typeLine("    Starting vim...", "line-dim", 20);
    await sleep(800);
    await typeLine("    Just kidding! No one knows how to exit vim anyway. :D", "line-yellow", 18);
    await typeLine("    (Hint: it's :q!)", "line-dim", 15);
    addLine("", "line-output");
}

async function cmdEcho(args) {
    if (args.length === 0) {
        addLine("", "line-output");
        return;
    }
    addLine("", "line-output");
    addLine(`   ${args.join(" ")}`, "line-output");
    addLine("", "line-output");
}

async function cmdExit() {
    addLine("", "line-ouput");
    await typeLine("    Nice try! But you can't excape a web portofolio. :>", "line-yellow", 18);
    await typeLine("    (You can close the tab though... but why would you?", "lin-dim", 15);
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
