import fs from 'node:fs';
import path from 'node:path';
import formidable from 'formidable';
import { getScorecardData, resolveWorkbookPath } from '@/lib/scorecard';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024,
    });
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ fields, files });
    });
  });

const isSpreadsheet = (file) => {
  if (!file) return false;
  const allowedExtensions = ['.xlsx'];
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  const ext = path.extname(file.originalFilename || '').toLowerCase();
  return allowedExtensions.includes(ext) || allowedTypes.includes(file.mimetype);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { files } = await parseForm(req);
    const uploaded = Array.isArray(files?.workbook) ? files.workbook[0] : files?.workbook;

    if (!uploaded || !isSpreadsheet(uploaded)) {
      return res.status(400).json({ message: 'Please upload a valid .xlsx file.' });
    }

    const destination = resolveWorkbookPath();
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    await fs.promises.copyFile(uploaded.filepath, destination);
    await fs.promises.chmod(destination, 0o644);

    const cadence = Array.isArray(req.query?.cadence) ? req.query.cadence[0] : req.query?.cadence;
    const payload = getScorecardData({ cadence });

    return res.status(200).json({
      message: 'Workbook uploaded successfully.',
      data: payload,
      file: {
        name: path.basename(destination),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Upload failed.' });
  }
}
