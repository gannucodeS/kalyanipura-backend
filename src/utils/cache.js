class Cache {
  constructor() {
    this.store = new Map();
    this.defaultTTL = 5 * 60 * 1000;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value, ttl = this.defaultTTL) {
    this.store.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  del(key) {
    this.store.delete(key);
  }

  flush() {
    this.store.clear();
  }

  delByPattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }
}

module.exports = new Cache();
