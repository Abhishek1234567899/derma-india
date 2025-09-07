import React, { useCallback, useState, useEffect } from 'react';
import { SkinConditionCategory, FaceImage } from '../types';
import Button from './common/Button';
import { analyzeImage } from '../services/geminiService';
import { UploadCloud, CheckCircle, X, CameraIcon, TriangleAlertIcon } from './Icons';
import CameraCapture from './CameraCapture';
import { getCategoryStyle } from '../constants';
import Card from './common/Card';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  faceImages: FaceImage[];
  setFaceImages: (files: FaceImage[] | ((prevFiles: FaceImage[]) => FaceImage[])) => void;
  analysisResult: SkinConditionCategory[] | null;
  setAnalysisResult: (result: SkinConditionCategory[] | null) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const Step2FaceAnalysis: React.FC<Step2Props> = ({
  onNext, onBack, faceImages, setFaceImages, analysisResult, setAnalysisResult, setIsLoading, isLoading,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [hoveredCondition, setHoveredCondition] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    setCountdown(60); // Reset on start

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev > 0) {
          return prev - 1;
        }
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    // Cleanup function
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      setFaceImages(prevImages => [...prevImages, ...newImages]);
      setAnalysisResult(null); 
      setHoveredCondition(null);
      e.target.value = ''; 
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFaceImages(prevImages => {
      const imageToRemove = prevImages[indexToRemove];
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      const updatedImages = prevImages.filter((_, index) => index !== indexToRemove);
      if (activeImageIndex >= updatedImages.length && updatedImages.length > 0) {
        setActiveImageIndex(updatedImages.length - 1);
      } else if (updatedImages.length === 0) {
        setActiveImageIndex(0);
      }
      return updatedImages;
    });
  };

  const handlePhotoCapture = useCallback(async (dataUrl: string) => {
    setIsCameraOpen(false);
    
    const dataURLtoFile = async (dataUrl: string, filename: string): Promise<File> => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: 'image/jpeg' });
    };

    try {
        const file = await dataURLtoFile(dataUrl, `capture-${Date.now()}.jpg`);
        const newImage: FaceImage = {
            file,
            previewUrl: URL.createObjectURL(file)
        };
        setFaceImages(prevImages => [...prevImages, newImage]);
        setAnalysisResult(null);
        setHoveredCondition(null);
    } catch (error) {
        console.error("Error converting data URL to file:", error);
        alert("Could not process the captured image.");
    }
  }, [setFaceImages, setAnalysisResult]);


  const handleAnalyze = useCallback(async () => {
    if (faceImages.length === 0) return;
    setIsLoading(true);
    setAnalysisResult(null);
    setHoveredCondition(null);
    try {
      const filesToAnalyze = faceImages.map(img => img.file);
      const result = await analyzeImage(filesToAnalyze);
      setAnalysisResult(result);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [faceImages, setAnalysisResult, setIsLoading]);

  const activeImage = faceImages[activeImageIndex];
  
  return (
    <div className="animate-fade-in-up w-full">
        <div>
          <div className="flex-shrink-0">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
                <span className="text-brand-primary">Step 2:</span> AI Face Analysis
            </h2>
             <div className="rounded-lg bg-red-50 p-2 text-xs text-red-800 border border-red-200 mb-4 flex items-start gap-2" role="alert">
                <TriangleAlertIcon className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="leading-tight">
                    For best results, upload clear, well-lit photos of your face — including front, left, and right views.
                </p>
            </div>
          </div>

          {analysisResult ? (
            // POST-ANALYSIS VIEW
            <div className="grid grid-cols-5 gap-4 items-start">
              <div className="col-span-3 flex flex-col gap-2">
                 <div className="relative w-full aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                  {activeImage ? (
                      <>
                          <img src={activeImage.previewUrl} alt={`Face preview ${activeImageIndex + 1}`} className="w-full h-full object-contain" />
                          <div className="absolute inset-0">
                              {analysisResult.flatMap(cat =>
                                  cat.conditions.flatMap(cond =>
                                      cond.boundingBoxes
                                          .filter(bbox => bbox.imageId === activeImageIndex)
                                          .map((bbox, i) => {
                                              const style = getCategoryStyle(cat.category);
                                              const isHovered = hoveredCondition === cond.name;
                                              const opacity = hoveredCondition === null ? 0.7 : (isHovered ? 1 : 0.2);
                                              return (
                                                  <div
                                                      key={`${cond.name}-${i}`}
                                                      className="absolute transition-all duration-200 ease-in-out rounded-sm"
                                                      style={{
                                                          border: `2px solid ${style.hex}`,
                                                          top: `${bbox.box.y1 * 100}%`,
                                                          left: `${bbox.box.x1 * 100}%`,
                                                          width: `${(bbox.box.x2 - bbox.box.x1) * 100}%`,
                                                          height: `${(bbox.box.y2 - bbox.box.y1) * 100}%`,
                                                          opacity: opacity,
                                                          transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                                                          zIndex: isHovered ? 20 : 10,
                                                      }}
                                                  ></div>
                                              );
                                          })
                                  )
                              )}
                          </div>
                      </>
                  ) : (
                      <p className="text-slate-500 text-sm">No image</p>
                  )}
                 </div>

                {faceImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-1.5">
                        {faceImages.map((image, index) => (
                            <div key={image.previewUrl} className="relative aspect-square">
                                <img 
                                  src={image.previewUrl} 
                                  alt={`Thumbnail ${index + 1}`} 
                                  onClick={() => setActiveImageIndex(index)}
                                  className={`w-full h-full object-cover rounded-md shadow-sm cursor-pointer transition-all ${activeImageIndex === index ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'}`}
                                />
                                <button onClick={() => handleRemoveImage(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 transition-transform hover:scale-110" aria-label="Remove image">
                                    <X className="w-2 h-2" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
              </div>
              <div className="col-span-2 flex flex-col">
                <div className="animate-fade-in-up">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-green-600">Analysis Complete!</h3>
                    </div>
                </div>
                <div>
                  {analysisResult.map((category) => {
                      const style = getCategoryStyle(category.category);
                      const Icon = style.icon;
                      return (
                          <div key={category.category} className="py-1 border-b border-slate-200 last:border-b-0">
                              <h4 className={`font-bold text-xs mb-1 flex items-center gap-1.5 ${style.tailwind.text}`}>
                                  <Icon className={`w-3 h-3 ${style.tailwind.icon}`} />
                                  {category.category}
                              </h4>
                              <ul className="space-y-0.5">
                              {category.conditions.map((condition) => (
                                  <li key={condition.name} 
                                      className={`flex justify-between items-center text-[10px] transition-all rounded p-0.5 -mx-0.5 cursor-pointer ${hoveredCondition === condition.name ? `bg-blue-50` : 'hover:bg-slate-50'}`}
                                      onMouseEnter={() => setHoveredCondition(condition.name)}
                                      onMouseLeave={() => setHoveredCondition(null)}>
                                      <div className="flex-grow pr-1">
                                          <span className="text-slate-700 font-semibold block leading-tight">{condition.name}</span>
                                          <span className="text-slate-500 text-[9px]">{condition.location}</span>
                                      </div>
                                      <span className={`font-semibold text-right text-[10px] flex-shrink-0 ${style.tailwind.text}`}>{condition.confidence}%</span>
                                  </li>
                              ))}
                              </ul>
                          </div>
                      )
                  })}
                </div>
              </div>
            </div>
          ) : (
            // PRE-ANALYSIS VIEW
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-full max-w-sm flex flex-col gap-2">
                 <div className="flex items-start gap-2">
                   <div className="relative flex-grow aspect-video bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                    {activeImage ? (
                        <img src={activeImage.previewUrl} alt={`Face preview ${activeImageIndex + 1}`} className="w-full h-full object-contain" />
                    ) : (
                        <p className="text-slate-500 text-xs">Upload an image</p>
                    )}
                    {isLoading && (
                        <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-2 rounded-lg z-10 animate-fade-in-up overflow-hidden">
                            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                            <div className="relative animate-pulse-soft-blue w-12 h-12 border-2 border-brand-primary-light/50 rounded-full flex items-center justify-center">
                                 <span className="text-lg font-bold text-brand-primary-light font-mono tabular-nums">{countdown}s</span>
                            </div>
                            <p className="text-[10px] font-semibold text-white mt-2 z-10 tracking-widest">ANALYSING</p>
                        </div>
                    )}
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label htmlFor="face-image-upload" className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer p-1 text-center">
                          <UploadCloud className="w-5 h-5"/>
                          <span className="text-[8px] font-semibold mt-0.5">Upload</span>
                          <input id="face-image-upload" type="file" accept="image/*" multiple onChange={handleFileChange} className="sr-only" />
                      </label>
                      <button type="button" onClick={() => setIsCameraOpen(true)} className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer p-1 text-center">
                          <CameraIcon className="w-5 h-5"/>
                          <span className="text-[8px] font-semibold mt-0.5">Camera</span>
                      </button>
                   </div>
                 </div>

                {faceImages.length > 0 && (
                    <div className="grid grid-cols-6 gap-1.5">
                        {faceImages.map((image, index) => (
                            <div key={image.previewUrl} className="relative aspect-square">
                                <img 
                                  src={image.previewUrl} 
                                  alt={`Thumbnail ${index + 1}`} 
                                  onClick={() => setActiveImageIndex(index)}
                                  className={`w-full h-full object-cover rounded-md shadow-sm cursor-pointer transition-all ${activeImageIndex === index ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'}`}
                                />
                                <button onClick={() => handleRemoveImage(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 transition-transform hover:scale-110" aria-label="Remove image">
                                    <X className="w-2 h-2" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
              </div>
              <div className="w-full max-w-sm">
                <div className="text-center bg-brand-surface rounded-xl shadow-lifted border border-slate-200/60 p-4">
                    <p className="text-xs text-slate-600 mb-3">Upload your photos, and our AI will analyze them and highlight any areas of concern.</p>
                    <Button onClick={handleAnalyze} disabled={faceImages.length === 0 || isLoading} isLoading={isLoading} size="sm" className="w-full">
                        {isLoading ? 'Analyzing...' : 'Analyze My Skin'}
                    </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 flex justify-between mt-4 pt-2 border-t border-slate-200">
          <Button onClick={onBack} variant="secondary" size="sm">Back</Button>
          <Button onClick={onNext} disabled={!analysisResult} size="sm">Next: Set My Goals</Button>
        </div>
        {isCameraOpen && <CameraCapture onCapture={handlePhotoCapture} onClose={() => setIsCameraOpen(false)} />}
    </div>
  );
};

export default Step2FaceAnalysis;
