'use client'
import { IFormSchema, formSchema } from "@/utils/zodschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader } from "@/components/common";
import { X } from "lucide-react";

function EditForm({ currentEntry, setCurrentEntry, openEdit, setOpenEdit, fetchData, type }: any) {

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<IFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: type,
            name: currentEntry && type !== 'tradeXing' ? currentEntry.name : '',
            fName: currentEntry && currentEntry.fName,
            cnic: currentEntry && currentEntry.cnic,
            address: currentEntry && type !== 'tradeXing' ? currentEntry.address : '',
            // Fields specific to 'local' type
            vehsType: currentEntry && type === 'local' ? currentEntry.vehsType : '',
            accompanyingFamilyMembersName: currentEntry && type === 'local' ? currentEntry.accompanyingFamilyMembersName : '',
            cnicOfFamilyMembers: currentEntry && type === 'local' ? currentEntry.cnicOfFamilyMembers : '',
            relation: currentEntry && type === 'local' ? currentEntry.relation : '',
            guestName: currentEntry && type === 'local' ? currentEntry.guestName : '',
            cnicOfGuest: currentEntry && type === 'local' ? currentEntry.cnicOfGuest : '',
            addressOfGuest: currentEntry && type === 'local' ? currentEntry.addressOfGuest : '',
            childrenNos: currentEntry && type === 'local' ? currentEntry.childrenNos : '',
            // Fields specific to 'fuelTrade' type
            driverName: currentEntry && (type === 'fuelTrade' || type === 'tradeXing') ? currentEntry.driverName : '',

            secondSeater: currentEntry && type === 'fuelTrade' ? currentEntry.secondSeater : '',
            chassisNumber: currentEntry && type === 'fuelTrade' ? currentEntry.chassisNumber : '',
            engineNumber: currentEntry && type === 'fuelTrade' ? currentEntry.engineNumber : '',
            regnNo: currentEntry && type === 'fuelTrade' ? currentEntry.regnNo : '',
            // Fields specific to 'tradeXing' type
            
            residenceOf: currentEntry && type === 'tradeXing' ? currentEntry.residenceOf : '',
            vehNo: currentEntry && type === 'tradeXing' ? currentEntry.vehNo : '',
            typeOfVeh: currentEntry && type === 'tradeXing' ? currentEntry.typeOfVeh : '',
            nameOfCoy: currentEntry && type === 'tradeXing' ? currentEntry.nameOfCoy : '',
            item: currentEntry && type === 'tradeXing' ? currentEntry.item : '',
            loadInNos: currentEntry && type === 'tradeXing' ? currentEntry.loadInNos : '',
            loadInTns: currentEntry && type === 'tradeXing' ? currentEntry.loadInTns : '',
            remarks: currentEntry && type === 'tradeXing' ? currentEntry.remarks : '',
        }
    });

    async function onSubmit(data: IFormSchema) {
        try {
            setLoading(true);
            const response = await fetch(`/api/entry/${currentEntry._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const resData = await response.json();
            if (resData.status === 'error') {
                throw new Error(resData.message);
            }
            if (resData.status === 'success') {
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
                setCurrentEntry('');
                fetchData();
                setOpenEdit(false);
            }
        }
        catch (err: any) {
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
        finally {
            setLoading(false);
        }

    }

    return (
        <Dialog open={openEdit} onOpenChange={setOpenEdit} >
            <DialogContent
                onOpenAutoFocus={e => e.preventDefault()}
                className='max-w-full lg:max-w-[1000px] max-h-screen !overflow-auto'
            >
                <X onClick={() => {
                    setOpenEdit(false);
                    setCurrentEntry('');
                }} className="absolute cursor-pointer print:hidden top-3 right-3 h-4 w-4" />
                <DialogHeader>
                    <DialogTitle>Edit</DialogTitle>
                </DialogHeader>
                <div>
                    <form action="" onSubmit={handleSubmit(onSubmit)} >
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7'>
                            {watch().type !== 'tradeXing' && (
                                <>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="name" className='text-sm text-zinc-700 font-semibold'>Name / نام</label>
                                        <input {...register("name")} type="text" id='name' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                        {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
                                    </div>

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

                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="address" className='text-sm text-zinc-700 font-semibold'>Address / پتہ</label>
                                        <input {...register("address")} type="text" id='address' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                        {errors.address && <p className='text-red-500 text-sm'>{errors.address.message}</p>}
                                    </div>
                                </>
                            )}
                            {watch().type === 'local' && (
                                <>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="vehsType" className='text-sm text-zinc-700 font-semibold'>Vehicle Type / گاڑی کی قسم</label>
                                        <input {...register("vehsType")} type="text" id='vehsType' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="accompanyingFamilyMembersName" className='text-sm text-zinc-700 font-semibold'>Accompanying Family Members Name / ھمرا کا نام</label>
                                        <input {...register("accompanyingFamilyMembersName")} type="text" id='accompanyingFamilyMembersName' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="cnicOfFamilyMembers" className='text-sm text-zinc-700 font-semibold'>CNIC of Family Members / خاندان کا شناختی کارڈ</label>
                                        <input {...register("cnicOfFamilyMembers")} type="text" id='cnicOfFamilyMembers' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="relation" className='text-sm text-zinc-700 font-semibold'>Relation / ر شتہ</label>
                                        <input {...register("relation")} type="text" id='relation' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="guestName" className='text-sm text-zinc-700 font-semibold'>Guest Name / مہمان کا نام</label>
                                        <input {...register("guestName")} type="text" id='guestName' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="cnicOfGuest" className='text-sm text-zinc-700 font-semibold'>CNIC of Guest / شناختی نمبر مہمان کا</label>
                                        <input {...register("cnicOfGuest")} type="text" id='cnicOfGuest' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="addressOfGuest" className='text-sm text-zinc-700 font-semibold'>Address of Guest / مہمان کا پتہ</label>
                                        <input {...register("addressOfGuest")} type="text" id='addressOfGuest' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="childrenNos" className='text-sm text-zinc-700 font-semibold'>Number of Children / بچوں کی تعداد</label>
                                        <input {...register("childrenNos")} type="text" id='childrenNos' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                </>
                            )}

                            {watch().type === 'fuelTrade' && (
                                <>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="driverName" className='text-sm text-zinc-700 font-semibold'>Driver Name / گاڈی چلانے والے کا نام</label>
                                        <input {...register("driverName")} type="text" id='driverName' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="secondSeater" className='text-sm text-zinc-700 font-semibold'>Second Seater / دوسری ثیٹر</label>
                                        <input {...register("secondSeater")} type="text" id='secondSeater' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="chassisNumber" className='text-sm text-zinc-700 font-semibold'>Chassis Number / باڈی نمبر</label>
                                        <input {...register("chassisNumber")} type="text" id='chassisNumber' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="engineNumber" className='text-sm text-zinc-700 font-semibold'>Engine Number / انجن نامبر</label>
                                        <input {...register("engineNumber")} type="text" id='engineNumber' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="regnNo" className='text-sm text-zinc-700 font-semibold'>Regn No / درج نمبر</label>
                                        <input {...register("regnNo")} type="text" id='regnNo' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
                                    </div>
                                </>
                            )}

                            {watch().type === 'tradeXing' && (
                                <>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="driverName" className='text-sm text-zinc-700 font-semibold'>Driver Name / گاڈی چلانے والے کا نام</label>
                                        <input {...register("driverName")} type="text" id='driverName' className='border border-zinc-300 text-zinc-800 focus:outline-none py-3 px-4 rounded-lg text-base' />
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
            </DialogContent>
        </Dialog>
    );
}

export default EditForm;
