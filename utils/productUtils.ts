export const matchesLabels = (
    { name, description }: { name: string; description: string },
    labelText: string
) => {
    const itemText = `${name} ${description}`.toLowerCase();
    return labelText.split(' ').some(label => itemText.includes(label));
};

export const contains = (
    { name, description }: { name: string; description: string },
    query: string
) => {
    return name.toLowerCase().includes(query) || description.toLowerCase().includes(query);
};