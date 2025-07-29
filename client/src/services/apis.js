const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;


export const endPoint={
    RESET_PASSWORD_TOKEN: BASE_URL +"profile/reset-password-token",
    RESET_PASSWORD_API: BASE_URL + "profile/resetPassword"
}

export const categories={
    CATEGORIES_API : BASE_URL +"course/showAllCategories"
}