import React from 'react';

const testimonials = [
    {
        content:
            'Eduguard fit us like a glove. Their team curates fresh, up-to-date courses from their marketplace and makes them available to customers.',
        name: 'Sundar Pichai',
        title: 'Chief Chairman of',
        company: 'Google',
    },
    {
        content:
            'Eduguard responds to the needs of the business in an agile and global manner. It’s truly the best solution for our employees and their careers.',
        name: 'Satya Nadella',
        title: 'CEO of',
        company: 'Microsoft',
    },
    {
        content:
            'In total, it was a big success, I would get emails about what a fantastic resource it was.',
        name: 'Ted Sarandos',
        title: 'Chief Executive Officer of',
        company: 'Netflix',
    },
];

const Testimonials = () => {
    return (
        <div className="container" style={{ margin: '7% auto' }}>
            <div className="row">
                {testimonials.map((t, i) => (
                    <div className='col-md-4' key={i}>
                        <div>
                            <div className='testimonial-content-wrapper'>
                                <div className="quote-icon top">❝</div>
                                <p className="testimonial-content">{t.content}</p>
                                <div className="quote-icon bottom">❞</div>
                            </div>
                            <p className="testimonial-name">{t.name}</p>
                            <p className="testimonial-title">
                                {t.title} <span className="company">{t.company}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
