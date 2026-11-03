import {
    createContext,
    useContext,
    useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [
        loggedInStudent,
        setLoggedInStudent
    ] = useState(() => {

        // sessionStorage = one login per browser tab, so two students
        // can be logged in side by side (localStorage is shared by all tabs)
        const data =
            sessionStorage.getItem(
                "loggedInStudent"
            );

        if (!data) {
            return null;
        }

        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    });


    const [
        loggedInAdmin,
        setLoggedInAdmin
    ] = useState(() => {

        const data =
            sessionStorage.getItem(
                "loggedInAdmin"
            );

        if (!data) {
            return null;
        }

        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    });


    function loginStudent(student) {

        setLoggedInStudent(student);

        sessionStorage.setItem(
            "loggedInStudent",
            JSON.stringify(student)
        );
    }


    function loginAdmin(admin) {

        setLoggedInAdmin(admin);

        sessionStorage.setItem(
            "loggedInAdmin",
            JSON.stringify(admin)
        );
    }


    function logoutStudent() {

        setLoggedInStudent(null);

        sessionStorage.removeItem(
            "loggedInStudent"
        );
        localStorage.removeItem(
            "loggedInStudent"
        );

        // the JWT belongs to the student session
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    }


    function logoutAdmin() {

        setLoggedInAdmin(null);

        sessionStorage.removeItem(
            "loggedInAdmin"
        );
        localStorage.removeItem(
            "loggedInAdmin"
        );

        // the JWT belongs to the admin session
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    }


    function logout(role) {

        if (role === "admin") {
            logoutAdmin();
        } else {
            logoutStudent();
        }
    }


    return (
        <AuthContext.Provider
            value={{
                loggedInStudent,
                loggedInAdmin,
                loginStudent,
                loginAdmin,
                logoutStudent,
                logoutAdmin,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}