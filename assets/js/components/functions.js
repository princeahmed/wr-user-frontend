export function getFavorites() {
    let favorites = localStorage.getItem('favorite_stations');
    if (!favorites) return [];

    favorites = JSON.parse(favorites);
    if (!Array.isArray(favorites)) return [];

    return favorites;
}