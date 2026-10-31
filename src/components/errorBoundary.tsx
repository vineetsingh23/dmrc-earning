import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps { children: ReactNode }
interface ErrorBoundaryState { errorText: string }

// shows a message instead of a blank page when something in the app crashes
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { errorText: '' };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { errorText: error instanceof Error ? `${error.name}: ${error.message}` : String(error) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('The app crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.errorText) return this.props.children;
    return (
      <main role="alert" className="mx-auto max-w-xl p-6">
        <h1 className="text-xl font-bold text-bad">Something went wrong</h1>
        <p className="mt-2 text-sm text-mu">Your saved data is safe. Reload the page. If it happens again, send the text below to your developer.</p>
        <pre className="mt-3 overflow-auto rounded-lg border border-bd bg-card p-3 text-xs">{this.state.errorText}</pre>
        <button type="button" onClick={() => window.location.reload()}
          className="mt-3 rounded-xl border border-ac bg-ac px-3.5 py-1.5 font-medium text-onac">Reload</button>
      </main>
    );
  }
}