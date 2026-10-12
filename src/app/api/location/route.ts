// The public provider permits at most one lookup per second per application.
let nextLookupAt = 0;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const lat = Number(params.get('lat'));
  const lon = Number(params.get('lon'));
  if (!params.get('lat') || !params.get('lon') || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return Response.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  if (Date.now() < nextLookupAt) {
    return Response.json({ error: 'Please try again shortly' }, { status: 429 });
  }
  nextLookupAt = Date.now() + 1000;

  const endpoint = new URL(process.env.REVERSE_GEOCODING_URL || 'https://nominatim.openstreetmap.org/reverse');
  // Area-level precision is sufficient for the label.
  endpoint.search = new URLSearchParams({ lat: lat.toFixed(3), lon: lon.toFixed(3), format: 'jsonv2', zoom: '16', addressdetails: '1', 'accept-language': 'en' }).toString();

  try {
    const response = await fetch(endpoint, {
      headers: { 'User-Agent': 'Olato/0.1 (nearby deals location lookup)' },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Location lookup unavailable');
    const data = await response.json() as { address?: Record<string, string> };
    const address = data.address;
    if (!address) throw new Error('Location not found');
    const city = address.city || address.town || address.village || address.municipality || '';
    const area = address.neighbourhood || address.quarter || address.suburb || address.city_district || city || address.county || address.state;
    if (!area) throw new Error('Location not found');
    return Response.json({ name: area, area, city }, { headers: { 'Cache-Control': 'private, max-age=86400' } });
  } catch {
    return Response.json({ error: 'Location name unavailable' }, { status: 502 });
  }
}
