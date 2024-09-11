const GOOGLE_MAPS_API_URL = "https://places.googleapis.com/v1/places";

async function searchNearby(latitude: number, longitude: number) {
  console.log({ latitude, longitude });
  const response = await fetch(`${GOOGLE_MAPS_API_URL}:searchNearby`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      "X-Goog-FieldMask": "*",
    }),
    body: JSON.stringify({
      maxResultCount: 20,
      languageCode: "ja",
      includedTypes: ["cafe"],
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: 3000,
        },
      },
    }),
  })
    .then((response) => response.json())
    .catch((e) => console.log(e));
  return response.places;
}

async function searchText(latitude: number, longitude: number, text: string) {
  console.log({ latitude, longitude });
  const response = await fetch(`${GOOGLE_MAPS_API_URL}:searchText`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      "X-Goog-FieldMask": "*",
    }),
    body: JSON.stringify({
      textQuery: text,
      maxResultCount: 5,
      languageCode: "ja",
      locationBias: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: 3000,
        },
      },
    }),
  })
    .then((response) => response.json())
    .catch((e) => console.log(JSON.stringify(e)));
  return response.places;
}

export { searchNearby, searchText };
