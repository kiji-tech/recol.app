import ENV from "@/env";
interface GoogleMapApiRequest {
  body: {
    latitude: number;
    longitude: number;
  };
}

export async function POST(req: Request) {
  console.log("handler post");
  const { latitude, longitude } = await req.json();
  const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": ENV.GOOGLE_MAP_API_KEY,
      "X-Goog-FieldMask": "*",
    },
    body: JSON.stringify({
      maxResultCount: 20,
      languageCode: "ja",
      includedTypes: ["cafe", "hostel", "hotel"],
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
  console.log(response);
  return Response.json({ places: response.places }, { status: 200 });
}
