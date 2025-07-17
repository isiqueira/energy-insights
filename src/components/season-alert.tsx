'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sun, CloudSun, Snowflake, Leaf } from 'lucide-react';

interface SeasonAlertProps {
    mesAno: string;
}

const getSeason = (mesAno: string): { name: string; icon: React.ReactNode } => {
    const month = parseInt(mesAno.split('/')[0], 10);

    // Seasons for the Southern Hemisphere (Brazil)
    if (month === 12 || month === 1 || month === 2) {
        return { name: 'Verão', icon: <Sun className="h-4 w-4" /> };
    } else if (month >= 3 && month <= 5) {
        return { name: 'Outono', icon: <Leaf className="h-4 w-4" /> };
    } else if (month >= 6 && month <= 8) {
        return { name: 'Inverno', icon: <Snowflake className="h-4 w-4" /> };
    } else {
        return { name: 'Primavera', icon: <CloudSun className="h-4 w-4" /> };
    }
};

export default function SeasonAlert({ mesAno }: SeasonAlertProps) {
    const season = getSeason(mesAno);

    return (
        <Alert className="mt-4 max-w-sm mx-auto text-center border-accent/50 bg-accent/5">
            {season.icon}
            <AlertTitle className="ml-6">Estamos no {season.name}!</AlertTitle>
            <AlertDescription className="ml-6">
                A estação do ano pode influenciar seu consumo de energia.
            </AlertDescription>
        </Alert>
    );
}
