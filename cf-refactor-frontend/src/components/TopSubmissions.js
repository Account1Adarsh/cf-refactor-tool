import React from 'react';

const TopSubmissions = ({ submissions, setSelectedUrl }) => {
    return (
        <div>
            <h3>Top Submissions</h3>
            {submissions.map((url, index) => (
                <div key={index}>
                   <a href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        {url}
                        </a>

                </div>
            ))}
        </div>
    );
};


export default TopSubmissions;
