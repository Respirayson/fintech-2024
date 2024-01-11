import React, { useState } from 'react';
import "../../styles/create-item.css";

const PolicyForm = ({ formData, handleChange, handleSubmit, publicAddress }) => {
    console.log(publicAddress)
    return (
        <div className="create__item">
        <form onSubmit={handleSubmit}>
            <div className="form__input">
                <label htmlFor="publicAddress">Public Address</label>
                <input
                    type="text"
                    id="publicAddress"
                    name="publicAddress"
                    value={publicAddress}
                    onChange={handleChange}
                    readOnly
                />
            </div>
            <div className="form__input">
                <label htmlFor="issuerName">Issuer Name</label>
                <input
                    type="text"
                    id="issuerName"
                    name="issuerName"
                    value={formData.issuerName}
                    onChange={handleChange}
                    placeholder="Enter issuer name"
                />
            </div>
            <div className="form__input">
                <label htmlFor="policyName">Policy Name</label>
                <input
                    type="text"
                    id="policyName"
                    name="policyName"
                    value={formData.policyName}
                    onChange={handleChange}
                    placeholder="Enter policy name"
                />
            </div>
            <div className="form__input">
                <label htmlFor="policyType">Policy Type</label>
                <select
                    id="policyType"
                    name="policyType"
                    value={formData.policyType}
                    onChange={handleChange}
                    >
                    <option value="">Select Policy Type</option>
                    <option value="Life Insurance">Life Insurance</option>
                    <option value="Health Insurance">Health Insurance</option>
                    <option value="Motor Insurance">Motor Insurance</option>
                    <option value="Personal Accident Insurance">Personal Accident Insurance</option>
                    <option value="Business Insurance">Business Insurance</option>
                    <option value="Travel Insurance">Travel Insurance</option>
                    <option value="Critical Illness Insurance">Critical Illness Insurance</option>
                    <option value="Fire Insurance">Fire Insurance</option>
                    <option value="Child Insurance">Child Insurance</option>
                    <option value="Disability Insurance">Disability Insurance</option>
                    <option value="General Insurance">General Insurance</option>
                </select>
            </div>
            <div className="form__input">
                <label htmlFor="premium">Premium</label>
                <input
                    type="number"
                    id="premium"
                    name="premium"
                    value={formData.premium}
                    onChange={handleChange}
                    placeholder="Enter premium (ETH)"
                />
            </div>
            <div className="d-flex align-items-center gap-4">
                <div className="form__input w-50">
                <label htmlFor="startDate">Starting Date</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                />
                </div>
                <div className="form__input w-50">
                <label htmlFor="maturityDate">Maturity Date</label>
                <input
                    type="date"
                    id="maturityDate"
                    name="maturityDate"
                    value={formData.maturityDate}
                    onChange={handleChange}
                />
                </div>
            </div>
            <div className="form__input">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows="7"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    className="w-100"
                ></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
        </div>
    )
}

export default PolicyForm;