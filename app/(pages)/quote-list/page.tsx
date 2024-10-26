"use client";
import React, { useEffect, useState } from 'react';
import { getQuotes, Quote } from '../../utils/http/api';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/app/utils/guards/authGuards';

const QuoteList: React.FC = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);
    const limit = 20;
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false); // State for scroll to top button
    const router = useRouter();

    useEffect(() => {
        const fetchQuotes = async () => {
            if (hasMore) {
                setLoading(true);
                setError(null);
                try {
                    const fetchedQuotes = await getQuotes(limit, offset);
                    if (fetchedQuotes.length === 0) {
                        setHasMore(false);
                    } else {
                        setQuotes((prev) => [...prev, ...fetchedQuotes]);
                    }
                } catch (error) {
                    console.error("Error fetching quotes:", error);
                    setError("Something went wrong. Please try again.");
                } finally {
                    setLoading(false);
                }
            }
        };

        if (typeof window != 'undefined') {
            fetchQuotes();
        }
    }, [offset, hasMore]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) { // Show button after scrolling down 300px
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const loadMore = () => {
        if (hasMore) {
            setOffset((prev) => prev + limit);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login/");
    };

    const formatDateToIST = (isoString: string) => {
        const date = new Date(isoString);
        const istDate = new Date(date.getTime() + 19800000); // Convert to IST

        return istDate.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div className="quote-list-container">
            <h1>Quotes</h1>
            <button className="create-quote-button" onClick={() => router.push('/quote-create/')}>Create Quote</button>
            <button className="create-quote-button" onClick={handleLogout}>Logout</button>

            {error && <p className="error-message">{error}</p>}

            <div className="quotes">
                {quotes.map((quote, index: number) => (
                    <div key={index} className="quote-item">
                        {quote.mediaUrl ? (
                            <div className="image-container">
                                <img src={quote.mediaUrl} alt="Quote" className="quote-image" />
                                <div className="overlay">
                                    <p className="quote-text">{quote.text}</p>
                                </div>
                            </div>
                        ) : (
                            <p>No image available</p>
                        )}
                        <p className="quote-username">User Name: {quote?.username}</p>
                        <p className="quote-created-at">Created At: {quote?.createdAt ? formatDateToIST(quote?.createdAt) : "NA"}</p>
                    </div>
                ))}
            </div>

            {loading && <p>Loading...</p>}
            {hasMore && !loading && <button onClick={loadMore}>Load More</button>}
            {!hasMore && !loading && <p>No more quotes to load.</p>}

            {showScrollTop && (
                <button className="scroll-to-top" onClick={scrollToTop} style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '10px' }}>
                    ↑
                </button>
            )}
        </div>
    );
};

export default AuthGuard(QuoteList);
