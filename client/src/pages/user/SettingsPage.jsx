// Settings.jsx
import React, { useState } from 'react';
import SettingsNavbar from '../../components/layout/SettingsNavbar';
import PasswordReset from "../../components/forms/PasswordReset";
import RequestForm from "../../components/forms/RequestForm";
import VerifyListingRequest from "../../components/forms/VerifyListingRequest";
import VerifyProfileRequest from "../../components/forms/VerifyProfileRequest";
import DeleteAccountRequest from "../../components/forms/DeleteAccountRequest";
const Settings = () => {
    const [active, setActive] = useState('password');

    const renderComponent = () => {
        switch (active) {
            case 'password': return <PasswordReset />;

            case 'support': return <RequestForm />;
            case 'verifyListing': return <VerifyListingRequest />;
            case 'verifyProfile': return <VerifyProfileRequest />;
            case 'delete': return <DeleteAccountRequest />;
            default: return null;
        }
    };

    return (
        <div className="p-3">
            <SettingsNavbar active={active} setActive={setActive} />
            {renderComponent()}
        </div>
    );
};

export default Settings;
