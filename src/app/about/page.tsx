import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About - George Diab',
  description: 'Learn more about George Diab - Engineering Leader, Technology Enthusiast, and Writer exploring the intersection of AI and software development.',
  openGraph: {
    title: 'About - George Diab',
    description: 'Engineering Leader, Technology Enthusiast, and Writer exploring the intersection of AI and software development.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="mb-16">
        <div className="mb-8">
          <h1 className="holman-h1">George Diab</h1>
          <p className="holman-p text-[#b0b0b0] text-xl">
            Engineering Leader & Technology Enthusiast
          </p>
        </div>
      </div>

      {/* About Content */}
      <div className="prose prose-lg mb-16">
        <h2 className="holman-h2">Hello! 👋</h2>
        
        <p className="holman-p">
          I&apos;m George, an engineering leader with a passion for building great software and leading 
          high-performing teams. I believe in the power of technology to solve complex problems and 
          create meaningful impact.
        </p>

        <h3 className="holman-h3">What I Do</h3>
        
        <p className="holman-p">
          Currently, I focus on engineering leadership, team building, and exploring the exciting 
          possibilities that artificial intelligence brings to software development. I enjoy writing 
          about these topics and sharing insights from my experience in the industry.
        </p>

        <h3 className="holman-h3">My Interests</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="border border-[#333333] p-6 rounded-lg hover:border-[#4a4a4a] transition-colors bg-[#0a0a0a]">
            <h4 className="text-lg font-semibold mb-2 text-[#f0f0f0]">Engineering Leadership</h4>
            <p className="text-[#b0b0b0] text-sm">
              Building and scaling engineering teams, creating effective processes, 
              and fostering a culture of continuous improvement.
            </p>
          </div>
          
          <div className="border border-[#333333] p-6 rounded-lg hover:border-[#4a4a4a] transition-colors bg-[#0a0a0a]">
            <h4 className="text-lg font-semibold mb-2 text-[#f0f0f0]">Artificial Intelligence</h4>
            <p className="text-[#b0b0b0] text-sm">
              Exploring practical applications of AI in software development, 
              automation, and enhancing developer productivity.
            </p>
          </div>
          
          <div className="border border-[#333333] p-6 rounded-lg hover:border-[#4a4a4a] transition-colors bg-[#0a0a0a]">
            <h4 className="text-lg font-semibold mb-2 text-[#f0f0f0]">Productivity</h4>
            <p className="text-[#b0b0b0] text-sm">
              Optimizing workflows, tools, and processes to help individuals 
              and teams work more effectively.
            </p>
          </div>
          
          <div className="border border-[#333333] p-6 rounded-lg hover:border-[#4a4a4a] transition-colors bg-[#0a0a0a]">
            <h4 className="text-lg font-semibold mb-2 text-[#f0f0f0]">Modern Web Development</h4>
            <p className="text-[#b0b0b0] text-sm">
              Staying current with the latest technologies, frameworks, 
              and best practices in web development.
            </p>
          </div>
        </div>

        <h3 className="holman-h3">Beyond Work</h3>
        
        <p className="holman-p">
          When I&apos;m not coding or writing, you might find me exploring new technologies, 
          reading about the latest developments in AI, or working on side projects that 
          combine my interests in technology and productivity.
        </p>

        <h3 className="holman-h3">This Blog</h3>
        
        <p className="holman-p">
          This platform serves as my digital space to share thoughts, insights, and 
          learnings from my journey in technology and leadership. I write about 
          engineering challenges, team dynamics, AI developments, and anything else 
          that catches my interest in the rapidly evolving world of technology.
        </p>

        <p className="holman-p">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Many of the posts here are enhanced by AI tools - not because I can't write, 
          but because I believe in leveraging technology to improve the quality and 
          reach of my content. This blog itself is a testament to how AI can augment 
          human creativity and productivity.
        </p>
      </div>

      {/* Contact Section */}
      <div className="border border-[#333333] rounded-lg p-8 mb-16 bg-[#0a0a0a]">
        <h2 className="holman-h2 text-center mb-6">
          Let&apos;s Connect
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6">
          <a 
            href="https://twitter.com/georgediab" 
            target="_blank" 
            rel="noopener noreferrer"
            className="holman-link flex items-center space-x-2 text-[#888888] hover:text-[#b0b0b0]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
            <span>Twitter</span>
          </a>
          
          <a 
            href="https://linkedin.com/in/georgediab" 
            target="_blank" 
            rel="noopener noreferrer"
            className="holman-link flex items-center space-x-2 text-[#888888] hover:text-[#b0b0b0]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span>LinkedIn</span>
          </a>
          
          <a 
            href="https://github.com/georgediab" 
            target="_blank" 
            rel="noopener noreferrer"
            className="holman-link flex items-center space-x-2 text-[#888888] hover:text-[#b0b0b0]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="holman-h2 mb-4">
          Interested in my writing?
        </h2>
        <p className="holman-p text-[#b0b0b0] mb-6">
          Check out my latest blog posts and join the conversation about 
          engineering leadership, AI, and technology.
        </p>
        <Link
          href="/blog"
          className="holman-link inline-flex items-center border border-[#333333] px-6 py-3 rounded-lg font-medium hover:border-[#4a4a4a] transition-colors bg-[#0a0a0a]"
        >
          Read the Blog
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}