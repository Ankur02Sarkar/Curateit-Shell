
export const updateLocation = (location, tab, navigate, allHighlights = []) => {
    
    if (location === "?add-import-details") {
    navigate("/add-import-details")
} 
    else {
        navigate("/")
    }
}