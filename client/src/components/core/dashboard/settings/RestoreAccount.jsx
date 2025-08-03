import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import ConfirmationModal from '../../../common/ConfirmationModal';

import { restoreAccount } from '../../../../services/operations/settingAPI';
import { logout } from '../../../../services/operations/authAPI';

const RestoreAccount = () => {

    const {user} =useSelector((state)=>state.profile);
    const { token } = useSelector(state => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Logic to format the deletion date
    const deletionDate = user?.deletionScheduledAt
        ? new Date(user.deletionScheduledAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'an unknown date';

    const modalData = {
        text1: 'Do you want to restore your account?',
        text2: `Your account will be deleted on ${deletionDate}. This action cannot be undone once deleted.`,
        btn1Text: 'Restore Account',
        btn2Text: 'Logout',
        btn1Handler: () => {
            dispatch(restoreAccount(token, navigate));
            setIsModalOpen(false);
        },
        btn2Handler: () => {
            dispatch(logout(navigate));
            setIsModalOpen(false);
        },
        closeModalHandler: () => setIsModalOpen(false),
    };

    return (
        <div className='bg-richblack-800'>
            {
                isModalOpen && <ConfirmationModal modalData={modalData} />
            }
        </div>
    );
};

export default RestoreAccount;
