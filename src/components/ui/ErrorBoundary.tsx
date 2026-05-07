// ============================================
// ERROR BOUNDARY - Global Error Handler
// ============================================

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-void flex flex-col items-center justify-center px-4 relative">
          <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-terminal/20" />
          <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-terminal/20" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-terminal/20" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-terminal/20" />

          <div className="border border-alert/30 p-8 max-w-lg w-full text-center relative">
            <div className="absolute -top-3 left-4 bg-void px-2">
              <span className="font-mono text-[10px] text-alert tracking-widest">SYSTEM_FAULT</span>
            </div>

            <div className="mb-6">
              <span className="font-mono text-xs text-terminal-dark tracking-[0.3em] block mb-4">
                ERROR_DETECTED
              </span>
              <h1 className="text-3xl font-display font-black text-terminal mb-2">
                SOMETHING<br />
                <span className="text-alert">WENT WRONG</span>
              </h1>
            </div>

            {this.state.error && (
              <div className="border border-terminal/10 p-3 mb-6 text-left">
                <p className="font-mono text-xs text-terminal-dark break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="font-mono text-xs tracking-widest px-6 py-3 border border-terminal/30 text-terminal hover:border-terminal hover:bg-terminal/5 transition-all duration-300 hoverable"
            >
              RELOAD_SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
