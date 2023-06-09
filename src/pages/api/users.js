import PocketBase from 'pocketbase';

export default async function handler(req, res) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_DB_URL || 'http://127.0.0.1:8090');
  const list = await pb.collection('users').getFullList();

  res.status(200).json({ data: list });
}
