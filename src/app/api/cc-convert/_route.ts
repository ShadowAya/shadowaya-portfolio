// app/api/cc-convert/route.ts
import sharp from "sharp";
import { NextRequest } from "next/server";

// CC color bit values and approx palette (Turtle/Monitor default)
const CC_COLORS: Array<{ bit: number; rgb: [number, number, number] }> = [
    { bit: 1, rgb: [0xf0, 0xf0, 0xf0] }, // white
    { bit: 2, rgb: [0xf2, 0xb2, 0x33] }, // orange
    { bit: 4, rgb: [0xe5, 0x7f, 0xd8] }, // magenta
    { bit: 8, rgb: [0x99, 0xb2, 0xf2] }, // lightBlue
    { bit: 16, rgb: [0xe5, 0xe5, 0x10] }, // yellow
    { bit: 32, rgb: [0x7f, 0xcc, 0x19] }, // lime
    { bit: 64, rgb: [0xf2, 0xb2, 0xcc] }, // pink
    { bit: 128, rgb: [0x4c, 0x4c, 0x4c] }, // gray
    { bit: 256, rgb: [0x99, 0x99, 0x99] }, // lightGray
    { bit: 512, rgb: [0x4c, 0x99, 0xb2] }, // cyan
    { bit: 1024, rgb: [0xb2, 0x66, 0xe5] }, // purple
    { bit: 2048, rgb: [0x33, 0x66, 0xcc] }, // blue
    { bit: 4096, rgb: [0x7f, 0x66, 0x4c] }, // brown
    { bit: 8192, rgb: [0x57, 0xa6, 0x4e] }, // green
    { bit: 16384, rgb: [0xcc, 0x4c, 0x4c] }, // red
    { bit: 32768, rgb: [0x11, 0x11, 0x11] }, // black
];

function nearestCCBit(r: number, g: number, b: number): number {
    let best = CC_COLORS[0].bit;
    let bestD = Number.POSITIVE_INFINITY;
    for (const { bit, rgb } of CC_COLORS) {
        const dr = r - rgb[0],
            dg = g - rgb[1],
            db = b - rgb[2];
        const d = dr * dr + dg * dg + db * db;
        if (d < bestD) {
            bestD = d;
            best = bit;
        }
    }
    return best;
}

async function readInputBytes(req: NextRequest): Promise<Uint8Array> {
    const ctype = req.headers.get("content-type") || "";
    // 1) multipart/form-data (file field "file")
    if (ctype.startsWith("multipart/form-data")) {
        const form = await req.formData();
        const file = form.get("file");
        if (file && file instanceof File) {
            return new Uint8Array(await file.arrayBuffer());
        }
    }
    // 2) raw blob (image/* or octet-stream)
    if (ctype.startsWith("image/") || ctype === "application/octet-stream") {
        return new Uint8Array(await req.arrayBuffer());
    }
    // 3) JSON { url: string }
    if (ctype.includes("application/json")) {
        const { url } = await req.json();
        if (!url || typeof url !== "string")
            throw new Error("Missing 'url' in JSON.");
        const r = await fetch(url);
        if (!r.ok) throw new Error(`Failed to fetch url (${r.status})`);
        return new Uint8Array(await r.arrayBuffer());
    }
    throw new Error(
        "Provide a blob (image/*), form-data 'file', or JSON {url}."
    );
}

export async function POST(req: NextRequest) {
    try {
        // Query params: w, h, keep_aspect (default 1), format ("row"|"flat")
        const { searchParams } = new URL(req.url);
        const w = clampInt(searchParams.get("w"), 1, 256, 25);
        const h = clampInt(searchParams.get("h"), 1, 256, 25);
        const keepAspect = searchParams.get("keep_aspect") !== "0";
        const outFormat = (searchParams.get("format") || "row").toLowerCase(); // "row" = rows of bits

        const bytes = await readInputBytes(req);

        // Decode & resize with sharp
        let img = sharp(bytes, { failOn: "none" })
            .ensureAlpha()
            .removeAlpha()
        if (keepAspect) {
            // Fit inside w x h; we'll pad with black to exact size
            img = img.resize({ width: w, height: h, fit: "inside" });
            const meta = await img.metadata();
            const pw = Math.min(meta.width ?? w, w);
            const ph = Math.min(meta.height ?? h, h);
            img = img
                .extend({
                    top: 0,
                    left: 0,
                    right: w - pw,
                    bottom: h - ph,
                    background: { r: 17, g: 17, b: 17 },
                })
                .resize(w, h, { fit: "fill" });
        } else {
            img = img.resize({ width: w, height: h, fit: "fill" });
        }

        const raw = await img.raw().toBuffer(); // RGB pixels
        const width = w,
            height = h;

        // Quantize to CC palette
        const pixels: number[][] = new Array(height);
        for (let y = 0; y < height; y++) {
            const row: number[] = new Array(width);
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 3;
                row[x] = nearestCCBit(raw[idx], raw[idx + 1], raw[idx + 2]);
            }
            pixels[y] = row;
        }

        // Optionally output flat array for smaller JSON
        if (outFormat === "flat") {
            const flat: number[] = [];
            for (const r of pixels) flat.push(...r);
            return Response.json({
                w: width,
                h: height,
                pixels: flat,
                format: "flat",
            });
        }

        return Response.json({ w: width, h: height, pixels, format: "row" });
    } catch (err: any) {
        return new Response(
            JSON.stringify({ error: err?.message || "Conversion failed" }),
            { status: 400, headers: { "content-type": "application/json" } }
        );
    }
}

function clampInt(v: string | null, min: number, max: number, def: number) {
    const n = v ? parseInt(v, 10) : def;
    if (Number.isNaN(n)) return def;
    return Math.max(min, Math.min(max, n));
}
