# Firestore Indexes

Database indexes for optimal query performance.

---

## Why Indexes Matter

- Queries with filters + sorting require composite indexes
- Without indexes: slow queries or failures at scale
- With indexes: millisecond response times

---

## Setup Methods

### Firebase Console (Manual)
1. Firestore → Indexes → Create Index
2. Select collection, add fields, set sort order
3. Wait for build (1-5 minutes)

### Firebase CLI (Automatic)
```bash
firebase deploy --only firestore:indexes
```

---

## Required Indexes

### blog

| Fields | Order | Purpose |
|--------|-------|---------|
| category, createdAt | Asc, Desc | Filter by category, sort by date |
| status, createdAt | Asc, Desc | Get published posts by date |
| authorId, createdAt | Asc, Desc | User's posts |

### resources

| Fields | Order | Purpose |
|--------|-------|---------|
| category, views | Asc, Desc | Popular by category |
| isActive, updatedAt | Asc, Desc | Active resources by update |
| category, isActive | Asc, Asc | Active in category |

### events

| Fields | Order | Purpose |
|--------|-------|---------|
| startDate, endDate | Asc, Asc | Date range queries |
| category, startDate | Asc, Desc | Category events by date |
| isFeatured, startDate | Asc, Desc | Featured events |

### forumTopics

| Fields | Order | Purpose |
|--------|-------|---------|
| category, createdAt | Asc, Desc | Topics by category |
| isPinned, createdAt | Asc, Desc | Pinned topics first |
| authorId, createdAt | Asc, Desc | User's topics |

### users

| Fields | Order | Purpose |
|--------|-------|---------|
| email | Asc | Email lookup |
| role, createdAt | Asc, Desc | Users by role |

### savedItems

| Fields | Order | Purpose |
|--------|-------|---------|
| userId, savedAt | Asc, Desc | User's saved items |
| itemType, userId | Asc, Asc | Items by type |

---

## Example Queries

**Filter + Sort (Needs Index):**
```javascript
db.collection('blog')
  .where('category', '==', 'Community')
  .orderBy('createdAt', 'desc')
```

**Single Filter (No Index Needed):**
```javascript
db.collection('resources')
  .where('category', '==', 'health')
```

---

## firestore.indexes.json

```json
{
  "indexes": [
    {
      "collectionGroup": "blog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "blog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "resources",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "views", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "events",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "startDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "forumTopics",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## Performance Tips

- Use `limit()` to reduce data transfer
- Paginate with cursors for large datasets
- Avoid client-side filtering of large collections
- Monitor query latency in Firebase Console

---

## Troubleshooting

**"Index not found" error?**
- Create the missing index in Firebase Console
- Or run `firebase deploy --only firestore:indexes`

**Slow queries?**
- Check if index exists
- Reduce result set with filters
- Use pagination

---

## Related Docs

[DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
[ARCHITECTURE.md](./ARCHITECTURE.md) - Data models
