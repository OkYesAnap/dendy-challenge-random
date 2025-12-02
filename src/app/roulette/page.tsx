'use client';
import MainInfo from '@/app/roulette/MainInfo';
import {Suspense} from 'react';

const RoulettePage: React.FC = () => (
        <Suspense>
            <MainInfo/>
        </Suspense>);

export default RoulettePage;