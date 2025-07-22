import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const token = req.headers.authorization;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}