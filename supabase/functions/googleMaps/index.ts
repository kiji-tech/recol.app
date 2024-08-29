//@ts-ignore
import { Hono } from "jsr:@hono/hono";
const app = new Hono().basePath("/googleMaps");

const GOOGLE_MAPS_API_URL = "https://places.googleapis.com/v1/places";

async function searchNearby(c: Hono.Context) {
  const { latitude, longitude } = await c.req.json();
  console.log({ latitude, longitude });
  let response = await fetch(`${GOOGLE_MAPS_API_URL}:searchNearby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // @ts-ignore
      "X-Goog-Api-Key": Deno.env.get("GOOGLE_MAPS_API_KEY"),
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
  return c.json({ places: response.places });
}

app.post("/searchNearby", searchNearby);

//@ts-ignore
Deno.serve(app.fetch);
