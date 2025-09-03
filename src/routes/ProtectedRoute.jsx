import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState({ loading: true, ok: false, error: null });

  useEffect(() => {
    let isMounted = true;
    window.electron.hasAccessToApp().then((resultado) => {
      if (isMounted) {
        setStatus({ loading: false, ...resultado });
      }
    });
    // if( isMounted) {
    //   setStatus({ loading: false, ok: true }); // Simulación de acceso permitido
    // }
    return () => { isMounted = false; };
  }, []);

  if (status.loading) return null; // o spinner

  if (!status.ok) {
    if (status.error === "no-session") {
      return <Navigate to="/login" replace />;
    }
    if (status.error === "no-license") {
      return <Navigate to="/pay-license" replace />;
    }

    if (status.error === "not-current-sync") {
      return <Navigate to="/loading" replace />;
    }
  }

  return children;
}