'use client'

import { useEffect, useState } from "react"
import HistoryCharts from "../../../components/HistoryCharts"

const History = () => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/history')
                if (res.ok) {
                    const json = await res.json()
                    setData(json.data || [])
                }
            } catch (error) {
                console.error('Error fetching history:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="w-full h-full p-10 flex flex-col items-center justify-center space-y-4">
                <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-sm font-semibold text-gray-500 animate-pulse">Loading mood history...</p>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-full p-10 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">No History Yet</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                    Create journal entries to start tracking your mood and sentiment trends over time.
                </p>
            </div>
        )
    }

    return (
        <div className="w-full h-full p-10 bg-zinc-400/10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Mood History</h2>
            <div className="w-full h-full">
                <HistoryCharts data={data} />
            </div>
        </div>
    )
}

export default History
