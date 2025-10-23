
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubscribers } from '../SPA App/services/subscriberService';

const Subscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<string[]>([]);

  useEffect(() => {
    setSubscribers(getSubscribers());
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
       <Link to="/admin" className="text-accent hover:underline mb-8 block">&larr; Back to Dashboard</Link>
      <h1 className="text-4xl font-bold mb-8 text-center">Subscribed Users</h1>
      <div className="bg-secondary p-6 rounded-lg shadow-lg">
        {subscribers.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {subscribers.map((email, index) => (
              <li key={index} className="py-3 text-text-main">
                {email}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-text-secondary">No one has subscribed yet.</p>
        )}
      </div>
    </div>
  );
};

export default Subscribers;
