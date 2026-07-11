#!/usr/bin/env python3
"""Generate the Growdollar AI & Modern UX Enhancement roadmap PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, NextPageTemplate, ListFlowable, ListItem, HRFlowable, KeepTogether
)

# ---- Nature palette ----
LEAF      = colors.HexColor("#2E7D32")
LEAF_DK   = colors.HexColor("#1B5E20")
LEAF_LT   = colors.HexColor("#4CAF50")
MINT      = colors.HexColor("#E8F5E9")
SOIL      = colors.HexColor("#5D4037")
NIGHT     = colors.HexColor("#0F3D3E")
INK       = colors.HexColor("#1F2D27")
GREY      = colors.HexColor("#5A655E")
SUN       = colors.HexColor("#F9A825")

OUT = "Growdollar_Enhancement_Plan.pdf"

styles = getSampleStyleSheet()

def S(name, **kw):
    kw.setdefault("parent", styles["Normal"])
    return ParagraphStyle(name, **kw)

body = S("body", fontName="Helvetica", fontSize=10.5, leading=15.5,
         textColor=INK, spaceAfter=6)
h1 = S("h1", fontName="Helvetica-Bold", fontSize=17, leading=21,
       textColor=LEAF_DK, spaceBefore=6, spaceAfter=8)
h2 = S("h2", fontName="Helvetica-Bold", fontSize=12.5, leading=16,
       textColor=LEAF, spaceBefore=10, spaceAfter=4)
kicker = S("kicker", fontName="Helvetica-Bold", fontSize=9, leading=12,
           textColor=LEAF_LT, spaceAfter=2)
bullet = S("bullet", parent=body, leftIndent=4, spaceAfter=3)
cover_title = S("ct", fontName="Helvetica-Bold", fontSize=34, leading=38,
                textColor=colors.white, alignment=TA_LEFT)
cover_sub = S("cs", fontName="Helvetica", fontSize=14, leading=20,
              textColor=MINT, alignment=TA_LEFT)
cover_tag = S("ctag", fontName="Helvetica-Bold", fontSize=11, leading=15,
              textColor=SUN, alignment=TA_LEFT)
cell = S("cell", fontName="Helvetica", fontSize=9.5, leading=13, textColor=INK)
cellb = S("cellb", parent=cell, fontName="Helvetica-Bold", textColor=LEAF_DK)
cellw = S("cellw", parent=cell, textColor=colors.white, fontName="Helvetica-Bold")

PAGE_W, PAGE_H = A4

def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(LEAF_DK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(LEAF)
    canvas.rect(0, 0, PAGE_W, PAGE_H*0.42, fill=1, stroke=0)
    canvas.setFillColor(LEAF_LT)
    canvas.rect(0, 0, PAGE_W, PAGE_H*0.30, fill=1, stroke=0)
    # decorative leaves (simple circles/ellipses)
    canvas.setFillColor(colors.HexColor("#66BB6A"))
    for x, y, r in [(60,720,40),(520,660,55),(470,150,70),(120,120,50)]:
        canvas.circle(x, y, r, fill=1, stroke=0)
    canvas.setFillColor(SUN)
    canvas.circle(500, 770, 28, fill=1, stroke=0)  # sun
    canvas.restoreState()

def content_bg(canvas, doc):
    canvas.saveState()
    # header band
    canvas.setFillColor(MINT)
    canvas.rect(0, PAGE_H-26*mm, PAGE_W, 26*mm, fill=1, stroke=0)
    canvas.setFillColor(LEAF)
    canvas.rect(0, PAGE_H-26*mm, PAGE_W, 3, fill=1, stroke=0)
    canvas.setFillColor(LEAF_DK)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(20*mm, PAGE_H-16*mm, "Growdollar")
    canvas.setFillColor(GREY)
    canvas.setFont("Helvetica", 8.5)
    canvas.drawRightString(PAGE_W-20*mm, PAGE_H-16*mm, "AI & Modern UX Enhancement Plan")
    # footer
    canvas.setFillColor(GREY)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(20*mm, 12*mm, "Prepared with Claude Code  ·  2026-06-18")
    canvas.drawRightString(PAGE_W-20*mm, 12*mm, "Page %d" % doc.page)
    canvas.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4,
                      leftMargin=20*mm, rightMargin=20*mm,
                      topMargin=20*mm, bottomMargin=18*mm)

cover_frame = Frame(20*mm, 30*mm, PAGE_W-40*mm, PAGE_H*0.5, id="cover")
content_frame = Frame(20*mm, 18*mm, PAGE_W-40*mm, PAGE_H-46*mm, id="content")

doc.addPageTemplates([
    PageTemplate(id="cover", frames=[cover_frame], onPage=cover_bg),
    PageTemplate(id="content", frames=[content_frame], onPage=content_bg),
])

def bullets(items, st=bullet):
    return ListFlowable(
        [ListItem(Paragraph(t, st), value="•", leftIndent=14) for t in items],
        bulletType="bullet", bulletColor=LEAF_LT, start="•",
        leftIndent=10, bulletFontSize=9,
    )

story = []

# ---------- COVER ----------
story += [
    Spacer(1, 150),
    Paragraph("ENHANCEMENT ROADMAP", cover_tag),
    Spacer(1, 8),
    Paragraph("Growdollar", cover_title),
    Paragraph("Growing AI into a living garden", cover_title),
    Spacer(1, 14),
    Paragraph("AI plant analysis · a modern nature-themed experience · "
              "phased delivery — all on a free stack.", cover_sub),
    Spacer(1, 30),
    Paragraph("Prepared 2026-06-18", cover_sub),
]

# ---------- PAGE: TODAY ----------
story += [NextPageTemplate("content"), PageBreak()]
story += [
    Paragraph("01 — Vision", kicker),
    Paragraph("Where we are, and where we're growing", h1),
    Paragraph("Growdollar is already a polished plant-cultivation app: users buy "
              "a virtual plant, watch it grow through 11 life stages, water it, "
              "photograph its journey, and see its environmental impact. The "
              "foundation is strong. This roadmap turns it into something "
              "<b>smart and delightful</b> — a garden that can look at a real "
              "plant and tell you how it's doing, wrapped in a living, animated, "
              "nature-themed interface.", body),
    Spacer(1, 4),
    Paragraph("The app today", h2),
    bullets([
        "<b>11-stage growth simulation</b> — seed to masterpiece, advancing in real time.",
        "<b>Care mechanics</b> — water, sunlight and care decay and can be restored.",
        "<b>Photo journal, location map & environmental impact</b> (CO₂ / oxygen).",
        "<b>Firebase auth</b> + local AsyncStorage plant data, with Reanimated polish.",
    ]),
    Spacer(1, 6),
    Paragraph("Three goals for this phase of work", h2),
    bullets([
        "<b>See with AI</b> — point the camera at a plant; identify the species and diagnose its health.",
        "<b>Feel alive</b> — a modern nature theme: falling leaves, day/night skies, growth celebrations.",
        "<b>Feel modern</b> — tab navigation, onboarding, a real design system and dark mode.",
    ]),
]

# ---------- PAGE: AI ----------
story += [PageBreak()]
story += [
    Paragraph("02 — AI Plant Analysis", kicker),
    Paragraph("A garden that can see", h1),
    Paragraph("The headline feature: a new <b>AI Scan</b> tab. The user captures "
              "or picks a photo of a plant or leaf; the app identifies the "
              "species and reports its health, then offers care tips and lets "
              "them attach the insight to one of their plants. Built entirely on "
              "a <b>free stack</b> — no paid vendor.", body),
    Spacer(1, 2),
    Paragraph("The free AI stack", h2),
]
ai_rows = [
    [Paragraph("Need", cellw), Paragraph("Free option", cellw), Paragraph("How it works", cellw)],
    [Paragraph("Identify species", cellb),
     Paragraph("Pl@ntNet API <i>(free, non-commercial)</i> or iNaturalist vision", cell),
     Paragraph("Send the photo, get back species name + confidence score.", cell)],
    [Paragraph("Diagnose health", cellb),
     Paragraph("Hugging Face Inference (free tier) hosting an open PlantVillage disease model", cell),
     Paragraph("Classifies healthy vs. common diseases (blight, rust, mildew…).", cell)],
    [Paragraph("Care tips", cellb),
     Paragraph("Rule-based mapping (no cost)", cell),
     Paragraph("Disease label → friendly, actionable advice in the app.", cell)],
    [Paragraph("Fully offline option", cellb),
     Paragraph("Bundle a TFLite model via react-native-fast-tflite", cell),
     Paragraph("No key, no network — slightly larger app, runs on-device.", cell)],
]
ai_tbl = Table(ai_rows, colWidths=[32*mm, 58*mm, 80*mm])
ai_tbl.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), LEAF),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, MINT]),
    ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#C8E6C9")),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("TOPPADDING", (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING", (0,0), (-1,-1), 7),
    ("RIGHTPADDING", (0,0), (-1,-1), 7),
]))
story += [ai_tbl, Spacer(1, 8)]
story += [
    Paragraph("Flow & data", h2),
    bullets([
        "Capture / pick photo  →  loading shimmer  →  result card "
        "(species, confidence, health, diagnosis, tips).",
        "“Save to plant” attaches the photo and a new <b>aiInsights</b> record "
        "to a plant in PlantContext.",
        "Free API key is hidden behind a tiny Firebase Cloud Function proxy — "
        "never shipped raw in the bundle.",
    ]),
]

# ---------- PAGE: UX ----------
story += [PageBreak()]
story += [
    Paragraph("03 — Modern UX & Nature Animations", kicker),
    Paragraph("A living, catchy interface", h1),
    Paragraph("Four upgrades make the app feel modern and alive — all using "
              "Reanimated, which is already a dependency.", body),
    Paragraph("Design system & theming", h2),
    bullets([
        "Central <b>theme tokens</b> (colors, spacing, radius, typography) — replacing today's hardcoded greens.",
        "<b>Light / dark mode</b> with nature palettes: day greens, night deep-teal.",
    ]),
    Paragraph("Modern navigation", h2),
    bullets([
        "Animated <b>bottom tab bar</b>: Home · Garden · <b>AI Scan</b> · Impact · Profile.",
        "Floating center “Scan” button; existing detail screens nest as pushed views.",
    ]),
    Paragraph("Animated nature theme", h2),
    bullets([
        "Falling-leaves / floating-pollen particles and gentle plant sway.",
        "Day/night animated sky gradient tied to device time.",
        "<b>Growth-stage-up celebration</b> — confetti + haptic when a plant levels up.",
    ]),
    Paragraph("Onboarding & micro-interactions", h2),
    bullets([
        "3–4 screen animated onboarding shown once (growing, AI scan, eco-impact).",
        "Skeleton loaders, pull-to-refresh, richer haptics, polished empty states.",
    ]),
]

# ---------- PAGE: ROADMAP ----------
story += [PageBreak()]
story += [
    Paragraph("04 — Phased Roadmap", kicker),
    Paragraph("How we deliver it", h1),
    Paragraph("Sequenced so each phase stands on its own and de-risks the next. "
              "Effort is rough relative sizing.", body),
    Spacer(1, 2),
]
rm = [
    [Paragraph("Phase", cellw), Paragraph("Focus", cellw),
     Paragraph("Effort", cellw), Paragraph("Value", cellw)],
    [Paragraph("1", cellb), Paragraph("Design system & theming (tokens, dark mode)", cell), Paragraph("Medium", cell), Paragraph("Foundation", cell)],
    [Paragraph("2", cellb), Paragraph("Modern navigation — animated tab bar", cell), Paragraph("Medium", cell), Paragraph("High", cell)],
    [Paragraph("3", cellb), Paragraph("AI Plant Scan — headline feature", cell), Paragraph("High", cell), Paragraph("Highest", cell)],
    [Paragraph("4", cellb), Paragraph("Animated nature theme & celebrations", cell), Paragraph("Medium", cell), Paragraph("High (delight)", cell)],
    [Paragraph("5", cellb), Paragraph("Onboarding & micro-interactions", cell), Paragraph("Low–Med", cell), Paragraph("Medium", cell)],
    [Paragraph("6", cellb), Paragraph("Polish, auth-persistence fix, QA & ship", cell), Paragraph("Low", cell), Paragraph("Stability", cell)],
]
rm_tbl = Table(rm, colWidths=[18*mm, 92*mm, 28*mm, 32*mm])
rm_tbl.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), LEAF_DK),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, MINT]),
    ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#C8E6C9")),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING", (0,0), (-1,-1), 7),
]))
story += [rm_tbl, Spacer(1, 12)]
story += [
    Paragraph("05 — Tech choices & risks", kicker),
    Paragraph("Things to watch", h1),
    bullets([
        "<b>Free-tier limits</b> — Pl@ntNet / Hugging Face cap requests; cache results and fall back to the on-device TFLite model if rate-limited.",
        "<b>Key handling</b> — keep API keys server-side in a Cloud Function proxy, never in the app bundle.",
        "<b>Offline path</b> — the bundled TFLite model keeps AI scanning working with no network and no key.",
        "<b>Auth persistence</b> — apply the standing Firebase + AsyncStorage fix so login survives restarts.",
        "<b>Performance</b> — keep particle/animation layers opt-in per screen to protect frame rate on older devices.",
    ]),
    Spacer(1, 10),
    HRFlowable(width="100%", thickness=1, color=colors.HexColor("#C8E6C9")),
    Spacer(1, 6),
    Paragraph("<b>Next step:</b> begin Phase 1 (design system) — it unblocks every "
              "later phase and is low-risk. The AI Scan (Phase 3) is the "
              "showcase moment worth demoing first to stakeholders.",
              S("close", parent=body, textColor=LEAF_DK)),
]

doc.build(story)
print("Wrote", OUT)
