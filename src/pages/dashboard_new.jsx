import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../styles/dashboard.css';
import { Bell, Map as MapIcon, BarChart2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useDarkMode } from '../context/DarkModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAlertMessages } from '../dataset/alertMessages';
import { Map, Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = "pk.eyJ1Ijoic3llZGhhYmliMTQiLCJhIjoiY202Z2tqd2xkMDF3NDJrcjc1d2tiM2FraiJ9.rAXTrOhUcGjWe-KCOrDXag";

const watchBrands = [
  'Rolex', 'Patek Philippe', 'Audemars Piguet', 'A. Lange & Söhne', 'Vacheron Constantin',
  'Jaeger-LeCoultre', 'Omega', 'Cartier', 'IWC', 'Breguet', 'Panerai', 'Hublot',
  'Blancpain', 'Chopard', 'Tag Heuer', 'Breitling', 'Zenith', 'Tudor', 'Grand Seiko'
];

const locations = [
  'Switzerland', 'Germany', 'Japan', 'Italy', 'France', 'United Kingdom', 'Hong Kong',
  'Singapore', 'United States', 'UAE', 'South Korea', 'China', 'Netherlands'
];

const timeAgo = () => {
  const times = ['2m ago', '5m ago', '15m ago', '30m ago', '1h ago', '2h ago', '4h ago'];
  return times[Math.floor(Math.random() * times.length)];
};

function Dashboard() {
  const { isDarkMode } = useDarkMode();
  const [popupInfo, setPopupInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [analytics, setAnalytics] = useState({
    avgCostIncrease: 0,
    highRiskSuppliers: 0,
    activeAlerts: 0
  });

  const generateSuppliers = () => {
    const risks = ['high', 'medium', 'low'];
    return watchBrands
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((brand, id) => ({
        id,
        name: brand,
        risk: risks[Math.floor(Math.random() * risks.length)],
        costChange: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 20).toFixed(1)}%`,
        location: locations[Math.floor(Math.random() * locations.length)]
      }));
  };

  const generateNotifications = () => {
    const alerts = generateAlertMessages();
    return alerts
      .sort(() => Math.random() - 0.5)
      .slice(0, 20)
      .map((alert, id) => ({
        id,
        type: alert.type,
        message: alert.message,
        time: timeAgo()
      }));
  };

  const updateAnalytics = (currentSuppliers) => {
    const highRisk = currentSuppliers.filter(s => s.risk === 'high').length;
    const avgCost = currentSuppliers.reduce((acc, curr) => {
      return acc + parseFloat(curr.costChange);
    }, 0) / currentSuppliers.length;

    setAnalytics({
      avgCostIncrease: Math.abs(avgCost).toFixed(1),
      highRiskSuppliers: highRisk,
      activeAlerts: Math.floor(Math.random() * 10) + 1
    });
  };

  useEffect(() => {
    const initialSuppliers = generateSuppliers();
    setSuppliers(initialSuppliers);
    setNotifications(generateNotifications());
    updateAnalytics(initialSuppliers);

    const interval = setInterval(() => {
      const newSuppliers = generateSuppliers();
      setSuppliers(newSuppliers);
      setNotifications(generateNotifications());
      updateAnalytics(newSuppliers);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
       
      <div className="header">
        <Header />
      </div>
      
      
      <br /><br /><br />
      <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <main className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-5">
              <CardHeader className="border-gray-200 dark:border-gray-700">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white font-sans">
                  <MapIcon className="inline-block h-5 w-5 mr-2" />
                  Supply Chain Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-96 rounded-lg overflow-hidden">
                  <Map
                    mapLib={import("mapbox-gl")}
                    initialViewState={{
                      longitude: 52.514,
                      latitude: 13.401,
                      zoom: 12.14
                    }}
                    style={{width: '100%', height: '100%'}}
                    mapStyle="mapbox://styles/syedhabib14/cm6kqi2yu00be01sa8tsnavde"
                    attributionControl={true}
                    renderWorldCopies={false}
                    preserveDrawingBuffer={true}
                    antialias={true}
                    fog={false}
                    terrain={false}
                  >
                    <Marker
                      longitude={52.514}
                      latitude={13.401}
                      onClick={() => {
                        setPopupInfo({
                          longitude: 52.514,
                          latitude: 13.401,
                          text: "Welcome to Supply Resilience Manager"
                        });
                      }}
                    />
                    {popupInfo && (
                      <Popup
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        anchor="bottom"
                        onClose={() => setPopupInfo(null)}
                      >
                        <div className="p-2">{popupInfo.text}</div>
                      </Popup>
                    )}
                    <NavigationControl position="top-right" />
                  </Map>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader className="border-gray-200 dark:border-gray-700">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white font-serif">
                  <MapIcon className="inline-block h-5 w-5 mr-2" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div 
                  className="space-y-4 overflow-y-auto pr-2 max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
                  style={{
                    scrollbarWidth: 'thin',
                    msOverflowStyle: 'none',
                  }}
                >
                  <AnimatePresence>
                    {notifications.map(notification => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                      >
                        <AlertTriangle 
                          className={`h-5 w-5 flex-shrink-0 mt-1 ${
                            notification.type === 'alert' ? 'text-red-500' :
                            notification.type === 'warning' ? 'text-amber-500' :
                            'text-blue-500'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm  text-gray-900 dark:text-white">{notification.message}</p>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{notification.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Supplier Risk Analysis */}
            <Card className="lg:col-span-2">
              <CardHeader className="border-gray-200 dark:border-gray-700">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white font-serif">
                  <BarChart2 className="inline-block h-5 w-5 mr-2" />
                  Supplier Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Supplier</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Risk Level</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Cost Change</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {suppliers.map(supplier => (
                          <motion.tr
                            key={supplier.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="border-b border-gray-200 dark:border-gray-700"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white font-sans">{supplier.name}</td>
                            <td className="px-6 py-4">
                              <motion.span
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  supplier.risk === 'high' ? 'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-200' :
                                  supplier.risk === 'medium' ? 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-200' :
                                  'bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-200'
                                }`}
                              >
                                {supplier.risk}
                              </motion.span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-sans">{supplier.costChange}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-sans">{supplier.location}</td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Cost Analytics Summary */}
            <Card>
              <CardHeader className="border-gray-200 dark:border-gray-700">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white font-serif">
                  <BarChart2 className="inline-block h-5 w-5 mr-2" />
                  Cost Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white font-sans">Average Cost Change</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white font-sans">{analytics.avgCostIncrease}%</div>
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white font-sans">High Risk Suppliers</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white font-sans">{analytics.highRiskSuppliers}</div>
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white font-sans">Active Alerts</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white font-sans">{analytics.activeAlerts}</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
