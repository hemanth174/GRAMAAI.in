// Simple toast notification utility
// No external dependencies needed

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

class Toast {
  private container: HTMLDivElement | null = null;

  private ensureContainer(position: string) {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        ${this.getPositionStyles(position)}
      `;
      document.body.appendChild(this.container);
    }
  }

  private getPositionStyles(position: string): string {
    const positions: Record<string, string> = {
      'top-right': 'top: 20px; right: 20px;',
      'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
      'top-left': 'top: 20px; left: 20px;',
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);',
      'bottom-left': 'bottom: 20px; left: 20px;',
    };
    return positions[position] || positions['top-right'];
  }

  private getIconAndColor(type: ToastType): { icon: string; color: string; bg: string } {
    const styles = {
      success: { icon: '✓', color: '#10b981', bg: '#d1fae5' },
      error: { icon: '✕', color: '#ef4444', bg: '#fee2e2' },
      info: { icon: 'i', color: '#3b82f6', bg: '#dbeafe' },
      warning: { icon: '⚠', color: '#f59e0b', bg: '#fef3c7' },
    };
    return styles[type];
  }

  show(message: string, type: ToastType = 'info', options: ToastOptions = {}) {
    const { duration = 3000, position = 'top-right' } = options;
    this.ensureContainer(position);

    const { icon, color, bg } = this.getIconAndColor(type);

    const toast = document.createElement('div');
    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      color: #1f2937;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      margin-bottom: 12px;
      min-width: 300px;
      max-width: 500px;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid ${color};
    `;

    toast.innerHTML = `
      <style>
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      </style>
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${bg};
        color: ${color};
        font-weight: bold;
        font-size: 14px;
        flex-shrink: 0;
      ">${icon}</div>
      <div style="flex: 1; font-size: 14px; line-height: 1.5;">${message}</div>
      <button onclick="this.parentElement.remove()" style="
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      ">&times;</button>
    `;

    this.container?.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(message: string, options?: ToastOptions) {
    this.show(message, 'success', options);
  }

  error(message: string, options?: ToastOptions) {
    this.show(message, 'error', options);
  }

  info(message: string, options?: ToastOptions) {
    this.show(message, 'info', options);
  }

  warning(message: string, options?: ToastOptions) {
    this.show(message, 'warning', options);
  }
}

export const toast = new Toast();
