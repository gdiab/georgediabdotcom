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
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="heading-xl mb-4">George Diab</h1>
        <p className="body-text text-xl text-gray-300 max-w-2xl mx-auto">
          Engineering Leader & Technology Enthusiast exploring the intersection of AI, 
          software development, and team leadership.
        </p>
      </div>

      {/* About Content */}
      <div className="prose max-w-none mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="heading-lg mb-6">Hello! 👋</h2>
              
              <div className="space-y-4">
                <p className="body-text">
                  I&apos;m George, an engineering leader with a passion for building great software and leading 
                  high-performing teams. I believe in the power of technology to solve complex problems and 
                  create meaningful impact.
                </p>
                
                <p className="body-text">
                  Currently, I focus on engineering leadership, team building, and exploring the exciting 
                  possibilities that artificial intelligence brings to software development. I enjoy writing 
                  about these topics and sharing insights from my experience in the industry.
                </p>
              </div>
            </section>

            <section>
              <h3 className="heading-md mb-6">What I Write About</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="card p-6 card-clickable">
                  <h4 className="heading-sm mb-3">Engineering Leadership</h4>
                  <p className="body-text-secondary text-sm">
                    Building and scaling engineering teams, creating effective processes, 
                    and fostering a culture of continuous improvement.
                  </p>
                </div>
                
                <div className="card p-6 card-clickable">
                  <h4 className="heading-sm mb-3">Artificial Intelligence</h4>
                  <p className="body-text-secondary text-sm">
                    Exploring practical applications of AI in software development, 
                    automation, and enhancing developer productivity.
                  </p>
                </div>
                
                <div className="card p-6 card-clickable">
                  <h4 className="heading-sm mb-3">Productivity & Tools</h4>
                  <p className="body-text-secondary text-sm">
                    Optimizing workflows, tools, and processes to help individuals 
                    and teams work more effectively.
                  </p>
                </div>
                
                <div className="card p-6 card-clickable">
                  <h4 className="heading-sm mb-3">Modern Web Development</h4>
                  <p className="body-text-secondary text-sm">
                    Staying current with the latest technologies, frameworks, 
                    and best practices in web development.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="heading-md mb-4">About This Blog</h3>
              
              <div className="space-y-4">
                <p className="body-text">
                  This platform serves as my digital space to share thoughts, insights, and 
                  learnings from my journey in technology and leadership. I write about 
                  engineering challenges, team dynamics, AI developments, and anything else 
                  that catches my interest in the rapidly evolving world of technology.
                </p>

                <p className="body-text">
                  Many of the posts here are enhanced by AI tools - not because I can&apos;t write, 
                  but because I believe in leveraging technology to improve the quality and 
                  reach of my content. This blog itself is a testament to how AI can augment 
                  human creativity and productivity.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="card p-6 mb-8 text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="heading-sm mb-2">George Diab</h3>
              <p className="body-text-secondary text-sm mb-4">
                Engineering Leader<br/>
                Technology Enthusiast<br/>
                AI Explorer
              </p>
              
              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://twitter.com/georgediab" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://linkedin.com/in/georgediab" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                
                <a 
                  href="https://github.com/georgediab" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-6 mb-8">
              <h4 className="heading-sm mb-4">Quick Facts</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Focus</span>
                  <span className="text-blue-400">Engineering Leadership</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Passion</span>
                  <span className="text-blue-400">AI & Automation</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Writing</span>
                  <span className="text-blue-400">Tech & Leadership</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card p-12 text-center">
        <h2 className="heading-lg mb-4">Interested in my writing?</h2>
        <p className="body-text-secondary text-lg mb-8 max-w-2xl mx-auto">
          Check out my latest blog posts and join the conversation about 
          engineering leadership, AI, and technology.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/blog"
            className="btn btn-primary inline-flex items-center"
          >
            <span>Read the Blog</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <Link
            href="https://twitter.com/georgediab"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Follow on X</span>
          </Link>
        </div>
      </div>
    </div>
  );
}