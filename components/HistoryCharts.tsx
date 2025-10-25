'use client'

import {ResponsiveContainer, Line, XAxis, YAxis, Tooltip, LineChart, CartesianGrid} from 'recharts'

const CustomeToolTip = ({payload, label, active}: {payload?: any; label?: any; active?: boolean}) => {
    if (!active || !payload || !payload.length) {
        return null
    }
    
    const data = payload[0].payload
    const dateLabel = data.date ? new Date(data.date).toLocaleDateString('en-us', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    }) : label
    
    return (
        <div className="p-4 bg-white shadow-lg border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: data.color || '#808080' }}
                />
                <p className="text-xs text-gray-500 font-medium">{dateLabel}</p>
            </div>
            <p className="text-lg font-semibold text-gray-900 capitalize mb-1">{data.mood || 'No mood'}</p>
            {data.summary && <p className="text-sm text-gray-600 line-clamp-2">{data.summary}</p>}
        </div>
    )
}

const HistoryCharts = ({data}: {data: any}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-center text-gray-500 py-8">
                <div>
                    <p className="text-lg font-medium">No entries yet</p>
                    <p className="text-sm">Start journaling to see your mood trends</p>
                </div>
            </div>
        )
    }

    // Convert mood to numeric values for charting
    const moodValues: {[key: string]: number} = {
        'happy': 5,
        'excited': 5,
        'joyful': 5,
        'content': 4,
        'satisfied': 4,
        'calm': 3,
        'neutral': 3,
        'okay': 3,
        'bored': 2,
        'tired': 2,
        'anxious': 2,
        'sad': 1,
        'angry': 1,
        'depressed': 1,
    }

    const chartData = data.map((entry: any) => {
        const moodLower = (entry.mood || 'neutral').toLowerCase()
        const moodScore = moodValues[moodLower] || 3
        
        return {
            ...entry,
            moodScore,
            displayName: entry.name || 'Entry'
        }
    })

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                        dataKey="displayName" 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        stroke="#9ca3af"
                    />
                    <YAxis 
                        domain={[0, 6]}
                        ticks={[1, 2, 3, 4, 5]}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        stroke="#9ca3af"
                        tickFormatter={(value) => {
                            const labels: {[key: number]: string} = {
                                1: 'Sad',
                                2: 'Low',
                                3: 'Neutral',
                                4: 'Good',
                                5: 'Great'
                            }
                            return labels[value] || ''
                        }}
                    />
                    <Tooltip content={<CustomeToolTip />}/>
                    <Line 
                        type="monotone"
                        dataKey="moodScore"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 7, strokeWidth: 2 }}
                    />
                </LineChart>    
            </ResponsiveContainer>
        </div>
    )
}

export default HistoryCharts