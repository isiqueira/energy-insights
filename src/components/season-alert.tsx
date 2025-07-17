'use client';

import { Sun, Snowflake, Leaf } from 'lucide-react';
import { CloudSun } from 'lucide-react';


interface SeasonAlertProps {
    mesAno: string;
}

type Season = {
    name: 'Verão' | 'Outono' | 'Inverno' | 'Primavera';
    icon: React.ReactNode;
    colorClass: string;
};

const getSeason = (mesAno: string): Season => {
    const month = parseInt(mesAno.split('/')[0], 10);

    // Seasons for the Southern Hemisphere (Brazil)
    if (month === 12 || month === 1 || month === 2) {
        return { 
            name: 'Verão', 
            icon: <Sun className="h-5 w-5" />, 
            colorClass: 'border-yellow-500/50 text-yellow-700 dark:text-yellow-400'
        };
    } else if (month >= 3 && month <= 5) {
        return { 
            name: 'Outono', 
            icon: <Leaf className="h-5 w-5" />, 
            colorClass: 'border-orange-500/50 text-orange-700 dark:text-orange-400'
        };
    } else if (month >= 6 && month <= 8) {
        return { 
            name: 'Inverno', 
            icon: <Snowflake className="h-5 w-5" />, 
            colorClass: 'border-blue-500/50 text-blue-700 dark:text-blue-400'
        };
    } else {
        return { 
            name: 'Primavera', 
            icon: <CloudSun className="h-5 w-5" />, 
            colorClass: 'border-green-500/50 text-green-700 dark:text-green-400'
        };
    }
};

export default function SeasonAlert({ mesAno }: SeasonAlertProps) {
    const season = getSeason(mesAno);

    return (
        <div className={`flex items-center justify-center gap-2 rounded-lg border py-2 px-4 max-w-xs mx-auto ${season.colorClass}`}>
            {season.icon}
            <span className="font-semibold">{season.name}</span>
        </div>
    );
}
