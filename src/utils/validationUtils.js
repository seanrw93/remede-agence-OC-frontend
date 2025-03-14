export const useValidationUtils = (config = { emailPattern: null, passwordLength: 0 }) => {
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
        clearErrors(ref); // Clear any existing errors
        ref.current.insertAdjacentHTML(
            "afterend",
            `<p class="error-message" style="color: red;">${message}</p>`
        );
        ref.current.style.borderColor = "red"; // Highlight the field with an error
        ref.current.setCustomValidity(message); // Set custom validity for the browser
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

        clearErrors(ref); // Clear errors if the input is valid
        return true; // Input is valid
    };

    const validateInputs = (refs) => {
        let isValid = true;
        refs.forEach((ref) => {
            if (ref && ref.current) {
                clearErrors(ref); // Clear previous errors
                const inputIsValid = validationCheck(ref); // Validate the current input
                if (!inputIsValid) {
                    isValid = false; // Mark the form as invalid if any input fails
                }
            }
        });
        return isValid;
    };

    return { validateInputs, clearErrors };
};