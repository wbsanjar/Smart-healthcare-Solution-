import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

interface RealtimeContextType {
  channel: ReturnType<typeof supabase.channel> | null;
}

const RealtimeContext = createContext<RealtimeContextType>({ channel: null });

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { addNotification } = useNotifications();
  const { userId } = useAuth();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('neurocare-realtime', {
      config: { broadcast: { self: true } },
    });

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'emergency_requests',
        },
        (payload) => {
          const req = payload.new as Record<string, unknown>;
          const isOwn = req.user_id === userId;

          if (isOwn) {
            addNotification({
              title: '🚑 Emergency Request Submitted',
              message: `Your emergency request (${req.id}) has been submitted. Help is on the way.`,
              type: 'emergency',
            });
          } else {
            addNotification({
              title: '🚨 New Emergency Case',
              message: `New ${req.severity || 'emergency'} case #${req.id} requires attention.`,
              type: 'emergency',
              link: '/doctor-dashboard',
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'emergency_requests',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const old = payload.old as Record<string, unknown>;
          const updated = payload.new as Record<string, unknown>;
          if (old.status !== updated.status) {
            addNotification({
              title: '🔄 Case Status Updated',
              message: `Your emergency request #${updated.id} status changed to "${updated.status}".`,
              type: 'info',
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ambulances',
        },
        (payload) => {
          const amb = payload.new as Record<string, unknown>;
          if (amb.status === 'available') {
            addNotification({
              title: '🚑 Ambulance Available',
              message: `Ambulance ${amb.vehicle_number || ''} is now available for dispatch.`,
              type: 'success',
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'patient_vitals',
        },
        (payload) => {
          const vitals = payload.new as Record<string, unknown>;
          addNotification({
            title: '❤️ New Vitals Recorded',
            message: vitals.notes
              ? `Vitals: ${vitals.notes}`
              : `Heart rate: ${vitals.heart_rate || 'N/A'}, BP: ${vitals.blood_pressure || 'N/A'}`,
            type: 'info',
          });
        }
      );

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('🔌 Realtime connected');
      }
    });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [userId, addNotification]);

  return (
    <RealtimeContext.Provider value={{ channel: channelRef.current }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  return useContext(RealtimeContext);
}
