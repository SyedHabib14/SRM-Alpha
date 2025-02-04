import Header from '../components/Header';
import '../styles/dashboard.css';
import React, { useState } from 'react';
import { Bell, Map, BarChart2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import MapboxGL from 'mapbox-gl';
import { useDarkMode } from '../context/DarkModeContext';

MapboxGL.accessToken = "pk.eyJ1Ijoic3llZGhhYmliMTQiLCJhIjoiY202Z2tqd2xkMDF3NDJrcjc1d2tiM2FraiJ9.rAXTrOhUcGjWe-KCOrDXag";

function Dashboard() {
    const { isDarkMode } = useDarkMode();

    const [notifications] = useState([
        { id: 1, type: 'alert', message: 'Supplier ABC increased prices by 15%', time: '2h ago' },
        { id: 2, type: 'warning', message: 'Potential delay in Component XYZ delivery', time: '4h ago' },
        { id: 3, type: 'info', message: 'New supplier analysis report available', time: '1d ago' },
    ]);

    const [suppliers] = useState([
        { id: 1, name: 'Supplier ABC', risk: 'high', costChange: '+15%', location: 'Asia' },
        { id: 2, name: 'Supplier XYZ', risk: 'medium', costChange: '+5%', location: 'Europe' },
        { id: 3, name: 'Supplier 123', risk: 'low', costChange: '0%', location: 'North America' },
    ]);


    
    return (
        <>
            <div className="header">
                <Header />
            </div>

            <br /><br /><br />
            <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Map Overview */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center text-black dark:text-white">
                                    <Map className="h-5 w-5 mr-2" />
                                    Supply Chain Map
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg flex items-center justify-center">
                                    <div id="map" style={{ width: '100%', height: '100%' }}></div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-black dark:text-white">
                                    <Bell className="h-5 w-5 mr-2" />
                                    Recent Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {notifications.map(notification => (
                                        <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
                                            <div className="flex-1">
                                                <p className="text-sm text-black dark:text-gray-200">{notification.message}</p>
                                                <span className="text-xs text-black dark:text-gray-200">{notification.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Supplier Risk Analysis */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center text-black dark:text-white">
                                    <BarChart2 className="h-5 w-5 mr-2" />
                                    Supplier Risk Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Change</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {suppliers.map(supplier => (
                                                <tr key={supplier.id}>
                                                    <td className="px-6 py-4 text-sm text-black dark:text-gray-200">{supplier.name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            supplier.risk === 'high' ? 'bg-red-100 text-red-800' :
                                                            supplier.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {supplier.risk}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-black dark:text-gray-200">{supplier.costChange}</td>
                                                    <td className="px-6 py-4 text-sm text-black dark:text-gray-200">{supplier.location}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cost Analytics Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-black dark:text-white">
                                    <BarChart2 className="h-5 w-5 mr-2" />
                                    Cost Analytics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <div className="text-sm text-black dark:text-gray-200 font-medium">Average Cost Increase</div>
                                        <div className="mt-1 text-2xl font-semibold text-black dark:text-gray-200">8.5%</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <div className="text-sm text-black dark:text-gray-200 font-medium">High Risk Suppliers</div>
                                        <div className="mt-1 text-2xl font-semibold text-black dark:text-gray-200">3</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <div className="text-sm text-black dark:text-gray-200 font-medium">Active Alerts</div>
                                        <div className="mt-1 text-2xl font-semibold text-black dark:text-gray-200">5</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
            <script>
                {`
                    const map = new MapboxGL.Map({
                        container: 'map',
                        style: 'mapbox://styles/syedhabib14/cm6kqi2yu00be01sa8tsnavde',
                        center: [74.331, 31.554],
                        zoom: 12.64
                    });
                `}
            </script>
        </>
    );
}

export default Dashboard;