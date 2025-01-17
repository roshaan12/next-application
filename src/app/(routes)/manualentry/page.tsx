'use client'

import { Loader } from '@/components/common';
import { ContextApi } from '@/context/context';
import { IFormSchema, formSchema } from '@/utils/zodschema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';

function ManualEntry() {

    const { state } = useContext(ContextApi)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<IFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "local", // Default to 'local' but can be changed via the select input
            name: "",
            fName: "",
            cnic: "",
            address: "",
            vehsType: "",
            accompanyingFamilyMembersName: "",
            cnicOfFamilyMembers: "",
            relation: "",
            guestName: "",
            cnicOfGuest: "",
            addressOfGuest: "",
            childrenNos: "",
            driverName: "",
            secondSeater: "",
            chassisNumber: "",
            engineNumber: "",
            regnNo: "",
            destination: "dalbandin",
            // For tradeXing type
            residenceOf: "",
            vehNo: "",
            typeOfVeh: "",
            nameOfCoy: "",
            item: "",
            loadInNos: "",
            loadInTns: "",
            remarks: "",
        }
    });

    console.log(errors);

    async function onSubmit(data: IFormSchema) {
        console.log('Form data:', data); 
        try {
            setLoading(true)
            const response = await fetch('/api/entry', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            const resData = await response.json()
            if (resData.status === 'error') {
                throw new Error(resData.message)
            }
            if (resData.status === 'success') {
                if (typeof window !== 'undefined') {
                toast.success(`${resData.message}`, {
                    duration: 2000,
                    position: window.matchMedia("(min-width: 600px)").matches ? "bottom-right" : "bottom-center",

                    style: {
                        backgroundColor: '#d9d9d9',
                        padding: window.matchMedia("(min-width: 600px)").matches ? "20px 30px" : "15px 20px",
                        fontSize: '14px',
                        fontWeight: 'bold'
                    },
                });
            }
            }
            reset()
        }
        catch (err: any) {
            if (typeof window !== 'undefined') {
            toast.error(err.message, {
                duration: 4000,
                position: window.matchMedia("(min-width: 600px)").matches ? "bottom-right" : "bottom-center",

                style: {
                    backgroundColor: '#d9d9d9',
                    padding: window.matchMedia("(min-width: 600px)").matches ? "20px 30px" : "15px 20px",
                    fontSize: '14px',
                    fontWeight: 'bold'
                },
            });
        }
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className='mt-10'>
            <Toaster />
            <h1 className='text-2xl font-bold text-zinc-800'>Manual Entry</h1>
            <div className='mt-10'>
                <form action="" onSubmit={handleSubmit(onSubmit)} >
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="select" className='text-sm text-zinc-700 font-semibold'>Select / منتخب کریں۔</label>
                            <select id="select" {...register("type")} className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base'>
                                <option value="local">Chedgi Pedestarian Xing</option>
                                {state.userDetails && (state.userDetails.role === 'super-admin' || state.userDetails.role === 'admin') && (
                                    <>
                                        <option value="fuelTrade">Paragkoh Fuel Xing</option>
                                        <option value="tradeXing">Chedgi Trade Xing</option>
                                    </>
                                )}
                            </select>
                        </div>
                        {watch().type !== 'tradeXing' ? (
    <div className='flex flex-col gap-1'>
        <label htmlFor="name" className='text-sm text-zinc-700 font-semibold'>Name / نام</label>
        <input {...register("name")} type="text" id='name' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
        {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
    </div>
) : (
    <input {...register("name")} id='name' type="hidden" value="dummyName" />
)}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="fName" className='text-sm text-zinc-700 font-semibold'>Father Name / والد کا نام</label>
                            <input {...register("fName")} type="text" id='fName' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                            {errors.fName && <p className='text-red-500 text-sm'>{errors.fName.message}</p>}
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="cnic" className='text-sm text-zinc-700 font-semibold'>CNIC / شناختی کارڈ</label>
                            <input {...register("cnic")} type="text" id='cnic' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                            {errors.cnic && <p className='text-red-500 text-sm'>{errors.cnic.message}</p>}
                        </div>
                        {watch().type !== 'tradeXing' ? (
    <div className='flex flex-col gap-1'>
        <label htmlFor="address" className='text-sm text-zinc-700 font-semibold'>Address / پتہ</label>
        <input {...register("address")} type="text" id='address' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
        {errors.address && <p className='text-red-500 text-sm'>{errors.address.message}</p>}
    </div>
) : (
    <input {...register("address")} type="hidden" id='address' value="dummyAddress" />
)}
                        {watch().type === 'local' && (
                            <>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="vehsType" className='text-sm text-zinc-700 font-semibold'>Vehicle Type / گاڑی کی قسم</label>
                                    <input {...register("vehsType")} type="text" id='vehsType' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.vehsType && <p className='text-red-500 text-sm'>{errors.vehsType.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="accompanyingFamilyMembersName" className='text-sm text-zinc-700 font-semibold'>Accompanying Family Members Name / ھمرا کا نام</label>
                                    <input {...register("accompanyingFamilyMembersName")} type="text" id='accompanyingFamilyMembersName' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.accompanyingFamilyMembersName && <p className='text-red-500 text-sm'>{errors.accompanyingFamilyMembersName.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="cnicOfFamilyMembers" className='text-sm text-zinc-700 font-semibold'>CNIC of Family Members / خاندان کا شناختی کارڈ</label>
                                    <input {...register("cnicOfFamilyMembers")} type="text" id='cnicOfFamilyMembers' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.cnicOfFamilyMembers && <p className='text-red-500 text-sm'>{errors.cnicOfFamilyMembers.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="relation" className='text-sm text-zinc-700 font-semibold'>Relation / ر شتہ</label>
                                    <input {...register("relation")} type="text" id='relation' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.relation && <p className='text-red-500 text-sm'>{errors.relation.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="guestName" className='text-sm text-zinc-700 font-semibold'>Guest Name / مہمان کا نام</label>
                                    <input {...register("guestName")} type="text" id='guestName' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.guestName && <p className='text-red-500 text-sm'>{errors.guestName.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="cnicOfGuest" className='text-sm text-zinc-700 font-semibold'>CNIC of Guest / شناختی نمبر مہمان کا</label>
                                    <input {...register("cnicOfGuest")} type="text" id='cnicOfGuest' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.cnicOfGuest && <p className='text-red-500 text-sm'>{errors.cnicOfGuest.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="addressOfGuest" className='text-sm text-zinc-700 font-semibold'>Address of Guest / مہمان کا پتہ</label>
                                    <input {...register("addressOfGuest")} type="text" id='addressOfGuest' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.addressOfGuest && <p className='text-red-500 text-sm'>{errors.addressOfGuest.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="childrenNos" className='text-sm text-zinc-700 font-semibold'>Number of Children / بچوں کی تعداد</label>
                                    <input {...register("childrenNos")} type="text" id='childrenNos' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.childrenNos && <p className='text-red-500 text-sm'>{errors.childrenNos.message}</p>}
                                </div>
                            </>
                        )}

                        {watch().type === 'fuelTrade' && (
                            <>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="driverName" className='text-sm text-zinc-700 font-semibold'>Driver Name / گاڈی چلانے والے کا نام</label>
                                    <input {...register("driverName")} type="text" id='driverName' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.driverName && <p className='text-red-500 text-sm'>{errors.driverName.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="secondSeater" className='text-sm text-zinc-700 font-semibold'>Second Seater / دوسری ثیٹر</label>
                                    <input {...register("secondSeater")} type="text" id='secondSeater' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.secondSeater && <p className='text-red-500 text-sm'>{errors.secondSeater.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="chassisNumber" className='text-sm text-zinc-700 font-semibold'>Chassis Number / باڈی نمبر</label>
                                    <input {...register("chassisNumber")} type="text" id='chassisNumber' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.chassisNumber && <p className='text-red-500 text-sm'>{errors.chassisNumber.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="engineNumber" className='text-sm text-zinc-700 font-semibold'>Engine Number / انجن نامبر</label>
                                    <input {...register("engineNumber")} type="text" id='engineNumber' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.engineNumber && <p className='text-red-500 text-sm'>{errors.engineNumber.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="regnNo" className='text-sm text-zinc-700 font-semibold'>Regn No / درج نمبر</label>
                                    <input {...register("regnNo")} type="text" id='regnNo' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.regnNo && <p className='text-red-500 text-sm'>{errors.regnNo.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="destination" className='text-sm text-zinc-700 font-semibold'>Destination / منزل</label>
                                    <select id="destination" {...register("destination")} className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base'>
                                        <option value="dalbandin">Dalbandin</option>
                                        <option value="nokhundi">Nokhundi</option>
                                        <option value="rajay">Rajay</option>
                                        <option value="talab">Talab</option>
                                    </select>
                                    {errors.destination && <p className='text-red-500 text-sm'>{errors.destination.message}</p>}
                                </div>
                            </>
                        )}

                        {watch().type === 'tradeXing' && (
                            <>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="driverName" className='text-sm text-zinc-700 font-semibold'>Driver Name / گاڈی چلانے والے کا نام</label>
                                    <input {...register("driverName")} type="text" id='driverName' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.driverName && <p className='text-red-500 text-sm'>{errors.driverName.message}</p>}
                                </div>
                           
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="residenceOf" className='text-sm text-zinc-700 font-semibold'>Residence Of / رہائش</label>
                                    <input {...register("residenceOf")} type="text" id='residenceOf' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.residenceOf && <p className='text-red-500 text-sm'>{errors.residenceOf.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="vehNo" className='text-sm text-zinc-700 font-semibold'>Vehicle No / گاڑی نمبر</label>
                                    <input {...register("vehNo")} type="text" id='vehNo' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.vehNo && <p className='text-red-500 text-sm'>{errors.vehNo.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="typeOfVeh" className='text-sm text-zinc-700 font-semibold'>Type of Vehicle / گاڑی کی قسم</label>
                                    <input {...register("typeOfVeh")} type="text" id='typeOfVeh' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.typeOfVeh && <p className='text-red-500 text-sm'>{errors.typeOfVeh.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="nameOfCoy" className='text-sm text-zinc-700 font-semibold'>Name of Company / کمپنی کا نام</label>
                                    <input {...register("nameOfCoy")} type="text" id='nameOfCoy' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.nameOfCoy && <p className='text-red-500 text-sm'>{errors.nameOfCoy.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="item" className='text-sm text-zinc-700 font-semibold'>Item / چیز</label>
                                    <input {...register("item")} type="text" id='item' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.item && <p className='text-red-500 text-sm'>{errors.item.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="loadInNos" className='text-sm text-zinc-700 font-semibold'>Load in Nos / تعداد</label>
                                    <input {...register("loadInNos")} type="text" id='loadInNos' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.loadInNos && <p className='text-red-500 text-sm'>{errors.loadInNos.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="loadInTns" className='text-sm text-zinc-700 font-semibold'>Load in Tons / ٹن</label>
                                    <input {...register("loadInTns")} type="text" id='loadInTns' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.loadInTns && <p className='text-red-500 text-sm'>{errors.loadInTns.message}</p>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="remarks" className='text-sm text-zinc-700 font-semibold'>Remarks / ریمارکس</label>
                                    <input {...register("remarks")} type="text" id='remarks' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    {errors.remarks && <p className='text-red-500 text-sm'>{errors.remarks.message}</p>}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mt-8 flex justify-end border-t py-5">
                        <button disabled={loading} type='submit' className="text-white w-[100px] h-[50px] rounded-md bg-primary">{loading ? <Loader height='h-4' width='w-4' /> : 'Submit'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ManualEntry;
