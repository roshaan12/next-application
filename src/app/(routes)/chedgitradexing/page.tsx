'use client'
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Loader } from '@/components/common';
import { ContextApi } from "@/context/context";

function ChedgiTradeXing() {
    const { state } = useContext(ContextApi);
    const userDetails = state?.userDetails || {}; 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const shouldShowPakToIran = !userDetails.role || 
                                userDetails.role === 'user-in-trade' || 
                                userDetails.role === 'user-in-out-local' || 
                                userDetails.role === 'admin' || 
                                userDetails.role === 'super-admin';

    const shouldShowIranToPak = !userDetails.role || 
                                userDetails.role === 'user-out-trade' || 
                                userDetails.role === 'user-in-out-local' || 
                                userDetails.role === 'admin' || 
                                userDetails.role === 'super-admin';

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader height='h-6' width='w-6' />
            </div>
        );
    }

    return (
        <div className="mt-10 px-5">
            <h1 className="text-2xl font-bold text-zinc-800 text-center">Chedgi Trade Xing</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
                {shouldShowPakToIran && (
                    <Link href="/paktoiran?type=tradeXing&search=" className="block p-6 max-w-[100%] bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Pak to Iran</h5>
                        <p className="font-normal text-gray-700">Manage and view entries for Pak to Iran</p>
                    </Link>
                )}
                {shouldShowIranToPak && (
                    <Link href="/irantopak?type=tradeXing" className="block p-6 max-w-[100%] bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Iran to Pak</h5>
                        <p className="font-normal text-gray-700">Manage and view entries for Iran to Pak</p>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default ChedgiTradeXing;
