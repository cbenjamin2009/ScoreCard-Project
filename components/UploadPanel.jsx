import { useEffect, useRef, useState } from 'react';

const MAX_SIZE_BYTES = 50 * 1024 * 1024;

const readableSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown';
  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return String(timestamp);
  }
};

export default function UploadPanel({ cadence = 'weekly', onSuccess }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('muted');
  const [fileMeta, setFileMeta] = useState({ name: 'IT Scorecard 2026.xlsx', updatedAt: '' });

  const loadFileMeta = async () => {
    try {
      const response = await fetch('/api/download?meta=1');
      if (!response.ok) return;
      const data = await response.json();
      setFileMeta({
        name: data.name || 'IT Scorecard 2026.xlsx',
        updatedAt: data.updatedAt || '',
      });
    } catch {
      /* ignore metadata errors */
    }
  };

  useEffect(() => {
    loadFileMeta();
  }, []);

  const resetState = () => {
    setIsDragging(false);
    setIsUploading(false);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    if (!file.name.endsWith('.xlsx')) {
      setVariant('error');
      setMessage('Only .xlsx files are supported.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setVariant('error');
      setMessage(`File is too large. Max size is ${readableSize(MAX_SIZE_BYTES)}.`);
      return;
    }

    const formData = new FormData();
    formData.append('workbook', file);

    try {
      setIsUploading(true);
      setVariant('muted');
      setMessage('Uploading workbook...');
      const response = await fetch(`/api/upload?cadence=${cadence}`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }
      setVariant('success');
      setMessage('Upload complete. Dashboard refreshed.');
      setFileMeta({
        name: result.file?.name || fileMeta.name,
        updatedAt: result.file?.updatedAt || new Date().toISOString(),
      });
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (error) {
      setVariant('error');
      setMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFiles = (files) => {
    if (files?.length) {
      handleUpload(files[0]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer?.files?.length) {
      handleUpload(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className="upload-panel">
      <p className="upload-panel__title">Upload updated workbook</p>
      <p className="muted">Drag & drop a new .xlsx file or use the button below.</p>
      <div className="upload-panel__actions">
        <a className="link-button" href="/api/download">
          Download {fileMeta.name}
        </a>
        <span className="upload-panel__meta">Last updated {formatTimestamp(fileMeta.updatedAt)}</span>
      </div>
      <div
        className={`upload-dropzone ${isDragging ? 'upload-dropzone--active' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && inputRef.current) {
            inputRef.current.click();
          }
        }}
      >
        <p>Drop file here</p>
        <p className="muted">.xlsx up to {readableSize(MAX_SIZE_BYTES)}</p>
        <button
          type="button"
          className="ghost-button"
          onClick={() => {
            resetState();
            inputRef.current?.click();
          }}
        >
          Select from computer
        </button>
        <input
          type="file"
          accept=".xlsx"
          ref={inputRef}
          hidden
          onChange={(event) => {
            if (event.target.files?.length) {
              handleFiles(event.target.files);
              event.target.value = '';
            }
          }}
        />
      </div>
      {isUploading && <p className="muted">Uploading...</p>}
      {message && <p className={`upload-panel__message upload-panel__message--${variant}`}>{message}</p>}
    </div>
  );
}
