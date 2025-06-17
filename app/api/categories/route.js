import { promises as fs } from 'fs';
import { join } from 'path';

export async function GET() {
  const filePath = join(process.cwd(), 'app/api/categories/categories.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const categories = JSON.parse(data);
    return Response.json(categories);
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Could not load categories.' }), { status: 500 });
  }
} 