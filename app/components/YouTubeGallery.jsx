import React, { useEffect, useState } from 'react';

const YOUTUBE_RSS_URL = '/api/youtube-latest';
const CHANNEL_URL = 'https://www.youtube.com/@Thanmaihomefoods';

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return date.toLocaleDateString();
}

export default function YouTubeGallery() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channel, setChannel] = useState({ name: '', url: CHANNEL_URL });
  const [showModal, setShowModal] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(YOUTUBE_RSS_URL);
        const text = await res.text();
        const parser = new window.DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        // Channel info
        const channelName = xml.getElementsByTagName('title')[0]?.textContent || 'YouTube Channel';
        setChannel({ name: channelName, url: CHANNEL_URL });
        // Videos
        const entries = Array.from(xml.getElementsByTagName('entry')).slice(0, 6);
        const vids = entries.map(entry => {
          const id = entry.getElementsByTagName('yt:videoId')[0]?.textContent;
          const title = entry.getElementsByTagName('title')[0]?.textContent;
          const link = entry.getElementsByTagName('link')[0]?.getAttribute('href');
          const thumbnail = entry.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url');
          const published = entry.getElementsByTagName('published')[0]?.textContent;
          const description = entry.getElementsByTagName('media:description')[0]?.textContent || '';
          // Duration is not present in YouTube RSS, but check for media:content duration attribute
          let duration = null;
          const mediaContent = entry.getElementsByTagName('media:content')[0];
          if (mediaContent && mediaContent.getAttribute('duration')) {
            const dur = parseInt(mediaContent.getAttribute('duration'));
            if (!isNaN(dur)) {
              const min = Math.floor(dur / 60);
              const sec = dur % 60;
              duration = `${min}:${sec.toString().padStart(2, '0')}`;
            }
          }
          return { id, title, link, thumbnail, published, description, duration };
        });
        setVideos(vids);
      } catch (err) {
        setError('Failed to load YouTube videos.');
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const openModal = (video) => {
    setModalVideo(video);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalVideo(null);
  };

  return (
    <section className="youtube-gallery-section" aria-label="Latest YouTube Videos" role="region" style={{marginBottom: '2.5rem'}}>
      {/* Channel Info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#A01d46', marginBottom: '0.5rem', fontSize: '2rem' }}>{channel.name}</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href={channel.url} target="_blank" rel="noopener noreferrer" style={{ color: '#A01d46', fontWeight: 'bold', fontSize: '1.1rem' }}>Visit Channel</a>
          <a href={channel.url + '?sub_confirmation=1'} target="_blank" rel="noopener noreferrer" style={{ background: '#A01d46', color: '#fff', borderRadius: '6px', padding: '0.4rem 1.1rem', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem' }}>Subscribe</a>
        </div>
      </div>
      {loading && <p style={{ textAlign: 'center' }}>Loading videos…</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div className="youtube-gallery-grid">
        {videos.map(video => (
          <div
            key={video.id}
            className="youtube-gallery-card"
            tabIndex={0}
            aria-label={`Watch: ${video.title}`}
            style={{ cursor: 'pointer' }}
            onClick={() => openModal(video)}
            onKeyDown={e => { if (e.key === 'Enter') openModal(video); }}
          >
            <div className="youtube-gallery-thumb-wrapper">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="youtube-gallery-thumb"
                loading="lazy"
              />
              <span className="youtube-gallery-play">▶</span>
              {video.duration && (
                <span style={{ position: 'absolute', right: 8, bottom: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', borderRadius: 4, fontSize: '0.95rem', padding: '2px 6px' }}>{video.duration}</span>
              )}
            </div>
            <div className="youtube-gallery-title">{video.title}</div>
            <div style={{ color: '#666', fontSize: '0.98rem', margin: '0 1rem 0.5rem 1rem', textAlign: 'center' }}>{video.description.slice(0, 80)}{video.description.length > 80 ? '…' : ''}</div>
            <div style={{ color: '#888', fontSize: '0.92rem', marginBottom: '0.7rem', textAlign: 'center' }}>{video.published ? timeAgo(video.published) : ''}</div>
          </div>
        ))}
      </div>
      {/* View More Button */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <a href={channel.url} target="_blank" rel="noopener noreferrer" style={{ color: '#A01d46', fontWeight: 'bold', fontSize: '1.1rem' }}>View more videos →</a>
      </div>
      {/* Modal for inline player */}
      {showModal && modalVideo && (
        <div
          style={{
            position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={closeModal}
        >
          <div
            style={{ background: '#fff', borderRadius: 12, padding: 0, maxWidth: '90vw', maxHeight: '80vh', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{ position: 'absolute', top: 8, right: 12, background: 'transparent', border: 'none', fontSize: '2rem', color: '#A01d46', cursor: 'pointer', zIndex: 2 }}
              aria-label="Close video"
            >×</button>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${modalVideo.id}?autoplay=1`}
              title={modalVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: 12, width: '70vw', height: '40vw', maxWidth: 700, maxHeight: 400, minWidth: 280, minHeight: 160, background: '#000' }}
            ></iframe>
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#A01d46', marginBottom: 6 }}>{modalVideo.title}</div>
              <div style={{ color: '#666', fontSize: '0.98rem', marginBottom: 8 }}>{modalVideo.description}</div>
              <div style={{ color: '#888', fontSize: '0.92rem' }}>{modalVideo.published ? timeAgo(modalVideo.published) : ''}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 