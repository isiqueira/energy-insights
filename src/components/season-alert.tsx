'use client';

import { Alert } from '@/components/ui/alert';
import { Sun, CloudSun, Snowflake, Leaf } from 'lucide-react';

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
            colorClass: 'text-chart-3'
        };
    } else if (month >= 3 && month <= 5) {
        return { 
            name: 'Outono', 
            icon: <Leaf className="h-5 w-5" />, 
            colorClass: 'text-chart-5'
        };
    } else if (month >= 6 && month <= 8) {
        return { 
            name: 'Inverno', 
            icon: <Snowflake className="h-5 w-5" />, 
            colorClass: 'text-chart-1'
        };
    } else {
        return { 
            name: 'Primavera', 
            icon: <CloudSun className="h-5 w-5" />, 
            colorClass: 'text-chart-2'
        };
    }
};

export default function SeasonAlert({ mesAno }: SeasonAlertProps) {
    const season = getSeason(mesAno);

    return (
        <Alert className={`flex items-center justify-center gap-2 p-2 max-w-xs mx-auto border-0 bg-transparent ${season.colorClass}`}>
            {season.icon}
            <span className="font-semibold text-sm">{season.name}</span>
        </Alert>
    );
}
