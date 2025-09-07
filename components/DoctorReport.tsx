import React, { useState } from 'react';
import { SkincareRoutine, FaceImage, SkinConditionCategory } from '../types';
import Button from './common/Button';
import { ArrowLeftIcon, ArrowRightIcon, Download, RefreshCw } from './Icons';
import { getCategoryStyle, SKINCARE_GOALS } from '../constants';

interface DoctorReportProps {
  recommendation: SkincareRoutine | null;
  routineTitle: string;
  onReset: () => void;
  onBack: () => void;
  onNext: () => void;
  faceImages: FaceImage[];
  analysisResult: SkinConditionCategory[] | null;
  skincareGoals: string[];
}

const DoctorReport: React.FC<DoctorReportProps> = ({
  recommendation,
  routineTitle,
  onReset,
  onBack,
  onNext,
  faceImages,
  analysisResult,
  skincareGoals
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const reportElement = document.getElementById('doctor-report-content');
    if (!reportElement || !window.html2canvas || !window.jspdf) return;

    setIsDownloading(true);
    try {
        const originalBg = reportElement.style.backgroundColor;
        reportElement.style.backgroundColor = '#FFFFFF';
        window.scrollTo(0, 0);
        
        const canvas = await window.html2canvas(reportElement, { 
            scale: 2, 
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        });
        
        reportElement.style.backgroundColor = originalBg;
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = canvas.width / pdfWidth;
        const canvasHeightOnPdf = canvas.height / ratio;

        let heightLeft = canvasHeightOnPdf;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeightOnPdf, undefined, 'FAST');
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeightOnPdf, undefined, 'FAST');
            heightLeft -= pdfHeight;
        }

        pdf.save('Dermatics_India_Skincare_Report.pdf');

    } catch (error) {
        console.error("Failed to download PDF:", error);
        alert("Sorry, there was an error creating the PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };


  if (!recommendation || !analysisResult) {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Report Data Missing</h2>
            <p className="text-slate-600">We couldn't find the necessary analysis or recommendation data. Please go back and complete the previous steps.</p>
            <Button onClick={onBack} variant="primary" size="lg" className="mt-6 gap-2">
              <ArrowLeftIcon className="w-5 h-5"/>
              Go Back
            </Button>
        </div>
    )
  }

  const primaryImage = faceImages.length > 0 ? faceImages[0].previewUrl : null;
  const goalLabels = skincareGoals.map(id => {
    const goal = SKINCARE_GOALS.find(g => g.id === id);
    return goal ? goal.label : id;
  });


  return (
    <div className="animate-fade-in-up h-full flex flex-col w-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            <span className="text-brand-primary">Step 5:</span> AI Doctor's Report
          </h2>
          <p className="text-sm text-slate-600">Here is a summary of your analysis and personalized plan.</p>
        </div>
        <Button onClick={handleDownload} isLoading={isDownloading} variant="secondary" size="sm" className="gap-2">
          <Download className="w-4 h-4"/>
          {isDownloading ? 'Downloading...' : 'Download'}
        </Button>
      </div>

      <div className="flex-grow">
        <div id="doctor-report-content" className="space-y-4 bg-white p-4 rounded-lg">
          <div className="text-center border-b pb-2">
            <h1 className="text-xl font-bold text-slate-800">{routineTitle}</h1>
            <p className="text-slate-500 text-sm">Personalized Skincare Plan</p>
            <p className="text-xs text-slate-400 mt-0.5">Generated on: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
                <h3 className="text-base font-semibold text-slate-700 mb-2 border-b pb-1">AI Skin Analysis Findings</h3>
                {analysisResult.map(category => {
                    const style = getCategoryStyle(category.category);
                    const Icon = style.icon;
                    return (
                        <div key={category.category} className="mb-2">
                            <h4 className={`font-bold text-sm flex items-center gap-1.5 ${style.tailwind.text}`}>
                                <Icon className={`w-4 h-4 ${style.tailwind.icon}`} />
                                {category.category}
                            </h4>
                            <ul className="list-disc list-inside pl-2 text-xs text-slate-600">
                                {category.conditions.map(c => <li key={c.name}>{c.name} ({c.location})</li>)}
                            </ul>
                        </div>
                    );
                })}
            </div>
            {primaryImage && (
                <div className="flex justify-center items-start">
                    <img src={primaryImage} alt="Your Face" className="rounded-lg shadow-md max-h-36 border"/>
                </div>
            )}
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-slate-700 mb-2 border-b pb-1">Your Skincare Goals</h3>
            <ul className="list-disc list-inside text-slate-600 text-sm space-y-0.5">
              {goalLabels.map(goal => <li key={goal}>{goal}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-700 mb-2 border-b pb-1">Recommended Routine</h3>
            <p className="text-xs text-slate-600 mb-3 italic">{recommendation.introduction}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-1.5">AM Routine ☀️</h4>
                <ul className="space-y-2">
                  {recommendation.am.map(step => (
                    <li key={step.productId} className="text-xs">
                      <strong className="text-slate-700 block">{step.stepType}: {step.productName}</strong>
                      <p className="text-slate-500 pl-2 border-l-2 border-slate-200 ml-1 mt-0.5">{step.purpose}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-1.5">PM Routine 🌙</h4>
                 <ul className="space-y-2">
                  {recommendation.pm.map(step => (
                    <li key={step.productId} className="text-xs">
                      <strong className="text-slate-700 block">{step.stepType}: {step.productName}</strong>
                      <p className="text-slate-500 pl-2 border-l-2 border-slate-200 ml-1 mt-0.5">{step.purpose}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div>
             <h3 className="text-base font-semibold text-slate-700 mb-2 border-b pb-1">Additional Advice</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                      <h4 className="font-bold text-slate-800 mb-1.5">Key Ingredients</h4>
                       <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                          {recommendation.keyIngredients.map(ing => <li key={ing}>{ing}</li>)}
                      </ul>
                  </div>
                   <div>
                      <h4 className="font-bold text-slate-800 mb-1.5">Lifestyle Tips</h4>
                       <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                          {recommendation.lifestyleTips.map(tip => <li key={tip}>{tip}</li>)}
                      </ul>
                  </div>
              </div>
          </div>

          <div className="pt-2 border-t">
              <h4 className="font-bold text-sm text-slate-800 mb-1">Disclaimer</h4>
              <p className="text-[10px] text-slate-500">{recommendation.disclaimer}</p>
          </div>

        </div>
      </div>

      <div className="flex-shrink-0 flex flex-wrap justify-center sm:justify-between items-center mt-4 pt-4 border-t border-slate-200 gap-3">
        <Button onClick={onBack} variant="secondary" size="sm" className="gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Plan
        </Button>
        <Button onClick={onReset} variant="secondary" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4"/>
            Start Over
        </Button>
        <Button onClick={onNext} variant="primary" size="sm" className="gap-2">
            Next: Assistant
            <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DoctorReport;
