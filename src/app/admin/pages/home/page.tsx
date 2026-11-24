'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/ToastContext';
import SingleRecordHero from '@/components/admin/SingleRecordHero';
import ModelTable from '@/components/admin/ModelTable';
import ModelFormModal from '@/components/admin/ModelFormModal';
import { modelConfigsMap } from '@/lib/admin/fields';

type ActiveTab = 'hero' | 'stats' | 'services' | 'projects' | 'faqs' | 'instagram';

interface InstaPostItemState {
  url: string;
  imageUrl?: string;
  videoUrl?: string;
  tag?: string;
  duration?: string;
  caption?: string;
}

export default function AdminHomePageEditor() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');
  const { showToast } = useToast();

  // Model states for tables
  const [stats, setStats] = useState<Record<string, unknown>[]>([]);
  const [services, setServices] = useState<Record<string, unknown>[]>([]);
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [faqs, setFaqs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);

  // Instagram section state
  const [instaSettings, setInstaSettings] = useState<{
    handle: string;
    title: string;
    profileUrl: string;
    posts: InstaPostItemState[];
  }>({
    handle: '@eliweb.in on Instagram',
    title: 'Stories, Reels & Studio Craft',
    profileUrl: 'https://www.instagram.com/eliweb.in/',
    posts: [
      { url: 'https://www.instagram.com/p/DeHKFFFySlE/', imageUrl: '/uploads/instagram-reel-cover.webp', tag: 'Hyperreal Surrealism', duration: '0:36' },
      { url: 'https://www.instagram.com/p/Dd9GTXxSYj2/', imageUrl: '', tag: 'Mixed Animation', duration: '0:43' },
      { url: 'https://www.instagram.com/p/Dd9Er4aSopu/', imageUrl: '', tag: 'Felt Animation', duration: '0:40' },
    ],
  });
  const [savingInsta, setSavingInsta] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [uploadingVideoIdx, setUploadingVideoIdx] = useState<number | null>(null);
  const [fetchingThumbIdx, setFetchingThumbIdx] = useState<number | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>('stat');
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAllSections();
  }, []);

  useEffect(() => {
    if (activeTab !== 'hero') {
      fetchTabData();
    }
  }, [activeTab]);

  const fetchAllSections = async () => {
    try {
      const [statsRes, servicesRes, projectsRes, faqsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/stat').then((r) => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/admin/service').then((r) => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/admin/project').then((r) => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/admin/faq').then((r) => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/admin/site-settings').then((r) => r.ok ? r.json() : []).catch(() => []),
      ]);

      if (Array.isArray(statsRes)) setStats(statsRes);
      if (Array.isArray(servicesRes)) setServices(servicesRes);
      if (Array.isArray(projectsRes)) setProjects(projectsRes);
      if (Array.isArray(faqsRes)) {
        setFaqs(faqsRes.filter((f: any) => !f.page || f.page === 'homepage'));
      }
      if (Array.isArray(settingsRes)) {
        const map: Record<string, string> = {};
        settingsRes.forEach((s: any) => { map[s.key] = s.value; });
        if (map.instagram_posts) {
          try {
            const arr = JSON.parse(map.instagram_posts);
            if (Array.isArray(arr) && arr.length > 0) {
              setInstaSettings((prev) => ({
                ...prev,
                handle: map.instagram_handle || prev.handle,
                title: map.instagram_title || prev.title,
                profileUrl: map.instagram_url || prev.profileUrl,
                posts: arr.map((item: any) => ({
                  url: item.url || '',
                  imageUrl: item.imageUrl || '',
                  videoUrl: item.videoUrl || '',
                  tag: item.tag || '',
                  duration: item.duration || '',
                  caption: item.caption || '',
                })),
              }));
            }
          } catch {}
        }
      }
    } catch {
      // Non-blocking
    }
  };

  const fetchTabData = async () => {
    if (activeTab === 'hero') return;
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const res = await fetch('/api/admin/stat');
        if (res.ok) setStats(await res.json());
      } else if (activeTab === 'services') {
        const res = await fetch('/api/admin/service');
        if (res.ok) setServices(await res.json());
      } else if (activeTab === 'projects') {
        const res = await fetch('/api/admin/project');
        if (res.ok) setProjects(await res.json());
      } else if (activeTab === 'faqs') {
        const res = await fetch('/api/admin/faq');
        if (res.ok) {
          const list = await res.json();
          setFaqs(Array.isArray(list) ? list.filter((f: any) => !f.page || f.page === 'homepage') : []);
        }
      } else if (activeTab === 'instagram') {
        const res = await fetch('/api/admin/site-settings');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            const map: Record<string, string> = {};
            list.forEach((s: any) => {
              map[s.key] = s.value;
            });
            let parsedPosts: InstaPostItemState[] = instaSettings.posts;
            if (map.instagram_posts) {
              try {
                const arr = JSON.parse(map.instagram_posts);
                if (Array.isArray(arr) && arr.length > 0) {
                  parsedPosts = arr.map((item: any) => {
                    if (typeof item === 'string') return { url: item, imageUrl: '', tag: 'EliWeb Reel', duration: '0:36' };
                    return {
                      url: item.url || '',
                      imageUrl: item.imageUrl || '',
                      videoUrl: item.videoUrl || '',
                      tag: item.tag || '',
                      duration: item.duration || '',
                      caption: item.caption || '',
                    };
                  });
                }
              } catch {
                parsedPosts = map.instagram_posts
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((url) => ({ url, imageUrl: '' }));
              }
            }
            setInstaSettings({
              handle: map.instagram_handle || instaSettings.handle,
              title: map.instagram_title || instaSettings.title,
              profileUrl: map.instagram_url || instaSettings.profileUrl,
              posts: parsedPosts,
            });
          }
        }
      }
    } catch {
      showToast('Failed to load section data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInstagram = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInsta(true);
    try {
      // Clean and auto-populate posts
      const processedPosts = await Promise.all(
        instaSettings.posts
          .filter((p) => p.url && p.url.trim().length > 0)
          .map(async (post) => {
            const cleanPost = { ...post };
            // Clear invalid videoUrl if user pasted Instagram page link as video
            if (cleanPost.videoUrl && cleanPost.videoUrl.includes('instagram.com')) {
              cleanPost.videoUrl = '';
            }
            // Auto-fetch high-res cover and duration if image is missing
            if (!cleanPost.imageUrl && cleanPost.url) {
              try {
                const res = await fetch('/api/admin/instagram-thumbnail', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url: cleanPost.url }),
                });
                const data = await res.json();
                if (data.success && data.imageUrl) {
                  cleanPost.imageUrl = data.imageUrl;
                  if (!cleanPost.duration && data.duration) cleanPost.duration = data.duration;
                  if (!cleanPost.caption && data.caption) cleanPost.caption = data.caption;
                }
              } catch {
                // Ignore background fetch error
              }
            }
            return cleanPost;
          })
      );

      const payload = [
        { key: 'instagram_handle', value: instaSettings.handle },
        { key: 'instagram_title', value: instaSettings.title },
        { key: 'instagram_url', value: instaSettings.profileUrl },
        { key: 'instagram_posts', value: JSON.stringify(processedPosts) },
      ];

      for (const item of payload) {
        const res = await fetch('/api/admin/site-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to update setting');
        }
      }

      setInstaSettings((prev) => ({ ...prev, posts: processedPosts }));
      showToast('Instagram Feed section updated successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update Instagram settings', 'error');
    } finally {
      setSavingInsta(false);
    }
  };

  const handleAddInstaPost = () => {
    setInstaSettings((prev) => ({
      ...prev,
      posts: [...prev.posts, { url: '', imageUrl: '' }],
    }));
  };

  const handleUpdateInstaPost = (index: number, field: keyof InstaPostItemState, value: string) => {
    setInstaSettings((prev) => {
      const updated = [...prev.posts];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, posts: updated };
    });
  };

  const handleRemoveInstaPost = (index: number) => {
    setInstaSettings((prev) => {
      const updated = prev.posts.filter((_, i) => i !== index);
      return { ...prev, posts: updated };
    });
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIdx(index);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      handleUpdateInstaPost(index, 'imageUrl', data.url);
      showToast('Image uploaded! Black bars removed for this post.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleVideoUpload = async (index: number, file: File) => {
    setUploadingVideoIdx(index);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Video upload failed');
      }

      handleUpdateInstaPost(index, 'videoUrl', data.url);
      showToast('Video uploaded! In-browser video reel active.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Video upload failed', 'error');
    } finally {
      setUploadingVideoIdx(null);
    }
  };

  const handleAutoFetchThumbnail = async (index: number) => {
    const post = instaSettings.posts[index];
    if (!post?.url) {
      showToast('Please enter an Instagram post or reel URL first', 'error');
      return;
    }
    setFetchingThumbIdx(index);
    try {
      const res = await fetch('/api/admin/instagram-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: post.url }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to auto-fetch cover image');
      }
      setInstaSettings((prev) => {
        const updated = [...prev.posts];
        updated[index] = {
          ...updated[index],
          imageUrl: data.imageUrl || updated[index].imageUrl,
          duration: data.duration || updated[index].duration || '0:45',
          caption: data.caption || updated[index].caption || '',
        };
        return { ...prev, posts: updated };
      });
      showToast('✨ Reel cover & metadata auto-fetched! Zero black bars enabled.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Auto-fetch failed. You can upload an image manually.', 'error');
    } finally {
      setFetchingThumbIdx(null);
    }
  };

  const handleOpenAdd = (model: string) => {
    setCurrentModel(model);
    setEditingRecord(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (model: string, record: Record<string, unknown>) => {
    setCurrentModel(model);
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleDelete = async (model: string, id: string) => {
    try {
      const res = await fetch(`/api/admin/${model}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Item deleted successfully', 'success');
      fetchTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item', 'error');
    }
  };

  const handleSave = async (formData: Record<string, unknown>) => {
    setSaving(true);
    try {
      const isUpdate = Boolean(editingRecord && editingRecord.id);
      const url = isUpdate
        ? `/api/admin/${currentModel}/${editingRecord!.id}`
        : `/api/admin/${currentModel}`;
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw err;
      }

      showToast(`Saved successfully!`, 'success');
      setModalOpen(false);
      fetchTabData();
    } catch (err: any) {
      showToast(err?.error || 'Failed to save', 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const currentConfig = modelConfigsMap[currentModel] || modelConfigsMap['stat'];

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>PAGE BUILDER</div>
          <h1 style={styles.title}>Home Page Content &amp; Sections</h1>
          <p style={styles.subtitle}>
            Control and edit every section visible on the EliWeb.in homepage. Updates reflect live immediately upon saving.
          </p>
        </div>
        <Link href="/" target="_blank" rel="noopener noreferrer" style={styles.viewLiveBtn}>
          👁️ View Live Home Page ↗
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabsWrap}>
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          style={{ ...styles.tabBtn, ...(activeTab === 'hero' ? styles.tabBtnActive : {}) }}
        >
          🎯 Hero &amp; Headlines
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          style={{ ...styles.tabBtn, ...(activeTab === 'stats' ? styles.tabBtnActive : {}) }}
        >
          📈 Stats &amp; Badges ({stats.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          style={{ ...styles.tabBtn, ...(activeTab === 'services' ? styles.tabBtnActive : {}) }}
        >
          ⚡ Services Cards ({services.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          style={{ ...styles.tabBtn, ...(activeTab === 'projects' ? styles.tabBtnActive : {}) }}
        >
          💼 Showcase Projects ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          style={{ ...styles.tabBtn, ...(activeTab === 'faqs' ? styles.tabBtnActive : {}) }}
        >
          ❓ Homepage FAQs ({faqs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('instagram')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'instagram' ? styles.tabBtnActive : {}),
            background: activeTab === 'instagram' ? 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)' : '#141414',
            borderColor: activeTab === 'instagram' ? '#DD2A7B' : '#262626',
          }}
        >
          📸 Instagram Section ({instaSettings.posts.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div style={styles.contentCard}>
        {activeTab === 'hero' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Hero Banner, Rotating Headlines &amp; CTAs</h2>
              <p style={styles.sectionDesc}>
                Edit the main hero message, CTAs, trust pills, and moving ticker displayed at the top of the homepage.
              </p>
            </div>
            <SingleRecordHero />
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Metrics &amp; Key Stats Strip</h2>
              <p style={styles.sectionDesc}>
                Values and labels displayed on the homepage stats bar and credibility badges (e.g. &quot;50+ Projects&quot;, &quot;100% Retention&quot;).
              </p>
            </div>
            <ModelTable
              config={modelConfigsMap['stat']}
              data={stats}
              loading={loading}
              onAdd={() => handleOpenAdd('stat')}
              onEdit={(rec) => handleOpenEdit('stat', rec)}
              onDelete={(id) => handleDelete('stat', id)}
              onRefresh={fetchTabData}
            />
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Digital Services Showcase</h2>
              <p style={styles.sectionDesc}>
                Services displayed in the interactive multi-box presentation and marquee on the homepage.
              </p>
            </div>
            <ModelTable
              config={modelConfigsMap['service']}
              data={services}
              loading={loading}
              onAdd={() => handleOpenAdd('service')}
              onEdit={(rec) => handleOpenEdit('service', rec)}
              onDelete={(id) => handleDelete('service', id)}
              onRefresh={fetchTabData}
            />
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Homepage Selected Works &amp; Case Studies</h2>
              <p style={styles.sectionDesc}>
                Work samples showcased on the homepage. Set <strong>Homepage Teaser</strong> to true to feature a project here.
              </p>
            </div>
            <ModelTable
              config={modelConfigsMap['project']}
              data={projects}
              loading={loading}
              onAdd={() => handleOpenAdd('project')}
              onEdit={(rec) => handleOpenEdit('project', rec)}
              onDelete={(id) => handleDelete('project', id)}
              onRefresh={fetchTabData}
            />
          </div>
        )}

        {activeTab === 'faqs' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Homepage Frequently Asked Questions</h2>
              <p style={styles.sectionDesc}>
                Questions and answers displayed in the accordion on the homepage.
              </p>
            </div>
            <ModelTable
              config={modelConfigsMap['faq']}
              data={faqs}
              loading={loading}
              onAdd={() => handleOpenAdd('faq')}
              onEdit={(rec) => handleOpenEdit('faq', rec)}
              onDelete={(id) => handleDelete('faq', id)}
              onRefresh={fetchTabData}
            />
          </div>
        )}

        {activeTab === 'instagram' && (
          <form onSubmit={handleSaveInstagram} style={styles.formCard}>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Instagram Feed, Reels &amp; Showcase Section</h2>
              <p style={styles.sectionDesc}>
                Configure the live Instagram row on the homepage. You can paste any Instagram link (posts or reels). If a vertical Reel shows black pillarbox bars from Instagram, upload or paste a clean cover image below to make it display full-width with <strong>zero black bars</strong>!
              </p>
            </div>

            <div style={styles.grid2}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Instagram Account Handle / Eyebrow</label>
                <input
                  type="text"
                  value={instaSettings.handle}
                  onChange={(e) => setInstaSettings({ ...instaSettings, handle: e.target.value })}
                  placeholder="@eliweb.in on Instagram"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Instagram Profile URL</label>
                <input
                  type="url"
                  value={instaSettings.profileUrl}
                  onChange={(e) => setInstaSettings({ ...instaSettings, profileUrl: e.target.value })}
                  placeholder="https://www.instagram.com/eliweb.in/"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Section Title / Headline</label>
              <input
                type="text"
                value={instaSettings.title}
                onChange={(e) => setInstaSettings({ ...instaSettings, title: e.target.value })}
                placeholder="Stories, Reels & Studio Craft"
                style={styles.input}
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ ...styles.label, fontSize: '0.95rem', color: '#fff' }}>
                  Instagram Posts &amp; Reels ({instaSettings.posts.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddInstaPost}
                  style={styles.addSmallBtn}
                >
                  + Add Another Instagram Card
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {instaSettings.posts.map((post, index) => (
                  <div key={index} style={styles.postCardBox}>
                    <div style={styles.postCardHeader}>
                      <span style={styles.postIndexBadge}>Reel Card #{index + 1}</span>
                      <span style={styles.cleanBadge}>✨ 9:16 Reel Player (Zero Black Bars)</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInstaPost(index)}
                        style={styles.removeBtn}
                        title="Remove this card"
                      >
                        ✕ Remove
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                      <div style={styles.formGroup}>
                        <label style={styles.subLabel}>Category / Style Tag (Top Left Badge)</label>
                        <input
                          type="text"
                          value={post.tag || ''}
                          onChange={(e) => handleUpdateInstaPost(index, 'tag', e.target.value)}
                          placeholder="e.g. Hyperreal Surrealism, Mobile MVP..."
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.subLabel}>Duration (Top Right Badge)</label>
                        <input
                          type="text"
                          value={post.duration || ''}
                          onChange={(e) => handleUpdateInstaPost(index, 'duration', e.target.value)}
                          placeholder="e.g. 0:36 or 0:43"
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.subLabel}>Instagram Post or Reel URL *</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="url"
                          value={post.url}
                          onChange={(e) => handleUpdateInstaPost(index, 'url', e.target.value)}
                          placeholder="https://www.instagram.com/reel/DeHKFFFySlE/ or /p/..."
                          style={{ ...styles.input, flex: 1 }}
                          required
                        />
                        {post.url && (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.previewLink}
                            title="Open link in Instagram"
                          >
                            ↗ Test Link
                          </a>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <label style={styles.subLabel}>
                        Cover Image / Poster (Fixes Black Bars &amp; Shows Before Play):
                      </label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          value={post.imageUrl || ''}
                          onChange={(e) => handleUpdateInstaPost(index, 'imageUrl', e.target.value)}
                          placeholder="Paste image URL (or click Auto-Fetch / Upload)..."
                          style={{ ...styles.input, flex: 1, minWidth: '220px' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleAutoFetchThumbnail(index)}
                          disabled={fetchingThumbIdx === index}
                          style={{
                            ...styles.uploadBtn,
                            backgroundColor: '#6366f1',
                            borderColor: '#818cf8',
                            cursor: fetchingThumbIdx === index ? 'wait' : 'pointer',
                          }}
                          title="Automatically download high-res cover image from Instagram"
                        >
                          {fetchingThumbIdx === index ? 'Fetching...' : '✨ Auto-Fetch Cover'}
                        </button>
                        <label style={styles.uploadBtn}>
                          {uploadingIdx === index ? 'Uploading...' : '📁 Upload Image'}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(index, file);
                            }}
                          />
                        </label>
                        {post.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleUpdateInstaPost(index, 'imageUrl', '')}
                            style={styles.clearImgBtn}
                          >
                            Clear Image
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <label style={styles.subLabel}>
                        Direct Video (Optional MP4 for In-Browser Playback):
                      </label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          value={post.videoUrl || ''}
                          onChange={(e) => handleUpdateInstaPost(index, 'videoUrl', e.target.value)}
                          placeholder="Paste MP4 video URL (or click Upload Video)..."
                          style={{ ...styles.input, flex: 1, minWidth: '220px' }}
                        />
                        <label style={{ ...styles.uploadBtn, backgroundColor: '#0284c7', borderColor: '#38bdf8' }}>
                          {uploadingVideoIdx === index ? 'Uploading...' : '🎥 Upload Video (MP4)'}
                          <input
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleVideoUpload(index, file);
                            }}
                          />
                        </label>
                        {post.videoUrl && (
                          <button
                            type="button"
                            onClick={() => handleUpdateInstaPost(index, 'videoUrl', '')}
                            style={styles.clearImgBtn}
                          >
                            Clear Video
                          </button>
                        )}
                      </div>
                      {post.imageUrl && (
                        <div style={styles.thumbPreviewWrap}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.imageUrl}
                            alt="Preview"
                            style={styles.thumbImg}
                          />
                          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                            ✓ Live 9:16 Reel Card Preview active: Zero black bars!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                type="submit"
                disabled={savingInsta}
                style={{
                  ...styles.saveBtn,
                  background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)',
                }}
              >
                {savingInsta ? 'Saving Instagram Section...' : 'Save Instagram Section Changes'}
              </button>
              <Link href="/#instagram-feed" target="_blank" rel="noopener noreferrer" style={styles.viewLiveBtn}>
                👁️ Preview on Live Site ↗
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* Shared Form Modal for Add/Edit */}
      {modalOpen && (
        <ModelFormModal
          title={editingRecord ? `Edit ${currentConfig.singular}` : `Create New ${currentConfig.singular}`}
          fields={currentConfig.fields}
          initialData={editingRecord}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          loading={saving}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#00C2CB',
    letterSpacing: '0.08em',
    marginBottom: '6px',
  },
  title: {
    fontSize: '1.85rem',
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 6px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#888',
    margin: 0,
    maxWidth: '650px',
    lineHeight: 1.5,
  },
  viewLiveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '8px',
    background: 'rgba(0, 194, 203, 0.1)',
    border: '1px solid rgba(0, 194, 203, 0.3)',
    color: '#00C2CB',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  tabsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    borderBottom: '1px solid #222',
    paddingBottom: '14px',
    alignItems: 'center',
  },
  tabBtn: {
    padding: '10px 16px',
    borderRadius: '8px',
    background: '#141414',
    border: '1px solid #262626',
    color: '#aaa',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  },
  tabBtnActive: {
    background: '#0066FF',
    borderColor: '#0066FF',
    color: '#fff',
    boxShadow: '0 2px 10px rgba(0, 102, 255, 0.35)',
  },
  contentCard: {
    minHeight: '400px',
  },
  sectionInfo: {
    marginBottom: '20px',
    padding: '16px 20px',
    background: '#121212',
    border: '1px solid #222',
    borderRadius: '10px',
  },
  sectionHeading: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 4px',
  },
  sectionDesc: {
    fontSize: '0.85rem',
    color: '#888',
    margin: 0,
    lineHeight: 1.5,
  },
  formCard: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#ccc',
  },
  subLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#aaa',
    marginBottom: '4px',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    background: '#181818',
    border: '1px solid #333',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  postCardBox: {
    padding: '18px',
    background: '#141414',
    border: '1px solid #282828',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  postCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  postIndexBadge: {
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#DD2A7B',
  },
  cleanBadge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#10b981',
    background: 'rgba(16, 185, 129, 0.12)',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  standardBadge: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#888',
    background: '#222',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  previewLink: {
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#222',
    border: '1px solid #333',
    color: '#00C2CB',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  },
  removeBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  uploadBtn: {
    padding: '11px 16px',
    borderRadius: '8px',
    background: '#222',
    border: '1px solid #3a3a3a',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  clearImgBtn: {
    padding: '11px 14px',
    borderRadius: '8px',
    background: 'transparent',
    border: '1px solid #444',
    color: '#888',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  thumbPreviewWrap: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  thumbImg: {
    width: '50px',
    height: '50px',
    borderRadius: '6px',
    objectFit: 'cover',
    border: '1px solid #333',
  },
  addSmallBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    background: 'rgba(221, 42, 123, 0.15)',
    border: '1px solid rgba(221, 42, 123, 0.4)',
    color: '#f472b6',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveBtn: {
    alignSelf: 'flex-start',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(221, 42, 123, 0.35)',
  },
};
