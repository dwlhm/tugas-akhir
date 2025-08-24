import { Info, X } from "react-feather"
import { BasicButton } from "../Button"
import { usePopup } from "../../../popup"

export const RulesExplanationButton = () => {
    const popup = usePopup();
    return (
        <div>
            <BasicButton variant="overlay" className="w-full text-left" icon={<Info className="size-5 stroke-blue-900" />} onClick={() => {
                popup.setPopup(<RulesExplanationPopup />)
            }}>
                Panduan Baku Mutu PM
            </BasicButton>
        </div>
    )
}

function RulesExplanationPopup() {
    const popup = usePopup();
    return (
        <div className="bg-white rounded-lg p-4 max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto relative">
            <h2 className="font-bold text-center mb-6">Panduan Baku Mutu PM</h2>
            <button className="absolute top-0 right-0 p-4 hover:bg-gray-300 rounded-tr-lg" onClick={() => popup.close({})}>
                <X className="size-5" />
            </button>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 border border-solid border-gray-300 rounded-lg">
                <div className="border-b sm:border-r lg:border-b-0 border-solid border-gray-300 p-4">
                    <h3 className="font-bold">📋 PM 1.0</h3><div className="space-y-1 mt-4">
                        <div className="text-gray-900 bg-gray-300 p-1 rounded">• PM1 {'>'} 250.5 μg/m³ = <span className="text-gray-900 font-semibold">Berbahaya</span></div>
                        <div className="text-red-900 bg-red-100 p-1 rounded">• PM1 150.5-250.4 µg/m³ = <span className="text-red-900 font-semibold">Sangat Tidak Sehat</span></div>
                        <div className="text-blue-900 bg-blue-100 p-1 rounded">• PM1 55.5-150.4 µg/m³ = <span className="text-blue-900 font-semibold">Tidak Sehat</span></div>
                        <div className="text-yellow-900 bg-yellow-100 p-1 rounded">• PM1 15.6-55.4 µg/m³ = <span className="text-yellow-900 font-semibold">Sedang</span></div>
                        <div className="text-green-900 bg-green-100 p-1 rounded">• PM1 0-15.5 µg/m³ = <span className="text-green-900 font-semibold">Baik</span></div>
                    </div>
                </div>
                <div className="border-b lg:border-r lg:border-b-0 border-solid border-gray-300 p-4">
                    <h3 className="font-bold">📋 PM 2.5</h3><div className="space-y-1 mt-4">
                        <div className="text-gray-900 bg-gray-300 p-1 rounded">• PM1 {'>'} 250.5 μg/m³ = <span className="text-gray-900 font-semibold">Berbahaya</span></div>
                        <div className="text-red-900 bg-red-100 p-1 rounded">• PM1 150.5-250.4 µg/m³ = <span className="text-red-900 font-semibold">Sangat Tidak Sehat</span></div>
                        <div className="text-blue-900 bg-blue-100 p-1 rounded">• PM1 55.5-150.4 µg/m³ = <span className="text-blue-900 font-semibold">Tidak Sehat</span></div>
                        <div className="text-yellow-900 bg-yellow-100 p-1 rounded">• PM1 15.6-55.4 µg/m³ = <span className="text-yellow-900 font-semibold">Sedang</span></div>
                        <div className="text-green-900 bg-green-100 p-1 rounded">• PM1 0-15.5 µg/m³ = <span className="text-green-900 font-semibold">Baik</span></div>
                    </div>
                </div>
                <div className="p-4 sm:col-span-2 lg:col-span-1">
                    <h3 className="font-bold">📋 PM 10</h3><div className="space-y-1 mt-4">
                        <div className="text-red-900 bg-red-100 p-1 rounded">• PM10 {'>'} 75 μg/m³ = <span className="text-red-900 font-semibold">Tidak Aman</span></div>
                        <div className="text-green-900 bg-green-100 p-1 rounded">• PM10 ≤ 75 μg/m³ = <span className="text-green-900 font-semibold">Aman</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}