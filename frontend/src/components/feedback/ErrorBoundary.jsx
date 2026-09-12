import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="app-card max-w-lg p-6">
            <h1 className="text-lg font-semibold text-slate-950">Không thể hiển thị màn hình</h1>
            <p className="mt-2 text-sm text-slate-600">Vui lòng tải lại trang hoặc quay lại dashboard.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
