const startDate = new Date(Date.UTC(2023, 4, 29));

export const getDayDiff = () => {
    let today = new Date();
    let utcToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

    return Math.floor((utcToday - startDate) / (1000 * 60 * 60 * 24));
}

export const getItemForToday = (array) => {
    let index = getDayDiff() % array.length;

    return array[index];
}

export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const sortArrayAlphabetically = (array) => {
    const sortedArray = [...array];
    return sortedArray.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())).map((item) => item.name)

}

export const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);

    const diff = tomorrow - now;

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor(diff / 1000 / 60) % 60;

    return `${hours} hours, ${minutes} minutes`;
}