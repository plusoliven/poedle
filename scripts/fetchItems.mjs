import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const divCardRewardColors = {
    'tc -gem': '#1ba29b',
    'tc -corrupted': '#d20000',
    'tc -rare': '#ffff77',
    'tc -magic': '#8888ff',
    'tc -white': '#c8c8c8',
    'tc -normal': '#c8c8c8',
    'tc -default': '#7f7f7f',
    'tc -enchanted': '#b8daf2',
    'tc -fractured': '#a29162',
    'tc -unique': '#af6025',
    'tc -currency': '#aa9e82',
    'tc -augmented': '#8888ff',
    'tc -divination': '#0ebaff'
}

const skipImgs = true;


class SeededRandom {
    constructor(seed = 123456789) {
        this.seed = seed
    }

    nextFloat() {
        return (this.seed = (this.seed * 16807 % 2147483647)) / 2147483647
    }
}

function seededShuffle(array, seed) {
    const rng = new SeededRandom(seed);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng.nextFloat() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const uniqueItemTypes = {
    // Unique
    flaskUnique: 'https://www.poewiki.net/wiki/List_of_unique_flasks',

    ringUnique: 'https://www.poewiki.net/wiki/List_of_unique_rings',
    beltUnique: 'https://www.poewiki.net/wiki/List_of_unique_belts',
    amuletUnique: 'https://www.poewiki.net/wiki/List_of_unique_amulets',

    bodyUnique: 'https://www.poewiki.net/wiki/List_of_unique_body_armours',
    bootsUnique: 'https://www.poewiki.net/wiki/List_of_unique_boots',
    glovesUnique: 'https://www.poewiki.net/wiki/List_of_unique_gloves',
    helmetUnique: 'https://www.poewiki.net/wiki/List_of_unique_helmets',

    shieldUnique: 'https://www.poewiki.net/wiki/List_of_unique_shields',
    swordUnique: 'https://www.poewiki.net/wiki/List_of_unique_swords',
    axeUnique: 'https://www.poewiki.net/wiki/List_of_unique_axes',
    bowUnique: 'https://www.poewiki.net/wiki/List_of_unique_bows',
    quiverUnique: 'https://www.poewiki.net/wiki/List_of_unique_quivers',
    clawUnique: 'https://www.poewiki.net/wiki/List_of_unique_claws',
    daggerUnique: 'https://www.poewiki.net/wiki/List_of_unique_daggers',
    fishingRodUnique: 'https://www.poewiki.net/wiki/List_of_unique_fishing_rods',
    maceUnique: 'https://www.poewiki.net/wiki/List_of_unique_maces',
    sceptreUnique: 'https://www.poewiki.net/wiki/List_of_unique_sceptres',
    staffUnique: 'https://www.poewiki.net/wiki/List_of_unique_staves',
    wandUnique: 'https://www.poewiki.net/wiki/List_of_unique_wands',

    jewelDropUnique: 'https://www.poewiki.net/wiki/List_of_unique_jewels_received_by_drop',
    jewelCorruptUnique: 'https://www.poewiki.net/wiki/List_of_unique_jewels_received_by_corruption',
    jewelVendorUnique: 'https://www.poewiki.net/wiki/List_of_unique_jewels_received_from_vendor_recipes',
    jewelAbyssUnique: 'https://www.poewiki.net/wiki/List_of_unique_abyss_jewels',
    jewelTimelessUnique: 'https://www.poewiki.net/wiki/List_of_unique_timeless_jewels',

    mapsUnique: 'https://www.poewiki.net/wiki/List_of_unique_maps'
}


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fetchImage = async (imgPath, savePath, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const imgResponse = await fetch(imgPath);
            imgResponse.body.pipe(fs.createWriteStream(savePath));
            return;
        } catch (error) {
            console.error(`Failed to fetch image at ${imgPath}, attempt ${i + 1}`);
            if (i === retries - 1) throw error;
        }
    }
}


const fetchItems = async (url, itemType) => {
    const response = await fetch(url);
    const $ = cheerio.load(await response.text());

    const items = [];

    const tables = $('table.wikitable.sortable.item-table').toArray();

    for (const table of tables) {
        const table$ = $(table);
        let statsIndex;

        table$.find('tbody tr th').each((index, th) => {
            if ($(th).text().includes('Stats')) {
                statsIndex = index;
            }
        });

        const rows = table$.find('tbody tr').toArray();
        for (const row of rows) {
            const row$ = $(row);

            const name = row$.find('span.c-item-hoverbox__activator a[title]').first().text().trim();
            if (name) {
                row$.find('td').eq(statsIndex).find('table').remove()

                // despair
                // console.log(splitModsStr.split('|'))
                // let splitModsStr = row$.find('td').eq(statsIndex).prop('innerText').replace(/([a-z\)%])([A-Z\+\(]|\d(?=[A-Z]))|(\d)(?=[A-Z])|(%)(?=[A-Za-z])/g, '$1$3$4|$2');

                const modElements = row$.find('td').eq(statsIndex).contents()

                const mods = []
                let modStr = '';

                for (let i = 0; i < modElements.length; i++) {
                    const modElement$ = $(modElements[i]);


                    // console.log(modElement$.text());

                    if (modElement$.is('table')) {
                        modElement$.remove();
                    }

                    modStr += modElement$.text();

                    if (modElement$.is('br') || i === modElements.length - 1) {
                        mods.push({ modStr });
                        modStr = '';
                    }
                }


                const imgPath = `https://www.poewiki.net${row$.find('span.c-item-hoverbox__activator a[title] img')?.attr('srcset')?.split(',').pop().trim().split(' ')[0]}`;

                let imageName = path.basename(new URL(imgPath).pathname);
                imageName = decodeURIComponent(imageName);
                imageName = imageName.replace(/[^\w-.]/g, '');
                const savePath = path.join(__dirname, 'images', itemType, imageName);

                if (!skipImgs) {
                    fs.mkdirSync(path.dirname(savePath), { recursive: true });
                    await fetchImage(imgPath, savePath);
                }

                const item = {
                    name,
                    imgPath: path.relative(__dirname, savePath),
                    mods,
                }

                console.log(item)

                if (!items.some((i) => i.name === item.name)) {
                    items.push(item);
                }

                console.log(`Fetched ${item.name}`)
                await new Promise(r => setTimeout(r, 100));
            }
        }
    }

    return items;
}

const fetchDivCards = async (url) => {
    const response = await fetch(url);
    const $ = cheerio.load(await response.text());

    const divCards = [];

    const tables = $('table.wikitable.sortable.item-table').toArray();

    for (const table of tables) {
        const table$ = $(table);
        let statsIndex;

        table$.find('tbody tr th').each((index, th) => {
            if ($(th).text().includes('Effect(s)')) {
                statsIndex = index;
            }
        });

        const rows = table$.find('tbody tr').toArray();
        for (const row of rows) {
            const row$ = $(row);

            const name = row$.find('span.c-item-hoverbox__activator a[title]').first().text().trim();
            if (name) {
                // despair
                // let splitModsStr = row$.find('td').eq(statsIndex).prop('innerText').replace(/([a-z\)%])([A-Z\+\(]|\d(?=[A-Z]))|(\d)(?=[A-Z])|(%)(?=[A-Za-z])/g, '$1$3$4|$2');


                const modElements = row$.find('td').eq(statsIndex).contents()

                const mods = []
                let modStr = '';
                let modColor = '';

                for (let i = 0; i < modElements.length; i++) {
                    const modElement$ = $(modElements[i]);

                    if (modElement$.is('table')) {
                        modElement$.remove();
                    }

                    modStr += modElement$.text();
                    if (Object.keys(divCardRewardColors).includes(modElement$.attr()?.class)) {
                        modColor = divCardRewardColors[modElement$.attr().class];
                    }

                    if (modElement$.is('br') || i === modElements.length - 1) {
                        mods.push({ modStr, modColor });
                        modStr = '';
                        modColor = '';
                    }
                }


                const href = `https://www.poewiki.net${row$.find('span.c-item-hoverbox__activator a[title]').first().prop('href')}`

                const divResponse = await fetch(href);
                const divPage$ = cheerio.load(await divResponse.text());

                const imgPath = `https://www.poewiki.net${divPage$('span.divicard-artlink:first a.image img').attr('src')}`;
                let imageName = path.basename(new URL(imgPath).pathname);
                imageName = decodeURIComponent(imageName);
                imageName = imageName.replace(/[^\w-.]/g, '');
                const savePath = path.join(__dirname, 'images', 'divCard', imageName);

                // lol
                const flavorText = name !== 'The Messenger' ? divPage$('span.divicard-flavour:first').html().replaceAll('<br>', '\n') : ''

                if (!skipImgs) {
                    fs.mkdirSync(path.dirname(savePath), { recursive: true });
                    await fetchImage(imgPath, savePath);
                }

                const card = {
                    name,
                    imgPath: path.relative(__dirname, savePath),
                    flavorText,
                    mods,
                }

                divCards.push(card);
                console.log(`Fetched ${card.name}`)
                console.log(card)
                await new Promise(r => setTimeout(r, 100));
            }
        }
    }

    return divCards;
}

const fetchAllItems = async () => {
    let dataFileContent = '// Auto-generated data\n';

    // div cards
    console.log(`\nFetching div cards\n`);
    const divCards = await fetchDivCards('https://www.poewiki.net/wiki/List_of_divination_cards');
    seededShuffle(divCards);
    dataFileContent += `export const ${'divCards'} = ${JSON.stringify(divCards, null, 4)};\n`;
    console.log(`\nFetched div cards\n`);

    await new Promise(r => setTimeout(r, 500));

    let uniques = [];
    for (const itemType of Object.keys(uniqueItemTypes)) {
        console.log(`\nFetching ${itemType}\n`);
        const items = await fetchItems(uniqueItemTypes[itemType], itemType);
        console.log(`\nFetched ${itemType}\n`);

        uniques.push(...items);

        await new Promise(r => setTimeout(r, 500));
    }
    seededShuffle(uniques);
    dataFileContent += `export const uniques = ${JSON.stringify(uniques, null, 4)}`
    fs.writeFileSync(path.join(__dirname, 'data.mjs'), dataFileContent);
}

await fetchAllItems()
