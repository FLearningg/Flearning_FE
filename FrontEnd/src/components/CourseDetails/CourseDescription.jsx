import { Check, ArrowRight } from "lucide-react";

const Section = ({ title, children, className = "" }) => (
    <section className={`mb-5 ${className}`}>
        <h2 className="h4 fw-bold mb-4 text-dark">{title}</h2>
        {children}
    </section>
);

const IconText = ({ icon, bg, text }) => (
    <div className="d-flex align-items-start">
        <div className="flex-shrink-0 me-3">
            <div
                className={`bg-${bg} rounded-circle d-flex align-items-center justify-content-center`}
                style={{ width: 24, height: 24 }}
            >
                {icon}
            </div>
        </div>
        <div className="text-muted">{text}</div>
    </div>
);

const ListSection = ({ items, renderItem, className = "" }) => (
    <div className={className}>
        {items.map(renderItem)}
    </div>
);

export default function CourseDescription({ paragraphs, learnItems, whoIsForItems, requirementsItems }) {
    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-12">
                    {/* Description Section */}
                    <Section title="Description">
                        <div className="text-muted lh-lg">
                            {paragraphs.map((text, idx) => (
                                <p className={idx === paragraphs.length - 1 ? "mb-0" : "mb-3"} key={idx}>
                                    {text}
                                </p>
                            ))}
                        </div>
                    </Section>

                    {/* What you will learn Section */}
                    <Section title="What you will learn in this course" className="bg-light p-4 rounded">
                        <div className="row g-4">
                            {learnItems.map((item, idx) => (
                                <div
                                    className={`col-md-6${idx === learnItems.length - 1 && learnItems.length % 2 !== 0 ? " col-12" : ""}`}
                                    key={idx}
                                >
                                    <IconText icon={<Check size={14} className="text-white" />} bg="success" text={item} />
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Who this course is for Section */}
                    <Section title="Who this course is for:">
                        <ListSection
                            items={whoIsForItems}
                            className="d-flex flex-column gap-3"
                            renderItem={(item, idx) => (
                                <div className="d-flex align-items-start" key={idx}>
                                    <ArrowRight size={16} className="text-danger me-3 mt-1 flex-shrink-0" />
                                    <span className="text-muted">{item}</span>
                                </div>
                            )}
                        />
                    </Section>

                    {/* Course Requirements Section */}
                    <Section title="Course requirements">
                        <ListSection
                            items={requirementsItems}
                            className="d-flex flex-column gap-3"
                            renderItem={(item, idx) => (
                                <div className="d-flex align-items-start" key={idx}>
                                    <span className="text-muted me-3">•</span>
                                    <span className="text-muted">{item}</span>
                                </div>
                            )}
                        />
                    </Section>
                </div>
            </div>
        </div>
    );
}