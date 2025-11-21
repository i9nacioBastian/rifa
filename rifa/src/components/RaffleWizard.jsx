import { useState } from 'react';
import BasicConfig from './BasicConfig';
import PrizeConfig from './PrizeConfig';
import { saveRaffleConfig } from '../utils/localStorage';

export default function RaffleWizard({ onComplete }) {
    const [step, setStep] = useState(1);
    const [config, setConfig] = useState({
        name: '',
        image: null,
        numberPrice: '',
        totalNumbers: 100,
        prizes: [],
        status: 'active', // 'active' or 'finalized'
        createdAt: new Date().toISOString()
    });

    const handleBasicConfigNext = (basicData) => {
        setConfig({ ...config, ...basicData });
        setStep(2);
    };

    const handlePrizeConfigBack = () => {
        setStep(1);
    };

    const handlePrizeConfigFinish = (prizes) => {
        const finalConfig = {
            ...config,
            prizes,
            status: 'active'
        };

        saveRaffleConfig(finalConfig);
        onComplete(finalConfig);
    };

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white' : 'text-white/50'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-white text-orange-600' : 'bg-white/30'
                                }`}>
                                1
                            </div>
                            <span className="font-semibold hidden sm:inline">Configuración</span>
                        </div>

                        <div className={`h-1 w-16 ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>

                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white' : 'text-white/50'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-white text-orange-600' : 'bg-white/30'
                                }`}>
                                2
                            </div>
                            <span className="font-semibold hidden sm:inline">Premios</span>
                        </div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="glass-card rounded-3xl p-8 animate-fadeIn">
                    {step === 1 && (
                        <BasicConfig
                            initialData={config}
                            onNext={handleBasicConfigNext}
                        />
                    )}

                    {step === 2 && (
                        <PrizeConfig
                            initialPrizes={config.prizes}
                            onBack={handlePrizeConfigBack}
                            onFinish={handlePrizeConfigFinish}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
