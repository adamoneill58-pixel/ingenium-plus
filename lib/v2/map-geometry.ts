import type { Entity } from "../data";

export const campusCoordinates: Record<string, [number, number]> = {
  "university-uniovi": [-5.8494, 43.3614],
  "university-mus": [23.3117, 42.6838],
  "university-uoc": [24.4772, 35.3545],
  "university-hka": [8.3901, 49.0158],
  "university-xamk": [27.2727, 61.6884],
  "university-uda": [14.1492, 42.3699],
  "university-hs": [13.853, 58.3912],
  "university-mtu": [-8.5353, 51.8856],
  "university-urn": [1.0684, 49.4607],
  "university-tuiasi": [27.5993, 47.1544],
};

export function recordCampusIds(record: Entity) {
  return [...new Set([...record.universityIds, ...(record.hostUniversityId ? [record.hostUniversityId] : [])])]
    .filter((id) => Boolean(campusCoordinates[id]));
}

export function recordCoordinate(record: Entity, campusId: string): [number, number] | undefined {
  const anchor = campusCoordinates[campusId];
  if (!anchor || !recordCampusIds(record).includes(campusId)) return undefined;
  let hash = 2166136261;
  for (const character of record.id) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const value = hash >>> 0;
  const angle = ((value % 360) * Math.PI) / 180;
  const ring = 0.12 + ((value >>> 9) % 12) * 0.05;
  return [anchor[0] + Math.cos(angle) * ring, anchor[1] + Math.sin(angle) * ring * 0.72];
}

export function worldPoint([longitude, latitude]: [number, number], zoom: number): [number, number] {
  const size = 256 * 2 ** zoom;
  const radians = (Math.min(85.0511, Math.max(-85.0511, latitude)) * Math.PI) / 180;
  return [((longitude + 180) / 360) * size, ((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2) * size];
}

export function longitudeLatitude([x, y]: [number, number], zoom: number): [number, number] {
  const size = 256 * 2 ** zoom;
  return [Math.min(179, Math.max(-179, (x / size) * 360 - 180)), Math.min(80, Math.max(-80, (180 / Math.PI) * Math.atan(Math.sinh(Math.PI - (2 * Math.PI * y) / size))))];
}

export type PositionedRecord = {record: Entity; campusId: string; coordinate: [number, number]; point: {left: number; top: number}};
export function clusterPositions(items: PositionedRecord[], zoom: number) {
  const cells = new Map<string, PositionedRecord[]>();
  const cellSize = zoom >= 9 ? 24 : 44;
  for (const item of items) {
    const key = `${Math.floor(item.point.left / cellSize)}:${Math.floor(item.point.top / cellSize)}`;
    const cell = cells.get(key) ?? [];
    cell.push(item);
    cells.set(key, cell);
  }
  return [...cells.entries()].map(([key, members]) => ({
    key,
    members,
    point: {left: members.reduce((sum, item) => sum + item.point.left, 0) / members.length, top: members.reduce((sum, item) => sum + item.point.top, 0) / members.length},
  }));
}
