export const getElementPos = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    return e.currentTarget.getBoundingClientRect();
}