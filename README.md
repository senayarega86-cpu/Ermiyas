# ECCSA Website (redesign)

Modern static website for the Ethiopian Chamber of Commerce and Sectoral Associations,
using the corporate colours of the ECCSA logo (sky blue, gold sunburst, deep navy).

## Structure
- `src/pages/` – page content (edit these)
- `src/partials/` – shared head, menu (header), footer and icons
- `assets/` – CSS, JavaScript and images
- `build.py` – combines pages + partials into the final `*.html` files in the root

## Build & preview
```bash
python3 build.py
python3 -m http.server 8000
```
Then open http://localhost:8000

## Status
Done: Home, About, Services. To do: Membership, News & Resources, Contact pages;
connect the newsletter/contact forms to an email service; optional Amharic version.
