class User {
  static authUrl = User.resolveAuthUrl();
  static cacheKey = "auth_user_cache_v1"
  static tokenKey = "auth_access_token_v1"
  static syncIntervalMs = 15000
  static syncTimer = null
  static syncInFlight = false
  static syncQueued = false
  static noAccountWarningShown = false

  static resolveAuthUrl() {
    const configured =
      (typeof window !== "undefined" && window.AUTH_URL) ||
      "https://auth-bhoppings.vercel.app"

    return String(configured).replace(/\/+$/, "") + "/"
  }

  static init() {
    this.consumeAuthCodeFromUrl()
      .catch((error) => console.error("Auth code exchange failed:", error))
      .finally(() => {
        this.startBackgroundSync()
        window.addEventListener("online", () => this.queueBackgroundSync())
        document.addEventListener("visibilitychange", () => {
          if (!document.hidden) this.queueBackgroundSync()
        })
      })
  }

  static getCurrentPageUrl() {
    return window.location.href
  }

  static getCache() {
    const raw = localStorage.getItem(this.cacheKey)
    if (!raw) {
      return { updatedAt: null, dirty: false, data: {} }
    }

    try {
      const parsed = JSON.parse(raw)
      return {
        updatedAt: parsed?.updatedAt || null,
        dirty: Boolean(parsed?.dirty),
        data: parsed?.data && typeof parsed.data === "object" ? parsed.data : {},
      }
    } catch {
      return { updatedAt: null, dirty: false, data: {} }
    }
  }

  static clearCache() {
    localStorage.removeItem(this.cacheKey)
  }

  static getAccessToken() {
    return String(localStorage.getItem(this.tokenKey) || "")
  }

  static setAccessToken(token) {
    if (!token) return
    localStorage.setItem(this.tokenKey, String(token))
  }

  static clearAccessToken() {
    localStorage.removeItem(this.tokenKey)
  }

  static setCache(nextData, nextUpdatedAt = new Date().toISOString(), dirty = false) {
    localStorage.setItem(
      this.cacheKey,
      JSON.stringify({
        updatedAt: nextUpdatedAt,
        dirty,
        data: this.serializeRecord(nextData),
      })
    )
  }

  static getData(keys = null) {
    const cache = this.getCache()

    if (typeof keys === "string") {
      const key = keys.trim()
      if (!key) return undefined
      return this.deserializeValue(cache.data[key])
    }

    if (Array.isArray(keys)) {
      const picked = {}
      for (const rawKey of keys) {
        const key = String(rawKey || "").trim()
        if (!key) continue
        picked[key] = this.deserializeValue(cache.data[key])
      }
      return picked
    }

    if (keys === null || keys === undefined) {
      return this.deserializeRecord(cache.data)
    }

    return this.deserializeRecord(cache.data)
  }

  static setData(keyOrData, value) {
    const newData = this.normalizeSetInput(keyOrData, value)
    if (!newData) return

    const cache = this.getCache()
    const merged = { ...cache.data, ...this.serializeRecord(newData) }
    const now = new Date().toISOString()
    this.setCache(merged, now, true)
    this.queueBackgroundSync()
  }

  static async setDataAsync(keyOrData, value) {
    this.setData(keyOrData, value)
    const auth = await this.getAuthStatus()
    if (auth.reachable && !auth.signedIn) return
    if (auth.signedIn) {
      await this.syncNow()
    }
  }

  static normalizeSetInput(keyOrData, value) {
    if (
      keyOrData &&
      typeof keyOrData === "object" &&
      !Array.isArray(keyOrData)
    ) {
      return keyOrData
    }

    if (typeof keyOrData === "string" && keyOrData.trim()) {
      return { [keyOrData]: value }
    }

    return null
  }

  static async getDataAsync(keys = null) {
    const auth = await this.getAuthStatus()
    if (auth.reachable && !auth.signedIn) return this.getData(keys)
    if (auth.signedIn) {
      await this.syncNow()
    }
    return this.getData(keys)
  }

  static async isLoggedIn() {
    const auth = await this.getAuthStatus()
    return auth.signedIn
  }

  static async getAuthStatus() {
    try {
      const res = await this.authFetch("api/auth/status", {
        method: "GET",
      })
      const data = await res.json()
      if (!res.ok) {
        return { reachable: true, signedIn: false }
      }
      const signedIn = Boolean(data?.signedIn)
      if (!signedIn) {
        this.clearAccessToken()
        this.warnNoAccountMode()
      } else {
        this.noAccountWarningShown = false
      }
      return { reachable: true, signedIn }
    } catch {
      return { reachable: false, signedIn: false }
    }
  }

  static async getUserAsync() {
    return this.getDataAsync(["email", "display_name", "avatar_url"])
  }

  static logout() {
    this.clearAccessToken()
    this.clearCache()
    const callbackUrl = encodeURIComponent(this.getCurrentPageUrl())
    window.open(this.authUrl + "logout?callbackUrl=" + callbackUrl, "_self")
  }

  static login(newTab = false) {
    const completeUrl = new URL(this.authUrl + "sso/complete")
    completeUrl.searchParams.set("returnTo", this.getCurrentPageUrl())
    const callbackUrl = encodeURIComponent(completeUrl.toString())
    window.open(this.authUrl + "login?callbackUrl=" + callbackUrl, newTab ? "_blank" : "_self")
  }

  static async syncNow() {
    if (this.syncInFlight) {
      this.syncQueued = true
      return
    }

    this.syncInFlight = true
    const auth = await this.getAuthStatus()
    try {
      if (auth.reachable && !auth.signedIn) return
      if (!auth.signedIn) return

      const localCache = this.getCache()
      const remote = await this.fetchRemoteUser()
      const remoteUpdatedAt = remote?.updated_at || null
      const localUpdatedAt = localCache.updatedAt || null

      if (localCache.dirty) {
        await this.pushToRemote(localCache.data)
        return
      }

      if (!remote || !remoteUpdatedAt || (localUpdatedAt && localUpdatedAt > remoteUpdatedAt)) {
        if (Object.keys(localCache.data).length) {
          await this.pushToRemote(localCache.data)
        }
        return
      }

      const nextData = { ...remote }
      delete nextData.id
      this.setCache(nextData, remoteUpdatedAt, false)
    } finally {
      this.syncInFlight = false
      if (this.syncQueued) {
        this.syncQueued = false
        setTimeout(() => this.syncNow(), 0)
      }
    }
  }

  static warnNoAccountMode() {
    if (this.noAccountWarningShown) return
    this.noAccountWarningShown = true
    console.warn("No account detected. User data is being saved to localStorage only until you sign in.")
  }

  static async fetchRemoteUser() {
    const res = await this.authFetch("api/user/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    const payload = await res.json()
    if (res.status === 401) {
      this.clearAccessToken()
    }
    if (!res.ok) {
      throw new Error(payload?.error || "Failed to fetch user data")
    }
    const row = payload?.row || null
    if (!row) return null
    const PROTECTED = ["provider", "provider_account_id", "last_sign_in_at", "created_at", "updated_at"]
    for (const field of PROTECTED) delete row[field]
    return row
  }

  static async pushToRemote(data) {
    const payloadData = this.serializeRecord(data)
    const res = await this.authFetch("api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadData),
    })
    const payload = await res.json()
    if (res.status === 401) {
      this.clearAccessToken()
    }
    if (!res.ok) {
      throw new Error(payload?.error || "Failed to update user data")
    }

    const row = payload?.row || {}
    const updatedAt = row.updated_at || new Date().toISOString()
    const nextData = { ...row }
    delete nextData.id
    this.setCache(nextData, updatedAt, false)
  }

  static async consumeAuthCodeFromUrl() {
    const url = new URL(window.location.href)
    const code = url.searchParams.get("auth_code")
    if (!code) return

    
    
    
    url.searchParams.delete("auth_code")
    window.history.replaceState({}, "", url.toString())

    const res = await fetch(this.authUrl + "api/auth/exchange-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    const payload = await res.json()
    if (!res.ok || !payload?.accessToken) {
      throw new Error(payload?.error || "Failed to exchange auth code")
    }

    this.setAccessToken(payload.accessToken)
  }

  static authFetch(path, init = {}) {
    const token = this.getAccessToken()
    const headers = new Headers(init.headers || {})
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    return fetch(this.authUrl + path, {
      ...init,
      headers,
      credentials: "include",
    })
  }

  static serializeRecord(record) {
    if (!record || typeof record !== "object" || Array.isArray(record)) return {}
    const out = {}
    for (const [key, value] of Object.entries(record)) {
      out[key] = this.serializeValue(value)
    }
    return out
  }

  static deserializeRecord(record) {
    if (!record || typeof record !== "object" || Array.isArray(record)) return {}
    const out = {}
    for (const [key, value] of Object.entries(record)) {
      out[key] = this.deserializeValue(value)
    }
    return out
  }

  static serializeValue(value) {
    if (value === undefined) return null
    if (value !== null && typeof value === "object") {
      try {
        return JSON.stringify(value)
      } catch {
        return String(value)
      }
    }
    return value
  }

  static deserializeValue(value) {
    if (typeof value !== "string") return value
    const text = value.trim()
    if (!text) return value
    try {
      return JSON.parse(text)
    } catch {
      return value
    }
  }

  static startBackgroundSync() {
    if (this.syncTimer) clearInterval(this.syncTimer)
    this.syncTimer = setInterval(() => {
      this.syncNow().catch((error) => {
        console.error("Background sync failed:", error)
      })
    }, this.syncIntervalMs)
    this.queueBackgroundSync()
  }

  static async queueBackgroundSync() {
    try {
      await this.syncNow()
    } catch (error) {
      console.error("Sync failed:", error)
    }
  }
}

User.init()