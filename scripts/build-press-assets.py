"""Refresh checked-in EPK downloads and image sizes. The website build does not run Python."""

import json
from io import BytesIO
from pathlib import Path
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile

from fontTools.ttLib import TTFont as WebFont
from PIL import Image, ImageOps
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
PRESS = PUBLIC / "press"
ART = PUBLIC / "assets/epk"
DATA = ROOT / "src/data"
COPY = json.loads((DATA / "epk.json").read_text(encoding="utf-8"))
PORTRAITS = {m["name"]: PUBLIC / m["image"].lstrip("/") for m in
             json.loads((DATA / "members.json").read_text(encoding="utf-8"))}
PDF = PRESS / "perennial-fallout-press-sheet.pdf"


def write_images():
    for member in COPY["members"]:
        original = PORTRAITS[member["siteName"]]
        with Image.open(original) as photo:
            photo.thumbnail((480, 720), Image.Resampling.LANCZOS)
            photo.save(ART / f"{original.stem}-480.webp", quality=86, method=6)
    with Image.open(PUBLIC / "assets/images/hero-mobile-v171.webp") as hero:
        hero.thumbnail((640, 720), Image.Resampling.LANCZOS)
        hero.save(ART / "hero-640.webp", quality=86, method=6)
    with Image.open(PUBLIC / "assets/images/hero-desktop.webp") as hero:
        ImageOps.fit(hero.convert("RGB"), (1200, 675)).save(
            ART / "perennial-fallout-social.jpg", quality=90, optimize=True)


def write_bios():
    members = [f'{m["name"]} — {m["instrument"]}\n{m["bio"]}' for m in COPY["members"]]
    bios = {"short-bio.txt": COPY["shortBio"], "full-bio.txt": COPY["fullBio"], "member-bios.txt": members}
    for name, paragraphs in bios.items():
        (PRESS / name).write_text("\n\n".join(paragraphs) + "\n", encoding="utf-8")


def load_fonts():
    for family, weight, name in (("barlow", 400, "Body"), ("barlow", 600, "Strong"),
                                 ("metal-mania", 400, "Display")):
        with WebFont(PUBLIC / "assets/fonts" / f"{family}-latin-{weight}-normal.woff") as font:
            font.flavor = None
            stream = BytesIO()
            font.save(stream)
            stream.seek(0)
            pdfmetrics.registerFont(TTFont(name, stream))


def make_pdf():
    load_fonts()
    pdf = canvas.Canvas(str(PDF), pagesize=letter, pageCompression=1)
    pdf.setTitle("Perennial Fallout | Electronic Press Kit")
    pdf.setAuthor("Perennial Fallout")
    pdf.setCreator("Perennial Fallout")
    pdf.setSubject("Band biography, lineup, sound, live performance and press resources")
    ink, wine, muted = "#20191D", "#722F43", "#594F54"
    left, right, width = 36, 576, 540

    def label(text, x, baseline, font="Body", size=10, color=ink):
        pdf.setFillColor(HexColor(color))
        pdf.setFont(font, size)
        pdf.drawString(x, baseline, text)

    def paragraph(text, x, top, measure, size=11, leading=14, font="Body", color=ink):
        style = ParagraphStyle("press", fontName=font, fontSize=size, leading=leading,
                               textColor=HexColor(color), spaceAfter=0, splitLongWords=1)
        block = Paragraph(escape(text), style)
        _, height = block.wrap(measure, 740)
        block.drawOn(pdf, x, top - height)
        return top - height

    def image_box(path, x, y, w, h, center_y):
        with Image.open(path) as source:
            photo = ImageOps.fit(source.convert("RGB"), (round(w * 3), round(h * 3)),
                                 method=Image.Resampling.LANCZOS, centering=(0.5, center_y))
            stream = BytesIO()
            photo.save(stream, "JPEG", quality=90, optimize=True)
            stream.seek(0)
            pdf.drawImage(ImageReader(stream), x, y, w, h)

    def rule(y):
        pdf.setStrokeColor(HexColor("#CDC3C6"))
        pdf.setLineWidth(.55)
        pdf.line(left, y, right, y)

    pdf.setFillColor(HexColor("#1B1017"))
    pdf.rect(0, 625, 612, 167, stroke=0, fill=1)
    image_box(PUBLIC / "assets/images/hero-mobile-v171.webp", 322, 625, 290, 167, .10)
    pdf.setFillColor(HexColor(wine))
    pdf.rect(0, 621, 612, 4, stroke=0, fill=1)
    label("ELECTRONIC PRESS KIT", left, 761, "Strong", 10, "#EDB8C6")
    label("PERENNIAL", left, 712, "Display", 46, "#FFF8F0")
    label("FALLOUT", left, 671, "Display", 46, "#FFF8F0")
    label(COPY["genre"], left, 643, "Strong", 12, "#F4DDE3")

    label("About the band", left, 592, "Display", 20)
    label(f'FORMED IN {COPY["formed"]}', 486, 594, "Strong", 10, wine)
    about_end = paragraph(" ".join(COPY["shortBio"]), left, 580, width)
    lineup_top = about_end - 28
    label("Meet the band", left, lineup_top, "Display", 20)
    gap = 9
    tile = (width - 4 * gap) / 5
    photo_y = lineup_top - 100
    for i, member in enumerate(COPY["members"]):
        x = left + i * (tile + gap)
        image_box(PORTRAITS[member["siteName"]], x, photo_y, tile, 87, .15)
        label(member["name"], x, photo_y - 16, "Strong", 13)
        label(member["instrument"], x, photo_y - 29, size=10, color=muted)
    rule(photo_y - 42)

    top = photo_y - 69
    col = 252
    x2 = 324
    label("The sound", left, top, "Display", 19)
    bottom_left = paragraph(" / ".join(COPY["genres"]), left, top - 9, col, font="Strong")
    bottom_left = paragraph("For fans of " + ", ".join(COPY["influences"][:-1]) +
                            " and " + COPY["influences"][-1] + ".", left, bottom_left - 7, col)
    listen = "Listen to The Way · 45-second preview"
    label(listen, left, bottom_left - 18, "Strong", 11, wine)
    pdf.linkURL(COPY["website"] + "/epk/#sound",
                (left, bottom_left - 21, left + pdfmetrics.stringWidth(listen, "Strong", 11), bottom_left - 7))
    label("Live performance", x2, top, "Display", 19)
    bottom_right = top - 9
    for point in COPY["live"]["highlights"]:
        bottom_right = paragraph("•  " + point, x2, bottom_right, col, leading=13)
    label("Planned projects", x2, bottom_right - 24, "Display", 16)
    plans = [item[0].lower() + item[1:] for item in COPY["next"]["plans"]]
    bottom_right = paragraph("Plans include " + ", ".join(plans[:-1]) + " and " + plans[-1] + ".",
                             x2, bottom_right - 31, col)
    quote_top = min(bottom_left - 33, bottom_right - 14)
    if quote_top < 113:
        raise ValueError("Press copy exceeds the one-sheet layout. Adjust it and recheck the PDF.")
    pdf.setFillColor(HexColor("#F3EAED"))
    pdf.rect(left, quote_top - 44, width, 44, stroke=0, fill=1)
    pdf.setFillColor(HexColor(wine))
    pdf.rect(left, quote_top - 44, 3, 44, stroke=0, fill=1)
    paragraph('“' + COPY["tagline"] + '”', left + 13, quote_top - 9, width - 26, 18, 23, "Display", wine)

    rule(58)
    label("BOOKING & PRESS", left, 42, "Strong", 9, wine)
    contact = COPY["bookingEmail"] or "Public contact pending band confirmation."
    label(contact, left, 27, size=10)
    if COPY["bookingEmail"]:
        pdf.linkURL("mailto:" + contact, (left, 24, left + pdfmetrics.stringWidth(contact, "Body", 10), 39))
    label("ONLINE PRESS KIT", x2, 42, "Strong", 9, wine)
    address = COPY["website"].split("://", 1)[-1].rstrip("/") + "/epk/"
    label(address, x2, 27, "Strong", 10)
    pdf.linkURL(COPY["website"] + "/epk/", (x2, 24, x2 + pdfmetrics.stringWidth(address, "Strong", 10), 39))
    pdf.showPage()
    pdf.save()


def make_press_zip():
    with ZipFile(PRESS / "perennial-fallout-press-assets.zip", "w", compression=ZIP_DEFLATED) as kit:
        kit.write(PDF, PDF.name)
        for name in ("short-bio.txt", "full-bio.txt", "member-bios.txt"):
            kit.write(PRESS / name, "biographies/" + name)
        kit.write(PUBLIC / "assets/icons/logo.svg", "art/perennial-fallout-logo.svg")
        kit.write(PUBLIC / COPY["groupPhoto"].lstrip("/"), "photos/perennial-fallout-band.webp")
        for member in COPY["members"]:
            kit.write(PORTRAITS[member["siteName"]], f'photos/{member["name"].lower()}.webp')


if __name__ == "__main__":
    PRESS.mkdir(parents=True, exist_ok=True)
    ART.mkdir(parents=True, exist_ok=True)
    write_images()
    write_bios()
    make_pdf()
    make_press_zip()
