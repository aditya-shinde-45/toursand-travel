import { useToast } from '../../hooks/useToast';

function Toast() {
  const { items, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto rounded-lg border p-3 text-sm shadow-md ${
            item.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : item.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-blue-200 bg-blue-50 text-blue-700'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <span>{item.text}</span>
            <button type="button" onClick={() => removeToast(item.id)} className="text-xs opacity-70 hover:opacity-100">
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Toast;
