import { IFormSchema } from "@/utils/zodschema";
import { NextRequest, NextResponse } from "next/server";
import Entry from '@/models/entry.model'
import { CustomError } from "@/utils/customError";
import { connect } from "@/db";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
    try {
        let user_details = JSON.parse(request.headers.get('verifiedJwt') as string)
        if (user_details.role !== 'super-admin' && user_details.role !== 'admin' && user_details.role !== 'user-in-out-local') {
            throw new CustomError('You are not authorized to perform this action', 401)
        }
        await connect()
        let body: IFormSchema = await request.json()
        if (user_details.role === 'user-in-out-local' && body.type === 'fuelTrade') {
            throw new CustomError('You are not authorized to perform this action', 401)
        }
        let oldEntry = await Entry.find({ cnic: body.cnic })
        if (body.type === 'local' && oldEntry.length) {
            throw new CustomError('Duplicate Entry', 409)
        }

        let details = JSON.parse(request.headers.get('verifiedJwt') as string)

        let data: any = {
            type: body.type,
            name: body.name,
            fName: body.fName,
            cnic: body.cnic,
            address: body.address,
            dateTimeOut: null,
            dateTimeIn: null,
            createdBy: details.id
        }
        if (body.type === 'local') {
            data = {
                ...data,
                vehsType: body.vehsType,
                accompanyingFamilyMembersName: body.accompanyingFamilyMembersName,
                cnicOfFamilyMembers: body.cnicOfFamilyMembers,
                relation: body.relation,
                guestName: body.guestName,
                cnicOfGuest: body.cnicOfGuest,
                addressOfGuest: body.addressOfGuest,
                childrenNos: body.childrenNos,
            }
        }
        else if (body.type === 'fuelTrade') {
            data = {
                ...data,
                driverName: body.driverName,
                secondSeater: body.secondSeater,
                chassisNumber: body.chassisNumber,
                engineNumber: body.engineNumber,
                regnNo: body.regnNo,
                destination: body.destination
            }
        }
        else if (body.type === 'tradeXing') {
            data = {
                ...data,
                driverName: body.driverName,
                residenceOf: body.residenceOf,
                vehNo: body.vehNo,
                typeOfVeh: body.typeOfVeh,
                nameOfCoy: body.nameOfCoy,
                item: body.item,
                loadInNos: body.loadInNos,
                loadInTns: body.loadInTns,
                remarks: body.remarks,
            };
        }
        else {
            throw new CustomError('Invalid type', 400)
        }

        await Entry.create(data)
        return NextResponse.json({ message: 'Entry completed successfully', status: "success" }, { status: 200 })
    }
    catch (err: any) {
        return NextResponse.json({ message: err.message, status: 'error' }, { status: err.statusCode ? err.statusCode : 500 })
    }

}






export async function GET(request: NextRequest) {
    console.log(request.nextUrl.searchParams.get('type'));
    let forPage = request.nextUrl.searchParams.get('forPage')
    const regex = new RegExp(request.nextUrl.searchParams.get('search')!, 'i');
    await connect()
    try {

        const query: any = {
            type: request.nextUrl.searchParams.get('type'),
            $or: [
                { name: regex },
                { fName: regex },
                { cnic: regex },
                { address: regex },
                { vehsType: regex },
                { accompanyingFamilyMembersName: regex },
                { cnicOfFamilyMembers: regex },
                { relation: regex },
                { guestName: regex },
                { cnicOfGuest: regex },
                { addressOfGuest: regex },
                { childrenNos: regex },
                { driverName: regex },
                { secondSeater: regex },
                { chassisNumber: regex },
                { engineNumber: regex },
                { regnNo: regex },
                { destination: regex },
    
                { residenceOf: regex },
                { vehNo: regex },
                { typeOfVeh: regex },
                { nameOfCoy: regex },
                { item: regex },
                { loadInNos: regex },
                { loadInTns: regex },
                { remarks: regex },
                // ... add any other fields you want to search
            ]
        };
        console.log("Query:", query);
        // Check if 'text' is a valid ObjectId
        if (mongoose.isValidObjectId(request.nextUrl.searchParams.get('search')!)) {
            query.$or.push({ _id: new mongoose.Types.ObjectId(request.nextUrl.searchParams.get('search')!) });
        }
        let entries = await Entry.find(query);
        // let entries = await Entry.find({ type: request.nextUrl.searchParams.get('type'), $text: { $search: request.nextUrl.searchParams.get('search')! } })
        // let entries = await Entry.find({
        //     type: request.nextUrl.searchParams.get('type'),
        //     $or: [
        //         { name: regex },
        //         { _id: new mongoose.Types.ObjectId(request.nextUrl.searchParams.get('search')!) },
        //         { fName: regex },
        //         { cnic: regex },
        //         { address: regex },
        //         { dateTimeOut: regex },
        //         { dateTimeIn: regex },
        //         { vehsType: regex },
        //         { accompanyingFamilyMembersName: regex },
        //         { cnicOfFamilyMembers: regex },
        //         { relation: regex },
        //         { guestName: regex },
        //         { cnicOfGuest: regex },
        //         { addressOfGuest: regex },
        //         { childrenNos: regex },
        //         { driverName: regex },
        //         { secondSeater: regex },
        //         { chassisNumber: regex },
        //         { engineNumber: regex },
        //         { regnNo: regex },
        //         // Add other fields you want to search in
        //     ]
        // })
        if (forPage && forPage === 'pti') {
            entries = entries.filter((entry) => !entry.dateTimeOut)
        }
        else if (forPage && forPage === 'itp') {
            entries = entries.filter((entry) => !entry.dateTimeIn && entry.dateTimeOut)
        }
        return NextResponse.json({ status: 'success', data: entries }, { status: 200 })
    }
    catch (err: any) {
        return NextResponse.json({ message: err.message, status: 'error' }, { status: err.statusCode ? err.statusCode : 500 })
    }
}
