'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export default function EstimatorPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [estimationData, setEstimationData] = useState(null);
  const [showRawText, setShowRawText] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setError('');
    setPdfFile(file);
    setEstimationData(null); // Reset estimation when new file is selected
    showToast('File uploaded successfully', 'info');
  }, [showToast]);

  const handleProcessEstimate = async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    setError('');
    setEstimationData(null);

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const response = await fetch('/api/estimate/process-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const data = await response.json();
      setEstimationData(data);
      showToast(`Found ${data.summary?.totalItems || 0} items`, 'success');
    } catch (err) {
      setError('Failed to process PDF and generate estimation. Please try again.');
      showToast('Failed to process PDF', 'error');
      console.error('PDF processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    noClick: true, // Disable click on the entire area
    noKeyboard: true // Disable keyboard interaction
  });

  const handleReset = () => {
    setPdfFile(null);
    setError('');
    setEstimationData(null);
    setShowRawText(false);
  };


  const handleExportExcel = async () => {
    if (!estimationData?.materials) return;

    try {
      const response = await fetch('/api/estimate/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ materials: estimationData.materials }),
      });

      if (!response.ok) {
        throw new Error('Failed to export Excel');
      }

      // Download the Excel file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `material_estimation_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Excel downloaded successfully', 'success');
    } catch (err) {
      setError('Failed to export Excel file.');
      showToast('Failed to export Excel', 'error');
      console.error('Export error:', err);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
      <main className="pt-16">
        <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="font-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="gradient-text">Electrical Material Estimation</span>
                </h1>
                <p className="text-xl text-gray-600">
                  AI-powered electrical material extraction and pricing from PDF documents
                </p>
              </div>

              {!estimationData ? (
                <Card className="mb-8" hover={false}>
                  <div
                    {...getRootProps()}
                    className={`
                      border-2 border-dashed rounded-xl p-12 text-center
                      ${isDragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300'
                      }
                      ${isProcessing ? 'opacity-50' : ''}
                    `}
                  >
                    <input {...getInputProps()} disabled={isProcessing} />
                    
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg 
                          className="w-10 h-10 text-blue-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                          />
                        </svg>
                      </div>

                      {isDragActive ? (
                        <p className="text-lg text-blue-600 font-medium">
                          Drop your PDF here
                        </p>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-lg text-gray-700 font-medium">
                            Drag & drop your PDF here
                          </p>
                          <p className="text-sm text-gray-500">or</p>
                          <Button size="medium" onClick={open}>
                            Browse Files
                          </Button>
                          <p className="text-xs text-gray-400 mt-2">
                            Only PDF files are supported
                          </p>
                        </div>
                      )}

                      {pdfFile && !isProcessing && (
                        <div className="mt-4 space-y-3">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700">
                              Selected: {pdfFile.name}
                            </p>
                          </div>
                          <div className="flex gap-3 justify-center">
                            <Button
                              variant="secondary"
                              size="medium"
                              onClick={() => {
                                setPdfFile(null);
                                setEstimationData(null);
                                setError('');
                              }}
                            >
                              Remove File
                            </Button>
                            <Button
                              size="medium"
                              onClick={handleProcessEstimate}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Processing...' : 'Process Estimate'}
                            </Button>
                          </div>
                        </div>
                      )}

                      {error && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="space-y-6">

                  {/* Main Results Card */}
                  <Card hover={false}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Estimation Results
                      </h2>
                      <Button variant="secondary" size="small" onClick={handleReset}>
                        Upload New PDF
                      </Button>
                    </div>

                        <div className="grid grid-cols-4 gap-4 mb-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Total Items</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {estimationData.summary?.totalItems || 0}
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Matched</p>
                            <p className="text-2xl font-bold text-green-600">
                              {estimationData.summary?.matchedItems || 0}
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Unmatched</p>
                            <p className="text-2xl font-bold text-yellow-600">
                              {estimationData.summary?.unmatchedItems || 0}
                            </p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Total Value</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {new Intl.NumberFormat('id-ID').format(
                                estimationData.summary?.totalValue || 0
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-100 border-b">
                                <th className="text-left p-3">No</th>
                                <th className="text-left p-3">Description</th>
                                <th className="text-left p-3">Brand</th>
                                <th className="text-left p-3">Reference</th>
                                <th className="text-center p-3">Qty</th>
                                <th className="text-right p-3">Unit Price</th>
                                <th className="text-right p-3">Total</th>
                                <th className="text-center p-3">Match</th>
                              </tr>
                            </thead>
                            <tbody>
                              {estimationData.materials?.map((item, index) => {
                                const qty = item.extracted.quantity || 1;
                                const unitPrice = item.bestMatch?.priceList || 0;
                                const total = qty * unitPrice;
                                const confidence = item.bestMatch?.confidence || 0;

                                return (
                                  <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">{item.extracted.description}</td>
                                    <td className="p-3">{item.extracted.brand || item.bestMatch?.mpg || '-'}</td>
                                    <td className="p-3 font-mono text-sm">
                                      {item.bestMatch?.materialReference || '-'}
                                    </td>
                                    <td className="p-3 text-center">{qty}</td>
                                    <td className="p-3 text-right">
                                      {new Intl.NumberFormat('id-ID').format(unitPrice)}
                                    </td>
                                    <td className="p-3 text-right font-semibold">
                                      {new Intl.NumberFormat('id-ID').format(total)}
                                    </td>
                                    <td className="p-3 text-center">
                                      <span className={`
                                        inline-block px-2 py-1 rounded text-xs font-medium
                                        ${confidence > 0.8 ? 'bg-green-100 text-green-700' :
                                          confidence > 0.5 ? 'bg-yellow-100 text-yellow-700' :
                                          confidence > 0 ? 'bg-orange-100 text-orange-700' :
                                          'bg-gray-100 text-gray-700'}
                                      `}>
                                        {confidence > 0 ? `${Math.round(confidence * 100)}%` : 'No match'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <Button
                            size="medium"
                            onClick={handleExportExcel}
                            disabled={!estimationData.materials || estimationData.materials.length === 0}
                          >
                            Download Excel Report
                          </Button>
                        </div>
                  </Card>

                  {/* Collapsible Raw Text Section */}
                  {estimationData?.pdfText && (
                    <Card hover={false}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                          Raw PDF Text
                        </h3>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => setShowRawText(!showRawText)}
                        >
                          {showRawText ? 'Hide' : 'Show'} Text
                        </Button>
                      </div>

                      {showRawText && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <pre className="whitespace-pre-wrap font-mono text-xs text-gray-600 overflow-x-auto max-h-96 overflow-y-auto">
                            {estimationData.pdfText}
                          </pre>
                          <div className="mt-4 flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              {estimationData.pdfInfo?.fileName} • {estimationData.pdfInfo?.numPages} pages • {estimationData.pdfInfo?.textLength} characters
                            </p>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => navigator.clipboard.writeText(estimationData.pdfText)}
                            >
                              Copy Text
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}