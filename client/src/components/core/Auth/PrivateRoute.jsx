import { useSelector } from "react-redux"
import { Navigate } from "react-router"

function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth)

  if (token !== null) {
    return children
  } else {
    return <Navigate to="/login" />
  }
}

export default PrivateRoute