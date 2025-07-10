import React from 'react';
import { exportspecialists } from '../../services/services';

const Ourservices = ({ onSpecialistClick }) => {
    const specialist = exportspecialists();

    return (
        <div className="container my-5 pb-3 text-center">
            <h2 className='main-heading'>Find Doctors By Health Concern</h2>
            <div className="row">
                {specialist.map(spe => (
                    <div className="col-lg-3 col-md-4 col-sm-6 my-3" key={spe.specialistiD}>
                        <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => onSpecialistClick(spe.specialistTitle)}
                        >
                            <div style={{ width: '100%', height: '80px', margin: '15px 0' }}>
                                <img
                                    src={spe.image}
                                    alt={spe.specialistTitle}
                                    style={{ height: '100%' }}
                                />
                            </div>
                            <h6 className='text-secondary'>{spe.specialistTitle}</h6>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ourservices;
