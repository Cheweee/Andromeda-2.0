export const capitalize = function (source: string): string {
    return source.charAt(0).toUpperCase() + source.slice(1)
}

export const getShortening = function (source: string): string {
    let shortening: string = '';

    const words = source.split(' ');
    for (const word of words) {
        if (word.length === 1)
            shortening += word.charAt(0);
        else
            shortening += word.toUpperCase().charAt(0);
    }

    return shortening;
}