import { Sandpack } from '@codesandbox/sandpack-react';

interface CodePlaygroundProps {
  code?: string;
  template?: 'react' | 'react-ts' | 'vanilla' | 'vanilla-ts';
  theme?: 'light' | 'dark' | 'auto';
  editable?: boolean;
  showPreview?: boolean;
  height?: string;
  files?: Record<string, string>;
}

export function CodePlayground({
  code,
  template = 'react-ts',
  theme = 'auto',
  editable = true,
  showPreview = true,
  height = '400px',
  files,
}: CodePlaygroundProps) {
  // Default React TypeScript example
  const defaultFiles = files || {
    '/App.tsx': code || `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui',
      textAlign: 'center'
    }}>
      <h1>Interactive Code Example</h1>
      <p>Current count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '4px',
          border: 'none',
          background: '#0070f3',
          color: 'white'
        }}
      >
        Increment
      </button>
    </div>
  );
}`,
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg my-6">
      <Sandpack
        template={template}
        theme={theme}
        files={defaultFiles}
        options={{
          showNavigator: false,
          showTabs: Object.keys(defaultFiles).length > 1,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: height,
          editorWidthPercentage: showPreview ? 50 : 100,
          readOnly: !editable,
        }}
        customSetup={{
          dependencies: {
            'framer-motion': '^12.0.0',
            'lucide-react': '^0.300.0',
          },
        }}
      />
    </div>
  );
}

// Preset examples for common use cases
export const playgroundPresets = {
  reactHooks: {
    '/App.tsx': `import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(['React', 'TypeScript', 'Vite', 'Tailwind']);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>React Hooks Example</h1>
      <ul>
        {data.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}`,
  },
  
  framerMotion: {
    '/App.tsx': `import { motion } from 'framer-motion';
import { useState } from 'react';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Framer Motion Example</h1>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '0.5rem 1rem', 
          marginBottom: '1rem',
          cursor: 'pointer'
        }}
      >
        Toggle Animation
      </button>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.5,
          rotate: isOpen ? 360 : 0
        }}
        transition={{ duration: 0.5 }}
        style={{
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px'
        }}
      />
    </div>
  );
}`,
  },

  typescript: {
    '/App.tsx': `interface User {
  id: number;
  name: string;
  email: string;
}

export default function App() {
  const users: User[] = [
    { id: 1, name: 'Ferry Hinardi', email: 'ferry@example.com' },
    { id: 2, name: 'John Doe', email: 'john@example.com' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>TypeScript Example</h1>
      <div>
        {users.map(user => (
          <div 
            key={user.id}
            style={{
              padding: '1rem',
              margin: '0.5rem 0',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}
          >
            <h3>{user.name}</h3>
            <p style={{ color: '#666' }}>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },
};
