const body = {
  mode: "scooter",
  type: "balanced",
  traffic: "free_flow",
  agents: [
    {
      start_location: [79.434018, 28.3769694],
      capabilities: [],
      time_windows: [],
      breaks: [],
    },
  ],
  jobs: [],
  shipments: [
    {
      id: "pizza_1",
      pickup: {
        location_index: 0,
        duration: 30,
        time_windows: [],
      },
      delivery: {
        location: [79.45667792826062, 28.3888721],
        duration: 120,
        time_windows: [[0, 3600]],
      },
      requirements: [],
      priority: 50,
    },
  ],
  locations: [
    {
      location: [79.434018, 28.3769694],
      id: "storage-0",
    },
  ],
  avoid: [],
};

const routePlanner = async () => {
  const route = await fetch(
    "https://api.geoapify.com/v1/routeplanner?apiKey=3f35d088cf9a4659b2550b1644053fe4",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const res = await route.json();
  return res;
};
