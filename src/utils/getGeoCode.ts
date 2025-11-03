interface getGeoCodeProps {
  address: string;
}
export async function getGeoCode({ address }: getGeoCodeProps) {
  const encodedAddress = encodeURIComponent(address);
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&format=json&apiKey=3f35d088cf9a4659b2550b1644053fe4
`
  );
  const data = await response.json();

  if (data.length === 0) {
    return "We couldn't find that address!";
  }

  const first = data.results[0];

  return {
    lat: first.lat,
    lon: first.lon,
  };
}
