import { useState } from "react";

interface ShareMessageProps {
  link: string;
  onShowMessage: boolean;
  setOnShowMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareMessage: React.FC<ShareMessageProps> = ({
  link,
  onShowMessage,
  setOnShowMessage,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
  };

  if (!onShowMessage) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto">
        <p className="text-gray-700 text-sm">
          This file is currently <span className="font-semibold">public</span>.
          You can change its accessibility in{" "}
          <span className="font-semibold">Settings</span>.
        </p>

        <div className="mt-3 p-2 bg-gray-100 text-gray-900 text-sm rounded-md break-all">
          {link}
        </div>

        <button
          onClick={handleCopy}
          className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {copied ? "✅ Copied!" : "📋 Copy Link"}
        </button>

        <button
          onClick={() => setOnShowMessage(false)}
          className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareMessage;
