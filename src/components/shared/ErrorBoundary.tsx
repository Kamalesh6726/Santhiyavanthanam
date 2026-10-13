import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-brand-background dark:bg-brand-darkBg text-center">
          <div className="max-w-md w-full bg-white dark:bg-brand-darkCard p-8 rounded-3xl shadow-xl border border-brand-sand/50 dark:border-gray-800 space-y-6">
            <div className="w-16 h-16 bg-brand-saffron/10 text-brand-saffron rounded-full flex items-center justify-center mx-auto text-2xl">
              🙏
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">
                Something went wrong
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                We encountered an unexpected issue while loading this page.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs p-3 rounded-xl text-left overflow-auto max-h-24 font-mono">
                {this.state.error.message}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-brand-saffron text-white font-semibold text-sm active:scale-95 transition-transform"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-brand-charcoal dark:text-gray-200 font-semibold text-sm active:scale-95 transition-transform"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
