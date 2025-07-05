import { useState } from "react";
import { ISPUCard } from "./ISPUCard";
import { ChevronDown } from "../../icons";

export type TAturanISPU = {
  className: string,
  label: string,
  range: string,
}

const AturanISPU = [
  {
    className: 'bg-green-400',
    label: 'Baik',
    range: '0 - 50',
  },
  {
    className: 'bg-blue-400',
    label: 'Sedang',
    range: '51 - 100',
  },
  {
    className: 'bg-yellow-400',
    label: 'Tidak Sehat',
    range: '101 - 200',
  },
  {
    className: 'bg-red-400',
    label: 'Sangat Tidak Sehat',
    range: '201 - 300',
  },
  {
    className: 'bg-black text-gray-100',
    label: 'Berbahaya',
    range: '>= 300',
  },
]

export const KeteranganISPU = () => {

  const [ isOpened, setIsOpened ] = useState(false);

  return (
    <div className="my-2">
      <button
        className="mb-1 w-full flex items-center justify-between gap-2 bg-gray-100 px-3 py-2 rounded-lg -mb-1"
        onClick={() => setIsOpened(prev => !prev)}
      >
        <span>Kategori ISPU: </span><ChevronDown className={!isOpened ? 'rotate-180' : 'rotate-0'} />
      </button>
      <div className={`transition-transform ${isOpened ? 'scale-y-100' : 'scale-y-0 h-0 overflow-hidden'} bg-gray-200 p-2 pt-3 pb-1 rounded-lg`}>
        {
          AturanISPU.map((v: TAturanISPU) => (
            <ISPUCard key={v.label} {...v} />
          ))
        }
      </div>
    </div>
  )
}

