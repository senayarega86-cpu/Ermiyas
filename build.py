#!/usr/bin/env python3
"""Build the ECCSA static website.

Each page lives in src/pages/<name>.html and starts with a front-matter block:

    <!--
    title: Page title
    description: Meta description
    nav: about
    -->

The shared head, header (menu) and footer are inserted from src/partials/,
so the menu only has to be edited in one place. Output goes to the project
root (index.html, about.html, ...), ready to upload to any web host.

Usage:  python3 build.py
"""
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"


def rays_svg(n=28, inner=34, outer=98, spread=0.055):
    """Sunburst wedges echoing the rays in the ECCSA logo."""
    parts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        pts = [
            (inner * math.cos(a - spread / 2), inner * math.sin(a - spread / 2)),
            (outer * math.cos(a - spread), outer * math.sin(a - spread)),
            (outer * math.cos(a + spread), outer * math.sin(a + spread)),
            (inner * math.cos(a + spread / 2), inner * math.sin(a + spread / 2)),
        ]
        parts.append('<polygon points="%s"/>' % " ".join("%.1f,%.1f" % p for p in pts))
    return "".join(parts)


def main():
    head = (SRC / "partials/head.html").read_text(encoding="utf-8")
    header = (SRC / "partials/header.html").read_text(encoding="utf-8")
    footer = (SRC / "partials/footer.html").read_text(encoding="utf-8")
    icons = (SRC / "partials/icons.svg").read_text(encoding="utf-8").replace("{{RAYS}}", rays_svg())
    header = header.replace("{{ICONS}}", icons)

    for page in sorted((SRC / "pages").glob("*.html")):
        raw = page.read_text(encoding="utf-8")
        m = re.match(r"\s*<!--(.*?)-->\s*", raw, re.S)
        meta = {}
        if m:
            for line in m.group(1).strip().splitlines():
                k, _, v = line.partition(":")
                meta[k.strip()] = v.strip()
            raw = raw[m.end():]

        h = head
        for k in ("title", "description"):
            h = h.replace("{{%s}}" % k, meta.get(k, ""))
        h = h.replace("{{canonical}}", "" if page.stem == "index" else page.name)

        nav = meta.get("nav", "")
        hdr = re.sub(r'data-nav="%s"' % re.escape(nav), 'data-nav="%s" aria-current="page"' % nav, header) if nav else header

        out = h + hdr + '\n<main id="main">\n' + raw.strip() + "\n</main>\n\n" + footer
        (ROOT / page.name).write_text(out, encoding="utf-8")
        print("built", page.name)


if __name__ == "__main__":
    main()
