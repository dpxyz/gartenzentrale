# Gartenzentrale 🌻

Private Anwesenheits-Dashboard für die Gartenzentrale.

## Tech

- **Frontend**: HTML, CSS, JavaScript (Fullscreen Video Animations)
- **Backend**: Cloudflare Pages Functions
- **Storage**: Cloudflare KV (`GARTEN_KV`)

## Endpoints

| Method | Path | Beschreibung |
|--------|------|-------------|
| `GET` | `/api/state` | Aktuellen Zustand abfragen |
| `POST` | `/webhook` | Anwesenheit melden (`user`, `status`) |

## Zustände

| State | Wer | Beschreibung |
|-------|-----|-------------|
| 1 | – | Niemand da, Zentrale schläft |
| 2 | Dave | Dave ist in der Zentrale |
| 3 | Anna | Anna ist in der Zentrale |
| 4 | Beide | Volle Power! |

## Deployment

Cloudflare Pages → verbunden mit diesem GitHub Repo.  
KV Binding: `GARTEN_KV` muss im Cloudflare Dashboard konfiguriert werden.
