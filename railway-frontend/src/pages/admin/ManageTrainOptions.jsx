import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaTrain, FaArrowLeft } from 'react-icons/fa';
import '../../css/admin/ManageTrainOptions.css';

const ManageTrainOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="manage-train-options">
      <button className="manage-back-button" onClick={() => navigate('/admin-dashboard')}>
        <FaArrowLeft className="back-icon" /> Back to Dashboard
      </button>
      <h2>Train Management</h2>
      <div className="manage-train-option-cards">
        <div className="manage-train-card" onClick={() => navigate('/admin/train/add')}>
          <FaPlusCircle className="train-card-icon" />
          <span>Add Train</span>
        </div>
        <div className="manage-train-card" onClick={() => navigate('/admin/train/list')}>
          <FaTrain className="train-card-icon" />
          <span>Get Trains</span>
        </div>
      </div>
    </div>
  );
};

export default ManageTrainOptions;
