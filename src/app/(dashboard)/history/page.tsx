'use client'

import { useEffect, useState } from "react"
import HistoryCharts from "../../../../Components/HistoryCharts"

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

    if (loading) return <div className="p-10">Loading...</div>
    if (!data || data.length === 0) return <div className="p-10">No data available</div>

    return (
        <div className="w-full h-full p-10 bg-zinc-400/10">
            <h2 className="text-3xl mb-8">History</h2>
            <div className="w-full h-full">
                <HistoryCharts data={data} />
            </div>
        </div>
    )
}

export default History