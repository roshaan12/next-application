'use client'

import { ImStatsBars } from "react-icons/im";
import { SiMicrosoftexcel } from "react-icons/si";
import { MdOutlineCompareArrows } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { BarChart, Loader } from "@/components/common";
import readXlsxFile from 'read-excel-file'
import { Toaster, toast } from 'react-hot-toast';
import { ContextApi } from "@/context/context";

const Page = () => {
  const { state, dispatch, Logout } = useContext(ContextApi)

  let [active, setActive] = useState(0)
  let [type, setType] = useState('')
  const [fetchedData, setFetchedData] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [addBulkLoading, setAddBulkLoading] = useState(false)
  const [selectedFileData, setSelectedFileData] = useState<any>()
  const [selectedFile, setSelectedFile] = useState<any>()

  let data = [
    { id: 'stats', title: 'DAILY STATE', icon: <ImStatsBars className="text-[60px] text-zinc-800" /> },
  ]

  if (state.userDetails && state.userDetails.role === 'super-admin') {
    data = [
      { id: 'stats', title: 'DAILY STATE', icon: <ImStatsBars className="text-[60px] text-zinc-800" /> },
      { id: 'fuelTrade', title: 'UPLOAD EXCEL PARAGKOH FUEL XING', icon: <SiMicrosoftexcel className="text-[60px] text-zinc-800" /> },
      { id: 'local', title: 'UPLOAD EXCEL CHEDGI PEDESTRIAN XING', icon: <SiMicrosoftexcel className="text-[60px] text-zinc-800" /> },
      { id: 'tradeXing', title: 'UPLOAD EXCEL CHEDGI TRADE XING', icon: <SiMicrosoftexcel className="text-[60px] text-zinc-800" /> },
      { id: 'unified', title: 'UPLOAD UNIFIED DATA', icon: <SiMicrosoftexcel className="text-[60px] text-zinc-800" /> },
    ]
  }

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch('/api/overallstats')
      const data = await res.json()
      if (data.status === 'error') {
        throw new Error(data.message)
      }
      setFetchedData(data.data)
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
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  function ReadExcelFile(e: any) {
    const file = e.target.files[0];

    if (file) {
      const fileType = file.type;
      const allowedTypes = [
        'application/vnd.ms-excel', // for .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // for .xlsx
      ];
      if (allowedTypes.includes(fileType)) {
        readXlsxFile(file).then((rows) => {
          setSelectedFile(file.name)
          setSelectedFileData(rows.slice(1))
        }).catch((error) => {
          toast.error(`Error reading the Excel file: ${error}`, {
            duration: 4000,
            position: window.matchMedia("(min-width: 600px)").matches ? "bottom-right" : "bottom-center",
            style: {
              backgroundColor: '#d9d9d9',
              padding: window.matchMedia("(min-width: 600px)").matches ? "20px 30px" : "15px 20px",
              fontSize: '14px',
              fontWeight: 'bold'
            },
          });
        });
      } else {
        toast.error('Invalid file type. Please upload an Excel file', {
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
    } else {
      console.error('No file selected.');
    }
  }

  async function onSubmit(data: any) {
    try {
      setAddBulkLoading(true)
      const response = await fetch('/api/entry/bulk', {
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
      setAddBulkLoading(false)
    }

  }

  const AddOfficialData = () => {
    if (!selectedFile || !selectedFileData.length) {
      toast.error('please select a file', {
        duration: 4000,
        position: window.matchMedia("(min-width: 600px)").matches ? "bottom-right" : "bottom-center",

        style: {
          backgroundColor: '#d9d9d9',
          padding: window.matchMedia("(min-width: 600px)").matches ? "20px 30px" : "15px 20px",
          fontSize: '14px',
          fontWeight: 'bold'
        },
      });
      return
    }
    if (selectedFileData[0].length !== 10) {
      toast.error('Invalid data format', {
        duration: 4000,
        position: window.matchMedia("(min-width: 600px)").matches ? "bottom-right" : "bottom-center",

        style: {
          backgroundColor: '#d9d9d9',
          padding: window.matchMedia("(min-width: 600px)").matches ? "20px 30px" : "15px 20px",
          fontSize: '14px',
          fontWeight: 'bold'
        },
      });
      return
    }
    let data = selectedFileData.map((item: any) => {
      return {
        type: type,
        name: item[0],
        fName: item[1],
        cnic: item[2],
        address: item[3],
        driverName: item[4],
        secondSeater: item[5],
        chassisNumber: item[6],
        engineNumber: item[7],
        regnNo: item[8],
        destination: item[9]
      }
    })
    onSubmit(data)

  }

  const AddLocalData = () => {
    if (!selectedFile || !selectedFileData.length) {
      toast.error('please select a file', {
        duration: 4000,
        position: window.matchMedia("(min-width: 600px)").matches ? "bottom-right" : "bottom-center",

        style: {
          backgroundColor: '#d9d9d9',
          padding: window.matchMedia("(min-width: 600px)").matches ? "20px 30px" : "15px 20px",
          fontSize: '14px',
          fontWeight: 'bold'
        },
      });
      return
    }
    if (selectedFileData[0].length !== 12) {
      toast.error('Invalid data format', {
        duration: 4000,
        position: window.matchMedia("(min-width: 600px)").matches ? "bottom-right" : "bottom-center",

        style: {
          backgroundColor: '#d9d9d9',
          padding: window.matchMedia("(min-width: 600px)").matches ? "20px 30px" : "15px 20px",
          fontSize: '14px',
          fontWeight: 'bold'
        },
      });
      return
    }

    let data = selectedFileData.map((item: any) => {
      return {
        type: type,
        name: item[0],
        fName: item[1],
        cnic: item[2],
        address: item[3],
        vehsType: item[4],
        guestName: item[5],
        cnicOfGuest: item[6],
        addressOfGuest: item[7],
        childrenNos: item[8],
        accompanyingFamilyMembersName: item[9],
        cnicOfFamilyMembers: item[10],
        relation: item[11],
      }
    })

    onSubmit(data)
  }

  const AddTradeXingData = () => {
    if (!selectedFile || !selectedFileData.length) {
      toast.error('Please select a file', {
        duration: 4000,
        position: window.matchMedia("(min-width: 600px)").matches ? "bottom-right" : "bottom-center",
        style: {
          backgroundColor: '#d9d9d9',
          padding: window.matchMedia("(min-width: 600px)").matches ? "20px 30px" : "15px 20px",
          fontSize: '14px',
          fontWeight: 'bold'
        },
      });
      return;
    }
    if (selectedFileData[0].length !== 11) {
      toast.error('Invalid data format', {
        duration: 4000,
        position: window.matchMedia("(min-width: 600px)").matches ? "bottom-right" : "bottom-center",
        style: {
          backgroundColor: '#d9d9d9',
          padding: window.matchMedia("(min-width: 600px)").matches ? "20px 30px" : "15px 20px",
          fontSize: '14px',
          fontWeight: 'bold'
        },
      });
      return;
    }

    let data = selectedFileData.map((item: any) => {
      return {
        type: type,
        driverName: item[0],
        fName: item[1],
        cnic: item[2],
        residenceOf: item[3],
        vehNo: item[4],
        typeOfVeh: item[5],
        nameOfCoy: item[6],
        item: item[7],
        loadInNos: item[8],
        loadInTns: item[9],
        remarks: item[10]
      };
    });
    onSubmit(data);
  }

  const AddUnifiedData = () => {
    if (!selectedFile || !selectedFileData.length) {
      toast.error('Please select a file', {
        duration: 4000,
        position: window.matchMedia("(min-width: 600px)").matches ? "bottom-right" : "bottom-center",
        style: {
          backgroundColor: '#d9d9d9',
          padding: window.matchMedia("(min-width: 600px)").matches ? "20px 30px" : "15px 20px",
          fontSize: '14px',
          fontWeight: 'bold'
        },
      });
      return;
    }

    let data = selectedFileData.map((item: any) => {
      return {
        type: item[0],
        name: item[1],
        fName: item[2],
        cnic: item[3],
        address: item[4],
        driverName: item[5],
        secondSeater: item[6],
        chassisNumber: item[7],
        engineNumber: item[8],
        regnNo: item[9],
        destination: item[10],
        vehsType: item[11],
        guestName: item[12],
        cnicOfGuest: item[13],
        addressOfGuest: item[14],
        childrenNos: item[15],
        accompanyingFamilyMembersName: item[16],
        cnicOfFamilyMembers: item[17],
        relation: item[18],
        residenceOf: item[19],
        vehNo: item[20],
        typeOfVeh: item[21],
        nameOfCoy: item[22],
        item: item[23],
        loadInNos: item[24],
        loadInTns: item[25],
        remarks: item[26]
      };
    });

    onSubmit(data);
  };

  return (
    <div className="mt-10">
      <Toaster />
      {
        active === 1 ?
          <div>
            <h1 className='text-2xl font-bold text-zinc-800'>Daily State</h1>
            {
              loading ?
                <div className='w-full flex justify-center items-center py-20'>
                  <Loader height='h-6' width='w-6' />
                </div>
                :
                !data.length ?
                  <div className='w-full flex justify-center items-center py-20'>
                    <h1 className='text-xl font-bold text-zinc-800'>No data found</h1>
                  </div>
                  :
                  <div className="w-full lg:w-[70%]">
                    <BarChart
                      data={[fetchedData.tokens, fetchedData.paktoiranofficial, fetchedData.irantopakofficial, fetchedData.paktoiranlocal, fetchedData.irantopaklocal,fetchedData.paktoirantradexing, fetchedData.irantopaktradexing]}
                      labels={[
                        'Token Issued',
                        'Fuel Veh Pak to Iran',
                        'Fuel Veh Iran to Pak',
                        'Pedestrian Pak to Iran',
                        'Pedestrian Iran to Pak',
                        'Trade Xing Pak to Iran',
                        'Trade Xing Iran to Pak',
                      ]}
                    />
                  </div>
            }
          </div>
          :
          active === 2 ?
            <div>
              <h1 className='text-2xl font-bold text-zinc-800'>UPLOAD EXCEL PARAGKOH FUEL XING</h1>
              <div className="mt-10">
                <div>
                  <label htmlFor="file" className="w-[300px] h-[70px] text-zinc-800 font-bold border-2 border-dashed rounded-2xl bg-zinc-100 flex justify-center items-center">
                    Browse File
                  </label>
                  <input onChange={ReadExcelFile} type="file" id="file" hidden />
                  <p className="mt-2">{selectedFile ? selectedFile : 'No file selected'} </p>
                </div>
                <button disabled={addBulkLoading} onClick={AddOfficialData} className="py-3 w-[120px] mt-5 rounded-lg bg-primary text-white">{addBulkLoading ? <Loader height="h-4" width="w-4" /> : 'Submit'}</button>
              </div>
            </div>
            :
            active === 3 ?
              <div>
                <h1 className='text-2xl font-bold text-zinc-800'>UPLOAD EXCEL LOCAL RESIDENTS</h1>
                <div className="mt-10">
                  <div>
                    <label htmlFor="file" className="w-[300px] h-[70px] text-zinc-800 font-bold border-2 border-dashed rounded-2xl bg-zinc-100 flex justify-center items-center">
                      Browse File
                    </label>
                    <input onChange={ReadExcelFile} type="file" id="file" hidden />
                    <p className="mt-2">{selectedFile ? selectedFile : 'No file selected'} </p>
                  </div>
                  <button disabled={addBulkLoading} onClick={AddLocalData} className="py-3 w-[120px] mt-5 rounded-lg bg-primary text-white">{addBulkLoading ? <Loader height="h-4" width="w-4" /> : 'Submit'}</button>
                </div>
              </div>
              :
              active === 4 ?
              <div>
              <h1 className='text-2xl font-bold text-zinc-800'>UPLOAD EXCEL TRADE XING</h1>
              <div className="mt-10">
                <div>
                  <label htmlFor="file" className="w-[300px] h-[70px] text-zinc-800 font-bold border-2 border-dashed rounded-2xl bg-zinc-100 flex justify-center items-center">
                    Browse File
                  </label>
                  <input onChange={ReadExcelFile} type="file" id="file" hidden />
                  <p className="mt-2">{selectedFile ? selectedFile : 'No file selected'} </p>
                </div>
                <button disabled={addBulkLoading} onClick={AddTradeXingData} className="py-3 w-[120px] mt-5 rounded-lg bg-primary text-white">{addBulkLoading ? <Loader height="h-4" width="w-4" /> : 'Submit'}</button>
              </div>
            </div>
              :
              active === 5 ?
              <div>
              <h1 className='text-2xl font-bold text-zinc-800'>UPLOAD UNIFIED DATA</h1>
              <div className="mt-10">
                <div>
                  <label htmlFor="file" className="w-[300px] h-[70px] text-zinc-800 font-bold border-2 border-dashed rounded-2xl bg-zinc-100 flex justify-center items-center">
                    Browse File
                  </label>
                  <input onChange={ReadExcelFile} type="file" id="file" hidden />
                  <p className="mt-2">{selectedFile ? selectedFile : 'No file selected'} </p>
                </div>
                <button disabled={addBulkLoading} onClick={AddUnifiedData} className="py-3 w-[120px] mt-5 rounded-lg bg-primary text-white">{addBulkLoading ? <Loader height="h-4" width="w-4" /> : 'Submit'}</button>
              </div>
            </div>
                :
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between gap-10">
                  {
                    data.map((item, i) => {
                      return (
                        <div key={i} className="border flex flex-col gap-5 justify-center items-center shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-[30px] p-7 bg-white check">
                          <span>{item.icon}</span>
                          <button onClick={() => {
                            setActive(i + 1)
                            setType(item.id)
                          }} className="text-white text-sm bg-primary w-full py-2 px-3 rounded-lg font-semibold">{item.title}</button>
                        </div>
                      )
                    })
                  }
                </div>
      }
      {
        active ?
          <div className="mt-8 flex justify-end border-t py-5">
            <button onClick={() => {
              setActive(0)
              setSelectedFile('')
              setType('')
              setAddBulkLoading(false)
              setSelectedFileData(null)
            }} className="text-white py-3 px-6 rounded-md bg-primary">Back</button>
          </div>
          :
          null
      }
    </div>
  )
}

export default Page
