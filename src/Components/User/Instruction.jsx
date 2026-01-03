import React from 'react'
import MainWrapper from '../../CommonComponents/MainWrapper'

export const Instruction = () => {
    return (
        <MainWrapper active={false}>
            <div className="title-header mt-3">
                <div className="d-flex align-items-center justify-content-between">
                    <h3>Instructions</h3>
                </div>
            </div>
            <div className='theme-card mt-3'>
                <h4>Myositis Training</h4>
                <p>Please follow the steps below to complete the Myositis case-based scoring assignment accurately and efficiently:</p>
                <div className='mt-4 ps-3'>
                    <div>
                        <h5 className='mb-1'>1. Login</h5>
                        <p>Access the training platform using the login link and credentials provided in your email.</p>
                    </div>
                    <div className='mt-3'>
                        <h5 className='mb-1'>2. Access Assigned Cases</h5>
                        <p>Upon logging in, navigate to the Dashboard and select "My Cases" to view your assigned cases.</p>
                    </div>
                    <div className="mt-3">
                        <h5 className='mb-1'>3. Begin Training</h5>
                        <p>Click "Begin" next to a case to start the training module.</p>
                    </div>
                    <div className='mt-3'>
                        <h5 className='mb-1'>4. Interface Overview</h5>
                        <p>The case content will appear on the left panel, while the scoring form will be displayed on the right panel.</p>
                    </div>
                    <div className='mt-3'>
                        <h5 className='mb-1'>5. Scoring Components</h5>
                        <p>Carefully review the case and complete all required scoring sections, including:</p>
                        <ul className='mt-2 ps-4 instruction-list'>
                            <li>MMT-8 (Manual Muscle Testing)</li>
                            {/* <li>CDASI (Cutaneous Dermatomyositis Disease Area and Severity Index)</li> */}
                            <li>MDAAT (Myositis Disease Activity Assessment Tool)</li>
                            {/* <li>Physician Global Assessment</li> */}
                        </ul>
                    </div>
                    <div className="mt-3">
                        <h5 className="mb-1">6. Mandatory Completion</h5>
                        <p>Do not leave any fields blank. All questions must be answered for accurate assessment.</p>
                    </div>
                    <div className="mt-3">

                        <h5 className="mb-1">7. Download Option</h5>
                        <p>If needed, click the "Download" button to save a copy of the Case for offline review.</p>
                    </div>
                    <div className="mt-3">
                        <h5 className="mb-1">8. Expanded View</h5>
                        <p>Use the "Expand" button to view the case and scoring form in full-screen mode for better readability.</p>
                    </div>
                    <div className="mt-3">
                        <h5 className="mb-1">9. Save Progress</h5>
                        <p>You may click “Save Draft” at any time to save your progress and return later to complete the scoring.</p>
                    </div>
                    <div className="mt-3">
                        <h5 className="mb-1">10. Final Submission</h5>
                        <p>After completing all sections, click "Submit Form" at the bottom of the page.</p>
                    </div>
                    <div className="mt-3">
                        <h5 className="mb-1">11. Final Review</h5>
                        <p>Ensure all fields are completed and thoroughly reviewed before submission.</p>
                    </div>
                </div>
                {/* <div className='mt-4 text-end'>
                     <button className="site-link border-btn">
                        <span>Got it</span>
                    </button> 
                </div> */}
            </div>
        </MainWrapper>
    )
}
