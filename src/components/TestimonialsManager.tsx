import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLinkedInTestimonials } from '@/hooks/useLinkedInTestimonials';
import { LinkedinIcon, Download, Trash2, Star, StarOff } from 'lucide-react';

export function TestimonialsManager() {
  const {
    testimonials,
    loading,
    error,
    importFromLinkedIn,
    convertToResumeFormat,
    saveToStorage,
    loadFromStorage,
    deleteTestimonial,
    toggleFeatured,
  } = useLinkedInTestimonials();

  const [importText, setImportText] = useState('');

  const handleImport = () => {
    importFromLinkedIn(importText);
    setImportText('');
  };

  const handleExport = () => {
    const formatted = convertToResumeFormat();
    const json = JSON.stringify({ testimonials: formatted }, null, 2);
    
    // Download as JSON file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `testimonials-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkedinIcon className="w-5 h-5" />
            LinkedIn Testimonials Manager
          </CardTitle>
          <CardDescription>
            Import and manage recommendations from LinkedIn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="import-text">
              Paste LinkedIn Recommendations (format: Name | Title @ Company | Text | ---)
            </Label>
            <textarea
              id="import-text"
              className="w-full min-h-[200px] p-3 mt-2 border rounded-md"
              placeholder="John Doe&#10;Senior Engineer @ Tech Corp&#10;Ferry is an exceptional developer...&#10;---&#10;Jane Smith&#10;Product Manager @ Startup Inc&#10;Worked with Ferry on multiple projects..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleImport} disabled={loading || !importText.trim()}>
              Import from Text
            </Button>
            <Button variant="outline" onClick={loadFromStorage}>
              Load from Storage
            </Button>
            <Button variant="outline" onClick={saveToStorage} disabled={testimonials.length === 0}>
              Save to Storage
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={testimonials.length === 0}
              className="ml-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {testimonials.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Imported Testimonials ({testimonials.length})
          </h3>
          
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className={testimonial.featured ? 'border-yellow-400' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{testimonial.author.name}</CardTitle>
                    <CardDescription>
                      {testimonial.author.title} @ {testimonial.author.company}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFeatured(testimonial.id)}
                    >
                      {testimonial.featured ? (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTestimonial(testimonial.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  "{testimonial.text}"
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(testimonial.date).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Step 1:</strong> Go to your LinkedIn profile → Recommendations section</p>
          <p><strong>Step 2:</strong> Copy each recommendation in this format:</p>
          <pre className="p-3 bg-gray-100 rounded-md dark:bg-gray-800">
{`Name
Title @ Company
Recommendation text here...
---`}
          </pre>
          <p><strong>Step 3:</strong> Paste into the text area above and click Import</p>
          <p><strong>Step 4:</strong> Mark featured testimonials with the star icon</p>
          <p><strong>Step 5:</strong> Export as JSON and add to resumeData.json</p>
        </CardContent>
      </Card>
    </div>
  );
}
