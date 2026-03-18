# Stencil `btoa` InvalidCharacterError Reproduction

Minimal reproduction for a bug in `@stencil/core` hydrate module where `serializeProperty` throws `InvalidCharacterError` when serializing object props containing non-Latin1 Unicode characters during SSR.

## Bug

`serializeProperty` in the hydrate bundle uses `btoa(JSON.stringify(arg))`. Node.js `btoa()` only accepts Latin1 characters (code points 0–255). Any non-Latin1 character (e.g., `€`, CJK characters, emoji) causes `InvalidCharacterError`.

**Location**: `@stencil/core` hydrate output → `src/utils/serialize.ts` → `serializeProperty()`

```
Error [InvalidCharacterError]: Invalid character
    at btoa (node:buffer:1288:11)
    at Object.serializeProperty (hydrate/index.js)
```

## Steps to Reproduce

```bash
# Install all dependencies (npm workspaces)
npm install

# Build the Stencil component
npm run build -w stencil-component

# Start the Next.js dev server
npm run dev -w nextjs-app

# Open http://localhost:3000 → 500 error with InvalidCharacterError
```

## Structure

- `stencil-component/` — Minimal Stencil component with `@Prop() content: Record<string, any>` and `@stencil/react-output-target` SSR support
- `nextjs-app/` — Next.js app that renders the component server-side with non-Latin1 content (`€`, `日本語`)

## Environment

- `@stencil/core`: 4.43.2
- `@stencil/react-output-target`: ^1.4.2
- Next.js: 16.1.7
- Node.js: 22.13.0

## Suggested Fix

Replace `btoa`/`atob` with Unicode-safe alternatives in `src/utils/serialize.ts`:

```js
// serializeProperty — replace btoa()
return SERIALIZED_PREFIX + (typeof Buffer !== "undefined"
  ? Buffer.from(JSON.stringify(arg), "utf-8").toString("base64")
  : btoa(encodeURIComponent(JSON.stringify(arg)).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))));

// deserializeProperty — replace atob()
const raw = typeof Buffer !== "undefined"
  ? Buffer.from(value.slice(SERIALIZED_PREFIX.length), "base64").toString("utf-8")
  : decodeURIComponent(Array.from(atob(value.slice(SERIALIZED_PREFIX.length)), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
return RemoteValue.fromLocalValue(JSON.parse(raw));
```
