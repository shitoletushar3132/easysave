interface FooterProps {
  currentIndex: number;
  totalFiles: number;
  zoom: number;
  rotation: number;
}

const FullScreenViewerFooter: React.FC<FooterProps> = ({
  currentIndex,
  totalFiles,
  zoom,
  rotation,
}) => {
  return (
    <div className="px-6 py-4 bg-gradient-to-t from-black/80 to-black/40">
      <div className="flex justify-between items-center text-white/80">
        <div className="text-sm">
          {currentIndex + 1} of {totalFiles}
        </div>
        <div className="text-sm space-x-4">
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Rotation: {rotation}°</span>
        </div>
      </div>
    </div>
  );
};

export default FullScreenViewerFooter;
