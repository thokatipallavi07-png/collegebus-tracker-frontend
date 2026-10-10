import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-shelf">
      {toasts.map(toast => (
        <div key={toast.id} className="toast-item">
          {toast.type === 'error' ? (
            <AlertCircle size={15} color="#f87171" />
          ) : (
            <CheckCircle2 size={15} color="#34d399" />
          )}
          <span>{toast.message}</span>
          <button 
            onClick={() => onDismiss(toast.id)} 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 'auto', display: 'flex' }}
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
