import React from 'react';
// import img from '../../maintenance.png';

function MaintenancePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 -mt-16">
            <img src={'./maintainance.png'} alt="Maintenance" className="max-w-[250px] h-auto mb-8" />
            <h1 className="text-4xl font-bold mb-4">We'll be back soon!</h1>
            <p className="text-lg text-center">Sorry for the inconvenience but we're performing some maintenance at the moment. We'll be back online shortly!</p>
        </div>
    );
}

export default MaintenancePage;
