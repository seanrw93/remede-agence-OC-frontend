export const clearErrors = (ref) => {
    console.log("clearErrors ref:", ref.current);
    if (!ref || !ref.current) return;
    const errorMessage = ref.current.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains("error-message")) {
        errorMessage.remove();
    }
    ref.current.style.borderColor = "";
    ref.current.setCustomValidity("");
};

export const setErrorMessage = (ref, message) => {
    console.log("setErrorMessage ref:", ref.current);
    if (!ref || !ref.current) return;
    clearErrors(ref);
    ref.current.insertAdjacentHTML(
        "afterend",
        `<p class="error-message" style="color: red;">${message}</p>`
    );
    ref.current.style.borderColor = "red";
    ref.current.setCustomValidity(message);
};

export const validationCheck = (ref, passwordLength = null) => {
    if (!ref || !ref.current) return true; 

    const name = ref.current.name;
    const value = ref.current.value;

    switch (name) {
        case "first-name":
            if (value.trim() === "") {
                setErrorMessage(ref, "Please enter your first name");
                return false;
            }
            break;
        case "last-name":
            if (value.trim() === "") {
                setErrorMessage(ref, "Please enter your last name");
                return false;
            }
            break;
        case "email":
            if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
                setErrorMessage(ref, "Please enter a valid email address");
                return false;
            }
            break;
        case "password":
            if (value.trim().length < passwordLength) {
                setErrorMessage(ref, `Password must be at least ${passwordLength} characters long`);
                return false;
            }
            break;
        default:
            console.log(`Unknown input: ${name}`);
            return true;
    }

    return true; // Input is valid
};
