import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Instagram URL is required' }, { status: 400 });
    }

    // Extract shortcode from URL: /p/CODE/ or /reel/CODE/ or /tv/CODE/
    const match = url.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not extract Instagram shortcode from URL' }, { status: 400 });
    }

    const shortcode = match[1];
    const embedUrl = `https://www.instagram.com/reel/${shortcode}/embed/`;

    // Fetch embed HTML
    const res = await fetch(embedUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch Instagram embed page (${res.status})` }, { status: 502 });
    }

    const html = await res.text();

    // 1. Extract high-res display_url (cover image)
    let remoteImgUrl: string | null = null;
    const dIdx = html.indexOf('display_url');
    if (dIdx !== -1) {
      const after = html.slice(dIdx);
      const httpIdx = after.indexOf('https:');
      if (httpIdx !== -1 && httpIdx < 50) {
        const urlPart = after.slice(httpIdx);
        const endIdx = urlPart.search(/\\*"/);
        if (endIdx !== -1) {
          let raw = urlPart.slice(0, endIdx);
          raw = raw.replace(/\\u00253D/g, '=');
          raw = raw.replace(/\\u0026/g, '&');
          raw = raw.replace(/\\u0025/g, '%');
          raw = raw.replace(/\\\//g, '/');
          raw = raw.replace(/\\\\/g, '');
          remoteImgUrl = raw;
        }
      }
    }

    // Fallback: look for any cdninstagram or fbcdn image in embed
    if (!remoteImgUrl) {
      const matches = html.match(/https:\/\/[^"'\s\\]+?(?:fbcdn\.net|cdninstagram\.com)[^"'\s\\]*?\.(?:webp|jpg)[^"'\s\\]*/g);
      if (matches && matches.length > 0) {
        const cleanUrls = matches.map((m) => m.replace(/&amp;/g, '&'));
        remoteImgUrl = cleanUrls.find((u) => !u.includes('profile_pic') && (u.includes('1080') || u.includes('720'))) || cleanUrls.find((u) => !u.includes('profile_pic')) || cleanUrls[0];
      }
    }

    // 2. Extract video duration if available
    let duration: string | null = null;
    const durMatch = html.match(/video_duration\\*"\s*:\s*([0-9.]+)/i);
    if (durMatch) {
      const totalSecs = Math.round(parseFloat(durMatch[1]));
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      duration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 3. Extract caption/title if available
    let caption: string | null = null;
    const capMatch = html.match(/edge_media_to_caption\\*".*?\\*"text\\*":\s*\\*"([^"\\]*(?:\\.[^"\\]*)*)\\*"/);
    if (capMatch && capMatch[1]) {
      caption = capMatch[1].replace(/\\n/g, ' ').replace(/\\u[0-9a-fA-F]{4}/g, '').trim().slice(0, 80);
    }

    if (!remoteImgUrl) {
      return NextResponse.json({
        success: false,
        error: 'No thumbnail image found in Instagram embed',
        shortcode,
        duration: duration || '0:45',
      }, { status: 404 });
    }

    // Download the image and save to public/uploads
    const imgRes = await fetch(remoteImgUrl);
    if (!imgRes.ok) {
      return NextResponse.json({ error: 'Failed to download Instagram thumbnail' }, { status: 502 });
    }

    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `insta-${shortcode}.webp`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      shortcode,
      duration: duration || '0:45',
      caption,
    });
  } catch (err: any) {
    console.error('Fetch Instagram thumbnail error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
