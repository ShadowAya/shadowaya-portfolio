import cn from 'classnames';
import React from 'react';

function formSentence(
    options: {
        bold?: boolean;
        capitalize?: boolean;
    },
    ...partsOrFalse: (string|false|null|undefined)[]
) {
    
    const parts = partsOrFalse.filter(part => part) as string[];
    if (parts.length === 0) return '';
    
    if (options.capitalize) parts[0] = parts[0][0].toUpperCase() + parts[0].slice(1);

    const last = parts.pop();
    
    if (parts.length === 0) {
        return <span className={cn(options.bold && 'bold')}>{last}</span>;
    }

    const jsxParts = parts.map((part, index) => (
        <React.Fragment key={index}>
            {index > 0 && ', '}
            <span className={cn(options.bold && 'bold')}>{part}</span>
        </React.Fragment>
    ));

    return (
        <React.Fragment>
            {jsxParts} and <span className={cn(options.bold && 'bold')}>{last}</span>
        </React.Fragment>
    );
}

export default formSentence;
