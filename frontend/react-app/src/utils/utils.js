export const transformDateWithTime = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString("pl-PL", {year: 'numeric', month: '2-digit', day: '2-digit'})} ${
        date.getHours().toString().padStart(2, '0')}:${
        date.getMinutes().toString().padStart(2, '0')}`;
};

export const transformDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
};