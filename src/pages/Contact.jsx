import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock, Users} from 'lucide-react';
import '../css/pages.css';
import '../css/contact.css';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Timestamp } from "firebase/firestore";
import { 
  validateName, 
  isValidEmailStrict, 
  validatePhoneNumberSimple,
  sanitizeEmail,
  sanitizeName 
} from '../utils/validation';

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
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if(name =="phone"){
      const digits = value.replace(/\D/g, '');

      if(digits.length === 0){
        formattedValue = "";

      } else if (digits.length <= 3){
        formattedValue = `(${digits}`;

      } else if (digits.length <= 6){
        formattedValue = `(${digits.slice(0,3)}) ${digits.slice(3)}`;

      } else {
        formattedValue = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.message;
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmailStrict(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate phone (optional but if provided, must be valid)
    if (formData.phone.trim()) {
      const phoneValidation = validatePhoneNumberSimple(formData.phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.message;
      }
    }

    // Validate subject
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters';
    }

    // Validate message
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }

    return true;
  };

  // Allow user to send another message
  const handleSendAnother = () => {
    setSuccess(false);
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Format phone if provided
      let formattedPhone = 'Not provided';
      if (formData.phone.trim()) {
        const phoneValidation = validatePhoneNumberSimple(formData.phone);
        formattedPhone = phoneValidation.formatted || formData.phone.trim();
      }

      // Save to Firestore with sanitized data
      const contactsRef = collection(db, 'contactSubmissions');
      await addDoc(contactsRef, {
        name: sanitizeName(formData.name),
        email: sanitizeEmail(formData.email),
        phone: formattedPhone,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        timestamp: Timestamp.now(),
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


      <div className = "contact-stats">
        <div className="stat-card2">
          <Mail size={32} className="stat-icon" />
          <h3>1250+ Messages Received</h3>
          <p>Our community trusts us with their inquiries and feedvback.</p>
        </div>

        <div className="stat-card2">
          <Clock size={32} className="stat-icon" />
          <h3>24-Hour Response</h3>
          <p>We respond within 48 hours of getting your message.</p>
        </div>

        <div className="stat-card2">
          <Users size={32} className="stat-icon" />
          <h3>Friendly Support Team</h3>
          <p>Our team is approachable, helpful, and ready to assist you.</p>
        </div>
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
                    className={fieldErrors.name ? 'error' : ''}
                  />
                  {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
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
                    className={fieldErrors.email ? 'error' : ''}
                  />
                  {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(XXX) XXX-XXXX"
                    maxLength="20"
                    className={fieldErrors.phone ? 'error' : ''}
                  />
                  {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
                  {formData.phone && !fieldErrors.phone && (
                    <span className="field-help">Phone format: (123) 456-7890</span>
                  )}
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
                    className={fieldErrors.subject ? 'error' : ''}
                  />
                  {fieldErrors.subject && <span className="field-error">{fieldErrors.subject}</span>}
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
                  className={fieldErrors.message ? 'error' : ''}
                />
                {fieldErrors.message && <span className="field-error">{fieldErrors.message}</span>}
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
