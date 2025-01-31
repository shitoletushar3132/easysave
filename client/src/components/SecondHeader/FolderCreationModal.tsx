interface FolderCreationModalProps {
  showFolderModal: boolean;
  folderName: string;
  onFolderNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FolderCreationModal: React.FC<FolderCreationModalProps> = ({
  showFolderModal,
  folderName,
  onFolderNameChange,
  onCancel,
  onSubmit,
}) => {
  if (!showFolderModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-600 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={folderName}
            onChange={onFolderNameChange}
            placeholder="Enter folder name"
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-white hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderCreationModal;
