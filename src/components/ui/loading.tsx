import React from 'react';

interface LoadingProps {
  variant?: 'spinner' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  fullScreen = false,
  message = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50'
    : 'flex flex-col items-center justify-center p-8';

  const renderSpinner = () => (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin`}
      />
      <div
        className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-blue-400 rounded-full animate-spin`}
        style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
      />
    </div>
  );

  const renderPulse = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
          } bg-blue-500 rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );

  const renderSkeleton = () => (
    <div className="w-full max-w-md space-y-4 px-4">
      <div className="h-12 bg-slate-700 rounded-lg animate-pulse" />
      <div className="h-8 bg-slate-700 rounded-lg animate-pulse w-3/4" />
      <div className="h-8 bg-slate-700 rounded-lg animate-pulse w-1/2" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-24 bg-slate-700 rounded-lg animate-pulse" />
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={containerClasses}>
      {/* Animated background effect for fullscreen */}
      {fullScreen && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {renderLoader()}
        
        {message && variant !== 'skeleton' && (
          <p className="mt-6 text-slate-300 text-lg font-medium animate-pulse">
            {message}
          </p>
        )}

        {fullScreen && (
          <div className="mt-8 flex flex-col items-center space-y-2">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              Preparing your experience...
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Loading;
