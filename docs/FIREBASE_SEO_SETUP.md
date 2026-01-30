# Firebase SEO Config Setup

## Architecture

```
flyto-cloud (Admin)     Firebase Firestore      flyto-landing-page (Public)
       │                      │                          │
       │   ┌──────────────────┼──────────────────┐       │
       │   │                  │                  │       │
       ├──►│  WRITE (auth)    │                  │       │
       │   │  ───────────►    │                  │       │
       │   │                  │   seo-config/    │       │
       │   │                  │   landing-page   │◄──────┤ READ (public)
       │   │                  │                  │       │
       │   └──────────────────┼──────────────────┘       │
       │                      │                          │
```

## 1. Firestore Security Rules

Add this to your Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // SEO config: public read, authenticated write
    match /seo-config/{document} {
      // Anyone can read (for GitHub Actions)
      allow read: if true;

      // Only authenticated admins can write
      allow write: if request.auth != null
                   && request.auth.token.admin == true;
    }

    // Block all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 2. Firestore Document Structure

Collection: `seo-config`
Document: `landing-page`

```json
{
  "baseUrl": "https://flyto2.com",

  "pages": {
    "index.html": {
      "changefreq": "weekly",
      "priority": "1.0",
      "index": true
    },
    "pricing.html": {
      "changefreq": "weekly",
      "priority": "0.9",
      "index": true
    }
    // ... more pages
  },

  "blockedPages": [
    "404.html",
    "license-purchase.html"
  ],

  "blockedPaths": [
    "/assets/js/",
    "/scripts/",
    "/.git/",
    "/.github/"
  ],

  "blockedBots": [
    "GPTBot",
    "ChatGPT-User",
    "CCBot",
    "anthropic-ai",
    "Google-Extended"
  ],

  "crawlDelay": 1,

  "updatedAt": "2024-01-25T00:00:00Z",
  "updatedBy": "admin@flyto2.com"
}
```

## 3. flyto-cloud Backend API

Add this endpoint to manage SEO config:

```python
# src/ui/web/backend/api/seo.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
import firebase_admin
from firebase_admin import firestore

router = APIRouter(prefix="/api/seo", tags=["seo"])

class PageConfig(BaseModel):
    changefreq: str = "monthly"
    priority: str = "0.5"
    index: bool = True

class SeoConfig(BaseModel):
    baseUrl: str = "https://flyto2.com"
    pages: Dict[str, PageConfig]
    blockedPages: List[str] = []
    blockedPaths: List[str] = []
    blockedBots: List[str] = []
    crawlDelay: int = 1

class UpdateSeoConfigRequest(BaseModel):
    config: SeoConfig

@router.get("/config")
async def get_seo_config(current_user = Depends(get_current_admin_user)):
    """Get current SEO config from Firestore"""
    db = firestore.client()
    doc = db.collection("seo-config").document("landing-page").get()

    if doc.exists:
        return {"ok": True, "data": doc.to_dict()}
    return {"ok": True, "data": None}

@router.put("/config")
async def update_seo_config(
    request: UpdateSeoConfigRequest,
    current_user = Depends(get_current_admin_user)
):
    """Update SEO config in Firestore"""
    db = firestore.client()

    config_data = request.config.dict()
    config_data["updatedAt"] = datetime.utcnow().isoformat()
    config_data["updatedBy"] = current_user.email

    db.collection("seo-config").document("landing-page").set(config_data)

    return {"ok": True, "message": "SEO config updated"}

@router.post("/pages")
async def add_page(
    page_name: str,
    config: PageConfig,
    current_user = Depends(get_current_admin_user)
):
    """Add a new page to SEO config"""
    db = firestore.client()
    doc_ref = db.collection("seo-config").document("landing-page")

    doc_ref.update({
        f"pages.{page_name}": config.dict(),
        "updatedAt": datetime.utcnow().isoformat(),
        "updatedBy": current_user.email
    })

    return {"ok": True, "message": f"Page {page_name} added"}

@router.delete("/pages/{page_name}")
async def remove_page(
    page_name: str,
    current_user = Depends(get_current_admin_user)
):
    """Remove a page from SEO config"""
    db = firestore.client()
    doc_ref = db.collection("seo-config").document("landing-page")

    doc_ref.update({
        f"pages.{page_name}": firestore.DELETE_FIELD,
        "updatedAt": datetime.utcnow().isoformat(),
        "updatedBy": current_user.email
    })

    return {"ok": True, "message": f"Page {page_name} removed"}

@router.post("/blocked-pages")
async def add_blocked_page(
    page: str,
    current_user = Depends(get_current_admin_user)
):
    """Add a page to blocked list"""
    db = firestore.client()
    doc_ref = db.collection("seo-config").document("landing-page")

    doc_ref.update({
        "blockedPages": firestore.ArrayUnion([page]),
        "updatedAt": datetime.utcnow().isoformat(),
        "updatedBy": current_user.email
    })

    return {"ok": True, "message": f"Page {page} blocked"}

@router.delete("/blocked-pages/{page}")
async def remove_blocked_page(
    page: str,
    current_user = Depends(get_current_admin_user)
):
    """Remove a page from blocked list"""
    db = firestore.client()
    doc_ref = db.collection("seo-config").document("landing-page")

    doc_ref.update({
        "blockedPages": firestore.ArrayRemove([page]),
        "updatedAt": datetime.utcnow().isoformat(),
        "updatedBy": current_user.email
    })

    return {"ok": True, "message": f"Page {page} unblocked"}
```

## 4. GitHub Actions Integration

Update `.github/workflows/i18n-sync.yml`:

```yaml
- name: Fetch SEO config from Firebase
  run: |
    cd flyto-landing-page
    node scripts/fetch-seo-config.js
  env:
    FIREBASE_PROJECT_ID: flyto-cloud

- name: Generate sitemap and robots.txt
  run: |
    cd flyto-landing-page
    node scripts/generate-sitemap.js
    node scripts/generate-robots.js
```

## 5. Security Checklist

- [x] Firestore rules: public read, authenticated write only
- [x] No Firebase credentials in public repo
- [x] Uses REST API (no SDK, no service account)
- [x] Fallback to local config if Firebase unavailable
- [x] Config validation before use
- [x] Admin-only write access in flyto-cloud
- [x] Audit trail (updatedAt, updatedBy)

## 6. Testing

```bash
# Test fetch (should work without auth)
curl "https://firestore.googleapis.com/v1/projects/flyto-cloud/databases/(default)/documents/seo-config/landing-page"

# Test local script
cd flyto-landing-page
node scripts/fetch-seo-config.js
```
