import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import apiClient from "../api/apiClient";
import { createSocket } from "../api/socketClient";
import { useAuth } from "../auth/AuthContext";


const NotificationContext = createContext(null);


/*
 * One socket + one notification list for the whole student session.
 * The navbar bell, the toast and the Live Notifications page all
 * read from here, so nothing opens a second connection.
 */
export function NotificationProvider({ children }) {

    const { loggedInStudent, loggedInAdmin } = useAuth();

    // students and admins both get live notifications (e.g. chat messages)
    const user = loggedInStudent || loggedInAdmin;

    const studentId =
        user?.id ? String(user.id) : "";

    const [items, setItems] = useState([]);
    const [toast, setToast] = useState(null);
    const timer = useRef(null);


    useEffect(() => {

        if (!studentId) {
            return undefined;
        }

        let active = true;

        apiClient
            .get("/notifications")
            .then((response) => {
                if (active) {
                    setItems(response.data.notifications || []);
                }
            })
            .catch(console.error);

        const socket = createSocket();

        socket.on("new_notification", (notification) => {

            setItems((previous) =>
                previous.some((item) => item._id === notification._id)
                    ? previous
                    : [notification, ...previous]
            );

            setToast(notification);

            clearTimeout(timer.current);
            timer.current = setTimeout(() => setToast(null), 5000);
        });

        socket.connect();

        return () => {
            active = false;
            clearTimeout(timer.current);
            socket.disconnect();
        };

    }, [studentId]);


    // Nothing is shown when logged out
    const notifications = studentId ? items : [];

    const unreadCount =
        notifications.filter((item) => !item.isRead).length;


    async function markRead(id) {

        await apiClient.patch(`/notifications/${id}/read`);

        setItems((previous) =>
            previous.map((item) =>
                item._id === id ? { ...item, isRead: true } : item
            )
        );
    }


    async function markAllRead() {

        await apiClient.patch("/notifications/read-all");

        setItems((previous) =>
            previous.map((item) => ({ ...item, isRead: true }))
        );
    }


    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, markRead, markAllRead }}
        >

            {children}

            {studentId && toast && (

                <div
                    className="toast show position-fixed bottom-0 end-0 m-3"
                    role="alert"
                    style={{ zIndex: 2000 }}
                >
                    <div className="toast-header">
                        <i className="bi bi-bell-fill me-2"></i>
                        <strong className="me-auto">New notification</strong>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setToast(null)}
                        ></button>
                    </div>
                    <div className="toast-body">
                        {toast.title && <strong>{toast.title}: </strong>}
                        {toast.message}
                    </div>
                </div>

            )}

        </NotificationContext.Provider>
    );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {

    return useContext(NotificationContext);
}
