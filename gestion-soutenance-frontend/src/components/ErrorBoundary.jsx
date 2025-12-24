import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Une erreur s'est produite
              </h1>
              
              <p className="text-gray-600 mb-6">
                Nous rencontrons un problème technique. Veuillez rafraîchir la page ou réessayer plus tard.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="w-full bg-gray-100 rounded-lg p-4 mb-4 text-left">
                  <p className="text-xs font-mono text-red-600 break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 bg-[#008D36] text-white rounded-xl hover:bg-[#05A66B] transition-colors"
                >
                  Rafraîchir la page
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
