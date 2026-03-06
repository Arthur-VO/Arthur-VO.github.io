import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { fileURLToPath } from 'url';

// Setup paden
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../src/content');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Helpers
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const today = new Date().toISOString().split('T')[0];

console.log('\n=============================================');
console.log('  [ SYS://CONTENT_GENERATOR_INITIALIZED ]  ');
console.log('=============================================\n');

async function ask(question) {
    const answer = await rl.question(`\x1b[36m> ${question}:\x1b[0m `); // \x1b[36m maakt de tekst Ice Blue!
    return answer.trim();
}

async function main() {
    console.log('Select module to scaffold:');
    console.log('  1. PROJECT  (Git Branch Map)');
    console.log('  2. BLOG     (Knowledge Graph Node)');
    console.log('  3. SIGNAL   (Beehiiv Archive)\n');

    const choice = await ask('Enter 1, 2, or 3');

    try {
        if (choice === '1') await createProject();
        else if (choice === '2') await createBlog();
        else if (choice === '3') await createSignal();
        else console.log('\n[ ERROR ] Invalid selection. Aborting.');
    } catch (err) {
        console.error('\n[ ERROR ] Failed to create file:', err.message);
    }

    rl.close();
}

async function createProject() {
    const title = await ask('Project Title');
    const topic = await ask('Topic (e.g., Security, AI, Networking)');
    const status = await ask('Status (active / completed / archived)');
    const url = await ask('Repository URL');
    const human = await ask('Tagline (Human / Business value)');
    const tech = await ask('Tagline (Tech / Stack details)');

    const content = `---
title: "${title}"
status: ${status || 'active'}
topic: ${topic || 'Uncategorized'}
startDate: ${today}
tagline_human: "${human}"
tagline_tech: "${tech}"
url: ${url}
---

Write your full project documentation here...
`;
    writeFile('projects', title, content);
}

async function createBlog() {
    const title = await ask('Post Title');
    const category = await ask('Category');
    const tagsInput = await ask('Tags (comma separated, e.g., AI, Fintech, Hardware)');
    const human = await ask('Description (Human)');
    const tech = await ask('Description (Tech)');

    const tagsArray = tagsInput.split(',').map(t => `"${t.trim()}"`).join(', ');

    const content = `---
title: "${title}"
pubDate: ${today}
category: "${category}"
description_human: "${human}"
description_tech: "${tech}"
tags: [${tagsArray}]
---

Start writing your knowledge node here...
`;
    writeFile('blog', title, content);
}

async function createSignal() {
    const issue = await ask('Issue Number (e.g., 2)');
    const title = await ask('Signal Title');
    const link = await ask('Beehiiv URL');

    const content = `---
issue_number: ${issue}
title: "${title}"
link: "${link}"
---

Write a short TL;DR or context note here...
`;
    // Voor signal zetten we het issue nummer in de bestandsnaam voor makkelijk sorteren
    const filename = `${String(issue).padStart(3, '0')}-${slugify(title)}`;
    writeFile('signal', filename, content, true);
}

function writeFile(folder, titleOrSlug, content, isAlreadySlug = false) {
    const slug = isAlreadySlug ? titleOrSlug : slugify(titleOrSlug);
    const dir = path.join(CONTENT_DIR, folder);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `${slug}.md`);
    fs.writeFileSync(filePath, content);

    console.log(`\n\x1b[32m[ SUCCESS ] File created at: src/content/${folder}/${slug}.md\x1b[0m\n`);
}

main();