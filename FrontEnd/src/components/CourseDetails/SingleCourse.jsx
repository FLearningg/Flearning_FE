import { useState } from "react";
import CourseHeader from "./CourseHeader";
import CourseDescription from "./CourseDescription";
import Curriculum from "./Curriculum";
import CourseRating from "./CourseRating";
import StudentFeedback from "./StudentFeedback";
import PricingCard from "./PricingCard";
import { useRef } from "react";

const course = {
  title: "Complete Website Responsive Design: from Figma to Webflow to Website Design",
  subtitle: "3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.",
  breadcrumb: ["Home", "Development", "Web Development", "Webflow"],
  instructors: [{ name: "Vako", img: "/images/connect_us.png" }],
  rating: {
    overall: 4.8,
    totalRatings: 451444,
    distribution: [
      { stars: 5, label: "5 Star Rating", percentage: 74.5 },
      { stars: 4, label: "4 Star Rating", percentage: 21 },
      { stars: 3, label: "3 Star Rating", percentage: 3 },
      { stars: 2, label: "2 Star Rating", percentage: 1 },
      { stars: 1, label: "1 Star Rating", percentage: 0.5 },
    ],
  },
  heroImage: "/images/two-business-partners-working-office.png",
  description: {
    paragraphs: [
      `It gives you a huge self-satisfaction when you look at your work and say, "I made that!" Love that feeling after I'm done working on something. When I lean back in my chair, look at the final result with a smile, and have this little "spark joy" moment. It's especially satisfying when I know I just made $3000.`,
      `I did. And that's why I got into this field. Not for the love of Web Design, which I do now. But for the LIFESTYLE. There are many ways one can achieve this lifestyle. This is my way. This is how I achieved a lifestyle I've been fantasizing about for five years. And I'm going to teach you the same. Often people think Web Design is complicated. That it needs some creative talent or knack for computers.`,
      `But a lot of people make it way complicated. That's like the hardest thing complicated. Like most subjects taught in the universities. I remember learning calculus. And thinking, "When will I ever use this?" Well, I never did. But here's the thing. I haven't gone to art school or have a computer science degree. I'm an outsider to this field who hacked himself into it, somehow making six-figure a month after professional. That's how I'm going to teach you Web Design. So you're not intimidated or your way with needless complexity. So you enjoy the process because it's simple and fun. So you can become a Freelance Web Designer in no time.`,
      `For example, this is a Design course but I don't teach you Photoshop. Because Photoshop is needlessly complicated for Web Design. Full people still teach it, quite designers. I don't. I teach Figma — a simple tool that is taking over the design world. You will be designing a complete website within a week while others are still learning how to create basic layouts in Photoshop.`,
    ],
    learnItems: [
      `You will learn how to design beautiful websites using Figma, an interface design tool used by designers at Uber, Airbnb, and Microsoft.`,
      `You will learn how to take your designs and build them into beautiful websites using Webflow, a state-of-the-art site builder used by teams at Dell, NASA, and more.`,
      `You will learn how freelance web designers make great money online and build a rewarding career.`,
      `You will master responsive design techniques to create websites that work on all devices.`,
      `You will learn best practices for client communication and project management as a freelancer.`,
    ],
    whoIsForItems: [
      `This course is for those who want to launch a Freelance Web Design career.`,
      `Beginners looking to enter the web design industry with no prior experience.`,
      `Professionals seeking to transition into a creative and flexible career.`,
      `Entrepreneurs who want to design their own websites without hiring developers.`,
      `Those who are looking to reboot their work life and try a new profession that is fun, rewarding, and highly in-demand.`,
    ],
    requirementsItems: [
      `No prior web design experience required.`,
      `A computer with internet access.`,
      `A free Figma account (no software purchase needed).`,
      `A willingness to learn and experiment with design tools.`,
      `Basic familiarity with computers and web browsing.`,
    ],
  },
  curriculum: {
    totalSections: 6,
    totalLectures: 202,
    totalDuration: "19h 37m",
    sections: [
      {
        id: "getting-started",
        title: "Getting Started",
        lectureCount: 5,
        duration: "51m",
        lectures: [
          { title: "What is Webflow?", duration: "07:31", type: "video" },
          { title: "Sign up in Webflow", duration: "07:31", type: "video" },
          { title: "Webflow Terms & Conditions", size: "5.3 MB", type: "document" },
          { title: "Teaser of Webflow", duration: "07:31", type: "video" },
          { title: "Practice Project", size: "5.3 MB", type: "document" },
        ],
      },
      {
        id: "secret-good-design",
        title: "Secret of Good Design",
        lectureCount: 52,
        duration: "5h 49m",
        lectures: [
          { title: "Introduction to Design Principles", duration: "10:00", type: "video" },
          { title: "Color Theory Basics", duration: "08:30", type: "video" },
          // Placeholder for remaining lectures
        ],
      },
      {
        id: "practice-design",
        title: "Practice Design Like an Artist",
        lectureCount: 43,
        duration: "53m",
        lectures: [
          { title: "Figma Interface Overview", duration: "06:00", type: "video" },
          // Placeholder for remaining lectures
        ],
      },
      {
        id: "web-development",
        title: "Web Development (Webflow)",
        lectureCount: 81,
        duration: "10h 6m",
        lectures: [
          { title: "Building Your First Webflow Site", duration: "12:00", type: "video" },
          // Placeholder for remaining lectures
        ],
      },
      {
        id: "freelancing",
        title: "Secrets of Making Money Freelancing",
        lectureCount: 21,
        duration: "38m",
        lectures: [
          { title: "Finding Freelance Clients", duration: "09:00", type: "video" },
          // Placeholder for remaining lectures
        ],
      },
      {
        id: "advanced",
        title: "Advanced",
        lectureCount: 0,
        duration: "0m",
        lectures: [],
      },
    ],
  },
  pricing: {
    currentPrice: 14.00,
    originalPrice: 28.00,
    discount: "56% OFF",
    timeLeft: "2 days",
    details: [
      { icon: "Clock", label: "Course Duration", value: "6 Months" },
      { icon: "BarChart3", label: "Course Level", value: "Beginner and Intermediate" },
      { icon: "Users", label: "Students Enrolled", value: "451,444" },
      { icon: "Book", label: "Language", value: "English" },
      { icon: "Calendar", label: "Subtitle Language", value: "English" },
    ],
    includes: [
      { icon: "Clock", text: "Lifetime access" },
      { icon: "DollarSign", text: "30-days money-back guarantee" },
      { icon: "FileText", text: "Free exercises file & downloadable resources" },
      { icon: "Trophy", text: "Shareable certificate of completion" },
      { icon: "Smartphone", text: "Access on mobile, tablet, and TV" },
      { icon: "Subtitles", text: "English subtitles" },
      { icon: "Layers", text: "100% online course" },
    ],
    shareButtons: [
      { icon: "Copy", label: "Copy" },
      { icon: "Facebook", label: "Facebook" },
      { icon: "Twitter", label: "Twitter" },
      { icon: "Mail", label: "Mail" },
      { icon: "MessageCircle", label: "Message" },
    ],
  },
  feedback: [
    {
      id: 1,
      name: "Guy Hawkins",
      avatar: "/avatar-guy.jpg?height=40&width=40",
      timestamp: "1 week ago",
      rating: 5,
      feedback:
        "I appreciate the precise short videos (10 mins or less each) because overly long videos tend to make me lose focus. The instructor is very knowledgeable in Web Design and it shows as he shares his knowledge. These were my best 6 months of training. Thanks, Vako.",
    },
    {
      id: 2,
      name: "Dianne Russell",
      avatar: "/avatar-dianne.jpg?height=40&width=40",
      timestamp: "51 mins ago",
      rating: 5,
      feedback:
        "This course is just amazing! has great course content, the best practices, and a lot of real-world knowledge. I love the way of giving examples, the best tips by the instructor which are pretty interesting, fun and knowledgeable and I was never getting bored throughout the course. This course meets more than my expectation and, I made the best investment of time to learn and practice what I am passionate about. Thank you so much to our excellent instructor Vako!! Highly recommend this course! Take the next step.",
    },
    {
      id: 3,
      name: "Bessie Cooper",
      avatar: "/avatar-bessie.jpg?height=40&width=40",
      timestamp: "6 hours ago",
      rating: 4,
      feedback:
        "Webflow course was good, it covers design secrets, and how to build responsive web pages, blogs, and some more tricks and tips about Webflow. I enjoyed the course and it helped me to add web development skills related to Webflow in my toolbox. Thank you Vako.",
    },
    {
      id: 4,
      name: "Eleanor Pena",
      avatar: "/avatar-eleanor.jpg?height=40&width=40",
      timestamp: "1 day ago",
      rating: 5,
      feedback:
        "The course structure is fantastic, with clear explanations and practical projects. I built my first portfolio site in a week using Figma and Webflow. Vako’s teaching style is engaging and easy to follow. Highly recommend!",
    },
    {
      id: 5,
      name: "Ralph Edwards",
      avatar: "/avatar-ralph.jpg?height=40&width=40",
      timestamp: "2 days ago",
      rating: 5,
      feedback:
        "GREAT Course! Instructor was very descriptive and professional. I learned a TON that is going to apply immediately to real life work. Thanks so much, cant wait for the next one!",
    },
    {
      id: 6,
      name: "Arlene McCoy",
      avatar: "/avatar-arlene.jpg?height=40&width=40",
      timestamp: "1 week ago",
      rating: 5,
      feedback:
        "This should be one of the best course I ever made about UXUI in Udemy. Highly recommend to those who is new to UXUI and want to become UXUI freelancer!",
    },
  ],
};

export default function SingleCourse() {
    const overviewRef = useRef(null);
    const curriculumRef = useRef(null);
    const reviewRef = useRef(null);

    const handleTabClick = (tab) => {
        let ref;
        if (tab === "overview") ref = overviewRef;
        else if (tab === "curriculum") ref = curriculumRef;
        else if (tab === "review") ref = reviewRef;
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div style={{ margin: "0 200px", backgroundColor: "#ffffff" }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <CourseHeader
                            breadcrumb={course.breadcrumb}
                            title={course.title}
                            subtitle={course.subtitle}
                            instructors={course.instructors}
                            rating={course.rating.overall}
                            totalRatings={course.rating.totalRatings}
                            heroImage={course.heroImage}
                            activeTab={null}
                            setActiveTab={handleTabClick}
                        />
                        <div ref={overviewRef}>
                            <CourseDescription {...course.description} />
                        </div>
                        <div ref={curriculumRef}>
                            <Curriculum {...course.curriculum} />
                        </div>
                        <div ref={reviewRef}>
                            <CourseRating rating={course.rating} />
                            <StudentFeedback feedback={course.feedback} />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div>
                            <PricingCard {...course.pricing} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
