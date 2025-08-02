import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"
import { resetCart } from "../../slices/cartSlice"
import { apiConnector } from "../apiconnector"

import { endPoint } from "../apis"

const {
    SIGNUP_API,
    SENDOTP_API,
    LOGIN_API,
    RESET_PASSWORD_TOKEN,
    RESET_PASSWORD_API
} = endPoint;

export function sendOtp(email, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true,
            })
            // console.log("SENDOTP API RESPONSE............", response)

            console.log(response.data.success)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("OTP Sent Successfully")
            navigate("/verify-email")
        } catch (error) {
            // console.log("SENDOTP API ERROR............", error)
            toast.error(error.response?.data?.message || error.message)
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email, password, navigate) {

    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {
            // CORRECTED: `Maps` is a client-side function and should NOT be sent in the API payload.
            // Sending it can cause the request to fail.
            const response = await apiConnector("POST", LOGIN_API, { email, password });

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Login Successful");

            dispatch(setToken(response.data.token))

            const userImage = response.data?.user?.image
                ? response.data.user.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

            const userWithImage = { ...response.data.user, image: userImage };
            dispatch(setUser(userWithImage));

            localStorage.setItem("token", JSON.stringify(response.data.token));
            // NEW: Add this line to save the full user object to localStorage for persistence
            localStorage.setItem("user", JSON.stringify(userWithImage));

            navigate("/dashboard/my-profile")

        } catch (error) {
            // console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)

    }
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            })

            // console.log("SIGNUP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Sign Up Successful")
            navigate("/login")
        } catch (error) {
            // console.log("SIGNUP API ERROR............", error)
            toast.error(error.response?.data?.message || error.message)
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function getPasswordResetToken(email, setEmailSent) {

    return async (dispatch) => {

        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {

            const response = await apiConnector("POST", RESET_PASSWORD_TOKEN, { email });
            // console.log("Reset password token sent response :", response);


            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Reset Email Sent")
            setEmailSent(true)
        } catch (error) {
            // console.log("RESETPASSWORD_TOKEN ERROR............", error)
            toast.error(error.response?.data?.message || error.message)
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export function resetPassword(password, confirmPassword, token, navigate) {

    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", RESET_PASSWORD_API, {
                password,
                confirmPassword,
                token,
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Password Reset Successfully")
            navigate("/login")
        } catch (error) {
            // console.log("RESETPASSWORD ERROR............", error)
            toast.error(error.response?.data?.message || error.message)
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export function logout(navigate) {
    return (dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}