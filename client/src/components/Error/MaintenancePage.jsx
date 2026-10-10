import React from 'react';
// import img from '../../maintenance.png';

function MaintenancePage() {
    return (
        <div className="min-h-screen bg-[#060818] flex flex-col items-center justify-center px-6 py-12">
            <img src={'./maintainance.png'} alt="Maintenance" className="max-w-[180px] sm:max-w-[250px] h-auto mb-8" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">We'll be back soon!</h1>
            <p className="text-base text-zinc-400 text-center max-w-sm">Sorry for the inconvenience but we're performing some maintenance at the moment. We'll be back online shortly!</p>
        </div>
    );
}

export default MaintenancePage;
