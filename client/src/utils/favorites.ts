const FAVORITES_STORAGE_KEY = 'eventfinder:favorites';

const parseFavorites = (raw: string | null): string[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
};

export const getFavoriteVenueIds = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  return parseFavorites(window.localStorage.getItem(FAVORITES_STORAGE_KEY));
};

const saveFavoriteVenueIds = (ids: string[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
};

export const isFavoriteVenue = (venueId: string): boolean => {
  return getFavoriteVenueIds().includes(venueId);
};

export const addFavoriteVenue = (venueId: string): string[] => {
  const ids = getFavoriteVenueIds();
  if (ids.includes(venueId)) {
    return ids;
  }

  const nextIds = [...ids, venueId];
  saveFavoriteVenueIds(nextIds);
  return nextIds;
};

export const removeFavoriteVenue = (venueId: string): string[] => {
  const nextIds = getFavoriteVenueIds().filter((id) => id !== venueId);
  saveFavoriteVenueIds(nextIds);
  return nextIds;
};
