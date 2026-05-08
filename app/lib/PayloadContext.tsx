'use client'

import { createContext, useContext, ReactNode } from 'react';

type PayloadType = {
	username?: string;
	name?: string;
	user_id?: string;
	email?: string;
	expiresAt?: string;
} | undefined;

const PayloadContext = createContext<PayloadType | null>(null);

export function PayloadProvider({ children, payload }: { children: ReactNode; payload: PayloadType }) {
	return (
		<PayloadContext.Provider value={payload}>
			{children}
		</PayloadContext.Provider>
	);
}

export function usePayload() {
	const context = useContext(PayloadContext);
	if (context === null) {
		throw new Error('usePayload must be used within a PayloadProvider');
	}
	return context;
}
