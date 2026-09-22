import { X, CheckCircle, Package, Truck, Clock } from 'lucide-react';
import type { TrackingInfo } from '../types';

interface TrackingTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingInfo: TrackingInfo | null;
  onReportIssue: () => void;
}

export function TrackingTimelineModal({ isOpen, onClose, trackingInfo, onReportIssue }: TrackingTimelineModalProps) {
  if (!isOpen || !trackingInfo) return null;

  const getIcon = (index: number) => {
    switch(index) {
      case 0: return <Package className="w-5 h-5" />;
      case 1: return <CheckCircle className="w-5 h-5" />;
      case 2: return <Truck className="w-5 h-5" />;
      case 3: return <Clock className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
        
        {}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold">Lacak Pengiriman</h2>
            <p className="text-sm text-slate-500 mt-1">
              {trackingInfo.courierName} ({trackingInfo.service}) - <span className="font-mono font-semibold text-pumpkin">{trackingInfo.receiptNumber}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="relative pl-8 space-y-8">
            {}
            <div className="absolute top-4 bottom-4 left-[2.25rem] w-px bg-slate-200 dark:bg-slate-800"></div>

            {trackingInfo.timeline.map((point, index) => {
              const isPast = point.completed;
              const isCurrent = point.active;
              const isFuture = !isPast && !isCurrent;

              return (
                <div key={point.id} className="relative">
                  {}
                  <div className={`absolute -left-[1.8rem] w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white dark:bg-[#1A1A1A] z-10 
                    ${isPast ? 'border-green-500 text-green-500' : 
                      isCurrent ? 'border-pumpkin text-pumpkin' : 
                      'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'}`}
                  >
                    {getIcon(index)}
                  </div>

                  {}
                  <div className={`pl-6 ${isFuture ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-start gap-4">
                      <h4 className={`font-semibold ${isCurrent ? 'text-pumpkin' : 'text-slate-900 dark:text-white'}`}>
                        {point.status}
                      </h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {isFuture ? '-' : new Date(point.timestamp).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#141414]">
          <button 
            onClick={() => {
              onClose();
              onReportIssue();
            }}
            className="w-full py-3 px-4 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-slate-700 dark:text-slate-300"
          >
            Laporkan Kendala Pengiriman
          </button>
        </div>
      </div>
    </div>
  );
}
