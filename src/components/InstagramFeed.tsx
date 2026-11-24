'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface InstagramPostItem {
  id?: string;
  url: string;
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
  tag?: string;
  duration?: string;
}

const DEFAULT_REELS: InstagramPostItem[] = [
  {
    id: 'reel-1',
    url: 'https://www.instagram.com/p/DeHKFFFySlE/',
    imageUrl: '/uploads/instagram-reel-cover.webp',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4',
    tag: 'Hyperreal Surrealism',
    duration: '0:36',
    caption: 'We Turn Ideas Into Apps - EliWeb Reel',
  },
  {
    id: 'reel-2',
    url: 'https://www.instagram.com/reel/Dfr0VEESTVZ/',
    imageUrl: '/uploads/insta-Dfr0VEESTVZ.webp',
    tag: 'Mixed Animation',
    duration: '0:45',
    caption: 'Cold Call Client Acquisition Strategy',
  },
  {
    id: 'reel-3',
    url: 'https://www.instagram.com/p/Dd9Er4aSopu/',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4',
    tag: 'Felt Animation',
    duration: '0:40',
    caption: 'Get Your App MVP Demo Before You Pay',
  },
];

interface InstagramFeedProps {
  handle?: string;
  title?: string;
  profileUrl?: string;
  posts?: InstagramPostItem[];
}

function extractShortcode(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

// Single Reel Player Card
function ReelCard({ post }: { post: InstagramPostItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(true);

  // Extract shortcode from reel link or video link
  const shortcode = extractShortcode(post.videoUrl) || extractShortcode(post.url);

  // Determine if this has a direct playable video stream (.mp4 / .webm) vs an Instagram Reel link
  const isDirectVideo = Boolean(
    post.videoUrl &&
    !post.videoUrl.includes('instagram.com') &&
    (post.videoUrl.endsWith('.mp4') ||
      post.videoUrl.endsWith('.webm') ||
      post.videoUrl.includes('cloudfront.net') ||
      post.videoUrl.includes('/uploads/'))
  );

  // High quality poster image
  const posterImage =
    post.imageUrl && post.imageUrl.trim().length > 0
      ? post.imageUrl
      : shortcode
        ? `/uploads/insta-${shortcode}.webp`
        : '/uploads/instagram-reel-cover.webp';

  const instagramUrl =
    post.url || (shortcode ? `https://www.instagram.com/reel/${shortcode}/` : 'https://www.instagram.com/eliweb.in/');

  // Autoplay video in mute on mount and when videoUrl changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = isMuted;

    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocked playback, guarantee muted and retry
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      }
    };

    playVideo();
    video.addEventListener('loadeddata', playVideo);

    return () => {
      video.removeEventListener('loadeddata', playVideo);
    };
  }, [post.videoUrl, isMuted]);

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <div ref={cardRef} className="reel-card-item">
      <div className="reel-card">
        {/* Top Badges (Category only - duration badge removed) */}
        <div className="reel-top-badges">
          <span className="reel-tag-pill">{post.tag || 'EliWeb Reel'}</span>
        </div>

        {/* Video / Media Layer */}
        {isDirectVideo ? (
          /* Native HTML5 Video - Autoplay in mute, edge-to-edge */
          <div className="reel-media-layer" onClick={toggleMute}>
            <video
              ref={videoRef}
              src={post.videoUrl}
              poster={posterImage}
              autoPlay
              muted={isMuted}
              playsInline
              loop
              preload="auto"
              className="reel-video"
            />
          </div>
        ) : (
          /* High-Res Reel Cover Poster (Edge-to-edge, zero black bars) */
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reel-media-layer"
            aria-label={`View ${post.caption || 'Reel'} on Instagram`}
          >
            <img
              src={posterImage}
              alt={post.caption || 'Instagram Reel'}
              className="reel-poster-img"
              loading="lazy"
            />
          </a>
        )}

        {/* Floating Sound Toggle Pill at Bottom-Right (When direct video is available) */}
        {isDirectVideo && (
          <button
            type="button"
            className="reel-sound-toggle-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Carousel Showcase
export default function InstagramFeed({
  handle = '@eliweb.in on Instagram',
  title = 'Stories, Reels & Studio Craft',
  profileUrl = 'https://www.instagram.com/eliweb.in/',
  posts: rawPosts,
}: InstagramFeedProps) {
  const posts = rawPosts && rawPosts.length > 0 ? rawPosts : DEFAULT_REELS;
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const cardWidth =
      trackRef.current.clientWidth >= 1024
        ? trackRef.current.clientWidth / 3
        : trackRef.current.clientWidth * 0.8;
    const offset = direction === 'left' ? -cardWidth : cardWidth;
    trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section className="instagram-feed-section" id="instagram-feed" aria-label="Instagram Feed & Reels">
      <div className="container insta-wide-container">
        {/* Section Header */}
        <div className="insta-header-row">
          <div className="insta-header-left">
            <div className="insta-badge-pill">
              <span className="insta-gradient-dot" />
              <span>{handle}</span>
            </div>
            <h2 className="section-headline insta-title">{title}</h2>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="insta-follow-btn"
            aria-label={`Follow ${handle} on Instagram`}
          >
            <svg
              className="insta-btn-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>Follow {handle.replace(/ on Instagram/i, '')} &rarr;</span>
          </a>
        </div>

        {/* Carousel Wrapper with Left & Right Arrows */}
        <div className="reel-carousel-wrapper">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="reel-nav-btn reel-nav-prev"
            aria-label="Previous reels"
            title="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Reel Track */}
          <div ref={trackRef} className="reel-carousel-track reels-track">
            {posts.map((post, idx) => (
              <ReelCard key={post.id || `reel-${idx}`} post={post} />
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="reel-nav-btn reel-nav-next"
            aria-label="Next reels"
            title="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>


      </div>
    </section>
  );
}
