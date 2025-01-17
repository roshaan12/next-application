'use client'

import { Loader } from '@/components/common';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { ISignUpSchema, signUpSchema } from '@/utils/zodschema';
import Image from 'next/image';
import { MdSupervisorAccount } from 'react-icons/md';

function SignUp() {



    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ISignUpSchema>({
        resolver: zodResolver(signUpSchema)
    })

    const router = useRouter()

    async function onSubmit(data: ISignUpSchema) {
        try {
            const response = await fetch('/api/signup', {
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
            
            if (typeof window !== 'undefined' && resData.status === 'success') {
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
            // console.log(resData);
        }
        catch (err: any) {
            if(typeof window !== 'undefined'){
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
    }


    return (
        <>
            <Toaster />
            <div className="grid grid-cols-1 md:grid-cols-1">
                {/* <div className="hidden md:flex flex-col justify-center items-center min-h-screen bg-primary">
                <h1 className="text-4xl lg:text-[2.4rem] font-bold text-white w-[90%] lg:w-[80%] text-center">WELCOME TO CHEDGI XING</h1>

                    <Image src={'/logo.png'} alt='logo' className='w-[300px] mt-10' width={500} height={500} />
                </div> */}
                <div className='p-[10px] md:p-0 w-full flex justify-center items-center relative'>
                    <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center -z-10">
                        <Image src={'/logo.png'} alt="watermark" width={500} height={500} className="w-[500px] opacity-5" />
                    </div>
                    <div className='w-[100%] md:w-[40%] rounded-md mx-auto px-5 py-5 mt-[5rem] mb-[5rem] bg-[#ffffffb8] shadow-lg rounded-[24px]'>
                        {/* <div className="flex justify-center">
                            <MdSupervisorAccount className="text-[150px] text-zinc-800" />
                        </div> */}
                                 <Image src={'/logo.png'} alt='logo' className='w-[100px] mt-10 mx-auto mb-4' width={300} height={300} />
                                 <h1 className="text-4xl lg:text-[2rem] font-bold text-[#85632E] mx-auto text-center">WELCOME TO CHEDGI XING</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 mt-7'>
                            <div>
                                <select {...register("role")} defaultValue={''} className={`text-sm ${errors.role ? 'border-red-500' : 'border-zinc-300'} border outline-none w-full py-4 px-5 rounded-md`}>
                                    <option value="" disabled>Select Role</option>
                                    <option value="user-out-local">user out local</option>
                                    <option value="user-out-fuel-trade">user out fuel trade</option>
                                    <option value="user-in-local">user in local</option>
                                    <option value="user-in-fuel-trade">user in fuel trade</option>
                                    <option value="user-in-out-local">user in out local</option>
                                    <option value="admin">admin</option>
                                    <option value="super-admin">super-admin</option>
                                </select>
                            </div>
                            {
                                errors.role && <p className='text-sm text-red-500 -mt-4'>{errors.role.message}</p>
                            }
                            <input {...register("name")} type="text" placeholder='Full name' className={`text-sm ${errors.name ? 'border-red-500' : 'border-zinc-300'} border outline-none w-full py-4 px-5 rounded-md`} />
                            {
                                errors.name && <p className='text-sm text-red-500 -mt-4'>{errors.name.message}</p>
                            }
                            <input {...register("email")} type='email' placeholder='Email address' className={`text-sm ${errors.email ? 'border-red-500' : 'border-zinc-300'} border outline-none w-full py-4 px-5 rounded-md`} />
                            {
                                errors.email && <p className='text-sm text-red-500 -mt-4'>{errors.email.message}</p>
                            }
                            <input {...register("password")} type="password" placeholder='Password' className={`text-sm ${errors.password ? 'border-red-500' : 'border-zinc-300'} border outline-none w-full py-4 px-5 rounded-md`} />
                            {
                                errors.password && <p className='text-sm text-red-500 -mt-4'>{errors.password.message}</p>
                            }

                            {
                                isSubmitting ?
                                    <button type='button' className='text-white bg-primary font-bold rounded-md tracking-widest w-full h-[50px] text-center'>{isSubmitting ? <Loader height='h-4' width='w-4' /> : 'ADD USER'}</button>
                                    :
                                    <button type='submit' className='text-white bg-primary font-bold rounded-md tracking-widest w-full h-[50px] text-center'>{isSubmitting ? <Loader height='h-4' width='w-4' /> : 'ADD USER'}</button>
                            }
                            {/* <div className='mt-3 py-3 border-t'>
                                <p className='text-sm text-main_dark'>Already have an account? <Link href={'/login'} className='text-blue-700' >Login</Link></p>
                            </div> */}
                        </form>

                    </div>
                </div >
            </div >
        </>
    );
}




export default SignUp