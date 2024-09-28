import { apiBaseUrl } from "../configs/var";
export const fetchUsers = async (region, errors, seed, page) => {
  const response = await fetch(
    `${apiBaseUrl}/api/users?region=${region}&errors=${errors}&seed=${seed}&page=${page}`
  );
  return await handleResponse(response, []);
};

export const fetchRandomSeed = async () => {
  const response = await fetch(`${apiBaseUrl}/api/users/generate-seed`);
  const defaultRandomSeed = Math.floor(1000 + Math.random() * 9000);
  return await handleResponse(response, { seed: defaultRandomSeed });
};
export const fetchRegions = async () => {
  const response = await fetch(`${apiBaseUrl}/api/regions-locales`);
  return await handleResponse(response, { regions: [] });
};

async function handleResponse(response, fallbackData) {
  if (!response) {
    return fallbackData;
  }
  if (!response.ok) {
    return fallbackData;
  }
  return await response.json();
}
