import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  ctx: RouteContext<'/api/mchead/[name]'>
) {
  // 1. Await the params (Required in Next.js 15+)
  const name = (await ctx.params).name;

  // 2. Define the endpoints
  const littleSkinUrl = `https://littleskin.cn/avatar/player/${name}?3d&png`;
  const fallbackUrl = `https://mc-heads.net/head/${name}/right`;

  try {
    // 3. Try fetching from LittleSkin first
    const littleSkinResponse = await fetch(littleSkinUrl, {
      method: 'GET',
      // Optional: Add a timeout so we don't hang too long before fallback
      signal: AbortSignal.timeout(2000), 
    });

    // 4. If LittleSkin finds the player (Status 200), return that image
    if (littleSkinResponse.ok) {
      const contentType = littleSkinResponse.headers.get('content-type') || 'image/png';
      const arrayBuffer = await littleSkinResponse.arrayBuffer();

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600, immutable',
        },
      });
    }
  } catch {}

  // 5. Fallback: Fetch from mc-heads.net
  try {
    const fallbackResponse = await fetch(fallbackUrl);
    
    // If fallback fails, return a 404 or a default Steve image
    if (!fallbackResponse.ok) {
        return new NextResponse('Avatar not found', { status: 404 });
    }

    const contentType = fallbackResponse.headers.get('content-type') || 'image/png';
    const arrayBuffer = await fallbackResponse.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, immutable',
      },
    });

  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}