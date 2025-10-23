
import React, { useState } from 'react';
import { addSubscriber } from '../services/subscriberService';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter a valid email address.');
      return;
    }
    try {
      addSubscriber(email);
      setMessage('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold text-text-main mb-2">Subscribe to my newsletter</h3>
            <p className="text-text-secondary">Get the latest tech articles and updates straight to your inbox.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="flex-grow bg-primary border border-gray-600 rounded-md py-2 px-4 text-text-main focus:ring-accent focus:border-accent"
              required
            />
            <button
              type="submit"
              className="bg-accent text-primary font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
        {message && <p className="text-center mt-4 text-sm text-accent">{message}</p>}
        <div className="text-center text-text-secondary mt-8 pt-8 border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} Purushotham Muktha. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
