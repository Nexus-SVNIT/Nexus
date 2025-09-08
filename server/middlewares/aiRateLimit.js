const AiUsage = require('../models/AiUsageSchema');

// Fixed IST offset (UTC+05:30)
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getIstDayKeyAndReset() {
  const now = Date.now();
  const shifted = new Date(now + IST_OFFSET_MS);
  const y = shifted.getUTCFullYear();
  const m = shifted.getUTCMonth();
  const d = shifted.getUTCDate();

  const istDayStartUTCms = Date.UTC(y, m, d) - IST_OFFSET_MS;
  const nextResetUTCms = istDayStartUTCms + 24 * 60 * 60 * 1000;

  const dayKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const resetAtISTString = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(nextResetUTCms));

  return { dayKey, nextResetUTCms, resetAtISTString };
}

module.exports = async function aiRateLimit(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { dayKey, nextResetUTCms, resetAtISTString } = getIstDayKeyAndReset();

    let usage = await AiUsage.findOne({ user: userId, date: dayKey });
    if (!usage) {
      usage = await AiUsage.create({ user: userId, date: dayKey, count: 1 });
      res.set('X-RateLimit-Limit', '3');
      res.set('X-RateLimit-Remaining', '2');
      res.set('X-RateLimit-Reset', String(Math.floor(nextResetUTCms / 1000)));
      res.set('X-RateLimit-Reset-IST', resetAtISTString);
      return next();
    }

    if (usage.count >= 3) {
      const retryAfterSec = Math.max(1, Math.ceil((nextResetUTCms - Date.now()) / 1000));
      res.set('X-RateLimit-Limit', '3');
      res.set('X-RateLimit-Remaining', '0');
      res.set('X-RateLimit-Reset', String(Math.floor(nextResetUTCms / 1000)));
      res.set('X-RateLimit-Reset-IST', resetAtISTString);
      res.set('Retry-After', String(retryAfterSec));
      return res.status(429).json({
        success: false,
        message: `Daily AI bot limit reached (3 requests per user). Your limit will reset at ${resetAtISTString} (IST).`,
        resetAt: nextResetUTCms,
        resetAtIST: resetAtISTString,
        remaining: 0,
      });
    }

    usage.count += 1;
    await usage.save();
    res.set('X-RateLimit-Limit', '3');
    res.set('X-RateLimit-Remaining', String(3 - usage.count));
    res.set('X-RateLimit-Reset', String(Math.floor(nextResetUTCms / 1000)));
    res.set('X-RateLimit-Reset-IST', resetAtISTString);
    return next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Rate limit check failed', error: err.message });
  }
};