export default function transform(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      obj[key] = { create: transform(obj[key]) };
    }
  }
  return obj;
}
