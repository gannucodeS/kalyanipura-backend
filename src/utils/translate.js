const { translate: googleTranslate } = require('@vitalets/google-translate-api');

const cache = new Map();

const TRANSLATABLE_FIELDS = {
  Event: ['title', 'time', 'location', 'description'],
  Ministry: ['title', 'description', 'tagline', 'detailedDescription', 'meetingTimes', 'volunteerNeeds'],
  GalleryItem: ['description', 'category'],
  ServiceTime: ['title', 'time', 'tagline', 'category'],
  PrayerRequest: ['request'],
};

function getHiFieldName(field) {
  return field + 'Hi';
}

async function translateText(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return '';
  const key = text.trim();
  if (cache.has(key)) return cache.get(key);
  try {
    const result = await googleTranslate(key, { to: 'hi' });
    cache.set(key, result.text);
    if (cache.size > 1000) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    return result.text;
  } catch {
    return '';
  }
}

async function autoTranslate(doc, modelName) {
  const fields = TRANSLATABLE_FIELDS[modelName];
  if (!fields) return doc;

  const updates = {};
  const tasks = [];

  for (const field of fields) {
    if (doc[field] && typeof doc[field] === 'string' && !doc[getHiFieldName(field)]) {
      tasks.push(
        translateText(doc[field]).then(translated => {
          if (translated) updates[getHiFieldName(field)] = translated;
        })
      );
    }
  }

  if (tasks.length === 0) return doc;
  await Promise.all(tasks);
  if (Object.keys(updates).length > 0) {
    Object.assign(doc, updates);
    await doc.save();
  }
  return doc;
}

module.exports = { translateText, autoTranslate, TRANSLATABLE_FIELDS };
