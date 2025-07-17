'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sun, CloudSun, Snowflake, Leaf } from 'lucide-react';

interface SeasonAlertProps {
    mesAno: string;
}

type Season = {
    name: 'Verão' | 'Outono' | 'Inverno' | 'Primavera';
    icon: React.ReactNode;
    colorClass: string;
    borderColorClass: string;
    bgColorClass: string;
};

const getSeason = (mesAno: string): Season => {
    const month = parseInt(mesAno.split('/')[0], 10);

    // Seasons for the Southern Hemisphere (Brazil)
    if (month === 12 || month === 1 || month === 2) {
        return { 
            name: 'Verão', 
            icon: <Sun className="h-5 w-5" />, 
            colorClass: 'text-chart-3', 
            borderColorClass: 'border-chart-3/50', 
            bgColorClass: 'bg-chart-3/5' 
        };
    } else if (month >= 3 && month <= 5) {
        return { 
            name: 'Outono', 
            icon: <Leaf className="h-5 w-5" />, 
            colorClass: 'text-chart-5', 
            borderColorClass: 'border-chart-5/50', 
            bgColorClass: 'bg-chart-5/5' 
        };
    } else if (month >= 6 && month <= 8) {
        return { 
            name: 'Inverno', 
            icon: <Snowflake className="h-5 w-5" />, 
            colorClass: 'text-chart-1', 
            borderColorClass: 'border-chart-1/50', 
            bgColorClass: 'bg-chart-1/5' 
        };
    } else {
        return { 
            name: 'Primavera', 
            icon: <CloudSun className="h-5 w-5" />, 
            colorClass: 'text-chart-2', 
            borderColorClass: 'border-chart-2/50', 
            bgColorClass: 'bg-chart-2/5'
        };
    }
};

export default function SeasonAlert({ mesAno }: SeasonAlertProps) {
    const season = getSeason(mesAno);

    return (
        <Alert className={`flex items-center justify-center gap-2 p-2 max-w-xs mx-auto ${season.borderColorClass} ${season.bgColorClass} ${season.colorClass}`}>
            {season.icon}
            <span className="font-semibold text-sm">{season.name}</span>
        </Alert>
    );
}
