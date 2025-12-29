import React from 'react';

interface ErrorDisplayProps {
  error?: Error | string;
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  showDetails?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = 'Oops! Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  onRetry,
  fullScreen = false,
  showDetails = false,
}) => {
  const [showMore, setShowMore] = React.useState(false);

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 p-4'
    : 'flex items-center justify-center p-8';

  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : error.message
    : message;

  const errorStack =
    error && typeof error !== 'string' && showDetails ? error.stack : null;

  return (
    <div className={containerClasses}>
      {/* Animated background for fullscreen */}
      {fullScreen && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-orange-500/5 rounded-full blur-3xl" />
        </div>
      )}

      {/* Error Card */}
      <div className="relative z-10 w-full max-w-lg bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
        {/* Header with Icon */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 border-b border-slate-700/50">
          <div className="flex items-start space-x-4">
            {/* Error Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Title and Message */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Suggestions */}
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              What you can do:
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Check your internet connection</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Refresh the page</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Try again in a few moments</span>
              </li>
            </ul>
          </div>

          {/* Technical Details Toggle */}
          {errorStack && (
            <div>
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center"
              >
                {showMore ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    Hide details
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    Show technical details
                  </>
                )}
              </button>

              {showMore && (
                <div className="mt-3 bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 max-h-48 overflow-auto">
                  <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap break-words">
                    {errorStack}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Try Again</span>
              </button>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Reload Page</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900/50 px-6 py-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400 text-center">
            If the problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
