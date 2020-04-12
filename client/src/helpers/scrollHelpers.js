export const scrollTo = elementId => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({behavior: 'smooth'});
    }
};