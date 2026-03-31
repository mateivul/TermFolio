const DATA = {
    name: "Matei Vultur",
    username: "visitor",
    hostname: "portofolio",

    banner: `
  __  __       _       _  __     __     _ _              
 |  \\/  | __ _| |_ ___(_) \\ \\   / /   _| | |_ _   _ _ __ 
 | |\\/| |/ _\` | __/ _ \\ |  \\ \\ / / | | | | __| | | | '__|
 | |  | | (_| | ||  __/ |   \\ V /| |_| | | |_| |_| | |   
 |_|  |_|\\__,_|\\__\\___|_|    \\_/  \\__,_|_|\\__|\\__,_|_|  
`,

    welcome: ["Welcome to my terminal portofolio!", "Type 'help' to see available commands.", ""],

    about: [
        "Hi! I'm Matei Vultur",
        "",
        "I'm a high school student and a developer who loves building things",
        "with code. I'm interested in web dev, physics",
        "simulations, taycoon games and creative coding projects.",
        "",
        "Currently exploring: React, Python(Manim), Canvas animations.",
        "Fun fact: I believe true complexity lies in simplicity!",
    ],

    projects: [
        {
            name: "TermFolio",
            emoji: "💻",
            description: "Terminal-style protofolio website, the one you're using right now!",
            tech: ["Vanilla JS", "HTML", "CSS"],
            url: "https://github.com/mateivul/TermFolio",
        },
        {
            name: "FourierOrpheus",
            emoji: "🦕",
            description: "Drawing the Hack Club logo with 80 rotating circles using Manim!",
            tech: ["Python", "Manim", "Fourier Transform"],
            url: "https://github.com/mateivul/FourierOrpheus",
        },
        {
            name: "TickDown",
            emoji: "⏱️",
            description: "Countdown timer with animated digits, shareable via URL!",
            tech: ["React", "Vite", "TailWind CSS"],
            url: "https://github.com/mateivul/TickDown",
        },
        {
            name: "PhysicsPlayground",
            emoji: "⚽",
            description: "Simple physics simulation of gravity and elasticity!",
            tech: ["JavaScript", "Vite", "HTML", "CSS"],
            url: "https://github.com/mateivul/PhysicsPlayground",
        },
        {
            name: "ROG-cosmos",
            emoji: "🌌",
            description: "A game for Republic Of Gamers 2026!",
            tech: ["Game Developement"],
            url: "https://github.com/mateivul/ROG-cosmos",
        },
    ],

    skills: {
        languages: [
            { name: "C++", stars: 4 },
            { name: "JavaScript", stars: 4 },
            { name: "HTML/CSS", stars: 4 },
            { name: "PHP", stars: 4 },
            { name: "SQL", stars: 2 },
        ],
        frameworks: [
            { name: "React", stars: 3 },
            { name: "Tailwind CSS", stars: 4 },
            { name: "Vite", stars: 4 },
            { name: "Express", stars: 3 },
        ],
        tools: [
            { name: "Git", stars: 4 },
            { name: "VS Code", stars: 5 }, //top editor
            { name: "Manim", stars: 3 },
            { name: "Canvas API", stars: 2 },
            { name: "FFmpeg", stars: 2 },
        ],
        learning: [
            { name: "Node.js", stars: 2 },
            { name: "TypeScript", stars: 3 },
            { name: "Three.js", stars: 2 },
        ],
    },

    contact: {
        email: "mateivultur08@gmail.com",
        location: "Romania",
    },

    socials: {
        github: "https://github.com/mateivul",
        instagram: "https://www.instagram.com/matei.vul",
    },

    // coding dad jokes :))
    fortunes: [
        "The best way to predict the future is to build it.",
        "Code is like humor. When you have to explain it, it's bad...",
        "First, solve the problem. Then, write the code.",
        "It works on my machine. ¯\\_(ツ)_/¯",
        "There are only 10 types of people: those who understand binary and those who don't.",
        "Try again...",
    ],

    cowsayDefault: "Moo! Check out my projects!",
};
