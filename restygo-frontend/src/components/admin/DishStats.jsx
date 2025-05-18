import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    Cell
} from "recharts";
import "../../styles/AdminPanel.css";

const COLORS = ['#5c6c91', '#7D9AE4'];

function DishStats() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/dishes/stats', {
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => setStats(data))
            .catch(err => {
                console.error('Помилка при завантаженні статистики:', err);
                setStats([]);
            });
    }, []);

    const chartData = stats
        .filter(d => d.timesOrdered > 0)
        .map((dish, index) => ({
            name: dish.name,
            timesOrdered: dish.timesOrdered,
            color: COLORS[index % COLORS.length]
        }));

    const chartHeight = Math.max(400, chartData.length * 60); // динамічна висота

    return (
        <div className="admin-container">
            <h3 className="chart-title">Статистика замовлень по стравах</h3>

            {chartData.length === 0 ? (
                <p>Немає даних для відображення.</p>
            ) : (
                <div style={{ width: '100%', height: chartHeight }}>
                    <BarChart
                        layout="vertical"
                        width={1350}
                        height={chartHeight}
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 1" />
                        <XAxis type="number" />
                        {/*<XAxis*/}
                        {/*    type="number"*/}
                        {/*    tickFormatter={(v) => v.toString()}*/}
                        {/*    tickCount={chartData.length}*/}
                        {/*    interval={0}*/}
                        {/*/>*/}
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={220} // збільшена ширина назв
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="timesOrdered" name="К-сть замовлень">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </div>
            )}
        </div>
    );
}

export default DishStats;

