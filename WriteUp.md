# Write-up

> This is the skeleton - replace everything in blockquotes with your own words
> and delete the prompts as you go. Aim for **~300 words** across the four
> questions; the route reference below can be as long as it needs to be.
>
> Write it like you're handing the work to a teammate. We'd rather read an
> honest "I ran out of time on X and here's what I'd do" than a polished list of
> accomplishments. **Submit this even if you didn't finish** - see CHALLENGE.md.

## 1. What did you build for Part B, and why that?

I thought about what features I'd really appreciate if I'm look at my personal restaurant tracker.
I often don't know where to eat from, but sometimes I know what cuisine I want. Thus, I thought it 
would be helpful to have a sorter that can give me the restaurants I have based on what cuisine they 
are in so it would be easier for me to pick somewhere to eat out.

## 2. What did you decide, and what did you rule out?

I focused on building another API file to store my function similar to how the GET, POST, and DELETE 
functions were written. At first, I wanted to have a dropdown for different ways to sort by (cuisine, 
date added,  rating, location), but I thought that was a lot so I settled on just having a cuisine sorter 
since that was the most important to me. The UI for the new page lies in a new layout page that follows 
the same design as the first one. The primary logic is in the SORT function of route.ts with the other functions.

## 3. Where did you cut corners?

I would make sure that I covered all the possible edge cases because I wasn't able to test them all. I would 
also edit the function to sort based on alphabetic categories and make it look organized. I also think it 
would be much more efficient if it just re-ordered itself on the original page instead of directing to a new

---

## Part B: routes

> Every endpoint you added, with its request and response shapes, so we can
> exercise it without reverse-engineering your code. Add or remove rows as
> needed; delete this section if your Part B added no routes.

| Method and path                        | What it does | Success | Errors       |
| ---------------                        | ------------ | ------- | ------------ |
| `SORT /api/restaurants/[id]/route.ts`  | Sorts restaurants into categories based on cuisine | None | None |

**`POST /api/...`**

```jsonc
// request
{ }

// 201 response
{ }
```

## Schema changes

none

## How I verified this

curl -i http://localhost:3000/api/restaurants/cuisine/

**Part A** - the contract table in CHALLENGE.md, every row including the error
cases:

```bash
# e.g.
curl -i http://localhost:3000/api/restaurants          # 200 + array
curl -i http://localhost:3000/api/restaurants/99999    # 404
curl -i http://localhost:3000/api/restaurants/abc      # 404
curl -i -X POST http://localhost:3000/api/restaurants \
  -H 'Content-Type: application/json' \
  -d '{"name":"Out Of Range","rating":6}'              # 400
```

**Part B** - the equivalent cases for what you built:

```bash

```

## Known issues / what I'd do next

I wasn't able to get the right error messaage to cover all the edge cases for part B so I just removed the 
functionality entirely.
