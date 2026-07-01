const crypto = require('crypto');

class SessionStore {
  constructor() {
    this.sessions = new Map();
    setInterval(() => this._cleanup(), 60 * 60 * 1000);
  }

  create(data) {
    const id = crypto.randomBytes(32).toString('hex');
    this.sessions.set(id, { data, createdAt: Date.now() });
    return id;
  }

  get(id) {
    const session = this.sessions.get(id);
    if (!session) return null;
    if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
      this.sessions.delete(id);
      return null;
    }
    return session.data;
  }

  destroy(id) {
    this.sessions.delete(id);
  }

  _cleanup() {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now - session.createdAt > 24 * 60 * 60 * 1000) {
        this.sessions.delete(id);
      }
    }
  }
}

module.exports = new SessionStore();
