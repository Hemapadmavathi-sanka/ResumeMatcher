import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function NotificationSystem({ token, userEmail }) {
  const [notifications, setNotifications] = useState([]);
  const clientRef = useRef(null);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    if (!token || !userEmail) return;

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    });

    client.onConnect = (frame) => {
      client.subscribe(`/user/${userEmail}/topic/notifications`, (message) => {
        try {
          const notif = JSON.parse(message.body);
          const id = Date.now();
          const newNotif = { ...notif, id };
          setNotifications(prev => [...prev.slice(-4), newNotif]);
          setTimeout(() => removeNotification(id), 6000);
        } catch (e) {
          console.error("Failed to parse notification", e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error', frame.headers['message']);
    };

    try {
      client.activate();
      clientRef.current = client;
    } catch (err) {
      console.error("STOMP Activation failed", err);
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [token, userEmail, removeNotification]);

  try {
    return (
      <div className="notification-container">
        {notifications.map(n => (
          <div key={n.id} className="notification-toast">
            <div className={`notif-icon ${n.type || ''}`}>
              {n.type === 'STATUS_UPDATE' ? '\u26A1' : n.type === 'NEW_APPLICATION' ? String.fromCodePoint(0x1F3AF) : String.fromCodePoint(0x1F514)}
            </div>
            <div className="notif-body">
              <div className="notif-title">
                {n.type === 'STATUS_UPDATE' ? 'Status Update' : n.type === 'NEW_APPLICATION' ? 'New Applicant' : 'Notification'}
              </div>
              <div className="notif-text">{n.message}</div>
            </div>
            <button className="modal-close" onClick={() => removeNotification(n.id)} style={{ fontSize: '1.2rem', padding: '0 4px' }}>&times;</button>
          </div>
        ))}
      </div>
    );
  } catch (err) {
    console.error("Notification UI crash", err);
    return null;
  }
}
