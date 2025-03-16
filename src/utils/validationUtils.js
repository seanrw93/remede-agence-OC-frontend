export const useValidationUtils = (config = { emailPattern: null, passwordLength: 0 }) => {
    console.log("useValidationUtil hook running")
    const clearErrors = (ref) => {
        if (!ref || !ref.current) return;
        const errorMessage = ref.current.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains("error-message")) {
            errorMessage.remove();
        }
        ref.current.style.borderColor = ""; // Reset border color
        ref.current.setCustomValidity(""); // Clear custom validity
    };

    const setErrorMessage = (ref, message) => {
        if (!ref || !ref.current) return;
        clearErrors(ref);
        ref.current.insertAdjacentHTML(
            "afterend",
            `<p class="error-message" style="color: red;">${message}</p>`
        );
        ref.current.style.borderColor = "red";
        ref.current.setCustomValidity(message); 
    };

    const validationCheck = (ref) => {
        if (!ref || !ref.current) return true;

        const name = ref.current.name;
        const value = ref.current.value.trim();

        switch (name) {
            case "first-name":
                if (value === "") {
                    setErrorMessage(ref, "Please enter your first name");
                    return false;
                }
                break;
            case "last-name":
                if (value === "") {
                    setErrorMessage(ref, "Please enter your last name");
                    return false;
                }
                break;
            case "email":
                const emailPattern = config.emailPattern || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                if (!value.match(emailPattern)) {
                    setErrorMessage(ref, "Please enter a valid email address");
                    return false;
                }
                break;
            case "password":
                const passwordLength = config.passwordLength || 8;
                if (value.length < passwordLength) {
                    setErrorMessage(ref, `Password must be at least ${passwordLength} characters long`);
                    return false;
                } else if (passwordLength === 0) {
                    setErrorMessage(ref, "Please enter a password");
                    return false;
                }
                break;
            default:
                console.error(`Unknown input: ${name}`);
                clearErrors(ref);
                return true;
        }

        clearErrors(ref);
        return true; 
    };

    const validateInputs = (refs) => {
        let isValid = true;
        refs.forEach((ref) => {
            if (ref && ref.current) {
                clearErrors(ref); 
                const inputIsValid = validationCheck(ref); 
                if (!inputIsValid) {
                    isValid = false;
                }
            }
        });
        return isValid;
    };

    return { validateInputs, clearErrors };
};