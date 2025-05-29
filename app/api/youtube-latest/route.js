export async function GET(req) {
  const res = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=UCwujSyyzYi99P9vMWriOp6w');
  const xml = await res.text();
  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' }
  });
} 