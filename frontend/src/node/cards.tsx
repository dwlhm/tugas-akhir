import { Info } from "../components/icons/info";
import { TooltipComp } from "./component";
import { getPM25Level, getPM10Level } from "./lib";

export function PM1Card({ value }: { value: string }) {
    const { level, color, text } = getPM25Level(value);

    console.log(level, color, text, 'level, color, text PM 2.5', value);

    const getTooltipContent = (value: string) => {

        return (
            <div className="space-y-2">
                <div className="text-center font-semibold text-blue-200">📋 Panduan PM1</div>
                <div className={`space-y-1 ${text} ${color} p-2 rounded`}>
                    <div className={`${text} font-medium`}>Saat ini: {value} μg/m³</div>
                    <div className={`${text} font-bold`}>Status: {level}</div>
                </div>
                <div className="space-y-1 mt-4">
                    <div className="text-white font-semibold">Kriteria:</div>
                    <div className="text-gray-900 bg-gray-300 p-1 rounded">• PM1 {'>'} 250.5 μg/m³ = <span className="text-gray-900 font-semibold">Berbahaya</span></div>
                    <div className="text-red-900 bg-red-100 p-1 rounded">• PM1 150.5-250.4 µg/m³ = <span className="text-red-900 font-semibold">Sangat Tidak Sehat</span></div>
                    <div className="text-blue-900 bg-blue-100 p-1 rounded">• PM1 55.5-150.4 µg/m³ = <span className="text-blue-900 font-semibold">Tidak Sehat</span></div>
                    <div className="text-yellow-900 bg-yellow-100 p-1 rounded">• PM1 15.6-55.4 µg/m³ = <span className="text-yellow-900 font-semibold">Sedang</span></div>
                    <div className="text-green-900 bg-green-100 p-1 rounded">• PM1 0-15.5 µg/m³ = <span className="text-green-900 font-semibold">Baik</span></div>
                </div>
            </div>
        );
    };

    return (
        <div
            className={`${color} bg-blue-100 py-2 px-4 mt-2 rounded`}
        >
            <p className="text-xs">PM 2.5</p>
            <p className="text-base">
                {value}
                <span className="text-sm ml-2">μg/m³</span>
            </p>
            <TooltipComp content={getTooltipContent(value)}>
                <div className={`text-xs flex items-center gap-1 mt-1 font-semibold ${text} cursor-help`}>
                    <Info className="size-3 text-black" /> {level}
                </div>
            </TooltipComp>
        </div>
    )
}

export function PM25Card({ value }: { value: string }) {
    const { level, color, text } = getPM25Level(value);

    console.log(level, color, text, 'level, color, text PM 2.5', value);

    const getTooltipContent = (value: string) => {

        return (
            <div className="space-y-2">
                <div className="text-center font-semibold text-blue-200">📋 Panduan PM25</div>
                <div className={`space-y-1 ${text} ${color} p-2 rounded`}>
                    <div className={`${text} font-medium`}>Saat ini: {value} μg/m³</div>
                    <div className={`${text} font-bold`}>Status: {level}</div>
                </div>
                <div className="space-y-1 mt-4">
                    <div className="text-white font-semibold">Kriteria:</div>
                    <div className="text-gray-900 bg-gray-300 p-1 rounded">• PM25 {'>'} 250.5 μg/m³ = <span className="text-gray-900 font-semibold">Berbahaya</span></div>
                    <div className="text-red-900 bg-red-100 p-1 rounded">• PM25 150.5-250.4 µg/m³ = <span className="text-red-900 font-semibold">Sangat Tidak Sehat</span></div>
                    <div className="text-blue-900 bg-blue-100 p-1 rounded">• PM25 55.5-150.4 µg/m³ = <span className="text-blue-900 font-semibold">Tidak Sehat</span></div>
                    <div className="text-yellow-900 bg-yellow-100 p-1 rounded">• PM25 15.6-55.4 µg/m³ = <span className="text-yellow-900 font-semibold">Sedang</span></div>
                    <div className="text-green-900 bg-green-100 p-1 rounded">• PM25 0-15.5 µg/m³ = <span className="text-green-900 font-semibold">Baik</span></div>
                </div>
            </div>
        );
    };

    return (
        <div
            className={`${color} bg-blue-100 py-2 px-4 mt-2 rounded`}
        >
            <p className="text-xs">PM 2.5</p>
            <p className="text-base">
                {value}
                <span className="text-sm ml-2">μg/m³</span>
            </p>
            <TooltipComp content={getTooltipContent(value)}>
                <div className={`text-xs flex items-center gap-1 mt-1 font-semibold ${text} cursor-help`}>
                    <Info className="size-3 text-black" /> {level}
                </div>
            </TooltipComp>
        </div>
    )
}

export function PM10Card({ value }: { value: number }) {

    const { level, color, text } = getPM10Level(value);

    const getTooltipContent = (value: number) => {
        return (
            <div className="space-y-2">
                <div className="text-center font-semibold text-blue-200">📋 Panduan PM10</div>

                <div className={`space-y-1 ${text} ${color} p-2 rounded`}>
                    <div className={`${text} font-medium`}>Saat ini: {value} μg/m³</div>
                    <div className={`${text} font-bold`}>Status: {level}</div>
                </div>

                <div className="space-y-1 mt-4">
                    <div className="text-white font-semibold">Kriteria:</div>
                    <div className="text-red-900 bg-red-100 p-1 rounded">• PM10 {'>'} 75 μg/m³ = <span className="text-red-900 font-semibold">Tidak Aman</span></div>
                    <div className="text-green-900 bg-green-100 p-1 rounded">• PM10 ≤ 75 μg/m³ = <span className="text-green-900 font-semibold">Aman</span></div>
                </div>
            </div>
        );
    };

    return (
        <div
            className={`${color} bg-blue-100 py-2 px-4 mt-2 rounded`}
        >
            <p className="text-xs">PM 10</p>
            <p className="text-base">
                {value}
                <span className="text-sm ml-2">μg/m³</span>
            </p>
            <TooltipComp content={getTooltipContent(value)}>
                <div className={`text-xs flex items-center gap-1 mt-1 font-semibold ${text} cursor-help`}>
                    <Info className="size-3 text-black" /> {level}
                </div>
            </TooltipComp>
        </div>
    )
}