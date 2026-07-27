# API Routes

HTTP transport layer. Each resource folder holds its route handlers, the
`<resource>-mapper.ts` that converts model types to API response types, and a
`<resource>-routes.ts` that registers its endpoints (schemas + middlewares +
handlers) via a `register<Resource>Routes(router)` function, composed in
`api/router.ts`. `_shared/` holds cross-resource mappers (collaborators, user
summaries).

## Handler contract

A handler does exactly three things:

1. **Parse the request** — read validated params/query/body (schema validation
   already ran in `api/middlewares/`).
2. **Call a service** — all business logic lives in `src/services/`. Handlers
   contain no queries, aggregation, or domain rules.
3. **Map the result** — convert the service's return value (model types) to the
   API response shape via the colocated `toApi*` mapper.

Failures are not handled here: services throw the domain errors defined in
`src/infrastructure/`, and `toApiResponse` (`api/infrastructure/api-utils.ts`)
translates them to HTTP status codes.

## Services contract (mirror image)

Modules in `src/services/` return model types (populated Mongoose docs or lean
domain shapes), never import express, never touch HTTP status codes, and signal
failure by throwing `src/infrastructure/` domain errors.
