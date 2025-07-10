import React, { useState } from 'react';
import { exportspecialists } from '../../services/services';

const FilterDoctors = ({ onFilter }) => {
    const specialistList = exportspecialists();
    const [search, setSearch] = useState('');
    const [gender, setGender] = useState('');
    const [specialists, setSpecialists] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onFilter({
            search,
            gender,
            specialists: specialists.join(',')
        });
    };

    const handleSpecialistChange = (e) => {
        const value = e.target.id;
        setSpecialists((prev) =>
            e.target.checked ? [...prev, value] : prev.filter((s) => s !== value)
        );
    };

    return (
        <div className='container border rounded-2'>
            <form onSubmit={handleSubmit}>
                <div className="row px-4 py-2">
                    <h4>Search Filter</h4>
                </div>
                <div className="row px-4 py-4 border-top">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search Doctor"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <h5 className='mt-4 mb-3'>Gender</h5>
                    <div className="form-check my-2">
                        <input className="form-check-input" type="radio" name="gender" id="male"
                            onChange={() => setGender('male')} />
                        <label className="form-check-label" htmlFor="male">Male Doctor</label>
                    </div>
                    <div className="form-check my-2">
                        <input className="form-check-input" type="radio" name="gender" id="female"
                            onChange={() => setGender('female')} />
                        <label className="form-check-label" htmlFor="female">Female Doctor</label>
                    </div>

                    <h5 className='mt-5 mb-3'>Select Specialist</h5>
                    {specialistList.map((spe) => (
                        <div className="form-check my-2" key={spe.specialistiD}>
                            <input className="form-check-input" type="checkbox" id={spe.specialistTitle} onChange={handleSpecialistChange} />
                            <label className="form-check-label" htmlFor={spe.specialistTitle}>
                                {spe.specialistTitle}
                            </label>
                        </div>
                    ))}

                    <div className='d-grid'>
                        <button type="submit" className="btn btn-warning my-4">Search</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FilterDoctors;
