import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalFiles: number;
}

const FullScreenViewerNavigator: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  currentIndex,
  totalFiles,
}) => {
  return (
    <>
      {currentIndex > 0 && (
        <button
          onClick={onPrevious}
          className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/75 transition-all transform hover:scale-110 group z-50"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-400 z-50" />
        </button>
      )}
      {currentIndex < totalFiles - 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/75 transition-all transform hover:scale-110 group z-50"
          title="Next (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-400 z-50" />
        </button>
      )}
    </>
  );
};

export default FullScreenViewerNavigator;
