# API Routes

## Response Envelope

All route handlers return this shape:

```ts
// Success
Response.json({ data: T }, { status: 200 | 201 })

// Error
Response.json({ error: { code: string, message: string } }, { status: 4xx | 5xx })
```

Never return raw data or a different shape.

## Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| UNAUTHORIZED | 401 | No valid session |
| FORBIDDEN | 403 | Authenticated but not allowed |
| NOT_FOUND | 404 | Resource doesn't exist |
| VALIDATION_ERROR | 422 | Request body failed Zod parse |
| INTERNAL_ERROR | 500 | Unexpected server error |

## Validation with Zod

```ts
import { z } from 'zod'

const CreateExpenseSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3),
  date: z.string().date(),
  categoryId: z.string().uuid(),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = CreateExpenseSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message: parsed.error.message } },
      { status: 422 }
    )
  }
  // use parsed.data
}
```

- Define Zod schemas at the top of the route file or in a `types/` file if shared
- Use `z.infer<typeof Schema>` to derive TypeScript types

## HTTP Conventions

- `GET` — list or fetch, no body
- `POST` — create, returns 201 + created resource
- `PUT` — full update of a resource, returns 200 + updated resource
- `DELETE` — delete, returns 200 + `{ data: { id } }`
- Route handlers only call `lib/` functions — no DB queries inline
