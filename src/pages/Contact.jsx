import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import '../css/pages.css';
import '../css/contact.css';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Please enter a subject');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Please enter a message');
      return false;
    }
    if (formData.message.trim().length < 10) {
      setError('Message must be at least 10 characters long');
      return false;
    }
    return true;
  };

  // Allow user to send another message
  const handleSendAnother = () => {
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Save to Firestore
      const contactsRef = collection(db, 'contactSubmissions');
      await addDoc(contactsRef, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || 'Not provided',
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        timestamp: serverTimestamp(),
        status: 'new',
        read: false
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      // Success message stays visible until user clicks to send another
    } catch {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <MapPin className="info-icon" size={32} />
            <h3>Address</h3>
            <p>Coppell, TX 75019</p>
          </div>

          <div className="info-card">
            <Phone className="info-icon" size={32} />
            <h3>Phone</h3>
            <p><a href="tel:+19729624311">(972) 962-4311</a></p>
          </div>

          <div className="info-card">
            <Mail className="info-icon" size={32} />
            <h3>Email</h3>
            <p><a href="mailto:info@coppellcommunityhub.com">info@coppellcommunityhub.com</a></p>
          </div>
        </div>

        <div className="contact-form-container">
          {success ? (
            <div className="contact-success">
              <CheckCircle size={64} className="success-icon" />
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We&apos;ve received your message and will get back to you soon.</p>
              <button 
                onClick={handleSendAnother}
                className="contact-submit-btn send-another-btn"
                type="button"
              >
                <Send size={20} />
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h2>Send us a Message</h2>

              {error && (
                <div className="contact-error">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    maxLength="100"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    maxLength="100"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                    maxLength="20"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    maxLength="100"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please tell us more about your inquiry..."
                  rows="6"
                  maxLength="5000"
                />
                <div className="char-count">
                  {formData.message.length}/5000
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="contact-submit-btn"
              >
                <Send size={20} />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
