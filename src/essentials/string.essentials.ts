export class StringEssentials {
    static titleCase(value: string): string {
        let newValue;
        if (!value) {
            newValue = '';
        } else {
            const parts = value.split(' ');
            const newParts: Array<string> = [];
            parts.forEach(part => {
                if (part && part.trim().length > 0) {
                    if (part.length === 1) {
                        newParts.push(part.toUpperCase());
                    } else {
                        const [firstLetter, ...otherLetters] = part;
                        newParts.push(firstLetter.toUpperCase() + otherLetters.join('').toLowerCase());
                    }
                }
            });
            newValue = newParts.join(' ');
        }

        return newValue;
    }
}
