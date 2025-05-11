export const formatName = (name) => {

    if (!name) {
        console.error("Name is undefined or null");
        return "";
    }

    const prefixes = ["mc", "mac", "o'"];
    
    // Check if the name starts with "Mc", "Mac", or "O'"
    for (let i = 0; i < prefixes.length; i++) {
        const prefix = prefixes[i];
        if (name.toLowerCase().startsWith(prefix)) {
            // Format the prefix
            const formattedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
            const restOfName = name.slice(prefix.length); 
            return (
                formattedPrefix +
                restOfName
                    .split(/[-\s]/) // Split at hyphens or spaces
                    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                    .join(restOfName.includes("-") ? "-" : " ")
            );
        }
    }

    // Check if the name includes a hyphen
    if (name.includes("-")) {
        return name
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join("-");
    } 
    
    // Check if the name includes a space
    if (name.includes(" ")) {
        return name
            .split(" ")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(" ");
    } 
    
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    
}