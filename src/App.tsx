import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import "./index.css";

function App() {
  return <ReadingPage />;
}

const ReadingPage = () => {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentChapterData, setCurrentChapterData] = useState<{
    id: number;
    title: string;
    content: string;
  } | null>(null);

  const [showTopSelector, setShowTopSelector] = useState(false);
  const [showBottomSelector, setShowBottomSelector] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const totalChapters = 1277;

  // Cargar el contenido del capítulo desde JSON
  useEffect(() => {
    const loadChapter = async () => {
      try {
        const res = await fetch(`/src/chapters/${currentChapter}.json`);
        if (!res.ok) throw new Error("Capítulo no encontrado");

        const data = await res.json();
        setCurrentChapterData(data);
      } catch (error) {
        console.error(error);
        setCurrentChapterData({
          id: currentChapter,
          title: "Capítulo no disponible",
          content: "No se pudo cargar el contenido de este capítulo.",
        });
      }
    };

    loadChapter();
  }, [currentChapter]);

  // Hacer scroll al inicio de la ventana cuando cambia el capítulo
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentChapter]);

  const goToPreviousChapter = () => {
    if (currentChapter > 1) setCurrentChapter(currentChapter - 1);
  };

  const goToNextChapter = () => {
    if (currentChapter < totalChapters) setCurrentChapter(currentChapter + 1);
  };

  const selectChapter = (chapterId: number) => {
    setCurrentChapter(chapterId);
    setShowTopSelector(false);
    setShowBottomSelector(false);
  };
  // ADELANTE
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b px-6 py-4 text-gray-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-400 mb-2 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-900" />
            Lector Web
          </h1>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-500">
                Capítulo {currentChapter}: {currentChapterData?.title}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowTopSelector(!showTopSelector)}
                className="px-3 py-2 bg-gray-800 text-gray-100 rounded-lg hover:bg-gray-700 transition-colors text-sm ont-medium relative"
              >
                {currentChapter} de {totalChapters}
                {showTopSelector && (
                  <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-48 text-white">
                    <div
                      className="py-2 max-h-64 overflow-y-auto"
                      ref={(el) => {
                        // Hacer scroll al capítulo actual
                        const selected = el?.querySelector(".current-chapter");
                        selected?.scrollIntoView({ block: "center" });
                      }}
                    >
                      {Array.from({ length: totalChapters }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => selectChapter(i + 1)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 text-sm ${
                            i + 1 === currentChapter
                              ? "bg-gray-100 text-gray-900 font-medium current-chapter"
                              : "text-gray-100"
                          }`}
                        >
                          Cap. {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={goToPreviousChapter}
                  disabled={currentChapter === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentChapter === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextChapter}
                  disabled={currentChapter === totalChapters}
                  className={`p-2 rounded-lg transition-colors ${
                    currentChapter === totalChapters
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main
        ref={contentRef}
        className="flex-1 overflow-y-auto px-6 py-8 text-white"
        onClick={() => {
          if (showTopSelector) setShowTopSelector(false);
          if (showBottomSelector) setShowBottomSelector(false);
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 transition-colors">
            <div className="prose prose-lg max-w-none prose-invert text-white">
              {currentChapterData?.content
                .split("\n\n")
                .map((paragraph, index) => (
                  <p key={index} className="mb-6 text-gray-500 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t px-6 py-4 text-gray-900">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={goToPreviousChapter}
            disabled={currentChapter === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentChapter === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <button
            onClick={() => setShowBottomSelector(!showBottomSelector)}
            className="px-4 py-2 bg-gray-800 text-gray-100 rounded-lg hover:bg-gray-700 transition-colors font-medium relative"
          >
            Cap. {currentChapter} - {currentChapterData?.title}
            {showBottomSelector && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-64 text-white">
                <div
                  className="py-2 max-h-64 overflow-y-auto"
                  ref={(el) => {
                    // Hacer scroll al capítulo actual
                    const selected = el?.querySelector(".current-chapter");
                    selected?.scrollIntoView({ block: "center" });
                  }}
                >
                  {Array.from({ length: totalChapters }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => selectChapter(i + 1)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-700 text-sm ${
                        i + 1 === currentChapter
                          ? "bg-gray-100 text-gray-900 font-medium current-chapter"
                          : "text-gray-100"
                      }`}
                    >
                      Cap. {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </button>

          <button
            onClick={goToNextChapter}
            disabled={currentChapter === totalChapters}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentChapter === totalChapters
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
