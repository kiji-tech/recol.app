export type DirectionMode = 'walking' | 'driving' | 'transit' | 'bicycling';
export interface Direction {
  geocoded_waypoints: Waypoint[];
  routes: Route[];
  status: string;
}

export interface Waypoint {
  geocoder_status: string;
  place_id: string;
  types: string[];
}

export interface Route {
  bounds: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
  copyrights: string;
  legs: Leg[];
  overview_polyline: {
    points: string;
  };
  summary: string;
  warnings: string[];
  waypoint_order: number[];
}

export interface Leg {
  distance: {
    text: string;
    value: string;
  };
  duration: {
    text: string;
    value: string;
  };
  end_address: string;
  end_location: {
    lat: number;
    lng: number;
  };
  start_address: string;
  start_location: {
    lat: number;
    lng: number;
  };
  steps: Step[];
  traffic_speed_entry: string[];
  via_waypoint: string[];
  travel_mode: string;
}

export interface Step {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  end_location: {
    lat: number;
    lng: number;
  };
  html_instructions: string;
  polyline: {
    points: string;
  };
  start_location: {
    lat: number;
    lng: number;
  };
  travel_mode: string;
}
