import { getScorecardData } from '@/lib/scorecard';

export default function handler(req, res) {
  try {
    const cadence = Array.isArray(req.query?.cadence) ? req.query.cadence[0] : req.query?.cadence;
    const payload = getScorecardData({ cadence });
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
