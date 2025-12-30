import { useState, useEffect } from 'react';
import { useResumeData } from '@/hooks/useResumeData';
import Loading from '@components/ui/loading';
import ErrorDisplay from '@components/ui/error';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Card } from '@components/ui/card';
import './AdminDashboard.css';

type ResumeData = {
  main: any;
  resume: any;
  portfolio: any;
  testimonials: any;
};

export default function AdminDashboard() {
  const { data: originalData, loading, error } = useResumeData();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState('main');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (originalData) {
      setResumeData(JSON.parse(JSON.stringify(originalData)));
    }
  }, [originalData]);

  // Simple password authentication (you should use proper auth in production)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Change this password to your preferred one
    const correctPassword = 'ferry2025'; // CHANGE THIS!
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    if (!resumeData) return;
    
    setResumeData(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      if (section === 'main') {
        updated.main = { ...updated.main, [field]: value };
      } else if (section === 'resume') {
        updated.resume = { ...updated.resume, [field]: value };
      } else if (section === 'portfolio') {
        updated.portfolio = { ...updated.portfolio, [field]: value };
      } else if (section === 'testimonials') {
        updated.testimonials = { ...updated.testimonials, [field]: value };
      }
      return updated;
    });
    setHasChanges(true);
  };

  const handleArrayItemChange = (section: string, arrayField: string, index: number, field: string, value: any) => {
    if (!resumeData) return;
    
    setResumeData(prev => {
      if (!prev) return prev;
      const updated = JSON.parse(JSON.stringify(prev));
      
      if (section === 'main') {
        updated.main[arrayField][index][field] = value;
      } else if (section === 'resume') {
        updated.resume[arrayField][index][field] = value;
      } else if (section === 'portfolio') {
        updated.portfolio[arrayField][index][field] = value;
      } else if (section === 'testimonials') {
        updated.testimonials[arrayField][index][field] = value;
      }
      
      return updated;
    });
    setHasChanges(true);
  };

  const addArrayItem = (section: string, arrayField: string, template: any) => {
    if (!resumeData) return;
    
    setResumeData(prev => {
      if (!prev) return prev;
      const updated = JSON.parse(JSON.stringify(prev));
      
      if (section === 'main') {
        if (!updated.main[arrayField]) updated.main[arrayField] = [];
        updated.main[arrayField].push(template);
      } else if (section === 'resume') {
        if (!updated.resume[arrayField]) updated.resume[arrayField] = [];
        updated.resume[arrayField].push(template);
      } else if (section === 'portfolio') {
        if (!updated.portfolio[arrayField]) updated.portfolio[arrayField] = [];
        updated.portfolio[arrayField].push(template);
      } else if (section === 'testimonials') {
        if (!updated.testimonials[arrayField]) updated.testimonials[arrayField] = [];
        updated.testimonials[arrayField].push(template);
      }
      
      return updated;
    });
    setHasChanges(true);
  };

  const removeArrayItem = (section: string, arrayField: string, index: number) => {
    if (!resumeData) return;
    
    setResumeData(prev => {
      if (!prev) return prev;
      const updated = JSON.parse(JSON.stringify(prev));
      
      if (section === 'main') {
        updated.main[arrayField].splice(index, 1);
      } else if (section === 'resume') {
        updated.resume[arrayField].splice(index, 1);
      } else if (section === 'portfolio') {
        updated.portfolio[arrayField].splice(index, 1);
      } else if (section === 'testimonials') {
        updated.testimonials[arrayField].splice(index, 1);
      }
      
      return updated;
    });
    setHasChanges(true);
  };

  const moveArrayItem = (section: string, arrayField: string, index: number, direction: 'up' | 'down') => {
    if (!resumeData) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    setResumeData(prev => {
      if (!prev) return prev;
      const updated = JSON.parse(JSON.stringify(prev));
      
      let array: any[] = [];
      if (section === 'main') {
        array = updated.main[arrayField];
      } else if (section === 'resume') {
        array = updated.resume[arrayField];
      } else if (section === 'portfolio') {
        array = updated.portfolio[arrayField];
      } else if (section === 'testimonials') {
        array = updated.testimonials[arrayField];
      }
      
      // Validate bounds
      if (newIndex < 0 || newIndex >= array.length) return prev;
      
      // Swap items
      const temp = array[index];
      array[index] = array[newIndex];
      array[newIndex] = temp;
      
      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!resumeData) return;
    
    const dataStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resumeData.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Resume data downloaded! Replace public/resumeData.json with this file and redeploy.');
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      if (originalData) {
        setResumeData(JSON.parse(JSON.stringify(originalData)));
        setHasChanges(false);
      }
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading admin dashboard..." />;
  }

  if (error || !originalData) {
    return (
      <ErrorDisplay 
        error={error || new Error('No data available')} 
        fullScreen 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <Card className="admin-login-card">
          <h1>🔐 Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {authError && <p className="auth-error">{authError}</p>}
            <Button type="submit" className="login-btn">Login</Button>
          </form>
          <p className="admin-note">
            Default password: <code>ferry2025</code> (Change in AdminDashboard.tsx:50)
          </p>
        </Card>
      </div>
    );
  }

  if (!resumeData) return null;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>📝 Resume Admin Dashboard</h1>
          <div className="admin-actions">
            {hasChanges && <span className="unsaved-indicator">● Unsaved changes</span>}
            <Button onClick={handleReset} variant="outline">Reset</Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              💾 Download JSON
            </Button>
            <Button onClick={() => window.open('/', '_blank')} variant="outline">
              👁️ Preview Site
            </Button>
          </div>
        </div>
      </header>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'main' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('main')}
        >
          Main Info
        </button>
        <button 
          className={activeTab === 'education' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('education')}
        >
          Education
        </button>
        <button 
          className={activeTab === 'work' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('work')}
        >
          Work Experience
        </button>
        <button 
          className={activeTab === 'skills' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('skills')}
        >
          Skills
        </button>
        <button 
          className={activeTab === 'portfolio' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio
        </button>
        <button 
          className={activeTab === 'testimonials' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('testimonials')}
        >
          Testimonials
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'main' && (
          <MainInfoTab 
            data={resumeData.main} 
            onChange={(field, value) => handleInputChange('main', field, value)}
            onArrayItemChange={(arrayField, index, field, value) => 
              handleArrayItemChange('main', arrayField, index, field, value)
            }
            onAddArrayItem={(arrayField, template) => addArrayItem('main', arrayField, template)}
            onRemoveArrayItem={(arrayField, index) => removeArrayItem('main', arrayField, index)}
            onMoveArrayItem={(arrayField, index, direction) => moveArrayItem('main', arrayField, index, direction)}
          />
        )}

        {activeTab === 'education' && (
          <EducationTab 
            data={resumeData.resume.education} 
            onChange={(index, field, value) => 
              handleArrayItemChange('resume', 'education', index, field, value)
            }
            onAdd={() => addArrayItem('resume', 'education', {
              school: '',
              degree: '',
              graduated: '',
              description: ''
            })}
            onRemove={(index) => removeArrayItem('resume', 'education', index)}
            onMove={(index, direction) => moveArrayItem('resume', 'education', index, direction)}
          />
        )}

        {activeTab === 'work' && (
          <WorkTab 
            data={resumeData.resume.work} 
            onChange={(index, field, value) => 
              handleArrayItemChange('resume', 'work', index, field, value)
            }
            onAdd={() => addArrayItem('resume', 'work', {
              company: '',
              title: '',
              years: '',
              description: ''
            })}
            onRemove={(index) => removeArrayItem('resume', 'work', index)}
            onMove={(index, direction) => moveArrayItem('resume', 'work', index, direction)}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsTab 
            data={resumeData.resume.skills} 
            skillMessage={resumeData.resume.skillmessage}
            onMessageChange={(value) => handleInputChange('resume', 'skillmessage', value)}
            onChange={(index, field, value) => 
              handleArrayItemChange('resume', 'skills', index, field, value)
            }
            onAdd={() => addArrayItem('resume', 'skills', {
              name: '',
              level: '50%'
            })}
            onRemove={(index) => removeArrayItem('resume', 'skills', index)}
            onMove={(index, direction) => moveArrayItem('resume', 'skills', index, direction)}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioTab 
            data={resumeData.portfolio.projects} 
            onChange={(index, field, value) => 
              handleArrayItemChange('portfolio', 'projects', index, field, value)
            }
            onAdd={() => addArrayItem('portfolio', 'projects', {
              title: '',
              category: '',
              image: '',
              url: '',
              technologies: []
            })}
            onRemove={(index) => removeArrayItem('portfolio', 'projects', index)}
            onMove={(index, direction) => moveArrayItem('portfolio', 'projects', index, direction)}
          />
        )}

        {activeTab === 'testimonials' && (
          <TestimonialsTab 
            data={resumeData.testimonials.testimonials} 
            onChange={(index, field, value) => 
              handleArrayItemChange('testimonials', 'testimonials', index, field, value)
            }
            onAdd={() => addArrayItem('testimonials', 'testimonials', {
              text: '',
              user: ''
            })}
            onRemove={(index) => removeArrayItem('testimonials', 'testimonials', index)}
            onMove={(index, direction) => moveArrayItem('testimonials', 'testimonials', index, direction)}
          />
        )}
      </div>

      <footer className="admin-footer">
        <p>💡 Tip: After downloading, replace <code>public/resumeData.json</code> and redeploy</p>
      </footer>
    </div>
  );
}

// Tab Components
interface MainInfoTabProps {
  data: any;
  onChange: (field: string, value: any) => void;
  onArrayItemChange: (arrayField: string, index: number, field: string, value: any) => void;
  onAddArrayItem: (arrayField: string, template: any) => void;
  onRemoveArrayItem: (arrayField: string, index: number) => void;
  onMoveArrayItem: (arrayField: string, index: number, direction: 'up' | 'down') => void;
}

function MainInfoTab({ data, onChange, onArrayItemChange, onAddArrayItem, onRemoveArrayItem, onMoveArrayItem }: MainInfoTabProps) {
  return (
    <div className="tab-content">
      <Card className="admin-card">
        <h2>Personal Information</h2>
        
        <div className="form-group">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={data.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>

        <div className="form-group">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={data.occupation || ''}
            onChange={(e) => onChange('occupation', e.target.value)}
          />
        </div>

        <div className="form-group">
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-group">
          <Label htmlFor="bio">Bio (HTML allowed)</Label>
          <Textarea
            id="bio"
            value={data.bio || ''}
            onChange={(e) => onChange('bio', e.target.value)}
            rows={6}
          />
        </div>

        <div className="form-group">
          <Label htmlFor="contactmessage">Contact Message</Label>
          <Textarea
            id="contactmessage"
            value={data.contactmessage || ''}
            onChange={(e) => onChange('contactmessage', e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={data.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
          />
        </div>
      </Card>

      <Card className="admin-card">
        <h2>Social Links</h2>
        {data.social?.map((social: any, index: number) => (
          <div key={index} className="array-item">
            <div className="form-row">
              <div className="form-group">
                <Label>Platform</Label>
                <Input
                  value={social.name || ''}
                  onChange={(e) => onArrayItemChange('social', index, 'name', e.target.value)}
                />
              </div>
              <div className="form-group flex-2">
                <Label>URL</Label>
                <Input
                  value={social.url || ''}
                  onChange={(e) => onArrayItemChange('social', index, 'url', e.target.value)}
                />
              </div>
              <div className="form-group">
                <Label>Icon Class</Label>
                <Input
                  value={social.className || ''}
                  onChange={(e) => onArrayItemChange('social', index, 'className', e.target.value)}
                />
              </div>
              <Button 
                onClick={() => onMoveArrayItem('social', index, 'up')} 
                variant="outline"
                disabled={index === 0}
                title="Move up"
              >
                ⬆️
              </Button>
              <Button 
                onClick={() => onMoveArrayItem('social', index, 'down')} 
                variant="outline"
                disabled={index === data.social.length - 1}
                title="Move down"
              >
                ⬇️
              </Button>
              <Button 
                onClick={() => onRemoveArrayItem('social', index)}
                variant="outline"
                className="remove-btn"
              >
                🗑️
              </Button>
            </div>
          </div>
        ))}
        <Button 
          onClick={() => onAddArrayItem('social', { name: '', url: '', className: 'fa fa-link' })}
          variant="outline"
        >
          + Add Social Link
        </Button>
      </Card>
    </div>
  );
}

interface ArrayTabProps {
  data: any[];
  onChange: (index: number, field: string, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

function EducationTab({ data, onChange, onAdd, onRemove, onMove }: ArrayTabProps) {
  return (
    <div className="tab-content">
      {data?.map((edu: any, index: number) => (
        <Card key={index} className="admin-card">
          <div className="card-header">
            <h3>Education #{index + 1}</h3>
            <div className="card-actions">
              <Button 
                onClick={() => onMove(index, 'up')} 
                variant="outline"
                disabled={index === 0}
                title="Move up"
              >
                ⬆️
              </Button>
              <Button 
                onClick={() => onMove(index, 'down')} 
                variant="outline"
                disabled={index === data.length - 1}
                title="Move down"
              >
                ⬇️
              </Button>
              <Button onClick={() => onRemove(index)} variant="outline">🗑️ Remove</Button>
            </div>
          </div>

          <div className="form-group">
            <Label>School</Label>
            <Input
              value={edu.school || ''}
              onChange={(e) => onChange(index, 'school', e.target.value)}
            />
          </div>

          <div className="form-group">
            <Label>Degree</Label>
            <Input
              value={edu.degree || ''}
              onChange={(e) => onChange(index, 'degree', e.target.value)}
            />
          </div>

          <div className="form-group">
            <Label>Graduated</Label>
            <Input
              value={edu.graduated || ''}
              onChange={(e) => onChange(index, 'graduated', e.target.value)}
              placeholder="e.g., 2015"
            />
          </div>

          <div className="form-group">
            <Label>Description</Label>
            <Textarea
              value={edu.description || ''}
              onChange={(e) => onChange(index, 'description', e.target.value)}
              rows={4}
            />
          </div>
        </Card>
      ))}
      
      <Button onClick={onAdd} className="add-btn">+ Add Education</Button>
    </div>
  );
}

function WorkTab({ data, onChange, onAdd, onRemove, onMove }: ArrayTabProps) {
  return (
    <div className="tab-content">
      {data?.map((job: any, index: number) => (
        <Card key={index} className="admin-card">
          <div className="card-header">
            <h3>Work Experience #{index + 1}</h3>
            <div className="card-actions">
              <Button 
                onClick={() => onMove(index, 'up')} 
                variant="outline"
                disabled={index === 0}
                title="Move up"
              >
                ⬆️
              </Button>
              <Button 
                onClick={() => onMove(index, 'down')} 
                variant="outline"
                disabled={index === data.length - 1}
                title="Move down"
              >
                ⬇️
              </Button>
              <Button onClick={() => onRemove(index)} variant="outline">🗑️ Remove</Button>
            </div>
          </div>

          <div className="form-group">
            <Label>Company</Label>
            <Input
              value={job.company || ''}
              onChange={(e) => onChange(index, 'company', e.target.value)}
            />
          </div>

          <div className="form-group">
            <Label>Job Title</Label>
            <Input
              value={job.title || ''}
              onChange={(e) => onChange(index, 'title', e.target.value)}
            />
          </div>

          <div className="form-group">
            <Label>Years</Label>
            <Input
              value={job.years || ''}
              onChange={(e) => onChange(index, 'years', e.target.value)}
              placeholder="e.g., 2020 - Present"
            />
          </div>

          <div className="form-group">
            <Label>Description</Label>
            <Textarea
              value={job.description || ''}
              onChange={(e) => onChange(index, 'description', e.target.value)}
              rows={5}
            />
          </div>
        </Card>
      ))}
      
      <Button onClick={onAdd} className="add-btn">+ Add Work Experience</Button>
    </div>
  );
}

interface SkillsTabProps extends ArrayTabProps {
  skillMessage: string;
  onMessageChange: (value: string) => void;
}

function SkillsTab({ data, skillMessage, onMessageChange, onChange, onAdd, onRemove, onMove }: SkillsTabProps) {
  return (
    <div className="tab-content">
      <Card className="admin-card">
        <h2>Skills Message</h2>
        <div className="form-group">
          <Label>Message</Label>
          <Textarea
            value={skillMessage || ''}
            onChange={(e) => onMessageChange(e.target.value)}
            rows={4}
          />
        </div>
      </Card>

      {data?.map((skill: any, index: number) => (
        <Card key={index} className="admin-card compact">
          <div className="form-row">
            <div className="form-group flex-2">
              <Label>Skill Name</Label>
              <Input
                value={skill.name || ''}
                onChange={(e) => onChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <Label>Level</Label>
              <Input
                value={skill.level || ''}
                onChange={(e) => onChange(index, 'level', e.target.value)}
                placeholder="e.g., 90%"
              />
            </div>
            <Button 
              onClick={() => onMove(index, 'up')} 
              variant="outline"
              disabled={index === 0}
              title="Move up"
            >
              ⬆️
            </Button>
            <Button 
              onClick={() => onMove(index, 'down')} 
              variant="outline"
              disabled={index === data.length - 1}
              title="Move down"
            >
              ⬇️
            </Button>
            <Button onClick={() => onRemove(index)} variant="outline">🗑️</Button>
          </div>
        </Card>
      ))}
      
      <Button onClick={onAdd} className="add-btn">+ Add Skill</Button>
    </div>
  );
}

function PortfolioTab({ data, onChange, onAdd, onRemove, onMove }: ArrayTabProps) {
  const handleTechnologiesChange = (index: number, value: string) => {
    const techs = value.split(',').map(t => t.trim()).filter(t => t);
    onChange(index, 'technologies', techs);
  };

  return (
    <div className="tab-content">
      {data?.map((project: any, index: number) => (
        <Card key={index} className="admin-card">
          <div className="card-header">
            <h3>Project #{index + 1}</h3>
            <div className="card-actions">
              <Button 
                onClick={() => onMove(index, 'up')} 
                variant="outline"
                disabled={index === 0}
                title="Move up"
              >
                ⬆️
              </Button>
              <Button 
                onClick={() => onMove(index, 'down')} 
                variant="outline"
                disabled={index === data.length - 1}
                title="Move down"
              >
                ⬇️
              </Button>
              <Button onClick={() => onRemove(index)} variant="outline">🗑️ Remove</Button>
            </div>
          </div>

          <div className="form-group">
            <Label>Title</Label>
            <Input
              value={project.title || ''}
              onChange={(e) => onChange(index, 'title', e.target.value)}
            />
          </div>

          <div className="form-group">
            <Label>Description</Label>
            <Textarea
              value={project.category || ''}
              onChange={(e) => onChange(index, 'category', e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <Label>Image Filename</Label>
              <Input
                value={project.image || ''}
                onChange={(e) => onChange(index, 'image', e.target.value)}
                placeholder="e.g., project.png"
              />
            </div>

            <div className="form-group">
              <Label>URL</Label>
              <Input
                value={project.url || ''}
                onChange={(e) => onChange(index, 'url', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <Label>Technologies (comma-separated)</Label>
            <Input
              value={project.technologies?.join(', ') || ''}
              onChange={(e) => handleTechnologiesChange(index, e.target.value)}
              placeholder="e.g., React.js, TypeScript, Next.js"
            />
          </div>
        </Card>
      ))}
      
      <Button onClick={onAdd} className="add-btn">+ Add Project</Button>
    </div>
  );
}

function TestimonialsTab({ data, onChange, onAdd, onRemove, onMove }: ArrayTabProps) {
  return (
    <div className="tab-content">
      {data?.map((testimonial: any, index: number) => (
        <Card key={index} className="admin-card">
          <div className="card-header">
            <h3>Testimonial #{index + 1}</h3>
            <div className="card-actions">
              <Button 
                onClick={() => onMove(index, 'up')} 
                variant="outline"
                disabled={index === 0}
                title="Move up"
              >
                ⬆️
              </Button>
              <Button 
                onClick={() => onMove(index, 'down')} 
                variant="outline"
                disabled={index === data.length - 1}
                title="Move down"
              >
                ⬇️
              </Button>
              <Button onClick={() => onRemove(index)} variant="outline">🗑️ Remove</Button>
            </div>
          </div>

          <div className="form-group">
            <Label>Quote</Label>
            <Textarea
              value={testimonial.text || ''}
              onChange={(e) => onChange(index, 'text', e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <Label>Author</Label>
            <Input
              value={testimonial.user || ''}
              onChange={(e) => onChange(index, 'user', e.target.value)}
            />
          </div>
        </Card>
      ))}
      
      <Button onClick={onAdd} className="add-btn">+ Add Testimonial</Button>
    </div>
  );
}
