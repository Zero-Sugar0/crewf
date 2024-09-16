import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const API_ENDPOINT = 'https://mcrew.onrender.com/crewai'; // Replace with your actual API endpoint

const AgentCard = ({ agent, status }) => (
  <div className="w-full border rounded-lg p-4">
    <div className="font-bold">{agent.role}</div>
    <div className="text-sm text-gray-600">{agent.name}</div>
    <p className="text-sm mt-2">{agent.backstory.substring(0, 100)}...</p>
    <div className="mt-4 flex items-center">
      {status === 'working' && <Loader2 className="h-4 w-4 animate-spin" />}
      {status === 'complete' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
      <span className="ml-2 text-sm capitalize">{status}</span>
    </div>
  </div>
);

const ResultTab = ({ title, content }) => (
  <div className="mt-4">
    <h3 className="font-bold text-lg">{title}</h3>
    <div className="border rounded-lg p-4 mt-2">
      <pre className="whitespace-pre-wrap">{content}</pre>
    </div>
  </div>
);

const CrewAIAgentsApp = () => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [mainProducts, setMainProducts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('research');
  const [agentStatuses, setAgentStatuses] = useState({
    researcher: 'idle',
    competitor_analyst: 'idle',
    content_writer: 'idle',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);
    setAgentStatuses({
      researcher: 'working',
      competitor_analyst: 'idle',
      content_writer: 'idle',
    });

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName, industry, mainProducts }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const data = await response.json();
      setResults(data);
      setAgentStatuses({
        researcher: 'complete',
        competitor_analyst: 'complete',
        content_writer: 'complete',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Simulating real-time updates from the server
    if (isLoading) {
      const timer1 = setTimeout(() => setAgentStatuses(prev => ({ ...prev, researcher: 'complete', competitor_analyst: 'working' })), 5000);
      const timer2 = setTimeout(() => setAgentStatuses(prev => ({ ...prev, competitor_analyst: 'complete', content_writer: 'working' })), 10000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isLoading]);

  const agents = [
    { role: 'Senior Market Research Specialist', name: 'Dr. Amelia Thornton', backstory: 'A renowned market research specialist with over 20 years of experience across various industries...' },
    { role: 'Elite Competitive Intelligence Strategist', name: 'Marcus Chen', backstory: 'A highly sought-after competitive intelligence strategist with a track record of helping companies outmaneuver their rivals...' },
    { role: 'Visionary Content Strategist and Master Storyteller', name: 'Sophia Rodriguez', backstory: 'A globally recognized content strategist and brand storyteller whose work has redefined digital marketing and corporate communications...' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">CrewAI Agents Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            className="border rounded p-2"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <input
            className="border rounded p-2"
            placeholder="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
          />
          <input
            className="border rounded p-2"
            placeholder="Main Products/Services"
            value={mainProducts}
            onChange={(e) => setMainProducts(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Run Analysis'
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {agents.map((agent, index) => (
          <AgentCard
            key={index}
            agent={agent}
            status={agentStatuses[Object.keys(agentStatuses)[index]]}
          />
        ))}
      </div>

      {results && (
        <div>
          <div className="mb-4">
            <button 
              onClick={() => setActiveTab('research')} 
              className={`mr-2 px-4 py-2 rounded ${activeTab === 'research' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Research
            </button>
            <button 
              onClick={() => setActiveTab('competitor')} 
              className={`mr-2 px-4 py-2 rounded ${activeTab === 'competitor' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Competitor Analysis
            </button>
            <button 
              onClick={() => setActiveTab('content')} 
              className={`px-4 py-2 rounded ${activeTab === 'content' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Blog Post
            </button>
          </div>
          {activeTab === 'research' && <ResultTab title="Research" content={results.research} />}
          {activeTab === 'competitor' && <ResultTab title="Competitor Analysis" content={results.competitorAnalysis} />}
          {activeTab === 'content' && <ResultTab title="Blog Post" content={results.blogPost} />}
        </div>
      )}
    </div>
  );
};

export default CrewAIAgentsApp;