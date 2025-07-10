import { useEffect, useState } from 'react';
import DoctorCard from '../components/doctorcard/DoctorCard';
import FilterDoctors from '../components/filterDoctors/FilterDoctors';

const SearchDoctor = () => {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${process.env.REACT_APP_API_URL}/doctors?${query}`);
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };


  useEffect(() => {
    fetchDoctors(); // load all on mount
  }, []);

  const handleFilters = (filters) => {
    fetchDoctors(filters);
  };

  return (
    <div className=''>
      <div className='row mx-4 my-3'>
        <div className="col-9">
          <p>Home <span style={{ color: "#d21f49 " }}>/ Search</span></p>
          <h4 className='text-secondary'>Search Doctor</h4>
        </div>
      </div>

      <div className="row mx-4">
        <div className="col-3 pe-3">
          <FilterDoctors onFilter={handleFilters} />
        </div>

        <div className="col-9">
          <DoctorCard doctors={doctors} />
        </div>
      </div>
    </div>
  );
};

export default SearchDoctor;
