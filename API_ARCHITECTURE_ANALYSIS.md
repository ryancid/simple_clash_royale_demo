# Clash Royale API Architecture Analysis

## Current Setup

### Architecture
```
Client → Next.js API Route → RoyaleAPI Proxy (45.79.218.79) → Clash Royale API
```

### Implementation
- **Proxy Service**: `https://proxy.royaleapi.dev/v1`
- **API Key**: Stored in `.env.local`, tied to IP `45.79.218.79`
- **Server Config**: `src/server/server.config.ts` uses axios instance with Authorization header
- **API Routes**: `/api/cards` and `/api/player/[id]` make server-side calls only

## The Problem

### Clash Royale API Restrictions
1. **IP Whitelisting Required**: API keys are bound to specific IP addresses (max 10 IPs per account)
2. **Serverless Challenge**: Vercel (and similar platforms) use dynamic IP ranges for serverless functions
3. **Proxy Limitations**:
   - Using a shared public proxy (RoyaleAPI) means shared rate limits
   - Single point of failure
   - No control over uptime/availability

## Solution Analysis

### Option 1: Continue Using RoyaleAPI Proxy ⭐ (Current - RECOMMENDED for Free Tier)

**Pros:**
- ✅ Free and already working
- ✅ No additional infrastructure needed
- ✅ Zero configuration changes required
- ✅ API key stays secure on server-side
- ✅ Simple architecture

**Cons:**
- ❌ Shared rate limits with other developers
- ❌ No SLA or uptime guarantees
- ❌ Dependent on third-party service
- ❌ Potential deprecation risk

**Best For:** Demo projects, prototypes, low-traffic applications

**Current Status:** Working correctly as implemented

---

### Option 2: Vercel Static IPs Add-on

**Setup:**
```
Client → Next.js API Route (Vercel Static IP) → Clash Royale API
```

**Pros:**
- ✅ Direct API access (no proxy needed)
- ✅ Full control over rate limits
- ✅ Better performance (one less hop)
- ✅ Official Vercel support

**Cons:**
- ❌ Requires Vercel Pro plan (~$20/month per user)
- ❌ Additional cost for Static IPs add-on
- ❌ Overkill for a demo project
- ❌ Shared IPs (not fully dedicated)

**Best For:** Production applications with budget, enterprise projects

**Implementation Effort:** Medium (requires Vercel plan upgrade + configuration)

---

### Option 3: Self-Hosted Proxy on VPS/Cloud

**Architecture:**
```
Client → Next.js API Route → Your Proxy (Static IP) → Clash Royale API
```

**Options:**
- Use [royale-proxy-api](https://github.com/AndreVarandas/royale-proxy-api) on a VPS
- Deploy simple proxy on DigitalOcean ($6/month), AWS EC2, or Google Cloud

**Pros:**
- ✅ Full control over proxy
- ✅ Dedicated rate limits
- ✅ Can customize caching/logging
- ✅ Cheaper than Vercel Static IPs for single project

**Cons:**
- ❌ Requires VPS management
- ❌ Additional infrastructure to maintain
- ❌ Security responsibility (SSL, updates, etc.)
- ❌ Monthly costs (~$5-10/month)

**Best For:** Multiple projects needing Clash Royale API, learning DevOps

**Implementation Effort:** High (requires VPS setup, deployment, monitoring)

---

### Option 4: Automated Key Generation (get-sc-key)

**URL:** `https://get-sc-key.vercel.app`

**How it works:**
- Automatically logs into Supercell developer portal with your credentials
- Checks if a key exists for your current IP
- Deletes oldest key and generates new one if needed

**Pros:**
- ✅ No proxy needed
- ✅ Automatically handles dynamic IPs

**Cons:**
- ❌ **SECURITY RISK**: Sends credentials to third-party service
- ❌ Destructive (auto-deletes old keys)
- ❌ Not suitable for production
- ❌ No uptime guarantees
- ❌ Still needs static IP for Vercel deployment

**Best For:** Local development only

**Recommendation:** ⚠️ **DO NOT USE for production**

---

### Option 5: Hybrid Approach - Caching Layer

**Architecture:**
```
Client → Next.js API Route → Cache (Redis/Vercel KV) → RoyaleAPI Proxy → Clash Royale API
```

**Implementation:**
```typescript
// Pseudo-code
async function getCards() {
  const cached = await cache.get('cards');
  if (cached && !isExpired(cached)) return cached;

  const fresh = await serverInstance.get('/cards');
  await cache.set('cards', fresh, TTL);
  return fresh;
}
```

**Pros:**
- ✅ Reduces API calls to proxy
- ✅ Faster response times
- ✅ Lower rate limit usage
- ✅ Works with current proxy setup

**Cons:**
- ❌ Slightly stale data
- ❌ Additional complexity
- ❌ Cache infrastructure needed (Vercel KV on paid plan)

**Best For:** High-traffic applications still using the proxy

**Implementation Effort:** Medium

---

## Recommendations

### For Your Current Demo Project: Option 1 (Stay with RoyaleAPI Proxy) ✅

**Reasoning:**
1. Already working correctly
2. Zero cost
3. Appropriate for demo/portfolio project
4. API key is properly secured server-side
5. Traffic is likely low enough for shared rate limits

**Action Items:**
- ✅ No changes needed
- ✅ Document the architecture (done in CLAUDE.md)
- ✅ Monitor for any proxy deprecation announcements

### If Scaling to Production: Option 2 (Vercel Static IPs)

**When to switch:**
- Consistent traffic > 1000 requests/day
- Revenue-generating application
- Need reliability SLA
- Budget available ($20+/month)

### If Building a Portfolio of Supercell API Apps: Option 3 (Self-Hosted Proxy)

**When to switch:**
- Multiple projects using Clash Royale API
- Want to learn infrastructure management
- Comfortable with DevOps
- Cost-conscious ($6/month for multiple projects vs $20+/month per Vercel project)

---

## Rate Limit Considerations

### Clash Royale API Official Limits
- **Requests per second**: 10
- **Requests per token**: Depends on plan (Developer/Silver typically)

### Current Setup Impact
- Using shared proxy means limits are shared across all proxy users
- For a demo project with minimal traffic, this is acceptable
- If experiencing rate limit errors, consider implementing:
  1. Client-side request debouncing
  2. Server-side caching (Option 5)
  3. Request queuing

---

## Security Analysis

### Current Implementation: ✅ SECURE

**Good practices already in place:**
1. ✅ API key stored in `.env.local` (not committed to git)
2. ✅ API key only used server-side (Next.js API routes)
3. ✅ Client never sees the API key
4. ✅ Authorization header set server-side

**Potential improvements:**
- Consider rotating API keys periodically
- Add rate limiting on your API routes to prevent abuse
- Implement request validation/sanitization

---

## Cost Comparison

| Solution | Monthly Cost | Setup Effort | Maintenance |
|----------|--------------|--------------|-------------|
| RoyaleAPI Proxy | **$0** | None | None |
| Vercel Static IPs | **$20+** | Low | Low |
| Self-Hosted VPS | **$6-10** | High | Medium |
| get-sc-key | $0 | Low | ⚠️ High Risk |
| Hybrid Cache | $0-20* | Medium | Low |

*Depends on cache solution (free: in-memory, paid: Vercel KV)

---

## Final Recommendation

**Keep your current setup (RoyaleAPI Proxy) for this demo project.**

The architecture is:
- ✅ Secure (API key hidden server-side)
- ✅ Cost-effective (free)
- ✅ Appropriate for the use case (demo/portfolio)
- ✅ Already implemented and working

Only consider changing if:
1. You experience rate limiting issues
2. RoyaleAPI announces proxy deprecation
3. This becomes a production app with revenue
4. You need guaranteed uptime/SLA

---

## Sources

- [RoyaleAPI Proxy Documentation](https://docs.royaleapi.com/proxy)
- [Vercel Static IPs Knowledge Base](https://vercel.com/kb/guide/can-i-get-a-fixed-ip-address)
- [Self-Hosted Proxy Repository](https://github.com/AndreVarandas/royale-proxy-api)
- [Automated Key Generation (get-sc-key)](https://github.com/marsidev/get-sc-key)
- [Clash Royale API Official Documentation](https://developer.clashroyale.com/)
- [RoyaleAPI Developers Documentation](https://docs.royaleapi.com/)
