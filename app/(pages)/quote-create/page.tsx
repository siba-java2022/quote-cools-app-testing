"use client";
import React, { useState, useRef } from 'react';
import { uploadImage, createQuote } from '@/app/utils/http/api';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/app/utils/guards/authGuards';

// Define the type for the form state
type FormState = {
    text: string;
    file: File | null; // Allow file to be either File or null
};

const QuoteCreate: React.FC = () => {
    const [form, setForm] = useState<FormState>({ text: '', file: null });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input

    const handleFileChange = (e: React.ChangeEvent<any>) => {
        if (e.target.files && e.target.files.length > 0) {
            setForm((prevForm) => ({ ...prevForm, file: e.target.files[0] }));
        } else {
            setForm((prevForm) => ({ ...prevForm, file: null })); // Clear the file if no file is selected
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form inputs
        if (!form.text.trim() || !form.file) {
            alert("Please fill in all fields.");
            return;
        }

        const formData = new FormData();
        formData.append('file', form.file);

        try {
            const uploadResponse = await uploadImage(formData);
            const mediaUrl = uploadResponse[0]?.url;
            const payload = {
                data: {
                    mediaUrl: mediaUrl,
                    text: form.text,
                }
            };
            await createQuote(payload);
            setSuccessMessage("Quote created successfully!"); // Success feedback
            setForm({ text: '', file: null }); // Reset form fields
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear the file input
            }
        } catch (error) {
            setError("An error occurred while creating the quote. Please try again.");
        }
    };

    const handleDashboard = () => {
        router.push("/quote-list/");
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message" style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
                {successMessage && <p className="success-message" style={{ textAlign: 'center', color: 'green' }}>{successMessage}</p>}
                <input
                    name="text"
                    placeholder="Quote Text"
                    value={form.text}
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    accept='.png, .gif, .jpeg, .jpg'
                    onChange={handleFileChange}
                    required
                    ref={fileInputRef} // Attach the ref to the file input
                />
                <span style={{ display: "flex", padding: "5px" }}>
                    <button style={{ marginRight: "5px" }} onClick={handleDashboard}>Dashboard</button>
                    <button type="submit">Create Quote</button>
                </span>
            </form>
        </>
    );
};

export default AuthGuard(QuoteCreate);
