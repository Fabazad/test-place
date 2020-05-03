export const scrollTo = (elementId , rep = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({behavior: 'smooth'});
    } else if(rep < 10) {
        setTimeout(() => scrollTo(elementId, rep++), 100);
    }
};

export const scrollTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
};