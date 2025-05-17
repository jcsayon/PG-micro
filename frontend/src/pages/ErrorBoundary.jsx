// ErrorBoundary.jsx
import React from "react";

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(err) {
    return { hasError: true };
  }

  componentDidCatch(err, info) {
    console.error("ErrorBoundary caught:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-700">
          Oops — something went wrong. Please try again later.
        </div>
      );
    }
    return this.props.children;
  }
}
