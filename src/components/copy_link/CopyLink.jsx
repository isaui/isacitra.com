import React, { useState } from 'react';

const CopyLinkApp = ({ initialUrl }) => {
  const [url, setUrl] = useState(initialUrl || '');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="border  p-2  rounded-md  "
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className={` ml-2 bg-slate-800 text-white px-3 py-2 rounded-md ${
          copied ? 'bg-green-900' : 'hover:bg-slate-950'
        }`}
        onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default CopyLinkApp;