'use client';
import MainInfo from '@/app/roulette/MainInfo';
import store from '@/redux/store';
import {Suspense} from 'react';
import {Provider} from 'react-redux';

const RoulettePage: React.FC = () => {
	return (
		<Provider store={store}>
			<Suspense>
				<MainInfo/>
			</Suspense>
		</Provider>);
};

export default RoulettePage;